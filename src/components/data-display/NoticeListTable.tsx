"use client";
import {
  GetAllNoticeResponse,
  TGetAllNoticeResponse,
} from "@/app/api/notice/route";
import { useToast, ViewNoticeDialog } from "@/components";
import { GET_ALL_NOTICE_API } from "@/components/constants/backend-routes";
import { DeleteNoticeDialog } from "@/components/popovers/DeleteNoticeDialog";
import { NotificationResponse } from "@/components/utils/api.utils";
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
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export interface IListTableItem {
  id: string;
  title: string;
  subtitle: string;
  isPublished: boolean;
  adminEmail?: string;
}
export interface IListTable {
  currentPage: number;
  rowPerPage: number;
}

export function NoticeListTable({ currentPage, rowPerPage }: IListTable) {
  const router = useRouter();
  const theme = useTheme();
  const toast = useToast();
  const [allNoticeData, setAllNoticeData] = useState<TGetAllNoticeResponse>();
  const [selectedViewNoticeId, setSelectedViewNoticeId] = useState("");
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [toDeleteNoticeId, setToDeleteNoticeId] = useState<string>("");

  const { data: AllNoticesResponse, isLoading: isAllNoticesLoading } = useSWR(
    GET_ALL_NOTICE_API(currentPage),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 20000,
    }
  );

  useEffect(() => {
    if (isAllNoticesLoading) return;

    const parsedErrorResponse =
      NotificationResponse.safeParse(AllNoticesResponse);

    if (parsedErrorResponse.success) {
      return toast.showToast(
        "Failed to fetch all notices",
        parsedErrorResponse.data.message,
        parsedErrorResponse.data.status
      );
    }
    const parsedResponse = GetAllNoticeResponse.safeParse(AllNoticesResponse);

    if (parsedResponse.success) {
      setAllNoticeData(parsedResponse.data);
      console.log(parsedResponse.data);
    } else if (parsedResponse.success === false && !isAllNoticesLoading) {
      toast.showToast(
        "Failed to fetch all notices",
        "server error occured",
        "error"
      );
    }
  }, [AllNoticesResponse]);

  return (
    <Box>
      {toDeleteNoticeId && (
        <DeleteNoticeDialog
          noticeId={toDeleteNoticeId}
          setOpen={setToDeleteNoticeId}
          currentPage={currentPage}
          noticeList={allNoticeData?.notices ?? []}
          setAllNoticeData={setAllNoticeData}
        />
      )}
      {selectedViewNoticeId && (
        <ViewNoticeDialog
          id={selectedViewNoticeId}
          setOpen={setSelectedViewNoticeId}
        />
      )}

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
        {allNoticeData?.notices.slice(0, rowPerPage).map((item, index) => (
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
                    onClick={() => setSelectedViewNoticeId(item.id)}
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
                onClick={() => setSelectedViewNoticeId(item.id)}
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
                      {`from ${item.adminEmail}`}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
            {index === rowPerPage - 1 ? null : <Divider />}
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
          count={Math.ceil((allNoticeData?.totalCount ?? 0) / rowPerPage)}
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
