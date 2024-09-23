"use client";
import { DashboardMainContent } from "@/components";
import { Typography } from "@mui/material";
export default function DashboardPage() {
  return (
    <DashboardMainContent
      heading={
        <Typography variant="h5" mb={2}>
          Users List
        </Typography>
      }
    >
      <Typography variant="h5" mb={2}>
        USERS
      </Typography>
    </DashboardMainContent>
  );
}
