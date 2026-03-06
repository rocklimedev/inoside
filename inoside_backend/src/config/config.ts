// src/config/config.ts
import dotenv from "dotenv";
dotenv.config();

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val || val.trim() === "") {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return val;
}

export const config = {
  env: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),

  db: {
    host: requireEnv("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 3306),
    username: requireEnv("DB_USER"),
    password: requireEnv("DB_PASS"),
    name: requireEnv("DB_NAME"),
  },
} as const;
