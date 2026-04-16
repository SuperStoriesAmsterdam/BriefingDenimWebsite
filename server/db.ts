import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  min: 2,
  max: 5,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 5000,
});

// Remove broken connections from the pool instead of letting them linger
pool.on("error", (err) => {
  console.error("Pool connection error (removed from pool):", err.message);
});

export const db = drizzle(pool, { schema });
