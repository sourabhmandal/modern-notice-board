"use client";
import { DashboardMainContent } from "@/components";
import { Typography, useTheme } from "@mui/material";
import { useState } from "react";
export default function DashboardPage() {
  const [open, setOpen] = useState(-1);
  const theme = useTheme();

  return (
    <DashboardMainContent heading={"Student Resources"}>
      <Typography variant="h5" mb={2}>
        RESOURCES
      </Typography>
    </DashboardMainContent>
  );
}
