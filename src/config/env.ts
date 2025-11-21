import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("4000"),
  DATABASE_URL: z.string().startsWith("postgresql://"),
  ACCESS_TOKEN_SECRET: z.string().min(10),
  REFRESH_TOKEN_SECRET: z.string().min(10),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
});

export const ENV = envSchema.parse(process.env);

export const ALLOWED_ORIGINS = ENV.CORS_ORIGINS.split(",") || [];
