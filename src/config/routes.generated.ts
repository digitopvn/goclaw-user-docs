/**
 * Route configuration for GoClaw Docs CMS
 * Defines which routes require auth and which are public
 */

/** Routes requiring authentication — all doc and admin routes */
export const PRIVATE_ROUTES = ["/en", "/vi", "/admin", "/profile"] as const;

/** Routes only accessible when NOT authenticated */
export const AUTH_ROUTES = ["/login"] as const;

/** Default redirect after successful login */
export const DEFAULT_LOGIN_REDIRECT = "/en/docs";

/** Default redirect after logout */
export const DEFAULT_LOGOUT_REDIRECT = "/login";

/** Check if path requires authentication */
export function isPrivateRoute(pathname: string): boolean {
	return PRIVATE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/** Check if path is auth-only (login page) */
export function isAuthRoute(pathname: string): boolean {
	return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}
