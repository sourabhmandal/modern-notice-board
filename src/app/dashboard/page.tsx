"use client";
import { DashboardMainContent, NoticeListTable, useToast } from "@/components";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const toast = useToast();
  const searchParams = useSearchParams();
  const pageNos = ~~parseInt(searchParams.get("page") ?? "1");
  const rowNos = 10;

  return (
    <DashboardMainContent>
      <toast.ToastComponent />
      <NoticeListTable currentPage={pageNos} rowPerPage={rowNos} />
    </DashboardMainContent>
  );
}
