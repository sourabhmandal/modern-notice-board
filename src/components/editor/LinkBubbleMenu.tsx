import { Box, Button, TextField } from "@mui/material";
import { BubbleMenu, type Editor } from "@tiptap/react";
import { useCallback, useState } from "react";

interface LinkBubbleMenuProps {
  editor: Editor | null;
}
export const LinkBubbleMenu = ({ editor }: LinkBubbleMenuProps) => {
  const [url, setUrl] = useState("");

  const handleInsertLink = useCallback(() => {
    if (url) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
    setUrl("");
  }, [editor, url]);

  const handleRemoveLink = useCallback(() => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setUrl("");
  }, [editor]);

  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{
        duration: 100,
        onShow(instance) {
          // Debug: Log the Tippy instance when it's shown
          console.log("Tippy Instance on Show:", instance);
        },
        onMount(instance) {
          // Debug: Log the Tippy instance when it's mounted
          console.log("Tippy Instance on Mount:", instance);
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "white",
          padding: "8px",
          borderRadius: "4px",
          boxShadow: "0 1px 5px rgba(0, 0, 0, 0.2)",
          position: "relative",
        }}
      >
        <TextField
          size="small"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          sx={{ marginRight: "8px", width: "400px" }}
        />
        <Button variant="contained" onClick={handleInsertLink}>
          Insert
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleRemoveLink}
          sx={{ marginLeft: "8px" }}
          disabled={!editor.isActive("link")}
        >
          Remove
        </Button>
      </Box>
    </BubbleMenu>
  );
};
