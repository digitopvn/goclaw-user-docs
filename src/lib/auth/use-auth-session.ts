/**
 * Session management via vinxi encrypted cookies
 * Simplified: stores {sessionId, userId, role, name} instead of JWT tokens
 */
import type { AuthSession } from "@/actions/auth/type";
import { query } from "@solidjs/router";
import { useSession } from "vinxi/http";

export const KEY_AUTH = "goclaw-docs-session";

export async function useAuthSession() {
	"use server";
	try {
		const session = await useSession<AuthSession>({
			password: process.env.JWT_SECRET as string,
			name: KEY_AUTH,
			maxAge: 60 * 60 * 24 * 30, // 30 days
			cookie: {
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
				httpOnly: true,
				path: "/",
			},
		});
		return session;
	} catch (error) {
		throw new Error(`Session error: ${error instanceof Error ? error.message : "Unknown error"}`);
	}
}

/** Get current session data from cookie */
export const getAuthSession = query(async () => {
	"use server";
	try {
		const session = await useAuthSession();
		return session?.data;
	} catch {
		return undefined;
	}
}, "getAuthSession");

/** Update session cookie with new data */
export async function updateAuthSession(data: Partial<AuthSession>) {
	"use server";
	try {
		const session = await useAuthSession();
		await session?.update?.(data);
	} catch (error) {
		if (error instanceof Error && error.message.includes("ERR_HTTP_HEADERS_SENT")) {
			console.warn("Cannot update session: headers already sent (SSR)");
			return;
		}
		throw error;
	}
}

/** Clear session cookie */
export async function clearAuthSession() {
	"use server";
	try {
		const session = await useAuthSession();
		await session?.clear();
	} catch (error) {
		console.error(`clearAuthSession failed: ${error instanceof Error ? error.message : "Unknown"}`);
	}
}
