/**
 * Docs sidebar navigation — sections with collapsible groups
 */
import { A, useLocation } from "@solidjs/router";
import { Component, For, Show, createSignal } from "solid-js";
import type { SidebarSection } from "@/actions/docs/get-sidebar-action";

interface DocSidebarProps {
	sections: SidebarSection[];
	locale: string;
}

const DocSidebar: Component<DocSidebarProps> = (props) => {
	const location = useLocation();

	const isActive = (section: string, slug: string) => {
		return location.pathname === `/${props.locale}/docs/${section}/${slug}`;
	};

	return (
		<nav class="space-y-4">
			<For each={props.sections}>
				{(section) => <SectionGroup section={section} locale={props.locale} isActive={isActive} />}
			</For>
		</nav>
	);
};

/** Collapsible section group */
const SectionGroup: Component<{
	section: SidebarSection;
	locale: string;
	isActive: (section: string, slug: string) => boolean;
}> = (props) => {
	// Admin and Reference sections collapsed by default
	const defaultOpen = !["admin", "reference"].includes(props.section.section);
	const [open, setOpen] = createSignal(defaultOpen);

	return (
		<div>
			<button
				class="text-foreground hover:text-primary flex w-full items-center justify-between px-3 py-2 text-sm font-semibold"
				onClick={() => setOpen(!open())}
			>
				<span>{props.section.label}</span>
				<svg
					class={`h-4 w-4 transition-transform ${open() ? "rotate-90" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 5 7 7-7 7" />
				</svg>
			</button>
			<Show when={open()}>
				<ul class="space-y-0.5 pl-3">
					<For each={props.section.items}>
						{(item) => (
							<li>
								<A
									href={`/${props.locale}/docs/${props.section.section}/${item.slug}`}
									class={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
										props.isActive(props.section.section, item.slug)
											? "bg-primary/10 text-primary font-medium"
											: "text-muted-foreground hover:text-foreground hover:bg-muted"
									}`}
								>
									{item.title}
								</A>
							</li>
						)}
					</For>
				</ul>
			</Show>
		</div>
	);
};

export default DocSidebar;
