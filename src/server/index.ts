import { env } from "@/server/env"; // Adjust the import path as necessary
import { demoAppSchema } from "@/server/model"; // Adjust the import path as necessary
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(env.PG_DATABASE_URL);
const db = drizzle(sql, { schema: demoAppSchema });

export default db;
