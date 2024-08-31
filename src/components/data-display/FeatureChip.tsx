"use client";
import { Chip, useTheme } from "@mui/material";

export interface IFeatureChip {
  title: string;
  index: number;
  selectedItemIndex: number;
  handleItemClick: (index: number) => void;
}
export function FeatureChip({
  title,
  index,
  selectedItemIndex,
  handleItemClick,
}: IFeatureChip) {
  const theme = useTheme();
  return (
    <Chip
      key={index}
      label={title}
      onClick={() => handleItemClick(index)}
      sx={{
        borderColor: `${theme.palette.mode === "light" ? "primary.light" : ""}`,
        background: `${theme.palette.mode === "light" ? "none" : ""}`,
        backgroundColor: selectedItemIndex === index ? "primary.main" : "",
        "& .MuiChip-label": {
          color: selectedItemIndex === index ? "#fff" : "",
        },
      }}
    />
  );
}
