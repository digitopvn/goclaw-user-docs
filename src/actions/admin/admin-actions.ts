/**
 * Admin server actions — user management only
 * All actions require admin role
 */
"use server";

import { db } from "@/db";
import { users, sessions } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/use-auth-session";
import { hashPassword } from "@/lib/auth/helpers/password";
import type { UserResponse } from "@/actions/auth/type";

/** Guard: throws if caller is not admin */
async function requireAdmin() {
	const session = await getAuthSession();
	if (!session?.role || session.role !== "admin") {
		throw new Error("Admin access required");
	}
	return session;
}

/** List all users */
export async function listUsersAction(): Promise<UserResponse[]> {
	await requireAdmin();
	return db
		.select({
			id: users.id,
			email: users.email,
			name: users.name,
			role: users.role,
			isActive: users.isActive,
			createdAt: users.createdAt,
		})
		.from(users)
		.orderBy(desc(users.createdAt));
}

/** Update user details */
export async function updateUserAction(
	userId: number,
	data: { name?: string; role?: string; isActive?: boolean },
): Promise<{ success: boolean; message?: string }> {
	await requireAdmin();
	await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, userId));
	return { success: true };
}

/** Reset user password */
export async function resetPasswordAction(
	userId: number,
	newPassword: string,
): Promise<{ success: boolean; message?: string }> {
	await requireAdmin();
	const hashed = await hashPassword(newPassword);
	await db.update(users).set({ password: hashed, updatedAt: new Date() }).where(eq(users.id, userId));
	return { success: true };
}

/** Get admin dashboard stats */
export async function getAdminStatsAction(): Promise<{
	userCount: number;
	activeSessionCount: number;
}> {
	await requireAdmin();
	const [userResult] = await db.select({ value: count() }).from(users);
	const [sessionResult] = await db.select({ value: count() }).from(sessions);
	return {
		userCount: userResult.value,
		activeSessionCount: sessionResult.value,
	};
}
