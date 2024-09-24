"use client";
import { TUser } from "@/app/api/user/route";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { SetStateAction, useEffect } from "react";
import useSWRMutation from "swr/mutation";
import { DELETE_NOTICE_BY_ID_API } from "../constants/backend-routes";
import { useToast } from "../data-display/useToast";
import { NotificationResponse, sendSwrDeleteRequest } from "../utils/api.utils";
interface UserActionsDialogProps {
  noticeId: string;
  setOpen: React.Dispatch<SetStateAction<string>>;
  currentPage: number;
  userList: Array<TUser>;
  updateNotices: () => void;
}
export function UserActionsDialog({
  noticeId,
  setOpen,
  currentPage,
  userList,
  updateNotices,
}: UserActionsDialogProps) {
  const toast = useToast();
  const theme = useTheme();

  const selectedNotice = noticeList.find((notice) => notice.id === noticeId);

  const {
    data: DeleteNoticeResponse,
    isMutating: isDeleteNoticeLoading,
    trigger: mutateDeleteNoticeResponse,
  } = useSWRMutation(DELETE_NOTICE_BY_ID_API(noticeId), sendSwrDeleteRequest);

  useEffect(() => {
    if (isDeleteNoticeLoading) return;

    const parsedResponse = NotificationResponse.safeParse(DeleteNoticeResponse);

    if (parsedResponse.success) {
      if (parsedResponse?.data?.status === "success") {
        setOpen("");
        return toast.showToast(
          "Successfully to delete notice",
          parsedResponse.data.message,
          parsedResponse.data.status
        );
      }

      return toast.showToast(
        "Failed to delete notice",
        parsedResponse.data.message,
        parsedResponse.data.status
      );
    } else if (parsedResponse.success === false && !isDeleteNoticeLoading) {
      toast.showToast(
        "Failed to delete notices",
        "server error occured",
        "error"
      );
    }
  }, [DeleteNoticeResponse]);

  return (
    <Dialog
      open={noticeId !== ""}
      onClose={() => setOpen("")}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        Do you want to delete notice?
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="body1">
            You are deleting the following notice
          </Typography>
          <Typography sx={{ fontSize: 12, color: theme.palette.grey[400] }}>
            {noticeId}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              color: theme.palette.error.main,
              mt: 1,
            }}
          >
            Title: {selectedNotice?.title}
          </Typography>
          <Typography variant="body1">
            Posted By: {selectedNotice?.adminEmail}
          </Typography>
          <Typography variant="body1">
            Published Status:{" "}
            {selectedNotice?.isPublished ? "Published" : "Not Published"}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen("")}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            console.log("<> OPTIMISTIC UPDATE IN DELETE BUTTON:: ");
            updateNotices();
            mutateDeleteNoticeResponse();
          }}
          color="error"
          startIcon={
            isDeleteNoticeLoading ? (
              <CircularProgress size={20} />
            ) : (
              <DeleteIcon />
            )
          }
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
