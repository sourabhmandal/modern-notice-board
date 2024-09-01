"use client";
import { Box, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "../navigation/Breadcrumb";

interface DashboardMainContentProps {
  children: React.ReactNode;
}
export function DashboardMainContent({ children }: DashboardMainContentProps) {
  const pathname = usePathname();

  return (
    <Box>
      <Breadcrumb path={pathname} />
      <Box component="main" sx={{ flexGrow: 1, my: { xs: 10, md: 2 }, mx: 2 }}>
        <Typography variant="h5" mb={2}>
          Notices
        </Typography>
        {children}
      </Box>
    </Box>
  );
}
