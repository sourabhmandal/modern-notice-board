"use client";
import { DashboardMainContent } from "@/components";
import { NoticeEditor } from "@/components/editor/NoticeEditor";
import { Typography, useTheme } from "@mui/material";
import { useState } from "react";
export default function DashboardPage() {
  const [open, setOpen] = useState(0);
  const theme = useTheme();

  return (
    <DashboardMainContent>
      <Typography variant="h5" mb={2}>
        <NoticeEditor open={open} setOpen={setOpen} />
      </Typography>
    </DashboardMainContent>
  );
}
