import { cn } from '@/lib/cn';
import type { ContentProps, DescriptionProps, DynamicProps, LabelProps } from '@corvu/drawer';
import DrawerPrimitive from '@corvu/drawer';
import type { ComponentProps, ParentProps, ValidComponent } from 'solid-js';
import { Match, Show, splitProps, Switch } from 'solid-js';

export const Drawer = DrawerPrimitive;
export const DrawerTrigger = DrawerPrimitive.Trigger;
export const DrawerClose = DrawerPrimitive.Close;

type drawerContentProps<T extends ValidComponent = 'div'> = ParentProps<
	ContentProps<T> & {
		class?: string;
		side?: 'top' | 'right' | 'bottom' | 'left';
		showThumb?: boolean;
	}
>;

export const DrawerContent = <T extends ValidComponent = 'div'>(props: DynamicProps<T, drawerContentProps<T>>) => {
	const [local, rest] = splitProps(props as drawerContentProps, ['class', 'children', 'side', 'showThumb']);
	const ctx = DrawerPrimitive.useContext();
	const showThumb = () => local.showThumb;
	const side = () => local.side ?? ctx.side();
	const sideThumb = () => showThumb() && (local.side ?? ctx.side());

	return (
		<DrawerPrimitive.Portal>
			<style>{`
				body::-webkit-scrollbar {
					display: none;
				}
			`}</style>

			<DrawerPrimitive.Overlay
				class="fixed inset-0 z-50 data-transitioning:transition-transform data-transitioning:duration-500"
				style={{
					'background-color': `oklch(from var(--background) l c h / ${0.8 * ctx.openPercentage()})`,
				}}
			/>
			<DrawerPrimitive.Content
				class={cn(
					'bg-background fixed z-50 flex data-[transitioning]:transition-transform data-[transitioning]:duration-300 data-[transitioning]:ease-in-out md:select-none',
					// Bottom drawer (default)
					side() === 'bottom' &&
						'inset-x-0 bottom-0 mt-24 h-auto flex-col rounded-t-xl border after:absolute after:inset-x-0 after:top-full after:h-[50%] after:bg-inherit',
					// Top drawer
					side() === 'top' &&
						'inset-x-0 top-0 mb-24 h-auto flex-col rounded-b-xl border after:absolute after:inset-x-0 after:bottom-full after:h-[50%] after:bg-inherit',

					// Left drawer - now positioned from center
					side() === 'left' &&
						'top-0 bottom-0 left-0 h-full w-full flex-col border-l shadow-2xl after:absolute after:inset-y-0 after:right-full after:w-[50%] after:bg-inherit sm:w-1/2',
					// Right drawer (horizontal) - now positioned from center
					side() === 'right' &&
						'top-0 right-0 bottom-0 h-full w-full flex-col border-l shadow-2xl after:absolute after:inset-y-0 after:left-full after:w-[50%] after:bg-inherit sm:w-1/2',

					local.class
				)}
				{...rest}
			>
				<Switch>
					<Match when={sideThumb() === 'right'}>
						<div
							class={cn(
								'bg-muted hover:bg-muted/60 absolute top-1/2 z-[999] h-[100px] w-2 -translate-y-1/2 cursor-grab rounded-full transition-colors active:cursor-grabbing',
								'left-2'
							)}
						/>
					</Match>
					<Match when={sideThumb() === 'left'}>
						<div
							class={cn(
								'bg-muted hover:bg-muted/60 absolute top-1/2 z-[999] h-[100px] w-2 -translate-y-1/2 cursor-grab rounded-full transition-colors active:cursor-grabbing',
								'right-2'
							)}
						/>
					</Match>
					<Match when={sideThumb() === 'bottom'}>
						<div
							class={cn(
								'bg-muted z-[999] mx-auto h-2 w-[100px] cursor-grab rounded-full transition-colors active:cursor-grabbing',
								'mt-2'
							)}
						/>
					</Match>
				</Switch>

				{local.children}

				<Show when={sideThumb() === 'top'}>
					<div
						class={cn(
							'bg-muted z-[999] mx-auto h-2 w-[100px] cursor-grab rounded-full transition-colors active:cursor-grabbing',
							'mb-2'
						)}
					/>
				</Show>
			</DrawerPrimitive.Content>
		</DrawerPrimitive.Portal>
	);
};

export const DrawerHeader = (props: ComponentProps<'div'>) => {
	const [local, rest] = splitProps(props, ['class']);

	return <div class={cn('grid gap-1.5 p-4 text-center sm:text-left', local.class)} {...rest} />;
};

export const DrawerFooter = (props: ComponentProps<'div'>) => {
	const [local, rest] = splitProps(props, ['class']);

	return <div class={cn('mt-auto flex flex-col gap-2 p-4', local.class)} {...rest} />;
};

type DrawerLabelProps = LabelProps & {
	class?: string;
};

export const DrawerLabel = <T extends ValidComponent = 'h2'>(props: DynamicProps<T, DrawerLabelProps>) => {
	const [local, rest] = splitProps(props as DrawerLabelProps, ['class']);

	return (
		<DrawerPrimitive.Label class={cn('text-lg leading-none font-semibold tracking-tight', local.class)} {...rest} />
	);
};

type DrawerDescriptionProps = DescriptionProps & {
	class?: string;
};

export const DrawerDescription = <T extends ValidComponent = 'p'>(props: DynamicProps<T, DrawerDescriptionProps>) => {
	const [local, rest] = splitProps(props as DrawerDescriptionProps, ['class']);

	return <DrawerPrimitive.Description class={cn('text-muted-foreground text-sm', local.class)} {...rest} />;
};
