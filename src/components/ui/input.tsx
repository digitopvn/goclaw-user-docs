import { cn } from '@/lib/cn';
import type { ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

export interface InputProps extends ComponentProps<'input'> {}

export const Input = (props: InputProps) => {
	const [local, others] = splitProps(props, ['type', 'class']);
	return (
		<input
			type={local.type}
			class={cn(
				'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
				local.class
			)}
			{...others}
		/>
	);
};

export interface TextareaProps extends ComponentProps<'textarea'> {}

export const Textarea = (props: TextareaProps) => {
	const [local, others] = splitProps(props, ['class']);
	return (
		<textarea
			class={cn(
				'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
				local.class
			)}
			{...others}
		/>
	);
};
