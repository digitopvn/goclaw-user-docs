/**
 * Doc page — VitePress-style layout with fixed navbar, fixed sidebar, scrollable content
 */
import { createAsync, useParams } from "@solidjs/router";
import { Show, Suspense, createSignal } from "solid-js";
import { getDocumentAction } from "@/actions/docs/get-document-action";
import { getSidebarAction } from "@/actions/docs/get-sidebar-action";
import DocSidebar from "@/components/docs/doc-sidebar";
import DocContent from "@/components/docs/doc-content";
import DocNavbar from "@/components/docs/doc-navbar";
import DocPager from "@/components/docs/doc-pager";

export default function DocPage() {
	const params = useParams<{ locale: string; section: string; slug: string }>();
	const [sidebarOpen, setSidebarOpen] = createSignal(false);

	const doc = createAsync(() => getDocumentAction(params.locale, params.section, params.slug));
	const sidebar = createAsync(() => getSidebarAction(params.locale));

	return (
		<div class="bg-background min-h-screen">
			{/* Fixed top navbar */}
			<DocNavbar locale={params.locale} onToggleSidebar={() => setSidebarOpen(!sidebarOpen())} />

			{/* Fixed sidebar (desktop) + scrollable content */}
			<div class="pt-14 lg:pl-64">
				{/* Sidebar — fixed on desktop */}
				<aside class="border-border bg-background fixed top-14 left-0 hidden h-[calc(100vh-3.5rem)] w-64 overflow-y-auto border-r lg:block">
					<div class="p-4">
						<Suspense fallback={<div class="text-muted-foreground p-2 text-sm">Loading...</div>}>
							<Show when={sidebar()}>
								{(sections) => <DocSidebar sections={sections()} locale={params.locale} />}
							</Show>
						</Suspense>
					</div>
				</aside>

				{/* Sidebar — mobile overlay */}
				<Show when={sidebarOpen()}>
					<div class="fixed inset-0 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
						<div class="bg-black/50 absolute inset-0" />
						<aside
							class="bg-background border-border relative h-full w-72 overflow-y-auto border-r p-4"
							onClick={(e) => e.stopPropagation()}
						>
							<Suspense>
								<Show when={sidebar()}>
									{(sections) => <DocSidebar sections={sections()} locale={params.locale} />}
								</Show>
							</Suspense>
						</aside>
					</div>
				</Show>

				{/* Main content — scrollable */}
				<main class="mx-auto max-w-3xl px-6 py-8 lg:px-12 lg:py-10">
					<Suspense fallback={<div class="text-muted-foreground">Loading document...</div>}>
						<Show
							when={doc()}
							fallback={
								<div class="py-20 text-center">
									<h1 class="text-foreground mb-2 text-2xl font-bold">Document Not Found</h1>
									<p class="text-muted-foreground">
										/{params.locale}/docs/{params.section}/{params.slug} does not exist.
									</p>
								</div>
							}
						>
							{(d) => <DocContent title={d().title} htmlContent={d().htmlContent} />}
						</Show>

						<Show when={sidebar()}>
							{(sections) => (
								<DocPager
									sections={sections()}
									currentSection={params.section}
									currentSlug={params.slug}
									locale={params.locale}
								/>
							)}
						</Show>
					</Suspense>
				</main>
			</div>
		</div>
	);
}
