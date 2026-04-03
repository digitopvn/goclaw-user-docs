/**
 * Global store actions — simplified for docs CMS
 */
import type { UserResponse } from "@/actions/auth/type";
import { updateAppState, replaceAppState, type IAppLayout, type ISession, type ThemeType } from "@/store/appStore";
import type { JSX } from "solid-js";

export const setLayout = (data: Partial<IAppLayout>) => {
	updateAppState("layout", data);
};

export const setUser = (data: Partial<UserResponse>) => {
	updateAppState("user", data);
};

export const setAuthSession = (session: Partial<ISession>) => {
	session.status = "loaded";
	if (!session.sessionId) session.status = "unauthorized";
	updateAppState("session", session);
};

export const setLoading = (isLoading: boolean, text?: string | JSX.Element) => {
	updateAppState("isLoading", isLoading);
	updateAppState("loadingText", text ? text : "");
};

export const setError = (error: string | null) => {
	updateAppState("error", error);
};

export const setTheme = (theme: ThemeType) => {
	updateAppState("theme", theme);
};

export const resetApp = () => {
	replaceAppState({
		isLoading: false,
		error: null,
	});
};
