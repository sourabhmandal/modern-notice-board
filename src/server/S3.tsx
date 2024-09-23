import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class AwsS3 {
  private s3_instance: S3Client;

  constructor() {
    this.s3_instance = new S3Client({
      credentials: {
        accessKeyId: process.env.AIT_AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AIT_AWS_SECRET_ACCESS_KEY!,
      },
      region: process.env.AIT_AWS_REGION,
    });
  }

  async DeleteFileByFilePath(
    filePath: string
  ): Promise<DeleteObjectCommandOutput> {
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: process.env.AIT_AWS_BUCKET_ID,
      Key: filePath,
    };

    const command = new DeleteObjectCommand(deleteParams);
    return this.s3_instance.send(command);
  }

  async DeleteFilesByFilePath(
    filePaths: Array<string>
  ): Promise<DeleteObjectCommandOutput> {
    const deleteParams: DeleteObjectsCommandInput = {
      Bucket: process.env.AIT_AWS_BUCKET_ID,
      Delete: {
        Objects: filePaths.map((filePath) => ({ Key: filePath })),
      },
    };

    const command = new DeleteObjectsCommand(deleteParams);
    return this.s3_instance.send(command);
  }

  async GetFilesByFolder(
    folderPath: string
  ): Promise<ListObjectsV2CommandOutput> {
    const listObjectParams: ListObjectsV2CommandInput = {
      Bucket: process.env.AIT_AWS_BUCKET_ID,
      Prefix: folderPath,
    };

    const command = new ListObjectsV2Command(listObjectParams);
    return this.s3_instance.send(command);
  }
  async UploadFile(
    noticeId: string,
    file: File
  ): Promise<PutObjectCommandOutput> {
    const arrayBuffer = await file.arrayBuffer();
    const uploadParams = {
      Bucket: process.env.AIT_AWS_BUCKET_ID,
      Key: `${noticeId}/${file.name}`,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type,
    };

    const command = new PutObjectCommand(uploadParams);
    return this.s3_instance.send(command);
  }

  async getDownloadUrl(filepath: string, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AIT_AWS_BUCKET_ID,
        Key: filepath,
      });

      // Generate the presigned URL
      const presignedUrl = await getSignedUrl(this.s3_instance, command, {
        expiresIn,
      });

      return presignedUrl;
    } catch (err) {
      console.error("Error generating presigned URL", err);
      throw err;
    }
  }
}

export const S3Instance = new AwsS3();
