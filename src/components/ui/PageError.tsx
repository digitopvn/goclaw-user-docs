import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { logout } from "@/lib/auth";
import { A } from '@solidjs/router';
import { Component, Show } from 'solid-js';

const PageError: Component<{ title?: string; message?: string }> = (props) => {
	return (
		<Flex flexDirection="col" justifyContent="center" class="h-screen gap-3 overflow-y-auto p-[15px]">
			<div class="flex items-center justify-center">
				<img src="/assets/images-webp/sym_exclamation.webp" alt="" class="h-[25vh]" />
			</div>
			<CardTitle class="text-center">{props.title}</CardTitle>
			<CardDescription class="mb-[20px] text-center">{props.message}</CardDescription>

			<Button variant="default">
				<A href="/">Back to home</A>
			</Button>

			<Show when={props.title == 'Need permisstion'}>
				<Button
					onclick={() => {
						logout();
					}}
					variant="default"
				>
					<A href="/">Logout</A>
				</Button>
			</Show>
		</Flex>
	);
};

export default PageError;
