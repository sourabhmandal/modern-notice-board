"use client";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSession } from "next-auth/react";
import { SignOutButton } from "../button/SignOutButton";
import MenuContent from "./MenuContent";

const drawerWidth = 240;

export function DashboardSideMenu() {
  const session = useSession();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        boxSizing: "border-box",
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 1.5,
        }}
      >
        <Typography variant="h6">Dashboard</Typography>
        {/* <ToggleMode border /> */}
      </Box>
      <Divider />
      <MenuContent />
      <Stack
        direction="row"
        sx={{
          px: 2,
          pt: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt="Riley Carter"
          src={session.data?.user?.image ?? ""}
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {session.data?.user?.name ?? "N.A"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {session.data?.user?.email ?? "N.A"}
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ p: 2 }}>
        <SignOutButton fullWidth variant="contained" />
      </Box>
    </Drawer>
  );
}
