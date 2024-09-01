"use client";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";
import DriveFileRenameOutlineTwoToneIcon from "@mui/icons-material/DriveFileRenameOutlineTwoTone";
import {
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import React from "react";

export interface IListTableItem {
  title: string;
  subtitle: string;
  profileImage?: string;
}
export interface IListTable {
  items: Array<IListTableItem>;
  currentPage: number;
  rowPerPage: number;
  totalCount: number;
  onClickAction: (num: number) => void;
}

export function ListTable({ items, onClickAction }: IListTable) {
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const rowPerPageState = 10;

  return (
    <Box>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          flexGrow: 1,
          border: 1,
          borderColor: "divider",
        }}
        dense
      >
        {items.slice(0, rowPerPageState).map((item, index) => (
          <React.Fragment key={`list-item-${index}`}>
            <ListItem
              sx={{ padding: 0 }}
              secondaryAction={
                <Box
                  gap={2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconButton edge="end" color="warning" aria-label="delete">
                    <DriveFileRenameOutlineTwoToneIcon />
                  </IconButton>
                  <IconButton edge="end" color="error" aria-label="delete">
                    <DeleteOutlineTwoToneIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemButton
                alignItems="flex-start"
                onClick={() => onClickAction(index)}
              >
                {item.profileImage && (
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={item.profileImage} />
                  </ListItemAvatar>
                )}
                <ListItemText
                  primary={
                    <Typography color="text.primary">{item.title}</Typography>
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {item.subtitle}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
            {index == rowPerPageState - 1 ? <></> : <Divider />}
          </React.Fragment>
        ))}
      </List>
      <Divider />
      <Box
        display="flex"
        justifyContent="center"
        flexGrow={1}
        sx={{
          border: 1,
          borderColor: "divider",
          borderTop: 0,
          p: { xs: 2, md: 3 },
        }}
      >
        <Pagination
          size={isSmall ? "small" : "medium"}
          count={10}
          variant="outlined"
          shape="rounded"
          onChange={(event: React.ChangeEvent<unknown>, page: number) => {
            event.preventDefault();
            router.push(`?page=${page}&rows=${rowPerPageState}`);
          }}
        />
      </Box>
    </Box>
  );
}
