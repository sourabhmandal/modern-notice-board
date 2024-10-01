import { Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

interface SafeHtmlProps {
  html: string;
}

export const SafeHtml = ({ html }: SafeHtmlProps) => {
  // Sanitize the HTML string
  const cleanHtml = DOMPurify.sanitize(html);

  // Parse the clean HTML into React components
  return (
    <Typography component="div" px={5} py={2} lineHeight={0.8}>
      {parse(cleanHtml)}
    </Typography>
  );
};
