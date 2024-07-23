"use client";
import * as React from "react";
import { useColorScheme } from "@mui/joy/styles";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton } from "@mui/joy";

export function ToggleMode() {
  const { mode, setMode } = useColorScheme();

  return (
    <IconButton
      variant="soft"
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
    >
      {mode === "light" ? <LightModeIcon /> : <BedtimeIcon />}
    </IconButton>
  );
}
