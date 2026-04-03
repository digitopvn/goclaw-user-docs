/**
 * Global app store — simplified for docs CMS
 */
import type { UserResponse } from "@/actions/auth/type";
import { createGlobalStore } from "@/store/createStore";
import type { JSX } from "solid-js";

export type ThemeType = "light" | "dark" | "system";

export interface IAppLayout {
	title: string;
	showHeader: boolean;
	showFooter: boolean;
	bgCss: JSX.CSSProperties;
}

export interface ISession {
	status: "init" | "loaded" | "unauthorized";
	sessionId: string;
}

export interface AppState {
	layout: IAppLayout;
	session: ISession;
	user: UserResponse;
	theme: ThemeType | undefined;
	isLoading: boolean;
	loadingText: string | JSX.Element;
	error: string | null;
}

const initialState: AppState = {
	layout: {
		title: "",
		showHeader: true,
		showFooter: true,
		bgCss: {},
	},
	session: {
		status: "init",
		sessionId: "",
	},
	user: {
		id: 0,
		name: "",
		email: "",
		role: "",
		isActive: false,
		createdAt: null,
	},
	theme: undefined,
	isLoading: false,
	loadingText: "",
	error: null,
};

export const {
	state: appState,
	update: updateAppState,
	replace: replaceAppState,
	setState: setAppState,
} = createGlobalStore<AppState>(initialState);
