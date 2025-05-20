import { DASHBOARD, RESOURCES } from "@/components";
import {
  ADMIN_CREATE_NOTICE,
  ADMIN_DASHBOARD,
  ADMIN_RESOURCES,
  ADMIN_USERS_LIST,
} from "@/components/constants/frontend-routes";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX } from "react";
interface IMenuItem {
  text: string;
  icon: JSX.Element;
  href: string;
  color?: "primary" | "secondary" | "warning" | "error" | "info" | "success";
}
const adminMenuListItems: Array<IMenuItem> = [
  { text: "Home", icon: <HomeRoundedIcon />, href: ADMIN_DASHBOARD },
  { text: "Resources", icon: <AnalyticsRoundedIcon />, href: ADMIN_RESOURCES },
  { text: "Users List", icon: <PeopleRoundedIcon />, href: ADMIN_USERS_LIST },
  {
    text: "Create Notice",
    icon: <AssignmentRoundedIcon />,
    href: ADMIN_CREATE_NOTICE,
    color: "warning",
  },
];

const studentMenuListItems: Array<IMenuItem> = [
  { text: "Home", icon: <HomeRoundedIcon />, href: DASHBOARD },
  { text: "Resources", icon: <AnalyticsRoundedIcon />, href: RESOURCES },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, href: "/settings" },
  { text: "About", icon: <InfoRoundedIcon />, href: "/about" },
];

export default function MenuContent() {
  const pathname = usePathname();
  const session = useSession();

  const mainListItems =
    session.data?.user.role === "ADMIN"
      ? adminMenuListItems
      : studentMenuListItems;

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <Link
              href={item.href}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton
                color={item?.color ?? "inherit"}
                selected={item.href === pathname}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <Link
              href={item.href}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton
                selected={item.href === pathname}
                href={item.href}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
