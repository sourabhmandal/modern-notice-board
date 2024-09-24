"use client";
import { AllUserListTable, DashboardMainContent } from "@/components";
import { Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
export default function DashboardPage() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter") ?? "NONE";
  const search = searchParams.get("search") ?? "";
  const pageNos = ~~parseInt(searchParams.get("page") ?? "1");

  const rowNos = 5;
  return (
    <DashboardMainContent
      heading={
        <Typography variant="h5" mb={2}>
          Users List
        </Typography>
      }
    >
      <AllUserListTable
        currentPage={pageNos}
        rowPerPage={rowNos}
        filter={filter}
        search={search}
      />
    </DashboardMainContent>
  );
}
