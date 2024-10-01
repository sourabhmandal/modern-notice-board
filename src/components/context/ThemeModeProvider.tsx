"use client";
import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from "@mui/material";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeModeContext = createContext({
  mode: "dark",
  toggleMode: function () {},
});

export const useThemeMode = () => useContext(ThemeModeContext);

interface IThemeModeProvider {
  children: React.ReactNode;
}
export const ThemeModeProvider = ({ children }: IThemeModeProvider) => {
  const [mode, setMode] = useState<PaletteMode>("light");

  // Memoize the theme based on the current mode
  const theme = useMemo(() => {
    console.log("changing theme");
    return createTheme({
      palette: {
        mode,
        primary: {
          main: mode === "light" ? "#1976d2" : "#90caf9",
        },
        secondary: {
          main: mode === "light" ? "#f50057" : "#f48fb1",
        },
      },
    });
  }, [mode]);

  useEffect(() => {
    console.log("theme at context", theme.palette.mode);
  }, [theme]);

  // Toggle between light and dark mode
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CssVarsProvider>{children}</CssVarsProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
