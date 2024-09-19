"use client";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"; // File icon
import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import { SetStateAction } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import {
  DELETE_UPLOAD_NOTICE_ID_API,
  UPLOAD_FILE_BY_NOTICE_ID_API,
} from "../constants/backend-routes";
import { useToast } from "../data-display/useToast";
import { CreateNoticeFormData } from "../editor/NoticeEditorMui"; // Adjust the import path as necessary
import { sendSwrDeleteRequest, sendSwrPostRequest } from "../utils/api.utils";

interface UploadFilesDialogProps {
  noticeId: string;
  open: boolean;
  setValue: UseFormSetValue<CreateNoticeFormData>;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  watch: UseFormWatch<CreateNoticeFormData>;
}

export function UploadFilesDialog({
  open,
  noticeId,
  setOpen,
  setValue,
  watch,
}: UploadFilesDialogProps) {
  const toast = useToast();
  const theme = useTheme();
  const files = watch("files");

  const {
    data: DeleteUploadResponse,
    isMutating: DeleteUploadLoading,
    trigger: mutateDeleteUpload,
  } = useSWRMutation(
    DELETE_UPLOAD_NOTICE_ID_API(noticeId),
    sendSwrDeleteRequest
  );

  const {
    data: CreateUploadResponse,
    isMutating: CreateUploadLoading,
    trigger: mutateCreateUpload,
  } = useSWRMutation(UPLOAD_FILE_BY_NOTICE_ID_API, sendSwrPostRequest);

  const onDrop = (droppedFiles: Array<File>) => {
    const newFilesAppended = [...files, ...droppedFiles];
    setValue("files", newFilesAppended, { shouldValidate: true });
    // api call for uploading files
    const formData = new FormData();
    formData.append("file_1", droppedFiles[0]);
  };
  const deleteUpload = (filename: string) => {
    const newFilesAfterDelete = files.filter((f) => f.name !== filename);
    setValue("files", newFilesAfterDelete, { shouldValidate: true });
    // api call for deleting files
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 10,
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
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle id="alert-dialog-title">Upload files</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div {...getRootProps()}>
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
              {DeleteUploadLoading || CreateUploadLoading
                ? "Syncing files..."
                : "All files synced"}
            </Typography>
            {!!files?.length && (
              <Grid container gap={2} columns={20} width={"100%"}>
                {files.map((file: File) => {
                  if (file.type.startsWith("image")) {
                    return (
                      <Grid xs={6} sx={{ position: "relative" }}>
                        <Image
                          src={URL.createObjectURL(file)}
                          width={200}
                          height={0}
                          layout="responsive"
                          objectFit="cover"
                          alt={file.name.replaceAll(" ", "_")}
                        />
                        <IconButton
                          onClick={() => deleteUpload(file.name)}
                          sx={{
                            position: "absolute",
                            top: 8, // Distance from the top
                            right: 8, // Distance from the right
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.8
                            ), // Light red tint
                            color: theme.palette.getContrastText(
                              theme.palette.text.disabled
                            ), // Red color for the icon
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                1
                              ), // Slightly darker red on hover
                            },
                          }}
                          size="small"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    );
                  } else {
                    return (
                      <Grid
                        xs={9}
                        sx={{
                          p: 2,
                          position: "relative",
                          borderColor: "divider",
                          border: 1,
                          borderRadius: 1,
                          display: "flex",
                        }}
                      >
                        <IconButton
                          onClick={() => deleteUpload(file.name)}
                          sx={{
                            position: "absolute",
                            top: 8, // Distance from the top
                            right: 8, // Distance from the right
                            backgroundColor: alpha(
                              theme.palette.error.main,
                              0.8
                            ), // Light red tint
                            color: theme.palette.getContrastText(
                              theme.palette.text.disabled
                            ), // Red color for the icon
                            "&:hover": {
                              backgroundColor: alpha(
                                theme.palette.error.main,
                                1
                              ), // Slightly darker red on hover
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
                          <InsertDriveFileIcon
                            color="action"
                            fontSize="large"
                          />
                          <Box>
                            <Typography variant="subtitle2">
                              {file.name.substring(0, 18)}...
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              color={alpha(theme.palette.text.secondary, 0.4)}
                            >
                              {file.type.substring(0, 25)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  }
                })}
              </Grid>
            )}
          </Box>
        </DialogContentText>
        <DialogActions>
          <Box
            display="flex"
            justifyContent="space-between"
            alignContent="center"
            width="100%"
          >
            <Typography variant="caption" color="text.secondary" my={"auto"}>
              {files ? files?.length : 0} files selected
            </Typography>
            <Box display="flex" justifyItems="center" gap={1}>
              <Button
                variant="text"
                onClick={() => {
                  setValue("files", []);
                }}
              >
                Clear all
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => setOpen(false)}
              >
                Done
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
