/**
 * Doc page — VitePress-style layout with navbar, sidebar, content, and pager
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
			{/* Top navbar */}
			<DocNavbar locale={params.locale} onToggleSidebar={() => setSidebarOpen(!sidebarOpen())} />

			<div class="flex">
				{/* Sidebar — desktop */}
				<aside class="border-border hidden w-64 shrink-0 overflow-y-auto border-r lg:block" style="height: calc(100vh - 3.5rem); position: sticky; top: 3.5rem;">
					<div class="p-4">
						<Suspense fallback={<div class="text-muted-foreground text-sm p-2">Loading...</div>}>
							<Show when={sidebar()}>
								{(sections) => <DocSidebar sections={sections()} locale={params.locale} />}
							</Show>
						</Suspense>
					</div>
				</aside>

				{/* Sidebar — mobile overlay */}
				<Show when={sidebarOpen()}>
					<div class="bg-background/80 fixed inset-0 z-30 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)}>
						<aside
							class="bg-background border-border h-full w-72 overflow-y-auto border-r p-4"
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

				{/* Main content */}
				<main class="min-w-0 flex-1 px-6 py-8 lg:px-12 lg:py-10" style="max-width: 48rem; margin: 0 auto;">
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

						{/* Previous / Next navigation */}
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
