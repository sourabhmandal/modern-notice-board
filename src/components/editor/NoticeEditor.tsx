"use client";

import type { TCreateNoticeRequest } from "@/app/api/notice/route";
import { CREATE_NOTICE_API } from "@/components";
import { useToast } from "@/components/data-display/useToast";
import { NotificationResponse } from "@/components/utils/api.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "@mui/material";
import Bold from "@tiptap/extension-bold";
import BulletedList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import FontFamily from "@tiptap/extension-font-family";
import Heading from "@tiptap/extension-heading"; // Import the Heading extension
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Italics from "@tiptap/extension-italic";
import LinkBubbleMenuHandler from "@tiptap/extension-link";
import UnorderList from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { generateHTML } from "@tiptap/html";
import { useEditor } from "@tiptap/react";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { z } from "zod";
import { sendSwrPostRequest } from "../utils/api.utils";
import styles from "./editor.module.css";

interface NoticeEditorProps {
  open: number;
  setOpen: Dispatch<SetStateAction<number>>;
  noticeId: string;
  mode?: "create" | "edit";
}

const extensions = [
  Document,
  Paragraph,
  Text,
  TextStyle,
  FontFamily,
  Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
  Bold,
  Italics,
  Underline,
  Highlight,
  Strike,
  TextAlign,
  LinkBubbleMenuHandler.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
  }),
  HorizontalRule,
  UnorderList,
  OrderedList,
  Subscript,
  Superscript,
  Image,
  BulletedList,
];

export function NoticeEditor({
  open,
  setOpen,
  mode = "create",
  noticeId,
}: NoticeEditorProps) {
  const session = useSession();
  const toast = useToast();
  const theme = useTheme();
  const [editorContent, setEditorContent] = useState<string>(
    "<p>Hello World! 🌎️</p>"
  );

  const editor = useEditor({
    extensions: extensions,
    content: editorContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<CreateNoticeFormData>({
    resolver: zodResolver(CreateNoticeSchema),
    defaultValues: {
      title: "",
      isPublished: "false",
    },
  });

  const {
    data: createNoticeResponse,
    error: createNoticeError,
    isMutating: submitCreateNoticeButtonLoading,
    trigger: createNoticePostApiCall,
  } = useSWRMutation(
    CREATE_NOTICE_API,
    sendSwrPostRequest<TCreateNoticeRequest>,
    {
      rollbackOnError: true,
      onSuccess: (data) => {
        const parsedResponse = NotificationResponse.safeParse(data);

        if (parsedResponse.success) {
          if (parsedResponse.data?.status === "success") {
            reset();
          }

          toast.showToast(
            parsedResponse.data?.message ?? "",
            null,
            parsedResponse.data?.status ?? "error"
          );
        }
      },
      onError: () => {
        const parsedResponse =
          NotificationResponse.safeParse(createNoticeError);
        if (parsedResponse.success) {
          toast.showToast(
            parsedResponse.data?.message ?? "",
            null,
            parsedResponse.data?.status ?? "error"
          );
        }
      },
    }
  );

  const handleOnSubmit = async (data: CreateNoticeFormData) => {
    console.log("FORM DATA ::", data);
    console.log("EDITOR CONTENT", editor?.getJSON());
    console.log(generateHTML(editor?.getJSON()!, extensions));

    createNoticePostApiCall({
      id: noticeId,
      title: data.title,
      content: JSON.stringify(editor?.getJSON()),
      contentHtml: editor?.getHTML(),
      adminEmail: session.data?.user.email ?? "",
      isPublished: data.isPublished === "true" ? true : false,
    });
  };
}
const FileSchema = z.object({
  download: z.string(),
  filename: z.string(),
  filetype: z.string(),
  filepath: z.string(),
});
export type FileData = z.infer<typeof FileSchema>;

export const CreateNoticeSchema = z.object({
  title: z.string().min(1, {
    message: "title is required",
  }),
  isPublished: z.enum(["true", "false"]).default("false"),
});

export type CreateNoticeFormData = z.infer<typeof CreateNoticeSchema>;

export type ValidFieldNames = "title" | "content" | "isPublished";
