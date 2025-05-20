"use client";
import { startLoginWithTpp } from "@/app/actions/query/auth";
import { providerMap } from "@/components/auth/providers.list";
import {
  ADMIN_DASHBOARD,
  DASHBOARD,
} from "@/components/constants/frontend-routes";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LoginForm() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.data?.user) {
      if (session.data.user.role === "STUDENT") {
        return router.replace(DASHBOARD);
      } else if (session.data.user.role === "ADMIN") {
        router.replace(ADMIN_DASHBOARD);
      }
    }
  }, [session]);

  function getIdpColor(provider: string) {
    switch (provider) {
      case "google":
        return "error";
      case "facebook":
        return "info";
      case "github":
        return "secondary";
      case "azure-ad":
        return "primary";
      default:
        return "secondary";
    }
  }

  function getIdpIcon(provider: string) {
    switch (provider) {
      case "google":
        return <GoogleIcon />;
      case "facebook":
        return <FacebookIcon />;
      case "github":
        return <GitHubIcon />;
      case "azure-ad":
        return <MicrosoftIcon />;
      default:
        return <GitHubIcon />;
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Paper elevation={3} sx={{ paddingX: 4, paddingY: 6 }}>
        <Stack
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={2}
          width={500}
        >
          <Box>
            <Typography variant="h4">Authenticate</Typography>
            <Typography variant="h6" textAlign="center">
              Login yourself
            </Typography>
          </Box>
          {providerMap.map((provider, idx) => (
            <Button
              variant="outlined"
              fullWidth
              startIcon={getIdpIcon(provider.id)}
              color={getIdpColor(provider.id)}
              size="large"
              onClick={async () => {
                await startLoginWithTpp(provider.id);
              }}
            >
              {provider.id.replace("-", " ")}
            </Button>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
