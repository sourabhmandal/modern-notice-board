"use client";
import {
  TDeleteUsersRequest,
  TGetAllUsersResponse,
  TUser,
} from "@/app/api/user/route";
import { DELETE_USERS_BY_ID_API } from "@/components/constants/backend-routes";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { SetStateAction } from "react";
import { KeyedMutator } from "swr";
import useSWRMutation from "swr/mutation";
import { useToast } from "../data-display/useToast";
import { NotificationResponse, sendSwrDeleteRequest } from "../utils/api.utils";
interface UserActionsDialogProps {
  selectedUserIds: string[];
  setSelected: React.Dispatch<SetStateAction<string[]>>;
  currentPage: number;
  userList: Array<TUser>;
  optimisticUsers: TGetAllUsersResponse;
  mutateAllUserList: KeyedMutator<any>;
  shouldDeleteUserModalOpen: boolean;
  setShouldDeleteUserModalOpen: React.Dispatch<SetStateAction<boolean>>;
}
export function UserActionsDialog({
  selectedUserIds,
  setSelected,
  currentPage,
  userList,
  optimisticUsers,
  mutateAllUserList,
  shouldDeleteUserModalOpen,
  setShouldDeleteUserModalOpen,
}: UserActionsDialogProps) {
  const toast = useToast();
  const theme = useTheme();

  const deleteUserApi = useSWRMutation(
    DELETE_USERS_BY_ID_API,
    sendSwrDeleteRequest<TDeleteUsersRequest>,
    {
      onSuccess: (data) => {
        const parsedResponse = NotificationResponse.safeParse(data);

        if (parsedResponse.success) {
          if (parsedResponse?.data?.status === "success") {
            // setOpen("");
            return toast.showToast(
              "Successfully to delete notice",
              parsedResponse.data.message,
              parsedResponse.data.status
            );
          }
        }
      },
      onError: (error) => {
        console.log("error in delete notice", error);

        const parsedErrorResponse = NotificationResponse.safeParse(error);

        if (parsedErrorResponse.success) {
          return toast.showToast(
            "Failed to fetch all users",
            parsedErrorResponse.data.message,
            parsedErrorResponse.data.status
          );
        } else
          return toast.showToast(
            "Failed to delete notices",
            "server error occured",
            "error"
          );
      },
    }
  );

  const handleDeleteUser = async () => {
    deleteUserApi.trigger({
      userIds: selectedUserIds,
    });
    const newOptimisticUsers = optimisticUsers.users.filter(
      (user) => !selectedUserIds.includes(user.id)
    );
    mutateAllUserList(newOptimisticUsers, {
      optimisticData: newOptimisticUsers,
      populateCache: true,
      revalidate: true,
    });
  };

  return (
    <Dialog
      open={shouldDeleteUserModalOpen}
      onClose={() => {
        setShouldDeleteUserModalOpen(false);
        setSelected([]);
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">
        Do you want to delete notice?
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="body1">
            You are deleting the following user
          </Typography>
          {selectedUserIds.map((id) => {
            const selectedUser = userList.find((user) => user.id === id);
            return (
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.error.main,
                    mt: 1,
                  }}
                >
                  Email: {selectedUser?.email}
                </Typography>
                <Typography variant="body1">
                  Role: {selectedUser?.role}
                </Typography>
                <Typography variant="body1">
                  Status: {selectedUser?.status}
                </Typography>
              </Box>
            );
          })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setShouldDeleteUserModalOpen(false);
            setSelected([]);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            console.log("<> OPTIMISTIC UPDATE IN DELETE BUTTON:: ");
            await handleDeleteUser();
            setSelected([]);
            setShouldDeleteUserModalOpen(false);
          }}
          color="error"
          startIcon={
            deleteUserApi.isMutating ? (
              <CircularProgress size={20} />
            ) : (
              <DeleteIcon />
            )
          }
          autoFocus
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
