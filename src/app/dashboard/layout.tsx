import { AppNavbar, DashboardSideMenu } from "@/components";
import { Box } from "@mui/material";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "student portal dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "background.paper",
        minHeight: "100vh",
      }}
    >
      <DashboardSideMenu />
      <AppNavbar />

      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
}
