"use client";
import { DashboardMainContent } from "@/components";
import { Typography, useTheme } from "@mui/material";
import { useState } from "react";
export default function DashboardPage() {
  const [open, setOpen] = useState(-1);
  const theme = useTheme();

  return (
    <DashboardMainContent
      heading={
        <Typography variant="h5" mb={2}>
          Student Resources
        </Typography>
      }
    >
      <Typography variant="h5" mb={2}>
        Coming Soon
      </Typography>
    </DashboardMainContent>
  );
}
