/**
 * Admin dashboard — user stats + management link
 */
import { createAsync } from "@solidjs/router";
import { Show, Suspense } from "solid-js";
import { A } from "@solidjs/router";
import { getAdminStatsAction } from "@/actions/admin/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import createAdminProtecter from "@/lib/hook/createAdminProtecter";

export default function AdminDashboard() {
	createAdminProtecter();

	const stats = createAsync(() => getAdminStatsAction());

	return (
		<div class="mx-auto max-w-4xl p-6">
			<h1 class="text-foreground mb-6 text-2xl font-bold">Admin Dashboard</h1>

			<Suspense fallback={<div class="text-muted-foreground">Loading stats...</div>}>
				<Show when={stats()}>
					{(s) => (
						<div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
							<Card>
								<CardHeader class="pb-2">
									<CardTitle class="text-sm font-medium">Users</CardTitle>
								</CardHeader>
								<CardContent>
									<div class="text-3xl font-bold">{s().userCount}</div>
								</CardContent>
							</Card>
							<Card>
								<CardHeader class="pb-2">
									<CardTitle class="text-sm font-medium">Active Sessions</CardTitle>
								</CardHeader>
								<CardContent>
									<div class="text-3xl font-bold">{s().activeSessionCount}</div>
								</CardContent>
							</Card>
						</div>
					)}
				</Show>
			</Suspense>

			<A href="/admin/users" class="block">
				<Card class="hover:border-primary transition-colors">
					<CardHeader>
						<CardTitle>User Management</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-muted-foreground text-sm">Create, edit, and manage user accounts</p>
					</CardContent>
				</Card>
			</A>

			<div class="mt-6">
				<A href="/en/docs" class="text-primary text-sm hover:underline">
					← Back to docs
				</A>
			</div>
		</div>
	);
}
