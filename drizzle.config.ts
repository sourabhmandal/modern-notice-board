import { env } from "@/server/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/model/index.ts",
  dialect: "postgresql",
  migrations: {
    prefix: "index",
  },
  dbCredentials: {
    url: env.PG_ADMIN_DATABASE_URL,
  },
  out: "./drizzle",
});
