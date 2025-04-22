// drizzle.config.ts
import 'dotenv/config';
import drizzleKit from 'drizzle-kit';



export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  driver: "pglite",
  dbCredentials: { url: process.env.DATABASE_URL! },
};
