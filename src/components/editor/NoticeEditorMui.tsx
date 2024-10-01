"use client";

import { useToast } from "@/components/data-display/useToast";
import AdjustIcon from "@mui/icons-material/Adjust";
import CheckIcon from "@mui/icons-material/Check";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  alpha,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
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
import _ from "lodash";
import css from "./editor.module.css";

import { TCreateNoticeRequest } from "@/app/api/notice/route";
import { UploadFilesSection } from "@/components";
import { CREATE_NOTICE_API } from "@/components/constants/backend-routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircularProgress } from "@mui/material";
import Placeholder from "@tiptap/extension-placeholder";
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
import { Suspense, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { z } from "zod";
import { NotificationResponse, sendSwrPostRequest } from "../utils/api.utils";

interface NoticeEditorProps {
  noticeId: string;
  noticeTitle?: string;
  isPublished?: boolean;
  files?: Array<FileData>;
  content?: string;
  mode: "create" | "update";
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
  Placeholder.configure({ placeholder: "Start typing..." }),
];

export function NoticeEditorMui({
  noticeId,
  noticeTitle,
  isPublished,
  files,
  content,
  mode,
}: NoticeEditorProps) {
  const rteRef = useRef<RichTextEditorRef>(null);
  const session = useSession();
  const toast = useToast();
  const [editorContentChanged, setEditorContentChanged] = useState(false);
  const theme = useTheme();
  const [isLoadingSync, setIsLoadingSync] = useState<
    "slate" | "loading" | "success"
  >("slate");


  const methods = useForm<CreateNoticeFormData>({
    resolver: zodResolver(CreateNoticeSchema),
    defaultValues: {
      title: noticeTitle ?? "",
      files: files ?? [],
      isPublished: isPublished ? "true" : "false",
    },
  });
  const data = methods.watch();

  const {
    data: createNoticeResponse,
    error: createNoticeError,
    isMutating: submitCreateNoticeButtonLoading,
    trigger: createNoticePostApiCall,
  } = useSWRMutation(
    CREATE_NOTICE_API,
    sendSwrPostRequest<TCreateNoticeRequest>,
    {
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
    if (data.title.length < 1) return;

    setIsLoadingSync("loading");
    await createNoticePostApiCall({
      id: noticeId,
      title: data.title,
      content: JSON.stringify(rteRef.current?.editor?.getJSON()),
      contentHtml: String(rteRef.current?.editor?.getHTML()),
      adminEmail: session.data?.user.email ?? "",
      isPublished: data.isPublished === "true" ? true : false,
    });
    setIsLoadingSync("success");
  };

  useEffect(() => {
    if (data.title.length < 1) return;

    // Define the debounced function
    const debouncedSync = _.debounce(async () => {
      if (data.title.length < 1) return;
      setIsLoadingSync("loading");
      const response = await handleOnSubmit(data);
      const parsedResponse = NotificationResponse.safeParse(response);

      toast.showToast(
        parsedResponse.data?.message ?? "",
        null,
        parsedResponse.data?.status ?? "error"
      );

      setIsLoadingSync("success");
    }, 1000);

    // Call the debounced function
    debouncedSync();

    // Clean up the debounce on unmount or if `data` changes
    return () => {
      debouncedSync.cancel();
    };
  }, [data.title, editorContentChanged]);

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
      {isLoadingSync == "slate" ? (
        <Chip
          icon={<AdjustIcon fontSize="small" />}
          label="slate"
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.secondary.main, 0.3),
            color: alpha(theme.palette.secondary.dark, 1),
          }}
          variant="outlined"
          color="secondary"
        />
      ) : isLoadingSync == "loading" ? (
        <Chip
          icon={<CircularProgress size={12} />}
          label="Save in Progress"
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.warning.main, 0.3),
            color: alpha(theme.palette.warning.dark, 1),
          }}
          variant="outlined"
          color="warning"
        />
      ) : (
        <Chip
          icon={<CheckIcon fontSize={"small"} />}
          label="Saved"
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.success.main, 0.3),
            color: alpha(theme.palette.success.dark, 1),
          }}
          variant="outlined"
          color="success"
        />
      )}
      <FormProvider {...methods}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          onSubmit={methods.handleSubmit(handleOnSubmit)}
        >
          <FormControl fullWidth margin="normal">
            <TextField
              type="text"
              fullWidth
              placeholder="Notice Title"
              label="Title"
              required
              size="small"
              {...methods.register("title", { required: true })}
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
              onUpdate={({ editor }) => {
                setEditorContentChanged((prev) => !prev);
              }}
              content={content}
              ref={rteRef}
              className={css.editorContent}
              extensions={extensions}
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
          <FormControl sx={{ marginBottom: 2, marginTop: 3, marginX: 1 }}>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Upload files
            </FormLabel>
            <UploadFilesSection
              noticeId={noticeId}
              setIsLoadingSync={setIsLoadingSync}
              isLoadingSync={isLoadingSync}
            />
          </FormControl>
          <FormControl sx={{ marginBottom: 2, marginTop: 3, marginX: 1 }}>
            <FormLabel id="demo-row-radio-buttons-group-label">
              How should we save the notice?
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-row-radio-buttons-group-label"
              row
            >
              <FormControlLabel
                value={"false"}
                defaultChecked
                checked={methods.getValues("isPublished") === "false"}
                control={
                  <Radio
                    {...methods.register("isPublished", { required: true })}
                  />
                }
                label="As Drafted"
              />
              <FormControlLabel
                value={"true"}
                checked={methods.getValues("isPublished") === "true"}
                control={
                  <Radio
                    {...methods.register("isPublished", { required: true })}
                  />
                }
                label="As Published"
              />
            </RadioGroup>
          </FormControl>
          <Box display="flex" gap={2}>
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
              color={mode == "create" ? "primary" : "warning"}
              type="submit"
            >
              {mode} Notice
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Suspense>
  );
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
  files: z.array(FileSchema).default([]),
});

export type CreateNoticeFormData = z.infer<typeof CreateNoticeSchema>;

export type ValidFieldNames = "title" | "content" | "isPublished";
