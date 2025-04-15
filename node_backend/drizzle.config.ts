// node_backend/drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.PGHOST || !process.env.PGUSER || !process.env.PGPASSWORD || !process.env.PGDATABASE) {
  throw new Error("❌ One or more required PG environment variables are missing.");
}

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: "require",
  },
});
