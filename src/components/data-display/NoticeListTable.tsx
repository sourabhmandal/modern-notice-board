"use client";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";
import DriveFileRenameOutlineTwoToneIcon from "@mui/icons-material/DriveFileRenameOutlineTwoTone";
import {
  alpha,
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { DeleteNoticeDialog } from "../popovers/DeleteNoticeDialog";

export interface IListTableItem {
  id: string;
  title: string;
  subtitle: string;
  isPublished: boolean;
  adminEmail?: string;
}
export interface IListTable {
  items: Array<IListTableItem>;
  currentPage: number;
  rowPerPage: number;
  totalCount: number;
  onClickAction: (num: string) => void;
  onUpdateAction: (num: string) => void;
}

export function NoticeListTable({
  items,
  onClickAction,
  onUpdateAction,
  currentPage,
  rowPerPage,
  totalCount,
}: IListTable) {
  const router = useRouter();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [toDeleteNoticeId, setToDeleteNoticeId] = useState<string>("");

  return (
    <Box>
      <DeleteNoticeDialog
        noticeId={toDeleteNoticeId}
        setOpen={setToDeleteNoticeId}
        currentPage={currentPage}
        noticeList={items}
      />
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          flexGrow: 1,
          border: 1,
          minHeight: 700,
          borderColor: "divider",
        }}
        dense
      >
        {items.slice(0, rowPerPage).map((item, index) => (
          <React.Fragment key={`list-item-${item.id}`}>
            <ListItem
              sx={{ padding: 0 }}
              secondaryAction={
                <Box
                  gap={2}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <IconButton
                    edge="end"
                    color="warning"
                    aria-label="update"
                    onClick={() => onUpdateAction(item.id)}
                  >
                    <DriveFileRenameOutlineTwoToneIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    color="error"
                    aria-label="delete"
                    onClick={() => setToDeleteNoticeId(item.id)}
                  >
                    <DeleteOutlineTwoToneIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemButton
                alignItems="flex-start"
                onClick={() => onClickAction(item.id)}
              >
                <ListItemText
                  primary={
                    <Typography color="text.primary">{item.title}</Typography>
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: alpha(theme.palette.text.secondary, 0.4) }}
                    >
                      {item.subtitle}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
            {index == rowPerPage - 1 ? <></> : <Divider />}
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
          count={Math.ceil(totalCount / rowPerPage)}
          page={currentPage}
          variant="outlined"
          shape="rounded"
          onChange={(event: React.ChangeEvent<unknown>, page: number) => {
            event.preventDefault();
            router.push(`?page=${page}`);
          }}
        />
      </Box>
    </Box>
  );
}
