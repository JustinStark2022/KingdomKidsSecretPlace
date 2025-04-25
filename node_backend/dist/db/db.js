// src/db/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
// pg v8+ ships as a default export under ESM
import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
export const db = drizzle(pool, {
// you can optionally pass { schema } if you have multiple schemas
});
