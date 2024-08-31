"use client";
import { DASHBOARD } from "@/components";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HomeIcon from "@mui/icons-material/Home";
import { Box, Link, Typography } from "@mui/material";
import NextLink from "next/link";
export function Breadcrumb() {
  // Parse the current path from the router
  const pathnames = window.location.pathname.split("/").filter((x) => x);

  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        borderBottom: 1,
        padding: 2,
        borderColor: "divider",
        height: 57,
        display: "flex",
        alignItems: "center",
      }}
    >
      <NextLink href={DASHBOARD} passHref>
        <Link
          underline="hover"
          color="text.info"
          sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
        </Link>
      </NextLink>
      <ArrowForwardIosIcon
        sx={{ mx: 0.5, color: "text.secondary" }}
        fontSize="inherit"
      />

      {/* Dynamically generate breadcrumbs from the path */}
      {pathnames.map((value, index) => {
        // Build the path to this point
        const href = "/" + pathnames.slice(0, index + 1).join("/");

        // Capitalize and replace hyphens with spaces for display
        const label = value
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());

        // Determine if the current link is the last in the list
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Typography key={href} color="text.secondary" variant="body1">
            {label}
          </Typography>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center">
            <NextLink key={href} href={href} passHref>
              <Link underline="hover" color="inherit">
                {label}
              </Link>
            </NextLink>
            <ArrowForwardIosIcon
              sx={{ mx: 0.5, color: "GrayText", fontSize: "small" }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
