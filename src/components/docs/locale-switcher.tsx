/**
 * Locale switcher — toggles between EN and VI
 * Preserves current doc path when switching
 */
import { A, useLocation } from "@solidjs/router";
import { Component } from "solid-js";

interface LocaleSwitcherProps {
	currentLocale: string;
}

const LocaleSwitcher: Component<LocaleSwitcherProps> = (props) => {
	const location = useLocation();

	/** Switch locale in current path: /en/docs/... → /vi/docs/... */
	const switchedPath = (targetLocale: string) => {
		return location.pathname.replace(`/${props.currentLocale}/`, `/${targetLocale}/`);
	};

	return (
		<div class="flex items-center gap-1 rounded-md border p-0.5">
			<A
				href={switchedPath("en")}
				class={`rounded px-2 py-1 text-xs font-medium transition-colors ${
					props.currentLocale === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
				}`}
			>
				EN
			</A>
			<A
				href={switchedPath("vi")}
				class={`rounded px-2 py-1 text-xs font-medium transition-colors ${
					props.currentLocale === "vi" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
				}`}
			>
				VI
			</A>
		</div>
	);
};

export default LocaleSwitcher;
