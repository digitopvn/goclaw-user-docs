import "@/index.css";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { MetaProvider } from "@solidjs/meta";
import { StyleRegistry } from "solid-styled";
import { ErrorBoundary, Suspense } from "solid-js";

export default function App() {
	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<StyleRegistry>
						<Suspense>
							<ErrorBoundary fallback={<></>}>{props.children}</ErrorBoundary>
						</Suspense>
					</StyleRegistry>
				</MetaProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
