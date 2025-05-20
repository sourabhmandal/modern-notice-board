"use client";
import { UploadFileResponse } from "@/app/api/upload/validate";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  alpha,
  Box,
  Card,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Dispatch, SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import {
  DELETE_UPLOAD_API,
  UPLOAD_FILE_API,
} from "../constants/backend-routes";
import { useToast } from "../data-display/useToast";
import {
  sendSwrDeleteRequest,
  sendSwrFileUploadRequest,
} from "../utils/api.utils";
import { CreateNoticeFormData, FileData } from "./NoticeEditorMui"; // Adjust the import path as necessary

interface UploadFilesDialogProps {
  noticeId?: string;
  isLoadingSync: "loading" | "success" | "slate";
  setIsLoadingSync: Dispatch<SetStateAction<"loading" | "success" | "slate">>;
}

export function UploadFilesSection({
  noticeId,
  isLoadingSync,
  setIsLoadingSync,
}: UploadFilesDialogProps) {
  const toast = useToast();
  const theme = useTheme();
  const { watch, setValue } = useFormContext<CreateNoticeFormData>();
  const files = watch("files");

  const {
    data: CreateUploadResponse,
    isMutating: CreateUploadLoading,
    trigger: mutateCreateUpload,
  } = useSWRMutation(UPLOAD_FILE_API, sendSwrFileUploadRequest);

  const {
    data: DeleteUploadResponse,
    isMutating: isDeleteUploadLoading,
    trigger: mutateDeleteUpload,
  } = useSWRMutation(
    DELETE_UPLOAD_API,
    sendSwrDeleteRequest<{
      file_path: string;
    }>
  );

  // -- sync save on file upload and delete --
  const onDrop = async (droppedFiles: Array<File>) => {
    if (!noticeId)
      return toast.showToast("Please Add Notice Title First", null, "error");

    setIsLoadingSync("loading");
    const remoteUploadData = await mutateCreateUpload({
      noticeId: noticeId,
      files: droppedFiles,
    });
    const parsedResponse = UploadFileResponse.safeParse(remoteUploadData);

    if (!parsedResponse.success) {
      console.error("Zod parsing error:", parsedResponse.error);
    } else {
      console.log("Parsed data:", parsedResponse.data);
      setValue("files", parsedResponse.data.uploads, { shouldValidate: true });
    }
    setIsLoadingSync("success");
  };
  const deleteUpload = (filepath: string) => {
    mutateDeleteUpload({
      file_path: filepath,
    });
    const newFilesAfterDelete = files.filter((f) => f.filepath !== filepath);
    setValue("files", newFilesAfterDelete, { shouldValidate: true });
    // api call for deleting files
  };
  // ----------------------------

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 20,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
        ".xls",
        ".csv",
        ".ods",
      ],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".ppt", ".pptx", ".odp", ".pdf", ".key"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "application/zip": [".zip"],
      "text/csv": [".csv"],
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    onDrop,
  });

  return (
    <Box>
      <div {...getRootProps()}>
        <toast.ToastComponent />
        <input
          {...getInputProps()}
          style={{
            display: "none",
          }}
        />
        <div
          style={{
            background: isDragActive ? "grey" : "white",
            height: 200,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px dashed #ddd",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          <Typography>
            {isDragActive
              ? "Drag the files here..."
              : "Drag 'n' Drop some files here..."}
          </Typography>
        </div>
      </div>

      <Box py={2}>
        <Typography variant="caption" color="text.secondary">
          {isDeleteUploadLoading || CreateUploadLoading
            ? "Syncing files..."
            : `${(files && files.length) ?? 0} files synced`}
        </Typography>
        {files &&
          files.filter((f) => f.filetype.startsWith("image")).length > 0 && (
            <Grid container spacing={2}>
              {files
                .filter((f) => f.filetype.startsWith("image"))
                .map((file: FileData) => (
                  <Grid item xs={4} sm={4} md={2} key={file.download}>
                    <Card
                      sx={{
                        position: "relative",
                        width: "100%",
                        height: 150, // Adjust the height as needed
                        overflow: "hidden",
                      }}
                    >
                      {/* CardMedia for the image */}
                      <CardMedia
                        component="img"
                        image={file.download}
                        alt={file.filename}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", // Ensures image covers the card while maintaining aspect ratio
                        }}
                      />

                      {/* Close button in the top-right corner */}
                      <IconButton
                        onClick={() => deleteUpload(file.filepath)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          backgroundColor: alpha(theme.palette.error.main, 0.7), // Semi-transparent background
                          color: theme.palette.getContrastText(
                            theme.palette.text.disabled
                          ), // Red color for the icon
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.error.main, 1), // Slightly darker red on hover
                          },
                        }}
                        aria-label={`delete ${file.filename}`}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          )}

        {files &&
          files.filter((f) => !f.filetype.startsWith("image")).length > 0 && (
            <Box py={2}>
              <Divider />
            </Box>
          )}

        {files &&
          files.filter((f) => !f.filetype.startsWith("image")).length > 0 && (
            <Grid container spacing={2} p={2}>
              <Grid
                xs={4}
                sm={4}
                md={3}
                sx={{
                  p: 2,
                  position: "relative",
                  borderColor: "divider",
                  border: 1,
                  borderRadius: 1,
                  display: "flex",
                  my: "auto",
                }}
              >
                {files
                  .filter((f) => !f.filetype.startsWith("image"))
                  .map((file: FileData) => (
                    <Box key={file.filepath}>
                      <IconButton
                        onClick={() => deleteUpload(file.filepath)}
                        sx={{
                          position: "absolute",
                          top: 8, // Distance from the top
                          right: 8, // Distance from the right
                          backgroundColor: alpha(theme.palette.error.main, 0.7), // Light red tint
                          color: theme.palette.getContrastText(
                            theme.palette.text.disabled
                          ), // Red color for the icon
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.error.main, 1), // Slightly darker red on hover
                          },
                        }}
                        size="small"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                      <Box
                        display="flex"
                        alignItems="center" // Center the items vertically
                        gap={1} // Space between the icon and the text
                      >
                        <InsertDriveFileIcon color="action" fontSize="large" />
                        <Box>
                          <Typography variant="subtitle2">
                            {`${
                              file.filename.length > 18
                                ? file.filename
                                    .split(".")
                                    .slice(0, -1)
                                    .join()
                                    .substring(0, 18)
                                : file.filename.split(".").slice(0, -1).join()
                            }... .${file.filename.split(".").pop()}`}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            color={alpha(theme.palette.text.secondary, 0.4)}
                          >
                            {file.filetype.substring(0, 25)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
              </Grid>
            </Grid>
          )}
      </Box>
    </Box>
  );
}
