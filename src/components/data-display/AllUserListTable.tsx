"use client";
import {
  GetAllUsersResponse,
  TGetAllUsersResponse,
  TUser,
} from "@/app/api/user/validate";
import { UserActionsDialog, useToast } from "@/components";
import {
  GET_ALL_USER_API,
  UPDATE_USER_STATUS_BY_ID_API,
} from "@/components/constants/backend-routes";
import {
  NotificationResponse,
  sendSwrPutRequest,
} from "@/components/utils/api.utils";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  alpha,
  Box,
  Button,
  Chip,
  ClickAwayListener,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Toolbar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import useSWR, { KeyedMutator } from "swr";
import useSWRMutation from "swr/mutation";

export interface IListTable {
  currentPage: number;
  rowPerPage: number;
  search: string;
  filter: string;
}

type IUserStatus = "ACTIVE" | "PENDING" | "REJECTED" | "OLD" | "NONE";
const filterOptions = ["ACTIVE", "PENDING", "REJECTED", "NONE"];

interface HeadCell {
  disablePadding: boolean;
  id: keyof TUser;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name",
    sortable: false,
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
    sortable: false,
  },
  {
    id: "emailVerifiedAt",
    numeric: false,
    disablePadding: false,
    label: "Onboarded On",
    sortable: true,
  },
  {
    id: "role",
    numeric: false,
    disablePadding: false,
    label: "Role",
    sortable: false,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    sortable: false,
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "normal"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  allUsers: Array<TUser>;
  selectedUserIds: string[];
  currentPage: number;
  search: string;
  filter: string;
  mutateAllUserList: KeyedMutator<any>;
  isLoading: boolean;
  optimisticUsers: TGetAllUsersResponse;
  setShouldDeleteUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function EnhancedTableToolbar({
  allUsers,
  selectedUserIds,
  currentPage,
  search,
  filter,
  mutateAllUserList,
  optimisticUsers,
  setShouldDeleteUserModalOpen,
}: EnhancedTableToolbarProps) {
  const toast = useToast();
  const router = useRouter();
  const filterAnchorRef = React.useRef<HTMLDivElement>(null);
  const [filterOpen, setFilterOpen] = React.useState(false);

  const firstSelectedUser = allUsers.find(
    (usr: TUser) => usr.id === selectedUserIds[0]
  );

  const updateUserStatusApi = useSWRMutation(
    UPDATE_USER_STATUS_BY_ID_API(firstSelectedUser?.id ?? ""),
    sendSwrPutRequest<{ status: string }>
  );

  const handleClose = (event: Event) => {
    if (
      filterAnchorRef.current &&
      filterAnchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setFilterOpen(false);
  };
  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    // ---------------------- //
    setFilterOpen(false);
    // Add filter logic here  //
    router.push(
      `?page=${currentPage}${
        search.trim().length > 0 ? `&search=${search}` : ""
      }&filter=${filterOptions[index]}`
    );
  };

  const handleUserStatusUpdate = async (status: "ACTIVE" | "REJECTED") => {
    updateUserStatusApi.trigger({
      status: status,
    });

    const newOptimisticUsers = optimisticUsers.users.map((user) => {
      if (user.id === selectedUserIds[0]) {
        user.status = status;
      }
      return user;
    });
    mutateAllUserList(newOptimisticUsers, {
      optimisticData: newOptimisticUsers,
      populateCache: true,
      revalidate: true,
    });
  };

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        selectedUserIds.length > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {selectedUserIds.length > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {selectedUserIds.length} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          User List
        </Typography>
      )}
      {selectedUserIds.length > 0 ? (
        <Tooltip title="Delete">
          <Box display="flex" gap={1}>
            <IconButton onClick={() => setShouldDeleteUserModalOpen(true)}>
              <DeleteIcon />
            </IconButton>
            {selectedUserIds.length == 1 &&
              firstSelectedUser?.status === "PENDING" && (
                <>
                  <Button
                    size="small"
                    sx={{ my: "auto" }}
                    variant="contained"
                    color="error"
                    onClick={() => handleUserStatusUpdate("REJECTED")}
                  >
                    REJECT
                  </Button>
                  <Button
                    size="small"
                    sx={{ my: "auto" }}
                    variant="contained"
                    color="success"
                    onClick={() => handleUserStatusUpdate("ACTIVE")}
                  >
                    APPROVE
                  </Button>
                </>
              )}

            {selectedUserIds.length == 1 &&
              firstSelectedUser?.status === "ACTIVE" && (
                <Button
                  size="small"
                  sx={{ my: "auto" }}
                  variant="contained"
                  color="error"
                  onClick={() => handleUserStatusUpdate("REJECTED")}
                >
                  REJECT
                </Button>
              )}

            {selectedUserIds.length == 1 &&
              firstSelectedUser?.status === "REJECTED" && (
                <Button
                  size="small"
                  sx={{ my: "auto" }}
                  variant="contained"
                  color="success"
                  onClick={() => handleUserStatusUpdate("ACTIVE")}
                >
                  APPROVE
                </Button>
              )}
          </Box>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <React.Fragment>
            {/* @ts-ignore */}
            <Button
              ref={filterAnchorRef}
              onClick={() => {
                setFilterOpen((prev) => !prev);
              }}
              startIcon={<FilterListIcon />}
            >
              {filter}
            </Button>
            <Popper
              sx={{ zIndex: 1 }}
              open={filterOpen}
              anchorEl={filterAnchorRef.current}
              role={undefined}
              transition
              disablePortal
              placement="bottom-end"
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="split-button-menu" autoFocusItem>
                        {filterOptions.map((option, index) => (
                          <MenuItem
                            key={option}
                            selected={index === filterOptions.indexOf(filter)}
                            onClick={(event) =>
                              handleMenuItemClick(event, index)
                            }
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </React.Fragment>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export function AllUserListTable({
  currentPage,
  rowPerPage,
  search,
  filter,
}: IListTable) {
  const router = useRouter();
  const theme = useTheme();
  const toast = useToast();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchInput, setSearchInput] = useState(search);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowPerPage);
  const [page, setPage] = React.useState(currentPage);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [emptyRows, setEmptyRows] = useState(0);
  const [shouldDeleteUserModalOpen, setShouldDeleteUserModalOpen] =
    useState(false);

  const {
    data: userListResponse,
    isLoading: isUserListLoading,
    mutate: mutateAllUserList,
  } = useSWR(GET_ALL_USER_API(currentPage, search, filter), {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 20000,
    onSuccess(data, key, config) {
      const parsedResponse = GetAllUsersResponse.safeParse(data);
      if (parsedResponse.success) {
        updateOptimisticUser({
          users: parsedResponse.data.users,
          totalCount: parsedResponse.data.totalCount,
        });
      } else if (parsedResponse.success === false && !isUserListLoading) {
        const parsedErrorResponse = NotificationResponse.safeParse(data);

        if (parsedErrorResponse.success) {
          updateOptimisticUser({
            users: [],
            totalCount: 0,
          });
          return toast.showToast(
            "No user found",
            parsedErrorResponse.data.message,
            parsedErrorResponse.data.status
          );
        } else
          return toast.showToast(
            "Failed to fetch all users",
            "server error occured",
            "error"
          );
      }
    },
    onError(error, key, config) {
      console.error("get all users error :: ", error);
      const parsedErrorResponse = NotificationResponse.safeParse(error);

      if (parsedErrorResponse.success) {
        return toast.showToast(
          "Failed to fetch all users",
          parsedErrorResponse.data.message,
          parsedErrorResponse.data.status
        );
      } else
        toast.showToast(
          "Failed to fetch all users",
          "server error occured",
          "error"
        );
    },
  });

  const [optimisticUsers, updateOptimisticUser] =
    useState<TGetAllUsersResponse>({
      users: [],
      totalCount: 0,
    });

  useEffect(() => {}, [userListResponse]);

  const handleUserOptimisticUpdate = async () => {
    const optimisticData = optimisticUsers.users.filter(
      (d) => !selected.includes(d.id)
    );
    await mutateAllUserList(
      updateOptimisticUser((prev) => ({ ...prev, users: [...optimisticData] })),
      {
        optimisticData: [...optimisticData],
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      }
    );
    setSelected([]);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = optimisticUsers.users.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(~~parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.findIndex((user) => user === id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  // Avoid a layout jump when reaching the last page with empty rows.

  useEffect(() => {
    const emptyRows =
      page > 0
        ? Math.max(0, page * rowsPerPage - optimisticUsers.users.length)
        : 0;
    setEmptyRows(emptyRows);
  }, [rowsPerPage, optimisticUsers.users.length]);

  return (
    <Box width={"100%"} border={1} borderRadius={2} borderColor="divider">
      <toast.ToastComponent />
      {shouldDeleteUserModalOpen && (
        <UserActionsDialog
          selectedUserIds={selected}
          setSelected={setSelected}
          currentPage={currentPage}
          userList={optimisticUsers.users ?? []}
          optimisticUsers={optimisticUsers}
          mutateAllUserList={mutateAllUserList}
          shouldDeleteUserModalOpen={shouldDeleteUserModalOpen}
          setShouldDeleteUserModalOpen={setShouldDeleteUserModalOpen}
        />
      )}

      <EnhancedTableToolbar
        selectedUserIds={selected}
        allUsers={optimisticUsers.users}
        currentPage={currentPage}
        search={searchInput}
        filter={filter}
        mutateAllUserList={mutateAllUserList}
        isLoading={isUserListLoading}
        optimisticUsers={optimisticUsers}
        setShouldDeleteUserModalOpen={setShouldDeleteUserModalOpen}
      />
      <TableContainer>
        <Table
          sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={"medium"}
        >
          <EnhancedTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={optimisticUsers.users.length}
          />
          <TableBody>
            {optimisticUsers.users.map((row, index) => {
              const isItemSelected = selected.includes(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    {row.name}
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.emailVerifiedAt?.toDateString()}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.status}
                      color={
                        row.status == "ACTIVE"
                          ? "success"
                          : row.status == "PENDING"
                          ? "warning"
                          : row.status == "REJECTED"
                          ? "error"
                          : "default"
                      }
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 57 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={optimisticUsers.totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}