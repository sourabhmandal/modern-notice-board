import { z } from "zod";

export async function sendSwrPostRequest<T>(url: string, { arg }: { arg: T }) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export async function sendSwrFileUploadRequest(
  url: string,
  { arg }: { arg: { noticeId: string; files: Array<File> } }
) {
  const formdata = new FormData();
  arg.files.forEach((file) => {
    formdata.append("file", file);
  });
  formdata.append("noticeId", arg.noticeId);

  return fetch(url, {
    method: "POST",
    body: formdata,
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to upload files");
    }
    return res.json();
  });
}

export async function sendSwrDeleteRequest<T>(
  url: string,
  { arg }: { arg: T }
) {
  return fetch(url, {
    method: "DELETE",
    body: arg ? JSON.stringify(arg) : null,
  }).then((res) => res.json());
}

export const NotificationResponse = z.object({
  status: z.enum(["success", "error", "warning"]),
  message: z.string(),
});
export type TNotificationResponse = z.infer<typeof NotificationResponse>;
