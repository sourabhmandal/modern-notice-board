"use client";
import {
  GetAllNoticeResponse,
  TGetAllNoticeResponse,
} from "@/app/api/notice/route";
import {
  DashboardMainContent,
  GET_ALL_NOTICE_API,
  NoticeListTable,
  useToast,
  ViewNoticeDialog,
} from "@/components";
import { NotificationResponse } from "@/components/utils/api.utils";
import { Box, CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function DashboardPage() {
  const [allNoticeData, setAllNoticeData] = useState<TGetAllNoticeResponse>();
  const [selectedNoticeId, setSelectedNoticeId] = useState("");

  const toast = useToast();
  const searchParams = useSearchParams();
  const pageNos = ~~parseInt(searchParams.get("page") ?? "1");
  const rowNos = 10;
  const { data: AllNoticesResponse, isLoading: isAllNoticesLoading } = useSWR(
    GET_ALL_NOTICE_API(pageNos)
  );

  useEffect(() => {
    console.log("SELECTED NOTICE ID", selectedNoticeId);
  }, [selectedNoticeId]);

  useEffect(() => {
    if (isAllNoticesLoading) return;

    const parsedErrorResponse =
      NotificationResponse.safeParse(AllNoticesResponse);

    if (parsedErrorResponse.success) {
      return toast.showToast(
        "Failed to fetch all notices",
        parsedErrorResponse.data.message,
        parsedErrorResponse.data.status
      );
    }
    const parsedResponse = GetAllNoticeResponse.safeParse(AllNoticesResponse);

    if (parsedResponse.success) {
      setAllNoticeData(parsedResponse.data);
      console.log(parsedResponse.data);
    } else if (parsedResponse.success === false && !isAllNoticesLoading) {
      toast.showToast(
        "Failed to fetch all notices",
        "server error occured",
        "error"
      );
    }
  }, [AllNoticesResponse]);

  if (isAllNoticesLoading) {
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
    <DashboardMainContent>
      <toast.ToastComponent />
      <NoticeListTable
        onClickAction={(id: string) => setSelectedNoticeId(id)}
        onUpdateAction={(id: string) => setSelectedNoticeId(id)}
        items={
          allNoticeData?.notices.map((notice) => ({
            id: notice.id,
            title: notice.title,
            subtitle: `from ${notice.adminEmail}`,
            isPublished: notice.isPublished,
            adminEmail: notice.adminEmail,
          })) || []
        }
        currentPage={pageNos}
        rowPerPage={rowNos}
        totalCount={allNoticeData?.totalCount ?? 0}
      />
      <ViewNoticeDialog id={selectedNoticeId} setOpen={setSelectedNoticeId} />
    </DashboardMainContent>
  );
}
