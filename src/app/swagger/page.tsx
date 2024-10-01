"use client";

import { useEffect } from "react";

import { useTheme } from "@mui/joy";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

import { OpenAPIV1 } from "@/app/api/v1/_open_api/_openapi";

export const OpenApiDocsPage = () => {
  const theme = useTheme();

  useEffect(() => {
    const body = document.body;

    if (theme.palette.mode === "dark") {
      body.classList.add("swagger-dark-theme");
    } else {
      body.classList.remove("swagger-dark-theme");
    }

    return () => {
      body.classList.remove("swagger-dark-theme");
    };
  }, [theme]);

  return <SwaggerUI spec={OpenAPIV1} displayOperationId={true} />;
};

export default OpenApiDocsPage;
