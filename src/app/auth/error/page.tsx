"use client";
import { AUTH_LOGIN, DASHBOARD } from "@/components";
import { Box, Button, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation"; // Import the correct module
export default function AuthErrorPage() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const errorName = queryParams.get("error");
  const session = useSession();
  if (session.status == "authenticated") {
    router.push(DASHBOARD);
  }

  function getErrorMessage() {
    switch (errorName) {
      case "Configuration":
        return "Configuration error: please react out to developer support";
      case "AccessDenied":
        return "Access denied: please check your credentials or reach out to support";
      case "Verification":
        return "Verification error: please verify your email";
      case "CredentialsSignin":
        return "CredentialsSignin error: please check your credentials, or password not generated";
      case "Default":
        return "Default error: please reach out to support";
      default:
        return "Unknown error: please reach out to support";
    }
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={"100vh"}
    >
      <Box
        sx={{
          backgroundColor: "beige",
          borderRadius: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        p={{ xs: 2, sm: 6, lg: 8 }}
        gap={1}
      >
        <Typography color="red" variant="h6">
          {getErrorMessage()}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            router.push(AUTH_LOGIN);
          }}
        >
          Retry Login
        </Button>
      </Box>
    </Box>
  );
}
