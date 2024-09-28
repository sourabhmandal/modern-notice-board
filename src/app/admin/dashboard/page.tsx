"use client";
import { DashboardMainContent, NoticeListTable, useToast } from "@/components";
import { Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const pageNos = ~~parseInt(searchParams.get("page") ?? "1");
  const rowNos = 10;
  const session = useSession();

  return (
    <DashboardMainContent
      heading={
        <Typography variant="h5" mb={2}>
          Notices
        </Typography>
      }
    >
      <toast.ToastComponent />
      <NoticeListTable currentPage={pageNos} rowPerPage={rowNos} isAdmin />
    </DashboardMainContent>
  );
}
