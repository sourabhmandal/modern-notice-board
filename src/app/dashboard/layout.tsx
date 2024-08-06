import { CustomAppBar } from "@/components";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import * as React from "react";

interface IDashboardPage {
  children: React.ReactNode;
}

export default function DashboardPage({ children }: IDashboardPage) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <CustomAppBar>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          Dashboard
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </CustomAppBar>
      {children}
    </Box>
  );
}
