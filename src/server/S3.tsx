import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";

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

  async DeleteFileByFileId(
    filePath: string
  ): Promise<DeleteObjectCommandOutput> {
    const deleteParams: DeleteObjectCommandInput = {
      Bucket: process.env.AIT_AWS_BUCKET_ID,
      Key: filePath,
    };

    const command = new DeleteObjectCommand(deleteParams);
    return this.s3_instance.send(command);
  }

  async UploadFile(file: File): Promise<PutObjectCommandOutput> {
    const arrayBuffer = await file.arrayBuffer();
    const uploadParams = {
      Bucket: process.env.AIT_AWS_BUCKET_ID,
      Key: `temp-uploads/${file.name}`,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type,
    };

    const command = new PutObjectCommand(uploadParams);
    return this.s3_instance.send(command);
  }

  async moveS3File(sourceKey: string, destinationKey: string) {
    try {
      // Step 1: Copy the file to the destination folder
      const copyParams = {
        Bucket: process.env.AIT_AWS_BUCKET_ID,
        CopySource: `${process.env.AIT_AWS_BUCKET_ID}/${sourceKey}`, // Source file
        Key: destinationKey, // New destination file
      };
      const copyCommand = new CopyObjectCommand(copyParams);
      await this.s3_instance.send(copyCommand);

      // Step 2: Delete the original file
      const deleteParams = {
        Bucket: process.env.AIT_AWS_BUCKET_ID,
        Key: sourceKey, // Source file to delete
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      console.log(
        `File moved successfully from ${sourceKey} to ${destinationKey}`
      );
      return this.s3_instance.send(deleteCommand);
    } catch (error) {
      console.error("Error moving file:", error);
    }
  }
}

export const S3Instance = new AwsS3();
