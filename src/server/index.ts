"use server";
import { env } from "@/server/env"; // Adjust the import path as necessary
import { demoAppSchema } from "@/server/model"; // Adjust the import path as necessary
import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: PostgresJsDatabase<typeof demoAppSchema>;

export async function initializeDb() {
  if (db) return db;

  try {
    const queryClient = postgres(env.PG_DATABASE_URL, { max: 10 });
    console.log("Initializing New database connection...");

    db = drizzle(queryClient, {
      schema: demoAppSchema,
      logger: env.NODE_ENV === "production" ? false : true,
    });
  } catch (error) {
    console.error("Error initializing database:", error);
  }

  return db;
}
