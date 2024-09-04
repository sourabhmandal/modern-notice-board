import { z } from "zod";

export async function sendSwrPostRequest<T>(url: string, { arg }: { arg: T }) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export async function sendSwrDeleteRequest(url: string) {
  return fetch(url, {
    method: "DELETE",
  }).then((res) => res.json());
}

export const NotificationResponse = z.object({
  status: z.enum(["success", "error"]),
  message: z.string(),
});
export type TNotificationResponse = z.infer<typeof NotificationResponse>;
