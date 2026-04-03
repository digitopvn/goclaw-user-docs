/**
 * Auth exports — self-contained credential auth
 */
import { clearAuthSession } from "@/lib/auth/use-auth-session";
import type { LoginInput } from "@/actions/auth/type";

export { CALLBACK_URL_KEY } from "@/lib/auth/data";

/** Credential login — validates and creates session */
export const checkCredential = async (data: LoginInput) => {
	"use server";
	try {
		const { loginAction } = await import("@/actions/auth");
		await loginAction(data);
		return { status: true, data: "ok" };
	} catch (error) {
		return { status: false, message: error instanceof Error ? error.message : "Unknown error" };
	}
};

/** Logout — clear DB session + cookie (server action) */
export const logoutServer = async () => {
	"use server";
	try {
		const { logoutAction } = await import("@/actions/auth");
		await logoutAction();
	} catch {
		await clearAuthSession();
	}
	return { status: true };
};

/** Logout — call server then redirect on client */
export const logout = async () => {
	await logoutServer();
	window.location.href = "/login";
};
