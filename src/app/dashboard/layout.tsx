import { AppNavbar, auth, AUTH_LOGIN, DashboardSideMenu } from "@/components";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { Box } from "@mui/material";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "student portal dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) {
    redirect(AUTH_LOGIN);
  }

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

      <Box sx={{ flexGrow: 1 }}>
        <Breadcrumb />

        <Box
          component="main"
          sx={{ flexGrow: 1, mt: { xs: 10, md: 2 }, mx: 2 }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
