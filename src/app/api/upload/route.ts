import { TNotificationResponse } from "@/components/utils/api.utils";
import { getDb } from "@/server/db";
import { attachments, TInsertAttachmentSchema } from "@/server/model/notice";
import { S3Instance } from "@/server/S3";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

async function uploadFileHandler(req: NextRequest) {
  try {
    const formData = await req.formData(); // Parse the form data
    const db = await getDb();
    let files = formData.getAll("file") as Array<File>; // Access the file
    const noticeId = formData.get("noticeId") as string; // Access the noticeId

    if (!noticeId)
      return NextResponse.json(
        {
          status: "error",
          message: "No noticeId provided",
        } as TNotificationResponse,
        { status: 400 }
      );

    if (!files)
      return NextResponse.json(
        {
          status: "warning",
          message: "No file uploaded",
        } as TNotificationResponse,
        { status: 400 }
      );

    if (!Array.isArray(files)) {
      files = [files];
    }

    if (files.length < 1) {
      return NextResponse.json(
        {
          status: "error",
          message: "No file uploaded",
        } as TNotificationResponse,
        { status: 400 }
      );
    }

    // Upload the file to S3
    const savedAttachmentResult = await Promise.allSettled(
      files.map(async (file) => {
        // upload in s3
        await S3Instance.UploadFile(noticeId, file);

        // create entry in attachments table
        return db
          .insert(attachments)
          .values({
            filepath: `${noticeId}/${file.name}`,
            filename: file.name,
            filetype: file.type,
            noticeid: `${noticeId}`,
          } as TInsertAttachmentSchema)
          .onConflictDoNothing({
            target: [attachments.filepath],
          })
          .returning();
      })
    );

    const allFilesInNoticeFromS3 = await S3Instance.GetFilesByFolder(
      `${noticeId}`
    );

    if (
      allFilesInNoticeFromS3.Contents &&
      allFilesInNoticeFromS3.Contents.length > 0
    ) {
      const finalizedUploadedFilesWithDownloadLink = await Promise.allSettled(
        allFilesInNoticeFromS3.Contents.map(async (remoteFile) => {
          const fileInAttachmentDb = await db
            .select()
            .from(attachments)
            .where(eq(attachments.filepath, remoteFile.Key!));

          if (!fileInAttachmentDb || fileInAttachmentDb.length < 1) {
            return;
          }
          return {
            filename: fileInAttachmentDb[0].filename,
            download: await S3Instance.getDownloadUrl(
              fileInAttachmentDb[0].filepath
            ),
            filetype: fileInAttachmentDb[0].filetype,
            filepath: fileInAttachmentDb[0].filepath,
          };
        })
      );

      console.log(
        "All files in notice:",
        finalizedUploadedFilesWithDownloadLink
          .filter((res) => res.status === "fulfilled")
          .map((res) => res.value)
      );

      return NextResponse.json(
        {
          uploads: finalizedUploadedFilesWithDownloadLink
            .filter((res) => res.status === "fulfilled")
            .map((res) => res.value),
          uploadedFilesCount: files.length,
          totalFilesCount: finalizedUploadedFilesWithDownloadLink.filter(
            (res) => res.status === "fulfilled"
          ).length,
        } as TUploadFileResponse,
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        uploads: [],
        uploadedFilesCount: 0,
        totalFilesCount: files.length,
      } as TUploadFileResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error uploading file",
      } as TNotificationResponse,
      { status: 500 }
    );
  }
}

async function deleteUploadedFileHandler(req: NextRequest) {
  try {
    const reqData = await req.json();
    const validatedFields = DeleteFileRequest.safeParse(reqData);
    if (!validatedFields.success) {
      console.error(
        "Invalid fields while validating request:",
        validatedFields.error.message
      );
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid fields",
        } as TNotificationResponse,
        {
          status: 400,
        }
      );
    }

    const deleteS3Response = await S3Instance.DeleteFileByFilePath(
      validatedFields.data.file_path
    );

    if (deleteS3Response.DeleteMarker) {
      console.log("File was deleted (DeleteMarker is set):", deleteS3Response);
    } else if (deleteS3Response.VersionId) {
      console.log("File was deleted (versioned delete):", deleteS3Response);
    } else {
      console.log(
        "File deleted successfully (no versioning):",
        deleteS3Response
      );
    }

    const db = await getDb();
    await db
      .delete(attachments)
      .where(eq(attachments.filepath, validatedFields.data.file_path));

    return NextResponse.json(
      {
        status: "success",
        message: "File deleted successfully!",
      } as TNotificationResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return NextResponse.json(
      { message: "Error uploading file", error },
      { status: 500 }
    );
  }
}

export { deleteUploadedFileHandler as DELETE, uploadFileHandler as POST };

export const DeleteFileRequest = z.object({
  file_path: z.string(),
});

export const UploadFileResponse = z.object({
  uploads: z.array(
    z.object({
      filename: z.string(),
      download: z.string(),
      filetype: z.string(),
      filepath: z.string(),
    })
  ),
  uploadedFilesCount: z.number(),
  totalFilesCount: z.number(),
});
export type TUploadFileResponse = z.infer<typeof UploadFileResponse>;
