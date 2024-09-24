"use client";
import { AllUserListTable, DashboardMainContent } from "@/components";
import { Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
export default function DashboardPage() {
  const searchParams = useSearchParams();
  const pendingPage = ~~parseInt(searchParams.get("pendingPage") ?? "1");
  const oldPageNos = ~~parseInt(searchParams.get("pendingPage") ?? "1");
  const pageNos = ~~parseInt(searchParams.get("page") ?? "1");

  const rowNos = 10;
  return (
    <DashboardMainContent
      heading={
        <Typography variant="h5" mb={2}>
          Users List
        </Typography>
      }
    >
      <AllUserListTable currentPage={pageNos} rowPerPage={rowNos} />
    </DashboardMainContent>
  );
}
