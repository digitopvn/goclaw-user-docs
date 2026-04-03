import { Component, JSX } from 'solid-js';

interface IconProps {
	size?: number | string;
	color?: string;
	class?: string;
}

export const Headset: Component<IconProps> = (props) => {
	const size = () => props.size || 14;
	const color = () => props.color || 'white';

	return (
		<svg
			width={size()}
			height={size()}
			viewBox="0 0 14 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class={props.class}
		>
			<path
				d="M12 9.75V12C12 12.4125 11.6625 12.75 11.25 12.75H10.5V9.75H12ZM3 9.75V12.75H2.25C1.8375 12.75 1.5 12.4125 1.5 12V9.75H3ZM6.75 0C3.0225 0 0 3.0225 0 6.75V12C0 13.245 1.005 14.25 2.25 14.25H4.5V8.25H1.5V6.75C1.5 3.8475 3.8475 1.5 6.75 1.5C9.6525 1.5 12 3.8475 12 6.75V8.25H9V14.25H11.25C12.495 14.25 13.5 13.245 13.5 12V6.75C13.5 3.0225 10.4775 0 6.75 0Z"
				fill={color()}
			/>
		</svg>
	);
};

export const PlayIcon: Component<IconProps> = (props) => {
	const size = () => props.size || 14;
	const color = () => props.color || 'white';

	return (
		<svg
			width={size()}
			height={size()}
			viewBox="0 0 14 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class={props.class}
		>
			<path d="M13.5937 7.84839L1.16815e-06 15.6967L1.85428e-06 3.27844e-05L13.5937 7.84839Z" fill={color()} />
		</svg>
	);
};

export const CopyIcon: Component<IconProps> = (props) => {
	const size = () => props.size || 16;
	const color = () => props.color || 'white';

	return (
		<svg width={size()} height={size()} viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g clip-path="url(#clip0_762_858)">
				<path
					d="M11.0229 0.00012207H2.99707V12.8885H14.0002V2.95492L11.0229 0.00012207ZM12.4825 11.3826H4.5146V1.50643H10.3945L12.4825 3.57842V11.3826Z"
					fill="white"
				/>
				<path
					d="M9.48547 13.3777V14.494H1.51753V4.61785H2.2888V3.11145H0V15.9998H11.0031V13.3777H9.48547Z"
					fill={color()}
				/>
			</g>
			<defs>
				<clipPath id="clip0_762_858">
					<rect width="14" height="16" fill={color()} />
				</clipPath>
			</defs>
		</svg>
	);
};

export type { IconProps };
