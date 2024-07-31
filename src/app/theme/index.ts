"use client";

import { createTheme } from "@mui/material";
import { GeistSans } from "geist/font/sans";

export const theme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: GeistSans.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === "info" && {
            backgroundColor: "#60a5fa",
          }),
        }),
      },
    },
  },
});
