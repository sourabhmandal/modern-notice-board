"use client";

import { useToast } from "@/components/data-display/useToast";
import { NotificationResponse } from "@/components/utils/api.utils";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
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
import css from "./editor.module.css";

import type { TCreateNoticeRequest } from "@/app/api/notice/route";
import { CREATE_NOTICE_API } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircularProgress } from "@mui/material";
import { generateHTML } from "@tiptap/html";
import {
  ImageNodeAttributes,
  MenuButtonAlignCenter,
  MenuButtonAlignLeft,
  MenuButtonAlignRight,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonHighlightColor,
  MenuButtonHorizontalRule,
  MenuButtonImageUpload,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonUnderline,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectFontFamily,
  MenuSelectHeading,
  RichTextEditor,
  type RichTextEditorRef,
} from "mui-tiptap";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, Suspense, useRef } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { z } from "zod";
import { sendSwrPostRequest } from "../utils/api.utils";

interface NoticeEditorProps {
  open: number;
  setOpen: Dispatch<SetStateAction<number>>;
  noticeId?: string;
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
  LinkBubbleMenuHandler,
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
  const rteRef = useRef<RichTextEditorRef>(null);
  const session = useSession();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
  } = useForm<CreateNoticeData>({
    resolver: zodResolver(CreateNoticeSchema),
    defaultValues: {
      title: "",
      isPublished: "false",
    },
  });
  const formValues = watch(); // Watch all fields

  // create a notice
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

  const handleOnSubmit = async (data: CreateNoticeData) => {
    console.log("FORM DATA ::", data);
    console.log("EDITOR CONTENT", rteRef.current?.editor?.getJSON());
    console.log(generateHTML(rteRef.current?.editor?.getJSON()!, extensions));

    createNoticePostApiCall({
      title: data.title,
      content: JSON.stringify(rteRef.current?.editor?.getJSON()),
      contentHtml: rteRef.current?.editor?.getHTML(),
      adminEmail: session.data?.user.email ?? "",
      isPublished: data.isPublished === "true" ? true : false,
    });
  };
  // Handle file uploads and return image attributes
  const handleUploadFiles = async (
    files: File[]
  ): Promise<ImageNodeAttributes[]> => {
    const results: ImageNodeAttributes[] = [];

    for (const file of files) {
      const reader = new FileReader();
      const promise = new Promise<ImageNodeAttributes>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve({ src: base64 });
        };
        reader.onerror = (error) => reject(error);
      });
      reader.readAsDataURL(file);
      const result = await promise;
      results.push(result);
    }

    return results;
  };

  if (open >= 0)
    return (
      <Suspense fallback={<div>Loading editor...</div>}>
        <toast.ToastComponent />
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <FormControl fullWidth margin="normal">
            <TextField
              type="text"
              fullWidth
              placeholder="Notice Title"
              label="Title"
              required
              size="small"
              {...register("title", { required: true })}
            />
          </FormControl>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "40vh",
            }}
          >
            <RichTextEditor
              ref={rteRef}
              className={css.editorContent}
              extensions={extensions}
              content="<p>Hello world</p>"
              renderControls={() => (
                <MenuControlsContainer>
                  <MenuSelectFontFamily
                    options={[
                      { value: "Arial", label: "Arial" },
                      { value: "Courier New", label: "Courier New" },
                      { value: "Georgia", label: "Georgia" },
                      { value: "Times New Roman", label: "Times New Roman" },
                      { value: "Verdana", label: "Verdana" },
                    ]}
                  />
                  <MenuDivider />
                  <MenuSelectHeading />
                  <MenuDivider />
                  <MenuButtonBold />
                  <MenuButtonItalic />
                  <MenuButtonUnderline />
                  <MenuButtonHighlightColor />
                  <MenuButtonStrikethrough />
                  <MenuDivider />
                  <MenuButtonBulletedList />
                  <MenuButtonOrderedList />
                  <MenuDivider />
                  <MenuButtonAlignLeft />
                  <MenuButtonAlignCenter />
                  <MenuButtonAlignRight />
                  <MenuDivider />
                  <MenuButtonSubscript />
                  <MenuButtonSuperscript />
                  <MenuDivider />
                  <MenuButtonHorizontalRule />
                  <MenuButtonImageUpload onUploadFiles={handleUploadFiles} />
                  <MenuDivider />
                </MenuControlsContainer>
              )}
            />
          </Box>
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              How should we save the notice?
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-row-radio-buttons-group-label"
              row={false}
            >
              <FormControlLabel
                value={"false"}
                defaultChecked
                checked={getValues("isPublished") === "false"}
                control={
                  <Radio {...register("isPublished", { required: true })} />
                }
                label="As Drafted"
              />
              <FormControlLabel
                value={"true"}
                checked={getValues("isPublished") === "true"}
                control={
                  <Radio {...register("isPublished", { required: true })} />
                }
                label="As Published"
              />
            </RadioGroup>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            disabled={submitCreateNoticeButtonLoading}
            startIcon={
              submitCreateNoticeButtonLoading ? (
                <CircularProgress size={16} />
              ) : (
                <DescriptionIcon />
              )
            }
            size="large"
            type="submit"
          >
            Create Notice
          </Button>
        </form>
      </Suspense>
    );
}

export const CreateNoticeSchema = z.object({
  title: z.string().min(1, {
    message: "title is required",
  }),
  isPublished: z.enum(["true", "false"]).default("false"),
});

type CreateNoticeData = z.infer<typeof CreateNoticeSchema>;

export type ValidFieldNames = "title" | "content" | "isPublished";
