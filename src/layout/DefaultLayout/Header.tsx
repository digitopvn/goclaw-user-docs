import Nav from '@/layout/DefaultLayout/Nav';
import { appState } from '@/store/appStore';
import { Component, Show, createSignal, createEffect, onCleanup, ErrorBoundary } from 'solid-js';

const Header: Component<{}> = ({ ...props }) => {
	return (
		<>
			<Show when={!!appState.layout.showHeader}>
				<ErrorBoundary fallback={<></>}>
					<Nav />
				</ErrorBoundary>
			</Show>
		</>
	);
};

export default Header;
