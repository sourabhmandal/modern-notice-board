//@ts-ignore
import { initContract } from "@ts-rest/core";

import {
  ZAuthorizationHeadersSchema,
  ZSuccessfulGetPingResponseSchema,
  ZUnsuccessfulResponseSchema,
} from "./_schema";

const c = initContract();

export const ApiContractV1 = c.router(
  {
    ping: {
      method: "GET",
      path: "/api/ping",
      responses: {
        200: ZSuccessfulGetPingResponseSchema,
        404: ZUnsuccessfulResponseSchema,
      },
      summary: "Get service health",
    },
  },
  {
    baseHeaders: ZAuthorizationHeadersSchema,
  }
);
