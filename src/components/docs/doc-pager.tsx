/**
 * Previous/Next navigation at bottom of doc page
 * Matches VitePress pager component
 */
import { A } from "@solidjs/router";
import { Component, Show } from "solid-js";
import type { SidebarSection } from "@/actions/docs/get-sidebar-action";

interface DocPagerProps {
	sections: SidebarSection[];
	currentSection: string;
	currentSlug: string;
	locale: string;
}

interface PageLink {
	title: string;
	href: string;
}

const DocPager: Component<DocPagerProps> = (props) => {
	// Flatten all items into a single list for prev/next
	const allItems = () => {
		const items: PageLink[] = [];
		for (const section of props.sections) {
			for (const item of section.items) {
				items.push({
					title: item.title,
					href: `/${props.locale}/docs/${section.section}/${item.slug}`,
				});
			}
		}
		return items;
	};

	const currentIndex = () => {
		return allItems().findIndex(
			(item) => item.href === `/${props.locale}/docs/${props.currentSection}/${props.currentSlug}`,
		);
	};

	const prev = () => {
		const idx = currentIndex();
		return idx > 0 ? allItems()[idx - 1] : null;
	};

	const next = () => {
		const idx = currentIndex();
		const items = allItems();
		return idx < items.length - 1 ? items[idx + 1] : null;
	};

	return (
		<nav class="border-border mt-12 flex items-stretch justify-between border-t pt-6">
			<Show when={prev()} fallback={<div />}>
				{(p) => (
					<A
						href={p().href}
						class="group border-border hover:border-primary max-w-[48%] rounded-lg border p-3 transition-colors"
					>
						<span class="text-muted-foreground text-xs font-medium">Previous</span>
						<span class="text-primary mt-1 block text-sm font-medium group-hover:underline">{p().title}</span>
					</A>
				)}
			</Show>
			<Show when={next()} fallback={<div />}>
				{(n) => (
					<A
						href={n().href}
						class="group border-border hover:border-primary ml-auto max-w-[48%] rounded-lg border p-3 text-right transition-colors"
					>
						<span class="text-muted-foreground text-xs font-medium">Next</span>
						<span class="text-primary mt-1 block text-sm font-medium group-hover:underline">{n().title}</span>
					</A>
				)}
			</Show>
		</nav>
	);
};

export default DocPager;
