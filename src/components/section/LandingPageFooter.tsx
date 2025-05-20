import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import FacebookIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/X";

const logoStyle = {
  width: "140px",
  height: "auto",
};

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {"Copyright © "}
      <Link href="https://aitpune.com" target="_blank">
        AIT Pune&nbsp;
      </Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

export function LandingPageFooter() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        py: { xs: 1, sm: 2 },
        width: "100%",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <div>
        <Copyright />
      </div>
      <Stack
        direction="row"
        justifyContent="left"
        spacing={1}
        useFlexGap
        sx={{
          color: "text.secondary",
        }}
      >
        <IconButton
          color="inherit"
          href="https://github.com/mui"
          aria-label="GitHub"
          sx={{ alignSelf: "center" }}
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          color="inherit"
          href="https://x.com/MaterialUI"
          aria-label="X"
          sx={{ alignSelf: "center" }}
        >
          <TwitterIcon />
        </IconButton>
        <IconButton
          color="inherit"
          href="https://www.linkedin.com/company/mui/"
          aria-label="LinkedIn"
          sx={{ alignSelf: "center" }}
        >
          <LinkedInIcon />
        </IconButton>
      </Stack>
    </Box>
  );
}
