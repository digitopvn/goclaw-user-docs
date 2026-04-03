import asset from '@/lib/asset';
import { Component } from 'solid-js';

const Splash: Component<{}> = (props) => {
	return (
		<div class="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center">
			<img class="h-1/3 w-auto object-cover" src={asset('/assets/images/logo/logo.svg')} alt="" />
		</div>
	);
};

export default Splash;
