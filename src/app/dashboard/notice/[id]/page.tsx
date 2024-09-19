"use client";
import { DashboardMainContent, NoticeEditorMui } from "@/components";
import { Typography } from "@mui/material";
import { useState } from "react";
export default function DashboardPage() {
  const [open, setOpen] = useState(0);

  return (
    <DashboardMainContent heading={"Create Notice"}>
      <Typography variant="h5" mb={2}>
        <NoticeEditorMui open={open} setOpen={setOpen} mode={"edit"} />
      </Typography>
    </DashboardMainContent>
  );
}
