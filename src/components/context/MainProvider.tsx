import { isProd } from "@/config";
import { useLocation } from "@solidjs/router";
import { createContext, useContext, ParentComponent, createEffect, onMount } from "solid-js";
import { toast, Toaster, ToastOptions } from "solid-toast";

export const showSuccess = (message: string, opts?: ToastOptions) => {
	toast.success(message, {
		...opts,
		className: 'text-sm',
	});
};

export const showError = (message: string, opts?: ToastOptions) => {
	message = message.includes('<html>') ? 'Please Try Again' : message;
	toast.error(message || 'Please Try Again', {
		...opts,
		className: 'text-sm',
	});
};

type MainContextType = {};

const MainContext = createContext<MainContextType>();

export const MainProvider: ParentComponent = (props) => {
	const location = useLocation();

	onMount(() => {
		if (isProd) {
			console.log("GoClaw Docs CMS");
		}
	});

	// Block progress updates for 1 second when route changes
	createEffect(() => {
		// Track route changes
		location.pathname;
		console.log('Route changed to:', location.pathname);
	});

	return (
		<MainContext.Provider value={{}}>
			<Toaster
				// theme=""
				// richColors
				position="top-left"
				gutter={8}
			/>
			{/* 			
			<div class="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center">
				<img
					class="pointer-events-none fixed top-0 z-50 mx-auto h-screen object-contain opacity-60 brightness-75 grayscale hue-rotate-180 saturate-150 sepia filter"
					src="/assets/images/src/home.jpg"
					alt=""
				/>
			</div> */}

			{props.children}
		</MainContext.Provider>
	);
};

export default MainProvider;

export const useMain = (): MainContextType => {
	const context = useContext(MainContext);
	if (!context) {
		throw new Error('useMain must be used within MainProvider');
	}
	return context;
};
