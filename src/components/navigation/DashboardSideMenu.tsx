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
  console.log(session.status);
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
        <Typography variant="h6">
          {session.data?.user.role ?? ""} Dashboard
        </Typography>
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
            {session.data?.user?.name
              ? session.data?.user?.name.length > 20
                ? `${session.data?.user?.name.substring(0, 20)}...`
                : session.data?.user?.name
              : "N.A"}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {session.data?.user?.email
              ? session.data?.user?.email.length > 20
                ? `${session.data?.user?.email
                    .split("@")[0]
                    .substring(0, 8)}...@${
                    session.data?.user?.email.split("@")[1]
                  }`
                : session.data?.user?.email
              : "N.A"}
          </Typography>
        </Box>
      </Stack>
      <Box sx={{ p: 2 }}>
        <SignOutButton fullWidth variant="contained" />
      </Box>
    </Drawer>
  );
}
