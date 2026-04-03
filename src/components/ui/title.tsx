import { cn } from '@/lib/cn';
import { ParentComponent, splitProps, JSX } from 'solid-js';

interface LabelProps extends JSX.HTMLAttributes<HTMLHeadingElement> {}

interface DescriptionProps extends JSX.HTMLAttributes<HTMLParagraphElement> {}

export const TLabel: ParentComponent<LabelProps> = (props) => {
	const [local, rest] = splitProps(props, ['class']);

	return <h4 class={cn('mb-1 text-xl leading-snug font-semibold tracking-tight', local.class)} {...rest} />;
};

export const TDescription: ParentComponent<DescriptionProps> = (props) => {
	const [local, rest] = splitProps(props, ['class']);

	return <p class={cn('text-muted-foreground text-sm', local.class)} {...rest} />;
};
