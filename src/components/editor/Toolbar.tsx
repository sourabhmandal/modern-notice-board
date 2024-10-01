"use client";

import BorderColorIcon from "@mui/icons-material/BorderColor";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import {
  Box,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { type Editor } from "@tiptap/core";
import { LinkBubbleMenu } from "./LinkBubbleMenu";

interface ToolbarProps {
  editor: Editor | null;
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  return (
    <Box
      display="flex"
      border={1}
      padding={1}
      borderColor={"#ccc"}
      sx={{
        border: "1px solid #ccc",
        borderBottom: "none",
        borderRadius: "4px 4px 0 0",
      }}
    >
      <LinkBubbleMenu editor={editor} />
      <ToggleButtonGroup aria-label="text formatting" size="small">
        <ToggleButton
          value="bold"
          aria-label="bold"
          selected={editor.isActive("bold")}
          onChange={(e, val) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
        >
          <FormatBoldIcon />
        </ToggleButton>
        <ToggleButton
          value="italic"
          aria-label="italic"
          selected={editor.isActive("italic")}
          onChange={(e, val) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
        >
          <FormatItalicIcon />
        </ToggleButton>
        <ToggleButton
          value="underlined"
          aria-label="underlined"
          selected={editor.isActive("underlined")}
          onChange={(e, val) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
        >
          <FormatUnderlinedIcon />
        </ToggleButton>
        <ToggleButton
          value="highlight"
          aria-label="highlight"
          selected={editor.isActive("highlight")}
          onChange={(e, val) => {
            e.preventDefault();
            editor.chain().focus().toggleHighlight().run();
          }}
        >
          <BorderColorIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider sx={{ mx: 2, my: 1 }} orientation="vertical" flexItem />

      <ToggleButtonGroup aria-label="Headings formatting" size="small">
        <ToggleButton
          value="heading1"
          aria-label="heading1"
          selected={editor.isActive("heading", { level: 1 })}
          onChange={(e, val) => {
            e.preventDefault();
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run();
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            H1
          </Typography>
        </ToggleButton>
        <ToggleButton
          value="heading2"
          aria-label="heading2"
          selected={editor.isActive("heading", { level: 2 })}
          onChange={(e, val) => {
            e.preventDefault();
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run();
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            H2
          </Typography>
        </ToggleButton>
        <ToggleButton
          value="heading3"
          aria-label="heading3"
          selected={editor.isActive("heading", { level: 3 })}
          onChange={(e, val) => {
            e.preventDefault();
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 3,
              })
              .run();
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            H3
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>

      <Divider sx={{ mx: 2, my: 1 }} orientation="vertical" flexItem />

      <ToggleButtonGroup aria-label="Headings formatting" size="small">
        <ToggleButton
          value="bulletList"
          aria-label="bulletList"
          selected={editor.isActive("bulletList")}
          onChange={(e, val) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run();
          }}
        >
          <FormatListBulletedIcon />
        </ToggleButton>
        <ToggleButton
          value="orderedList"
          aria-label="orderedList"
          selected={editor.isActive("orderedList")}
          onChange={(e, val) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run();
          }}
        >
          <FormatListBulletedIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
