"use server";
import { demoAppSchema } from "@/server/model"; // Adjust the import path as necessary
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { env } from "./env";

const sqlFunc = neon(
  env.PG_DATABASE_URL ??
    "postgresql://aitplacements:LbTsQW3AOJ4h@ep-cold-bonus-a1rbdpzf.ap-southeast-1.aws.neon.tech/aitplacement_local?sslmode=require"
);
let dbInst = drizzle(sqlFunc, { schema: demoAppSchema });

export const getDb = async () => {
  // this function singleton for database connection
  // check id dbInst is connected
  try {
    await dbInst.execute(sql`SELECT 1`);
  } catch (error) {
    // if not connected, reconnect
    dbInst = drizzle(sqlFunc, { schema: demoAppSchema });
  }
  return dbInst;
};
