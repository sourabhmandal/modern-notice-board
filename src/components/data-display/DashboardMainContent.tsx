"use client";
import { Box } from "@mui/material";
import { usePathname } from "next/navigation";
import { Breadcrumb } from "../navigation/Breadcrumb";

interface DashboardMainContentProps {
  heading: React.ReactNode;
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
        {heading}
        {children}
      </Box>
    </Box>
  );
}
