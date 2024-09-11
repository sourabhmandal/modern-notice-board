"use server";
import { env } from "@/server/env";
import aws from "aws-sdk";

class AwsS3 {
  private s3_instance: aws.S3;

  constructor() {
    this.s3_instance = new aws.S3({
      credentials: {
        accessKeyId: env.AIT_AWS_ACCESS_KEY,
        secretAccessKey: env.AIT_AWS_SECRET_ACCESS_KEY,
      },
      region: env.AIT_AWS_REGION,
    });
  }

  GetS3(): aws.S3 {
    if (this.s3_instance) return this.s3_instance;
    else {
      throw new Error("Cannot instantiate S3 bucket access");
    }
  }

  async DeleteFileByFileId(fileid: string) {
    this.s3_instance.deleteObject(
      {
        Bucket: env.AIT_AWS_BUCKET_ID,
        Key: `${fileid}`,
      },
      (err, data) => {
        console.log(data, err);
      }
    );
  }

  async UploadFile(fileid: string) {
    this.s3_instance.deleteObject(
      {
        Bucket: env.AIT_AWS_BUCKET_ID,
        Key: `${fileid}`,
      },
      (err, data) => {
        console.log(data, err);
      }
    );
  }
}

export const S3Instance = new AwsS3();
