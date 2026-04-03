import LoaderMain from "@/components/ui/loader/LoaderMain";
import { appState } from "@/store/appStore";
import { ParentComponent, Show } from "solid-js";

export const AppLoading: ParentComponent = (props) => {
	// const stl = createMemo(() => {
	// 	if (appState.isLoading) {
	// 		return css`
	// 			@global {
	// 				body {
	// 					-webkit-overflow-scrolling: touch !important;
	// 				}
	// 			}
	// 		`;
	// 	} else return '';
	// });
	// stl();

	return (
		<>
			<Show when={appState.isLoading}>
				<div class="fixed top-0 left-0 z-[99999] flex h-full w-full flex-col items-center justify-center gap-[12px] bg-black/[.6]">
					<LoaderMain size={60} />

					<p class="text-center text-white">{appState.loadingText}</p>
				</div>
			</Show>

			{props.children}
		</>
	);
};
