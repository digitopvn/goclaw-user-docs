/**
 * User icon with popover — theme toggle + auth actions
 */
import { Component, Show } from "solid-js";
import Popover from "@corvu/popover";
import { Flex } from "@/components/ui/flex";
import { logout } from "@/lib/auth";
import { isLogin } from "@/store/authAction";
import { A } from "@solidjs/router";
import { appState } from "@/store/appStore";
import { setTheme } from "@/store/appActions";

const toggleTheme = () => setTheme(appState.theme === "dark" ? "light" : "dark");

const UserIcon: Component = () => {
	const user = appState.user;

	return (
		<Popover placement="bottom-end">
			<Popover.Anchor class="flex">
				<Popover.Trigger class="hover:bg-muted flex h-8 w-8 items-center justify-center rounded-lg transition-colors">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-foreground"
					>
						<path d="M18 20a6 6 0 0 0-12 0" />
						<circle cx="12" cy="10" r="4" />
						<circle cx="12" cy="12" r="10" />
					</svg>
				</Popover.Trigger>
			</Popover.Anchor>
			<Popover.Portal>
				<Popover.Overlay />
				<Popover.Content class="z-50">
					<div class="bg-gradient-bg border-border mt-2 min-w-[200px] overflow-hidden rounded-xl border shadow-xl">
						<Show when={isLogin() && user.name}>
							<div class="border-border border-b px-4 py-3">
								<div class="text-foreground truncate text-sm font-semibold">{user.name}</div>
								<Show when={user.email}>
									<div class="text-muted-foreground mt-0.5 truncate text-xs">{user.email}</div>
								</Show>
							</div>
						</Show>

						<div class="border-border border-b">
							<button
								class="hover:bg-muted flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
								onClick={toggleTheme}
							>
								<span class="text-foreground">{appState.theme === "dark" ? "Dark mode" : "Light mode"}</span>
							</button>
						</div>

						<div>
							<Show
								when={isLogin()}
								fallback={
									<A
										href="/login"
										class="hover:bg-muted flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
									>
										<span class="text-foreground">Sign in</span>
									</A>
								}
							>
								<button
									class="hover:bg-destructive/10 text-destructive flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
									onClick={() => logout()}
								>
									<span>Sign out</span>
								</button>
							</Show>
						</div>
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover>
	);
};

export default UserIcon;
