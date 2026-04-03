/**
 * Database schema for GoClaw User Manual CMS
 * Tables: users, sessions (docs stored on filesystem)
 */
import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// ─── Users ─────────────────────���────────────────────────
export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	email: text("email").notNull().unique(),
	name: text("name").notNull(),
	password: text("password").notNull(), // scrypt hash format: "salt:hash"
	role: text("role").notNull().default("viewer"), // admin | editor | viewer
	isActive: boolean("is_active").notNull().default(true),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Sessions ─────────────────────���─────────────────────
export const sessions = pgTable("sessions", {
	id: text("id").primaryKey(), // UUID
	userId: integer("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});
