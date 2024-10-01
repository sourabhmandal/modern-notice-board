import { type NextRequest, NextResponse } from "next/server";

import { OpenAPIV1 } from "@/app/api/v1/_open_api/_openapi";

function swaggerOpenApiHandler(req: NextRequest) {
  return NextResponse.json(OpenAPIV1, {
    status: 200,
  });
}

export { swaggerOpenApiHandler as GET };
