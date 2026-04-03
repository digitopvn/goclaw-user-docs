import Nav from '@/layout/DefaultLayout/Nav';
import { appState } from '@/store/appStore';
import { Component, ErrorBoundary, Show } from 'solid-js';

const Footer: Component<{}> = ({ ...props }) => {
	return (
		<Show when={appState.layout.showFooter}>
			<ErrorBoundary fallback={<></>}>
				<footer class="relative w-full"></footer>
			</ErrorBoundary>
		</Show>
	);
};

export default Footer;
