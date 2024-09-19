"use client";
import { Box, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "../navigation/Breadcrumb";

interface DashboardMainContentProps {
  heading: string;
  children: React.ReactNode;
}
export function DashboardMainContent({
  heading,
  children,
}: DashboardMainContentProps) {
  const pathname = usePathname();

  return (
    <Box>
      <Breadcrumb path={pathname} />
      <Box component="main" sx={{ flexGrow: 1, my: { xs: 10, md: 2 }, mx: 2 }}>
        <Typography variant="h5" mb={2}>
          {heading}
        </Typography>
        {children}
      </Box>
    </Box>
  );
}
