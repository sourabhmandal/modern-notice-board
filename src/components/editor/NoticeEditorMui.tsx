"use client";

import { useToast } from "@/components/data-display/useToast";
import { NotificationResponse } from "@/components/utils/api.utils";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
  Typography,
} from "@mui/material";
//@ts-ignore

import Bold from "@tiptap/extension-bold";
import BulletedList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading"; // Import the Heading extension
import HorizontalRule from "@tiptap/extension-horizontal-rule";
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
import { CREATE_NOTICE_API, UploadFilesDialog } from "@/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircularProgress } from "@mui/material";
import {
  MenuButtonAlignCenter,
  MenuButtonAlignLeft,
  MenuButtonAlignRight,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonHorizontalRule,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonUnderline,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  type RichTextEditorRef,
} from "mui-tiptap";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, Suspense, useRef, useState } from "react";
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
  Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
  Bold,
  Italics,
  Underline,
  Strike,
  TextAlign,
  LinkBubbleMenuHandler,
  HorizontalRule,
  UnorderList,
  OrderedList,
  Subscript,
  Superscript,
  BulletedList,
];

export function NoticeEditorMui({
  mode = "create",
  noticeId,
}: NoticeEditorProps) {
  const rteRef = useRef<RichTextEditorRef>(null);
  const session = useSession();
  const toast = useToast();
  const [openUploadFilesModal, setOpenUploadFilesModal] =
    useState<boolean>(true);

  if (mode === "edit") {
    // get notice details by noticeId
    // get attachments by noticeId
  }

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<CreateNoticeFormData>({
    resolver: zodResolver(CreateNoticeSchema),
    defaultValues: {
      title: "",
      isPublished: "false",
    },
  });

  const formState = watch();
  // console.log("formState", formState);

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

  const handleOnSubmit = async (data: CreateNoticeFormData) => {
    createNoticePostApiCall({
      title: data.title,
      content: JSON.stringify(rteRef.current?.editor?.getJSON()),
      contentHtml: String(rteRef.current?.editor?.getHTML()),
      adminEmail: session.data?.user.email ?? "",
      isPublished: data.isPublished === "true" ? true : false,
    });
  };

  return (
    <Suspense
      fallback={
        <Box
          display="flex"
          height="80vh"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          <CircularProgress size={25} />
          <Typography variant="h5" color="text.secondary">
            Loading editor...
          </Typography>
        </Box>
      }
    >
      <toast.ToastComponent />
      <UploadFilesDialog
        noticeId=""
        watch={watch}
        setValue={setValue}
        open={openUploadFilesModal}
        setOpen={setOpenUploadFilesModal}
      />
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
            minHeight: "40vh",
          }}
        >
          <RichTextEditor
            // sx={{
            //   minHeight: "40vh",
            //   overflowY: "auto",
            // }}
            ref={rteRef}
            className={css.editorContent}
            extensions={extensions}
            content="<p>Hello world</p>"
            renderControls={() => (
              <MenuControlsContainer>
                <MenuSelectHeading />
                <MenuDivider />
                <MenuButtonBold />
                <MenuButtonItalic />
                <MenuButtonUnderline />
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
                <MenuDivider />
              </MenuControlsContainer>
            )}
          />
        </Box>
        {/* <DropzoneArea
            multiple={false}
            onChange={(files: any) => console.log("Files:", files)}
            onDropRejected={() =>
              toast.showToast(
                "Unsupported file",
                `file type not accepted`,
                "error"
              )
            }
            maxFileSize={50 * 1024 ** 2} // 20 mb
            dropzoneText={"Drag and drop an image here or click"}
            showAlerts={["error"]}
            acceptedFiles={}
          /> */}
        <FormControl sx={{ marginBottom: 2, marginTop: 3, marginX: 1 }}>
          <FormLabel id="demo-row-radio-buttons-group-label">
            How should we save the notice?
          </FormLabel>
          <RadioGroup aria-labelledby="demo-row-radio-buttons-group-label" row>
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
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            fullWidth
            color="info"
            onClick={() => {
              setOpenUploadFilesModal(true);
            }}
            startIcon={<CloudUploadIcon />}
          >
            Upload Files
          </Button>
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
            color="success"
            type="submit"
          >
            Create Notice
          </Button>
        </Box>
      </form>
    </Suspense>
  );
}

export const CreateNoticeSchema = z.object({
  title: z.string().min(1, {
    message: "title is required",
  }),
  isPublished: z.enum(["true", "false"]).default("false"),
  files: z.array(z.any()).default([]),
});

export type CreateNoticeFormData = z.infer<typeof CreateNoticeSchema>;

export type ValidFieldNames = "title" | "content" | "isPublished";
