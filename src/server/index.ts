// lib/db.ts
import { env } from "@/server/env"; // Adjust the import path as necessary
import { demoAppSchema } from "@/server/model"; // Adjust the import path as necessary
import { eq } from "drizzle-orm";
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: PostgresJsDatabase<typeof demoAppSchema>;

export async function initializeDb() {
  if (db) return db; // Return existing db if already initialized

  try {
    const queryClient = postgres(env.PG_DATABASE_URL, { max: 10 });

    db = drizzle(queryClient, {
      schema: demoAppSchema,
      logger: env.NODE_ENV === "production" ? false : true,
    });

    // Optional: Test the connection with a simple query
    const user = await db.query.users.findFirst({
      where: eq(demoAppSchema.users.id, 0),
    });

    console.log("Database initialized successfully: ", user?.name);
  } catch (error) {
    console.error("Error initializing database:", error);
  }

  return db;
}
