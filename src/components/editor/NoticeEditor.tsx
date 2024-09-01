"use client";
import { Button, Slide, useTheme } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  type RichTextEditorRef,
} from "mui-tiptap";
import { Dispatch, forwardRef, SetStateAction, Suspense, useRef } from "react";

interface NoticeEditorProps {
  open: number;
  setOpen: Dispatch<SetStateAction<number>>;
  noticeId?: string;
  mode?: "create" | "edit";
}

export function NoticeEditor({
  open,
  setOpen,
  mode = "create",
  noticeId,
}: NoticeEditorProps) {
  const rteRef = useRef<RichTextEditorRef>(null);
  const theme = useTheme();

  if (open >= 0)
    return (
      <Suspense fallback={<div>Loading editor...</div>}>
        <RichTextEditor
          ref={rteRef}
          extensions={[StarterKit]} // Or any Tiptap extensions you wish!
          content="<p>Hello world</p>" // Initial content for the editor
          // Optionally include `renderControls` for a menu-bar atop the editor:
          renderControls={() => (
            <MenuControlsContainer>
              <MenuSelectHeading />
              <MenuDivider />
              <MenuButtonBold />
              <MenuButtonItalic />
              {/* Add more controls of your choosing here */}
            </MenuControlsContainer>
          )}
        />

        <Button onClick={() => console.log(rteRef.current?.editor?.getJSON())}>
          Log JSON
        </Button>
      </Suspense>
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
