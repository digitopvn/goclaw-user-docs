import { ParentComponent } from 'solid-js';
import { children } from 'solid-js';

const AsideScroll: ParentComponent<{}> = (props) => {
	const resolved = children(() => props.children);

	return (
		<aside class="size-full overflow-hidden">
			<div class="h-full overflow-x-hidden overflow-y-auto">{resolved()}</div>
		</aside>
	);
};

export default AsideScroll;
