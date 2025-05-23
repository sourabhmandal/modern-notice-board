import dotenv from "dotenv";
import { z } from "zod";

const envSchema = z.object({
  SVC_PORT: z.coerce.number().min(1000).default(9000),
  PG_DATABASE_URL: z
    .string()
    .url()
    .trim()
    .min(1)
    .refine(
      (str) => str.includes("postgresql://"),
      "please provide a valid url"
    ),
  PG_ADMIN_DATABASE_URL: z
    .string()
    .url()
    .trim()
    .min(1)
    .refine(
      (str) => str.includes("postgresql://"),
      "please provide a valid url"
    ),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DB_SCHEMA: z.string().default("incentives"),
  JWT_SECRET_KEY: z.string(),
  JWT_ALG: z
    .enum([
      "HS256",
      "HS348",
      "HS512",
      "RS256",
      "RS384",
      "RS512",
      "ES256",
      "ES348",
      "ES512",
      "PS256",
      "PS348",
      "PS512",
      "none",
    ])
    .default("HS256"),
  AUTH_GOOGLE_ID: z.string(),
  AUTH_GOOGLE_SECRET: z.string(),
  NEXT_PUBLIC_API_URL: z.string().url(),
  AIT_AWS_ACCESS_KEY: z.string(),
  AIT_AWS_BUCKET_ID: z.string(),
  AIT_AWS_REGION: z.string(),
  AIT_AWS_SECRET_ACCESS_KEY: z.string(),
});

dotenv.config();

export const env = envSchema.parse(process.env);
