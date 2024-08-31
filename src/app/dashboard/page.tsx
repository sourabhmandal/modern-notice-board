"use client";
import { ListTable } from "@/components";
import CloseIcon from "@mui/icons-material/Close";
import {
  alpha,
  AppBar,
  Box,
  Button,
  Dialog,
  Slide,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, useState } from "react";
export default function DashboardPage() {
  const [open, setOpen] = useState(-1);
  const theme = useTheme();

  const listItems = [
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
    {
      title: "Brunch this weekend?",
      subtitle: "Ali Connors",
    },
  ];

  return (
    <Box my={4}>
      <Typography variant="h5" mb={2}>
        Notices
      </Typography>
      <ListTable
        onClickAction={(num: number) => setOpen(num)}
        items={listItems}
        currentPage={1}
        rowPerPage={10}
        totalCount={listItems.length + 1}
      />
      {open >= 0 && (
        <Dialog
          fullScreen
          open={open !== -1}
          onClose={() => setOpen(-1)}
          TransitionComponent={Transition}
        >
          <AppBar
            sx={{
              position: "relative",
              boxShadow: "none",
              backgroundColor:
                theme.palette.mode == "light"
                  ? alpha(theme.palette.primary.light, 0.2)
                  : theme.palette.primary.dark,
            }}
          >
            <Toolbar
              sx={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  sx={{ ml: 2, flex: 1, lineHeight: 1 }}
                  color="text.primary"
                  variant="h5"
                >
                  {listItems[open].title}
                </Typography>
                <Typography
                  sx={{ ml: 2, flex: 1, lineHeight: 1 }}
                  color="text.secondary"
                  variant="subtitle1"
                >
                  {listItems[open].subtitle}
                </Typography>
              </Box>
              <Button
                color="error"
                size="large"
                variant="outlined"
                onClick={() => setOpen(-1)}
                aria-label="close"
                startIcon={<CloseIcon />}
              >
                Close
              </Button>
            </Toolbar>
          </AppBar>
          Test {open}
        </Dialog>
      )}
    </Box>
  );
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
