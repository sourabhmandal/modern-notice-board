"use client";
import { DashboardMainContent, NoticeEditor } from "@/components";
import { Typography } from "@mui/material";
import { useState } from "react";
export default function DashboardPage() {
  const [open, setOpen] = useState(0);

  return (
    <DashboardMainContent>
      <Typography variant="h5" mb={2}>
        <NoticeEditor open={open} setOpen={setOpen} />
      </Typography>
    </DashboardMainContent>
  );
}
