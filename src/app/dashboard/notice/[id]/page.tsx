"use client";
import { GetNoticeResponse } from "@/app/api/notice/[id]/validate";
import { DashboardMainContent, NoticeEditorMui, useToast } from "@/components";
import { GET_NOTICE_BY_ID_API } from "@/components/constants/backend-routes";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";
import useSWR from "swr";
export default function DashboardPage() {
  const router = useRouter();
  const {
    data: NoticesResponse,
    error: NoticesError,
    isLoading: isNoticeByIdLoading,
  } = useSWR(GET_NOTICE_BY_ID_API(router.query.id as string));
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
      `notice of id ${
        router.query.id as string
      } not loaded due to server error`,
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
        noticeId={router.query.id as string}
        noticeTitle={noticeDetails.title}
        files={noticeDetails.files}
        isPublished={noticeDetails.isPublished}
        content={noticeDetails.contentHtml?.toString()}
      />
    </DashboardMainContent>
  );
}
