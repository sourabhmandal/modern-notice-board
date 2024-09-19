"use client";
import {
  GetNoticeResponse,
  TGetNoticeResponse,
} from "@/app/api/notice/[id]/route";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import {
  alpha,
  AppBar,
  Box,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  Slide,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, SetStateAction, useEffect, useState } from "react";
import useSWR from "swr";
import { GET_NOTICE_BY_ID_API } from "../constants/backend-routes";
import { SafeHtml } from "../data-display/SafeHtml";
import { useToast } from "../data-display/useToast";
import { NotificationResponse } from "../utils/api.utils";

const imageMime = ["image/pdf", "image/png", "image/jpeg"];
const fileMime = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
interface ViewNoticeDialogProps {
  id: string;
  setOpen: React.Dispatch<SetStateAction<string>>;
}
export function ViewNoticeDialog({ id, setOpen }: ViewNoticeDialogProps) {
  const theme = useTheme();
  const [noticeData, setNoticeData] = useState<TGetNoticeResponse>();

  const toast = useToast();
  const {
    data: NoticesResponse,
    error: NoticesError,
    isLoading: isAllNoticesLoading,
  } = useSWR(GET_NOTICE_BY_ID_API(id));

  useEffect(() => {
    if (isAllNoticesLoading) return;

    const parsedErrorResponse = NotificationResponse.safeParse(NoticesResponse);

    if (parsedErrorResponse.success) {
      return toast.showToast(
        "Failed to fetch all notices",
        parsedErrorResponse.data.message,
        parsedErrorResponse.data.status
      );
    }
    const parsedResponse = GetNoticeResponse.safeParse(NoticesResponse);

    if (parsedResponse.success) {
      setNoticeData(parsedResponse.data);
    } else if (parsedResponse.success === false && !isAllNoticesLoading) {
      toast.showToast(
        "Failed to fetch all notices",
        "server error occured",
        "error"
      );
    }
  }, [NoticesResponse]);

  return (
    <Dialog
      fullScreen
      open={id !== ""}
      onClose={() => setOpen("")}
      TransitionComponent={Transition}
    >
      <AppBar
        sx={{
          position: "relative",
          boxShadow: "none",
          backgroundColor:
            theme.palette.mode == "light"
              ? alpha(theme.palette.primary.light, 0.2)
              : theme.palette.primary.dark,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              sx={{ ml: 2, flex: 1, lineHeight: 1 }}
              color="text.primary"
              variant="h4"
            >
              {noticeData?.title}
            </Typography>
          </Box>
          <IconButton color="error" onClick={() => setOpen("")}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {isAllNoticesLoading && (
        <Box
          display="flex"
          height="80vh"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress size={80} />
        </Box>
      )}
      <Grid container gap={2} p={2}>
        {[
          ...(noticeData?.files ?? []),
          ...(noticeData?.files ?? []),
          ...(noticeData?.files ?? []),
        ].map((file, idx) => (
          <Grid item xs={3.8} key={`file-name-${file.filename}-${idx}`}>
            <Box
              border={1}
              borderColor="divider"
              display={"flex"}
              alignItems={"center"}
            >
              <Box padding={2}>
                {imageMime.includes(file.filetype) ? (
                  <ImageIcon />
                ) : (
                  <DescriptionIcon />
                )}
              </Box>
              <Box>
                <Typography variant="body2">{`${
                  file.filename.length > 40
                    ? file.filename.split(".")[0].substring(0, 40) + "... "
                    : file.filename.split(".")[0]
                }.${file.filename.split(".").pop()}`}</Typography>
                <Typography variant="body2">{file.filetype}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <SafeHtml html={noticeData?.contentHtml ?? ""} />
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
