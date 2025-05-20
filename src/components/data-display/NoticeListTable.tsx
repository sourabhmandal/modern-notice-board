"use client";
import { TGetNoticeResponse } from "@/app/api/notice/[id]/validate";
import { GetAllNoticeResponse } from "@/app/api/notice/validate";
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
export interface IListTable {
  currentPage: number;
  rowPerPage: number;
  isAdmin?: boolean;
}

export function NoticeListTable({
  currentPage,
  rowPerPage,
  isAdmin,
}: IListTable) {
  const router = useRouter();
  const theme = useTheme();
  const toast = useToast();
  const [selectedViewNoticeId, setSelectedViewNoticeId] = useState("");
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [toDeleteNoticeId, setToDeleteNoticeId] = useState<string>("");

  const {
    data: AllNoticesResponse,
    isLoading: isAllNoticesLoading,
    mutate: mutateAllNoticeList,
  } = useSWR(GET_ALL_NOTICE_API(currentPage), {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 20000,
    onError(error, key, config) {
      console.error("get all notice error :: ", error);
      toast.showToast(
        "Failed to fetch all notices",
        "server error occured",
        "error"
      );
    },
  });

  const [optimisticNotice, updateOptimisticNotice] = useState<
    Array<TGetNoticeResponse>
  >(AllNoticesResponse?.notices);

  useEffect(() => {
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
      updateOptimisticNotice(parsedResponse.data.notices);
    } else if (parsedResponse.success === false && !isAllNoticesLoading) {
      toast.showToast(
        "Failed to fetch all notices",
        "server error occured",
        "error"
      );
    }
  }, [AllNoticesResponse]);

  const handleNoticeOptimisticUpdate = async () => {
    const optimisticData = optimisticNotice?.filter(
      (d) => d.id !== toDeleteNoticeId
    );
    await mutateAllNoticeList(updateOptimisticNotice([...optimisticData]), {
      optimisticData: [...optimisticData],
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    });
    setToDeleteNoticeId("");
  };

  return (
    <Box>
      {toDeleteNoticeId && (
        <DeleteNoticeDialog
          noticeId={toDeleteNoticeId}
          setOpen={setToDeleteNoticeId}
          currentPage={currentPage}
          noticeList={optimisticNotice ?? []}
          updateNotices={handleNoticeOptimisticUpdate}
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
        {optimisticNotice &&
          optimisticNotice?.slice(0, rowPerPage).map((item, index) => (
            <React.Fragment key={`list-item-${item.id}`}>
              <ListItem
                sx={{ padding: 0 }}
                secondaryAction={
                  isAdmin && (
                    <React.Fragment>
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
                          onClick={() =>
                            router.push(`/dashboard/notice/${item.id}`)
                          }
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
                    </React.Fragment>
                  )
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
          count={Math.ceil((AllNoticesResponse?.totalCount ?? 0) / rowPerPage)}
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
