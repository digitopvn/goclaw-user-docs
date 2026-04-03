/**
 * Middleware — auth + theme for docs CMS
 * Simplified: checks session cookie directly, no JWT verification
 */
import { createMiddleware, type RequestMiddleware } from "@solidjs/start/middleware";
import { useSession } from "vinxi/http";
import { isPrivateRoute, isAuthRoute, DEFAULT_LOGIN_REDIRECT } from "@/config/routes.generated";
import type { AuthSession } from "@/actions/auth/type";

const CALLBACK_URL_KEY = "callbackUrl";
const KEY_AUTH = "goclaw-docs-session";
const KEY_THEME = "theme";

const shouldSkipMiddleware = (pathname: string): boolean => {
	return (
		pathname.startsWith("/api/") ||
		pathname.startsWith("/_server") ||
		pathname.startsWith("/_build/") ||
		pathname.startsWith("/assets/") ||
		pathname === "/favicon.ico" ||
		!!pathname.match(
			/\.(js|css|json|xml|txt|map|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot|otf|mp4|webm|mp3|wav|pdf)$/,
		)
	);
};

// Theme middleware
const themeMiddleware: RequestMiddleware = async (event) => {
	try {
		const url = new URL(event.request.url);
		if (shouldSkipMiddleware(url.pathname)) return;

		const themeSession = await useSession<{ theme: string }>({
			password: process.env.JWT_SECRET as string,
			name: KEY_THEME,
		});
		event.locals.theme = themeSession?.data?.theme || "light";
	} catch {
		event.locals.theme = "light";
	}
};

// Auth middleware — checks encrypted session cookie
const authMiddleware: RequestMiddleware = async (event) => {
	const url = new URL(event.request.url);
	const pathname = url.pathname;

	if (shouldSkipMiddleware(pathname)) return;

	try {
		const session = await useSession<AuthSession>({
			password: process.env.JWT_SECRET as string,
			name: KEY_AUTH,
		});
		const isAuthenticated = !!session?.data?.sessionId;

		event.locals.isLogin = isAuthenticated;
		event.locals.user = session?.data || null;

		if (isPrivateRoute(pathname) && !isAuthenticated) {
			const callbackUrl = encodeURIComponent(pathname + url.search);
			return Response.redirect(new URL(`/login?${CALLBACK_URL_KEY}=${callbackUrl}`, url.origin));
		}

		if (isAuthRoute(pathname) && isAuthenticated) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, url.origin));
		}
	} catch (error) {
		console.error("Auth middleware error:", error);
		if (isPrivateRoute(pathname)) {
			const callbackUrl = encodeURIComponent(pathname + url.search);
			return Response.redirect(new URL(`/login?${CALLBACK_URL_KEY}=${callbackUrl}`, url.origin));
		}
	}
};

export default createMiddleware({
	onRequest: [themeMiddleware, authMiddleware],
});
