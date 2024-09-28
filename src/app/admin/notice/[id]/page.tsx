"use client";
import { GetNoticeResponse } from "@/app/api/notice/[id]/route";
import {
  DashboardMainContent,
  GET_NOTICE_BY_ID_API,
  NoticeEditorMui,
  useToast,
} from "@/components";
import { Box, CircularProgress, Typography } from "@mui/material";
import useSWR from "swr";
export default function DashboardPage({ params }: { params: { id: string } }) {
  const {
    data: NoticesResponse,
    error: NoticesError,
    isLoading: isNoticeByIdLoading,
  } = useSWR(GET_NOTICE_BY_ID_API(params.id));
  const toast = useToast();
  if (isNoticeByIdLoading) {
    return (
      <Box
        display="flex"
        height="80vh"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <CircularProgress size={25} />
        <Typography variant="h5" color="text.secondary">
          Loading Notice Details...
        </Typography>
      </Box>
    );
  }

  if (NoticesError) {
    toast.showToast(
      "Error fetching notice details",
      `notice of id ${params.id} not loaded due to server error`,
      "error"
    );
  }

  const noticeDetails = GetNoticeResponse.parse(NoticesResponse);

  return (
    <DashboardMainContent
      heading={
        <Typography variant="h5" mb={2}>
          Update Notice
        </Typography>
      }
    >
      <NoticeEditorMui
        mode={"update"}
        noticeId={params.id}
        noticeTitle={noticeDetails.title}
        files={noticeDetails.files}
        isPublished={noticeDetails.isPublished}
        content={noticeDetails.contentHtml?.toString()}
      />
    </DashboardMainContent>
  );
}
