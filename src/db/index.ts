import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.ts";
import * as dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DB_URL ||
  process.env.POSTGRES_URL ||
  process.env.PG_CONNECTION_STRING;

let pool: pg.Pool;

if (connectionString) {
  const isLocalOrSocket =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1") ||
    connectionString.includes("sslmode=disable");
  const isRemoteSupabase =
    connectionString.includes("supabase.co") ||
    connectionString.includes("sslmode=require") ||
    connectionString.includes("neon.tech");

  pool = new Pool({
    connectionString,
    ssl: isLocalOrSocket ? false : isRemoteSupabase ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
} else {
  const host = process.env.SQL_HOST || process.env.DB_HOST;
  const database = process.env.SQL_DB_NAME || process.env.DB_NAME;
  const user = process.env.SQL_USER || process.env.DB_USER;
  const password = process.env.SQL_PASSWORD || process.env.DB_PASSWORD;
  const port = parseInt(process.env.SQL_PORT || process.env.DB_PORT || "5432", 10);

  // Cloud SQL unix socket or local loopback does not support/require SSL
  const isSocketOrLocal =
    !host ||
    host.startsWith("/") ||
    host.includes("cloudsql") ||
    host === "127.0.0.1" ||
    host === "localhost";

  const useSSL = !isSocketOrLocal && (process.env.PGSSLMODE === "require" || (Boolean(host) && host.includes("supabase")));

  if (!host || !database || !user || !password) {
    console.warn("Database connection parameters incomplete, fallback local pool initialized.");
  }

  pool = new Pool({
    host: host || "127.0.0.1",
    database: database || "postgres",
    user: user || "postgres",
    password: password || "",
    port,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
  });
}

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err);
});

export const db = drizzle(pool, { schema });
export { pool };
