"use client";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Button onClick={() => router.back()}>Return Back</Button>
    </Box>
  );
}
