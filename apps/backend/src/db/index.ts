import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schemas from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const defaultDb = drizzle(pool, { schema: schemas });
export type DB = typeof defaultDb;
