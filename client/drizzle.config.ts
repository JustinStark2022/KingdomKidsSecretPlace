import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("❌ Missing DATABASE_URL in environment variables.");
}

export default defineConfig({
  schema: "./shared/schema.ts", // Path to your Drizzle schema
  out: "./migrations",          // Where migrations will be stored
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});