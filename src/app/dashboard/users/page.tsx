"use client";
import { DashboardMainContent } from "@/components";
import { Typography } from "@mui/material";
export default function DashboardPage() {
  return (
    <DashboardMainContent heading={"Users List"}>
      <Typography variant="h5" mb={2}>
        USERS
      </Typography>
    </DashboardMainContent>
  );
}
