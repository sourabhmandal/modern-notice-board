
import { z } from "zod";

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