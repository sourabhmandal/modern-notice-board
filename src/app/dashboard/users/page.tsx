"use client";
import { DashboardMainContent } from "@/components";
import { Typography, useTheme } from "@mui/material";
import { useState } from "react";
export default function DashboardPage() {
  const [open, setOpen] = useState(-1);
  const theme = useTheme();

  return (
    <DashboardMainContent>
      <Typography variant="h5" mb={2}>
        USERS
      </Typography>
    </DashboardMainContent>
  );
}
