import Footer from '@/layout/DefaultLayout/Footer';
import Header from '@/layout/DefaultLayout/Header';
import { cn } from '@/lib/utils';
import { createEffect, ErrorBoundary, onCleanup, ParentComponent } from 'solid-js';

const DefaultLayout: ParentComponent = (props) => {
	// const isHideHeader = createMemo(() => !appState.layout.showHeader);

	return (
		<>
			<Header />

			<main class={cn('')}>
				<ErrorBoundary fallback={<></>}>{props.children}</ErrorBoundary>
			</main>

			<Footer />
		</>
	);
};

export default DefaultLayout;
