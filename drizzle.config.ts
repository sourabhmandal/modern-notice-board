import { env } from "@/server/env";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/server/model/index.ts",
  dialect: "postgresql",
  migrations: {
    prefix: "index",
  },
  dbCredentials: {
    url: env.PG_DATABASE_URL,
  },
});
