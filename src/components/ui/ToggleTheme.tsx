/**
 * Theme toggle button — toggles dark/light mode
 * Theme initialization happens in root layout (root-route.tsx)
 */
import { appState } from "@/store/appStore";
import { setTheme } from "@/store/appActions";
import { Component } from "solid-js";

const ToggleTheme: Component = () => {
	const toggleTheme = () => {
		setTheme(appState.theme === "dark" ? "light" : "dark");
	};

	return (
		<button
			class="text-foreground hover:bg-muted flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
			onclick={toggleTheme}
			title="Toggle theme"
		>
			{appState.theme === "dark" ? (
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
				</svg>
			) : (
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<circle cx="12" cy="12" r="4" />
					<path d="M12 2v2" />
					<path d="M12 20v2" />
					<path d="m4.93 4.93 1.41 1.41" />
					<path d="m17.66 17.66 1.41 1.41" />
					<path d="M2 12h2" />
					<path d="M20 12h2" />
					<path d="m6.34 17.66-1.41 1.41" />
					<path d="m19.07 4.93-1.41 1.41" />
				</svg>
			)}
		</button>
	);
};

export default ToggleTheme;
