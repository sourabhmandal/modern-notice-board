"use client";
import { useCallback, useState } from "react";
import { type IToastMessage, type IToastServity, Toast } from "./Toast";

export function useToast() {
  const [message, setMessage] = useState<IToastMessage>({
    messageTitle: "",
    messageSubtitle: "",
  });
  const [messageServity, setMessageServity] = useState<IToastServity>("info");

  const showToast = useCallback(
    (title: string, subtitle?: string | null, servity?: IToastServity) => {
      setMessage({
        messageTitle: title,
        messageSubtitle: subtitle,
      });
      setMessageServity(servity ?? "info");
    },
    []
  );

  const ToastComponent = () => (
    <Toast message={message} setMessage={setMessage} type={messageServity} />
  );

  return { showToast, ToastComponent };
}
