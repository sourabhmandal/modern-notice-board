"use client";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, SetStateAction, useEffect } from "react";
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import {
  DELTE_NOTICE_BY_ID_API,
  GET_ALL_NOTICE_API,
} from "../constants/backend-routes";
import { IListTableItem } from "../data-display/NoticeListTable";
import { useToast } from "../data-display/useToast";
import { NotificationResponse, sendSwrDeleteRequest } from "../utils/api.utils";

interface DeleteNoticeDialogProps {
  noticeId: string;
  setOpen: React.Dispatch<SetStateAction<string>>;
  currentPage: number;
  noticeList: Array<IListTableItem>;
}
export function DeleteNoticeDialog({
  noticeId,
  setOpen,
  currentPage,
  noticeList,
}: DeleteNoticeDialogProps) {
  const toast = useToast();
  const theme = useTheme();

  const selectedNotice = noticeList.find((notice) => notice.id === noticeId);

  const {
    data: DeleteNoticeResponse,
    isMutating: isDeleteNoticeLoading,
    trigger: mutateDeleteNoticeResponse,
  } = useSWRMutation(DELTE_NOTICE_BY_ID_API(noticeId), sendSwrDeleteRequest);

  useEffect(() => {
    if (isDeleteNoticeLoading) return;

    const parsedResponse = NotificationResponse.safeParse(DeleteNoticeResponse);

    if (parsedResponse.success) {
      if (parsedResponse?.data?.status === "success") {
        const newNoticeList = noticeList?.filter(
          (notice) => notice.id !== noticeId
        );
        mutate(GET_ALL_NOTICE_API(currentPage), newNoticeList, false);
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

  if (isDeleteNoticeLoading) {
    return (
      <Box
        display="flex"
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={80} />
      </Box>
    );
  }
  return (
    <Dialog
      open={noticeId !== ""}
      onClose={() => setOpen("")}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        Do you want to delete notice?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography sx={{ fontSize: 12, color: theme.palette.grey[400] }}>
            {noticeId}
          </Typography>
          <Typography variant="body1">
            you are deleting the following notice
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
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
          onClick={() => mutateDeleteNoticeResponse()}
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
