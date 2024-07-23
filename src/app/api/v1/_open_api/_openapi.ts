import { generateOpenApi } from "@ts-rest/open-api";

import { ApiContractV1 } from "./_api_contract";

export const OpenAPIV1 = Object.assign(
  generateOpenApi(ApiContractV1, {
    info: {
      title: "The title of the API",
      version: "1.0.0",
      description: "The description of the API",
    },
  })
);
