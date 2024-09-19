import { TNotificationResponse } from "@/components/utils/api.utils";
import { initializeDb } from "@/server";
import { attachments, TInsertAttachmentSchema } from "@/server/model/notice";
import { S3Instance } from "@/server/S3";
import { inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

async function uploadFileHandler(req: NextRequest) {
  try {
    const formData = await req.formData(); // Parse the form data
    const files = formData.getAll("file") as Array<File>; // Access the file

    const db = await initializeDb();

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
    const resolved = await Promise.allSettled(
      files.map(async (file) => {
        return {
          file_name: file.name,
          file_path: `temp-uploads/${file.name}`,
          file_type: file.type,
          s3_response: await S3Instance.UploadFile(file),
        };
      })
    );

    await db
      .insert(attachments)
      .values(
        resolved
          .filter((fulRes) => fulRes.status == "fulfilled")
          .map(
            (res) =>
              ({
                filepath: res.value.file_path,
                filename: res.value.file_name,
                filetype: res.value.file_type,
                noticeid: "temp-uploads",
              } as TInsertAttachmentSchema)
          )
      )
      .onConflictDoNothing({
        target: [attachments.filepath],
      });

    return NextResponse.json(
      {
        uploads: resolved
          .filter((result) => result.status === "fulfilled")
          .map((res) => ({
            file_name: res.value.file_name,
            upload_status: res.status,
          })),
        uploadedFilesCount: resolved.filter((res) => res.status === "fulfilled")
          .length,
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

    const db = await initializeDb();

    const data = await Promise.allSettled(
      validatedFields.data.file_path.map(async (filePath) => {
        return {
          filepath: filePath,
          s3_response: await S3Instance.DeleteFileByFilePath(filePath),
        };
      })
    );

    await db
      .delete(attachments)
      .where(
        inArray(
          attachments.filepath,
          data
            .filter((fulRej) => fulRej.status == "fulfilled")
            .map((res) => res.value.filepath)
        )
      )
      .returning();

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
  file_path: z.array(z.string()),
});

export const UploadFileResponse = z.object({
  uploads: z.array(
    z.object({
      file_name: z.string(),
      upload_status: z.string(),
    })
  ),
  uploadedFilesCount: z.number(),
  totalFilesCount: z.number(),
});
export type TUploadFileResponse = z.infer<typeof UploadFileResponse>;
