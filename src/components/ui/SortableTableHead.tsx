import { TableHead } from '@/components/ui/table';
import { useSearchParams } from '@solidjs/router';
import { Component, createEffect, Show } from 'solid-js';

// Helper component for sortable table headers
export const SortableTableHead: Component<{
	field: 'createdAt' | 'updatedAt' | 'viewCount';
	currentSortBy: 'createdAt' | 'updatedAt' | 'viewCount' | undefined;
	currentSortOrder: 'asc' | 'desc' | undefined;
	onSort: (field: 'createdAt' | 'updatedAt' | 'viewCount') => void;
	children: any;
}> = (props) => {
	const [searchParams, setSearchParams] = useSearchParams();

	return (
		<TableHead
			class="hover:bg-muted/50 cursor-pointer transition-colors select-none"
			onClick={() => props.onSort(props.field)}
		>
			<div class="flex items-center gap-1">
				{props.children}
				<Show
					when={props.currentSortBy && props.currentSortBy === props.field}
					fallback={
						<svg
							class="h-3 w-3 opacity-30"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="m21 16-4 4-4-4" />
							<path d="M17 20V4" />
							<path d="m3 8 4-4 4 4" />
							<path d="M7 4v16" />
						</svg>
					}
				>
					<Show
						when={props.currentSortOrder === 'asc'}
						fallback={
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								class="h-3 w-3"
							>
								<path d="M12 5v14" />
								<path d="m19 12-7 7-7-7" />
							</svg>
						}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="h-3 w-3"
						>
							<path d="m5 12 7-7 7 7" />
							<path d="M12 19V5" />
						</svg>
					</Show>
				</Show>
			</div>
		</TableHead>
	);
};
