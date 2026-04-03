import { cn } from '@/lib/cn';
import DialogPrimitive from '@corvu/dialog';
import type { ComponentProps, ParentProps, ValidComponent } from 'solid-js';
import { Show, splitProps } from 'solid-js';

// Export the root Dialog component and its primitives
export const Dialog = DialogPrimitive;

// Export Trigger
export const DialogTrigger = DialogPrimitive.Trigger;

// Export Close button
export const DialogClose = DialogPrimitive.Close;

type DialogContentProps = ParentProps<{
	class?: string;
	as?: ValidComponent;
	forceMount?: boolean;
	closeButton?: boolean;
}>;

export const DialogContent = (props: DialogContentProps) => {
	const [local, rest] = splitProps(props, ['class', 'children']);

	return (
		<DialogPrimitive.Portal>
			{/* 
         Overlay Animation:
         - data-[open]:animate-in: Kích hoạt animation khi mở
         - data-[closed]:animate-out: Kích hoạt animation khi đóng
         - fade-in-0 / fade-out-0: Hiệu ứng mờ dần
      */}
			<DialogPrimitive.Overlay class="data-[open]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[open]:fade-in-0 fixed inset-0 z-50 bg-black/80" />

			{/* 
         Content Animation:
         - Thêm zoom-in-95 và zoom-out-95 để có hiệu ứng phóng to/thu nhỏ nhẹ
         - Thêm slide-in-from... để trượt từ giữa màn hình
      */}
			<DialogPrimitive.Content
				class={cn(
					'bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border-[2px] p-6 shadow-lg duration-200',
					// Animation Classes đã sửa:
					'data-[closed]:fade-out-0 data-[open]:fade-in-0',
					'data-[closed]:zoom-out-95 data-[open]:zoom-in-95',
					'data-[closed]:slide-out-to-left-1/2 data-[closed]:slide-out-to-top-[48%]',
					'data-[open]:slide-in-from-left-1/2 data-[open]:slide-in-from-top-[48%]',
					local.class
				)}
				{...rest}
			>
				{local.children}

				<Show when={props.closeButton}>
					<DialogPrimitive.Close class="text-foreground ring-offset-background absolute top-2 right-2 cursor-pointer text-[35px] opacity-70 transition-transform duration-300 hover:rotate-180 hover:opacity-100 disabled:pointer-events-none sm:top-2 sm:right-2">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">
							<path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M18 6L6 18M6 6l12 12"
							/>
							<title>Close</title>
						</svg>
					</DialogPrimitive.Close>
				</Show>
			</DialogPrimitive.Content>
		</DialogPrimitive.Portal>
	);
};

// DialogTitle (using Dialog.Label)
type DialogTitleProps = {
	class?: string;
	as?: ValidComponent;
} & ComponentProps<'h2'>;

export const DialogTitle = (props: DialogTitleProps) => {
	const [local, rest] = splitProps(props, ['class']);

	return <DialogPrimitive.Label class={cn('text-foreground text-lg font-semibold', local.class)} {...rest} />;
};

// DialogDescription
type DialogDescriptionProps = {
	class?: string;
	as?: ValidComponent;
} & ComponentProps<'p'>;

export const DialogDescription = (props: DialogDescriptionProps) => {
	const [local, rest] = splitProps(props, ['class']);

	return <DialogPrimitive.Description class={cn('text-muted-foreground text-sm', local.class)} {...rest} />;
};

// DialogHeader (custom component)
export const DialogHeader = (props: ComponentProps<'div'>) => {
	const [local, rest] = splitProps(props, ['class']);

	return <div class={cn('flex flex-col space-y-2 text-center sm:text-left', local.class)} {...rest} />;
};

// DialogFooter (custom component)
export const DialogFooter = (props: ComponentProps<'div'>) => {
	const [local, rest] = splitProps(props, ['class']);

	return <div class={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', local.class)} {...rest} />;
};
