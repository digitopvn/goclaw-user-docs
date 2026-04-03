/**
 * Root layout — initializes session + theme
 */
import { getSessionAction } from "@/actions/auth";
import { AppLoading } from "@/components/context/AppLoading";
import MetaSection from "@/layout/DefaultLayout/MetaSection";
import { setAuthSession, setUser, setTheme } from "@/store/appActions";
import { appState } from "@/store/appStore";
import type { RouteSectionProps } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { createResource, createEffect, onMount } from "solid-js";
import { isServer } from "solid-js/web";

const MainProvider = clientOnly(() => import("@/components/context/MainProvider"), { lazy: true });

/** Apply dark class to <html> */
function applyTheme(theme: string) {
	if (isServer) return;
	if (theme === "dark") {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}
	localStorage.setItem("theme", theme);
}

export default function RootLayout(props: RouteSectionProps) {
	const [data] = createResource(() => getSessionAction(), { deferStream: true });

	// Initialize theme from localStorage on client
	onMount(() => {
		const saved = localStorage.getItem("theme");
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const initial = saved || (prefersDark ? "dark" : "light");
		setTheme(initial as "light" | "dark");
	});

	// Apply theme whenever it changes
	createEffect(() => {
		if (appState.theme) applyTheme(appState.theme);
	});

	// Initialize session
	createEffect(() => {
		if (typeof data() === "undefined") return;

		const session = data();
		if (session) {
			setAuthSession({ sessionId: session.sessionId, status: "loaded" });
			setUser(session.user);
		} else {
			setAuthSession({ sessionId: "", status: "unauthorized" });
		}
	});

	return (
		<>
			<MetaSection />
			<AppLoading />
			<MainProvider />
			{props.children}
		</>
	);
}
