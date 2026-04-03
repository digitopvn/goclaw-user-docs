import { cn } from '@/lib/cn';
import type { ComponentProps } from 'solid-js';
import { splitProps } from 'solid-js';

const Table = (props: ComponentProps<'table'>) => {
	const [local, others] = splitProps(props, ['class']);
	return (
		<div class="relative w-full overflow-auto">
			<table class={cn('w-full caption-bottom text-sm', local.class)} {...others} />
		</div>
	);
};

const TableHeader = (props: ComponentProps<'thead'>) => {
	const [local, others] = splitProps(props, ['class']);
	return <thead class={cn('[&_tr]:border-b', local.class)} {...others} />;
};

const TableBody = (props: ComponentProps<'tbody'>) => {
	const [local, others] = splitProps(props, ['class']);
	return <tbody class={cn('[&_tr:last-child]:border-0', local.class)} {...others} />;
};

const TableFooter = (props: ComponentProps<'tfoot'>) => {
	const [local, others] = splitProps(props, ['class']);
	return <tfoot class={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', local.class)} {...others} />;
};

const TableRow = (props: ComponentProps<'tr'>) => {
	const [local, others] = splitProps(props, ['class']);
	return (
		<tr
			class={cn('hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors', local.class)}
			{...others}
		/>
	);
};

const TableHead = (props: ComponentProps<'th'>) => {
	const [local, others] = splitProps(props, ['class']);
	return (
		<th
			class={cn(
				'text-muted-foreground h-12 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
				local.class
			)}
			{...others}
		/>
	);
};

const TableCell = (props: ComponentProps<'td'>) => {
	const [local, others] = splitProps(props, ['class']);
	return <td class={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', local.class)} {...others} />;
};

const TableCaption = (props: ComponentProps<'caption'>) => {
	const [local, others] = splitProps(props, ['class']);
	return <caption class={cn('text-muted-foreground mt-4 text-sm', local.class)} {...others} />;
};

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
