"use client";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";

export function ToggleMode() {
  const { mode, setMode } = useColorScheme();

  return (
    <IconButton
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
    >
      {mode === "light" ? <LightModeIcon /> : <BedtimeIcon />}
    </IconButton>
  );
}
