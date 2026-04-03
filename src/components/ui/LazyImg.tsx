import { cn } from '@/lib/cn';
import { wait } from '@/lib/utils';
import { Component, onCleanup, onMount, JSX } from 'solid-js';

type LazyImgProps = JSX.ImgHTMLAttributes<HTMLImageElement> & {
	src: string;
	alt: string;
	onIntersecting?: () => void;
};

export const LazyImg: Component<LazyImgProps> = (props) => {
	let imgElement: HTMLImageElement | undefined;

	onMount(async () => {
		await wait(100);
		if (!imgElement) return;

		// Intersection Observer for preloading images before they enter viewport
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						props?.onIntersecting?.();
						observer.disconnect();
					}
				});
			},
			{
				// Start loading when image is 30% of viewport height before entering screen
				rootMargin: '0% 0px 0% 0px', // top right bottom left
				threshold: 0.01,
			}
		);

		observer.observe(imgElement);

		onCleanup(() => {
			observer.disconnect();
		});
	});

	return (
		<img
			ref={imgElement}
			loading="lazy"
			decoding="async"
			onLoad={() => {
				// console.log('Image fully loaded:', props.alt);
			}}
			onError={() => {
				// console.error('Image failed to load:', props.src);
			}}
			{...props}
			class={cn('size-full object-contain', props.class)}
		/>
	);
};
