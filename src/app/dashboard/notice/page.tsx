"use client";
import { DashboardMainContent, NoticeEditorMui } from "@/components";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function DashboardPage() {
  const [uuid, setUuid] = useState(uuidv4());
  return (
    <DashboardMainContent
      heading={
        <Box display="flex" alignItems="center" mb={2} gap={1}>
          <Typography variant="h5">Create Notice</Typography>
        </Box>
      }
    >
      <NoticeEditorMui noticeId={uuid} mode={"create"} />
    </DashboardMainContent>
  );
}
