import { startLoginWithTpp } from "@/app/actions/query/auth";
import { providerMap } from "@/components/auth/providers.list";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";

export interface IAuthFormWrapper {
  headerLabel: string;
  backButtomLabel: string;
  backButtonLink: string;
  children: React.ReactNode;
  showSocial?: boolean;
}

export function AuthFormWrapper({
  headerLabel,
  backButtomLabel,
  backButtonLink,
  children,
  showSocial = false,
}: IAuthFormWrapper) {
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
          gap={4}
          width={500}
        >
          <Box>
            <Typography variant="h4">Authenticate</Typography>
            <Typography variant="h6" textAlign="center">
              {headerLabel}
            </Typography>
          </Box>
          {children}
          {showSocial && (
            <Grid container width="100%" spacing={2}>
              {providerMap.map((provider, idx) => (
                <Grid item xs={12} md={6} key={`${provider.id}-${idx}`}>
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
                </Grid>
              ))}
            </Grid>
          )}

          <Link href={backButtonLink}>{backButtomLabel}</Link>
        </Stack>
      </Paper>
    </Box>
  );
}
