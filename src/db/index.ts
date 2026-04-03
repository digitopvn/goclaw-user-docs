/**
 * Database connection using Drizzle ORM + postgres.js
 * Single pooled connection shared across all server actions
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL environment variable is required");
}

// Connection pool — sized for 20-200 concurrent users
const client = postgres(connectionString, {
	max: 20,
	idle_timeout: 30,
});

export const db = drizzle(client, { schema });
