// drizzle.config.ts
import 'dotenv/config';

const config = {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  driver: "pg", // <-- Corrected: drizzle-kit expects 'driver', NOT 'dialect'
  dbCredentials: {
    url: process.env.DATABASE_URL || "", // <-- Fixed typing issue safely
  },
};

export default config;
