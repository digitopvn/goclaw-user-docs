/**
 * Auth server actions — self-contained, Drizzle-backed
 * Direct DB queries, no external API
 */
"use server";

import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { checkCorrectPassword, hashPassword } from "@/lib/auth/helpers/password";
import { validateSession } from "@/lib/auth/validate-session";
import {
	getAuthSession,
	updateAuthSession,
	clearAuthSession,
} from "@/lib/auth/use-auth-session";
import type { AuthSession, LoginInput, UserResponse } from "./type";

/** Login with email/password — creates DB session + sets cookie */
export async function loginAction(input: LoginInput): Promise<AuthSession> {
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.email, input.email))
		.limit(1);

	if (!user || !user.isActive) {
		throw new Error("Invalid email or password");
	}

	const passwordValid = await checkCorrectPassword(user.password, input.password);
	if (!passwordValid) {
		throw new Error("Invalid email or password");
	}

	// Create session in DB (30-day expiry)
	const sessionId = uuid();
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

	await db.insert(sessions).values({
		id: sessionId,
		userId: user.id,
		expiresAt,
	});

	const session: AuthSession = {
		sessionId,
		userId: user.id,
		role: user.role,
		name: user.name,
	};

	// Set encrypted cookie
	await updateAuthSession(session);

	return session;
}

/** Logout — delete session from DB + clear cookie */
export async function logoutAction(): Promise<void> {
	const cookieData = await getAuthSession();
	if (cookieData?.sessionId) {
		await db.delete(sessions).where(eq(sessions.id, cookieData.sessionId));
	}
	await clearAuthSession();
}

/** Get current session — validate cookie against DB */
export async function getSessionAction(): Promise<(AuthSession & { user: UserResponse }) | null> {
	const cookieData = await getAuthSession();
	if (!cookieData?.sessionId) return null;

	const result = await validateSession(cookieData.sessionId);
	if (!result) {
		// Session expired or invalid — clear stale cookie
		await clearAuthSession();
		return null;
	}

	return {
		sessionId: cookieData.sessionId,
		userId: result.userId,
		role: result.user.role,
		name: result.user.name,
		user: result.user,
	};
}

/** Create user account (admin only) */
export async function createUserAction(
	input: { email: string; name: string; password: string; role?: string },
	callerRole?: string,
): Promise<UserResponse> {
	if (callerRole && callerRole !== "admin") {
		throw new Error("Only admin can create users");
	}

	const hashedPassword = await hashPassword(input.password);

	const [newUser] = await db
		.insert(users)
		.values({
			email: input.email,
			name: input.name,
			password: hashedPassword,
			role: input.role || "viewer",
		})
		.returning();

	return {
		id: newUser.id,
		email: newUser.email,
		name: newUser.name,
		role: newUser.role,
		isActive: newUser.isActive,
		createdAt: newUser.createdAt,
	};
}
