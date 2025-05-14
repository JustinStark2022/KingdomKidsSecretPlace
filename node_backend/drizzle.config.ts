// drizzle.config.ts
import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables from the renamed and relocated .env.node_backend file
dotenv.config({ path: "../.env.node_backend" });

// Validate database configuration
const dbConfigSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

try {
  dbConfigSchema.parse(process.env);
} catch (error) {
  console.error("Database configuration validation failed:", error);
  process.exit(1);
}

const config = {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  },
  verbose: process.env.NODE_ENV === "development",
  strict: true,
};

export default config;