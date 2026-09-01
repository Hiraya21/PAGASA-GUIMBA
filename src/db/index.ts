import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.ts";
import * as dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const host = process.env.SQL_HOST;
const database = process.env.SQL_DB_NAME;
const user = process.env.SQL_USER;
const password = process.env.SQL_PASSWORD;

if (!host || !database || !user || !password) {
  console.warn("Database connection parameters incomplete, checking environment...");
}

const pool = new Pool({
  host: host || "127.0.0.1",
  database: database || "postgres",
  user: user || "postgres",
  password: password || "",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: false,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err);
});

export const db = drizzle(pool, { schema });
export { pool };
