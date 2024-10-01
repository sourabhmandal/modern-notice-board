"use client";

import { PaletteMode, ThemeOptions } from "@mui/material";
import { red } from "@mui/material/colors";
import { GeistSans } from "geist/font/sans";

declare module "@mui/material/styles/createPalette" {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  interface PaletteColor extends ColorRange {}
}

export const brand = {
  50: "#A0F7FF",
  100: "#AEE5FD",
  200: "#ACCCFC",
  300: "#A5A6F6",
  400: "#AA66C2",
  500: "#A959AA",
  600: "#A64079",
  700: "#A33363",
  800: "#A2294F",
  900: "#A21F3B",
};

export const secondary = {
  50: "#F9F0FF",
  100: "#E9CEFD",
  200: "#D49CFC",
  300: "#B355F6",
  400: "#750AC2",
  500: "#6709AA",
  600: "#490679",
  700: "#3B0363",
  800: "#2F024F",
  900: "#23023B",
};

export const gray = {
  50: "#FBFCFE",
  100: "#EAF0F5",
  200: "#D6E2EB",
  300: "#BFCCD9",
  400: "#94A6B8",
  500: "#5B6B7C",
  600: "#4C5967",
  700: "#364049",
  800: "#131B20",
  900: "#090E10",
};

export const green = {
  50: "#F6FEF6",
  100: "#E3FBE3",
  200: "#C7F7C7",
  300: "#A1E8A1",
  400: "#51BC51",
  500: "#1F7A1F",
  600: "#136C13",
  700: "#0A470A",
  800: "#042F04",
  900: "#021D02",
};

export const getCustomTheme = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    primary: {
      light: brand[200],
      main: brand[500],
      dark: brand[800],
      contrastText: brand[50],
      ...(mode === "dark" && {
        contrastText: brand[100],
        light: brand[300],
        main: brand[400],
        dark: brand[800],
      }),
    },
    secondary: {
      light: secondary[300],
      main: secondary[500],
      dark: secondary[800],
      ...(mode === "dark" && {
        light: secondary[400],
        main: secondary[500],
        dark: secondary[900],
      }),
    },
    warning: {
      main: "#F7B538",
      dark: "#F79F00",
      ...(mode === "dark" && { main: "#F7B538", dark: "#F79F00" }),
    },
    error: {
      light: red[50],
      main: red[500],
      dark: red[700],
      ...(mode === "dark" && {
        light: "#D32F2F",
        main: "#D32F2F",
        dark: "#B22A2A",
      }),
    },
    success: {
      light: green[300],
      main: green[400],
      dark: green[800],
      ...(mode === "dark" && {
        light: green[400],
        main: green[500],
        dark: green[700],
      }),
    },
    grey: {
      50: gray[50],
      100: gray[100],
      200: gray[200],
      300: gray[300],
      400: gray[400],
      500: gray[500],
      600: gray[600],
      700: gray[700],
      800: gray[800],
      900: gray[900],
    },
  },
  typography: {
    fontFamily: GeistSans.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }: any) => ({
          ...(ownerState.severity === "info" && {
            backgroundColor: brand[200],
          }),
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
});
