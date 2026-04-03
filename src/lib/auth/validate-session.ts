/**
 * Validate session against database
 * Returns user data if session is valid, null otherwise
 */
"use server";

import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import type { UserResponse } from "@/actions/auth/type";

export async function validateSession(
	sessionId: string,
): Promise<{ userId: number; user: UserResponse } | null> {
	if (!sessionId) return null;

	const result = await db
		.select({
			sessionId: sessions.id,
			userId: sessions.userId,
			expiresAt: sessions.expiresAt,
			userEmail: users.email,
			userName: users.name,
			userRole: users.role,
			userIsActive: users.isActive,
			userCreatedAt: users.createdAt,
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, new Date())))
		.limit(1);

	if (result.length === 0) return null;

	const row = result[0];
	if (!row.userIsActive) return null;

	return {
		userId: row.userId,
		user: {
			id: row.userId,
			email: row.userEmail,
			name: row.userName,
			role: row.userRole,
			isActive: row.userIsActive,
			createdAt: row.userCreatedAt,
		},
	};
}
