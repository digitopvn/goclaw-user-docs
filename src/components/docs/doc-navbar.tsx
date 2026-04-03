/**
 * Top navbar — logo, locale switcher, theme toggle, user menu
 * Matches VitePress header layout
 */
import { Component } from "solid-js";
import LocaleSwitcher from "@/components/docs/locale-switcher";
import ToggleTheme from "@/components/ui/ToggleTheme";
import UserIcon from "@/components/ui/nav/UserIcon";
import { A } from "@solidjs/router";

interface DocNavbarProps {
	locale: string;
	onToggleSidebar?: () => void;
}

const DocNavbar: Component<DocNavbarProps> = (props) => {
	return (
		<header class="border-border bg-background/80 sticky top-0 z-40 flex h-14 items-center border-b px-4 backdrop-blur-sm">
			{/* Mobile sidebar toggle */}
			<button class="text-foreground mr-3 lg:hidden" onClick={props.onToggleSidebar}>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M3 12h18M3 6h18M3 18h18" />
				</svg>
			</button>

			{/* Logo */}
			<A href={`/${props.locale}/docs`} class="text-foreground flex items-center gap-2 font-bold">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
				</svg>
				GoClaw Docs
			</A>

			{/* Right side actions */}
			<div class="ml-auto flex items-center gap-3">
				<LocaleSwitcher currentLocale={props.locale} />
				<ToggleTheme />
				<UserIcon />
			</div>
		</header>
	);
};

export default DocNavbar;
