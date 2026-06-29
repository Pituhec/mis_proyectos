import { Pool } from "pg";

const globalForPg = globalThis as unknown as { pool: Pool };

export const pool =
  globalForPg.pool ??
  new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
  });

if (process.env.NODE_ENV !== "production") globalForPg.pool = pool;

export const query = <T = Record<string, unknown>>(text: string, params?: unknown[]) =>
  pool.query<T>(text, params);

export default pool;
