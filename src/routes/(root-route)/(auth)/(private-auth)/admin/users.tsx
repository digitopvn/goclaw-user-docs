/**
 * Admin user management page — list, create, edit users
 */
import { createAsync } from "@solidjs/router";
import { Show, Suspense, For, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { listUsersAction, updateUserAction, resetPasswordAction } from "@/actions/admin/admin-actions";
import { createUserAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showSuccess, showError } from "@/components/context/MainProvider";
import createAdminProtecter from "@/lib/hook/createAdminProtecter";

export default function AdminUsers() {
	createAdminProtecter();

	const users = createAsync(() => listUsersAction());
	const [showCreate, setShowCreate] = createSignal(false);

	return (
		<div class="mx-auto max-w-5xl p-6">
			<div class="mb-6 flex items-center justify-between">
				<h1 class="text-foreground text-2xl font-bold">User Management</h1>
				<Button onClick={() => setShowCreate(!showCreate())}>
					{showCreate() ? "Cancel" : "Create User"}
				</Button>
			</div>

			{/* Create user form */}
			<Show when={showCreate()}>
				<CreateUserForm onCreated={() => { setShowCreate(false); window.location.reload(); }} />
			</Show>

			{/* User list */}
			<Suspense fallback={<div class="text-muted-foreground">Loading users...</div>}>
				<Show when={users()}>
					{(userList) => (
						<div class="space-y-2">
							<For each={userList()}>
								{(user) => <UserRow user={user} />}
							</For>
						</div>
					)}
				</Show>
			</Suspense>

			<div class="mt-6">
				<A href="/admin" class="text-primary text-sm hover:underline">← Back to admin</A>
			</div>
		</div>
	);
}

/** Create user form */
function CreateUserForm(props: { onCreated: () => void }) {
	const [email, setEmail] = createSignal("");
	const [name, setName] = createSignal("");
	const [password, setPassword] = createSignal("");
	const [role, setRole] = createSignal("viewer");
	const [submitting, setSubmitting] = createSignal(false);

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const res = await createUserAction(
				{ email: email(), name: name(), password: password(), role: role() },
				"admin",
			);
			showSuccess(`User ${res.email} created`);
			props.onCreated();
		} catch (error) {
			showError(error instanceof Error ? error.message : "Create failed");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Card class="mb-6">
			<CardHeader><CardTitle>Create User</CardTitle></CardHeader>
			<CardContent>
				<form class="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={handleSubmit} autocomplete="off">
					<input class="bg-background border-border rounded border px-3 py-2 text-sm" type="email" placeholder="Email" required value={email()} onInput={(e) => setEmail(e.currentTarget.value)} autocomplete="new-email" />
					<input class="bg-background border-border rounded border px-3 py-2 text-sm" type="text" placeholder="Name" required value={name()} onInput={(e) => setName(e.currentTarget.value)} autocomplete="new-name" />
					<input class="bg-background border-border rounded border px-3 py-2 text-sm" type="password" placeholder="Password (min 6)" required minLength={6} value={password()} onInput={(e) => setPassword(e.currentTarget.value)} autocomplete="new-password" />
					<select class="bg-background border-border rounded border px-3 py-2 text-sm" value={role()} onChange={(e) => setRole(e.currentTarget.value)}>
						<option value="viewer">Viewer</option>
						<option value="editor">Editor</option>
						<option value="admin">Admin</option>
					</select>
					<Button type="submit" disabled={submitting()} class="md:col-span-2 w-fit">
						{submitting() ? "Creating..." : "Create"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

/** Single user row with inline actions */
function UserRow(props: { user: { id: number; email: string; name: string; role: string; isActive: boolean } }) {
	const [editing, setEditing] = createSignal(false);
	const [role, setRole] = createSignal(props.user.role);
	const [active, setActive] = createSignal(props.user.isActive);

	const handleSave = async () => {
		const res = await updateUserAction(props.user.id, { role: role(), isActive: active() });
		if (res.success) {
			showSuccess("User updated");
			setEditing(false);
		} else {
			showError(res.message || "Update failed");
		}
	};

	const handleResetPassword = async () => {
		const newPass = prompt("Enter new password (min 6 chars):");
		if (!newPass || newPass.length < 6) return;
		const res = await resetPasswordAction(props.user.id, newPass);
		if (res.success) showSuccess("Password reset");
		else showError(res.message || "Reset failed");
	};

	return (
		<Card>
			<CardContent class="flex items-center justify-between py-3">
				<div class="min-w-0 flex-1">
					<div class="text-foreground text-sm font-medium">{props.user.name}</div>
					<div class="text-muted-foreground text-xs">{props.user.email}</div>
				</div>

				<Show when={editing()} fallback={
					<div class="flex items-center gap-2">
						<span class={`rounded px-2 py-0.5 text-xs ${props.user.isActive ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}>
							{props.user.isActive ? "Active" : "Inactive"}
						</span>
						<span class="bg-muted rounded px-2 py-0.5 text-xs">{props.user.role}</span>
						<Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>
					</div>
				}>
					<div class="flex items-center gap-2">
						<select class="bg-background border-border rounded border px-2 py-1 text-xs" value={role()} onChange={(e) => setRole(e.currentTarget.value)}>
							<option value="viewer">Viewer</option>
							<option value="editor">Editor</option>
							<option value="admin">Admin</option>
						</select>
						<label class="flex items-center gap-1 text-xs">
							<input type="checkbox" checked={active()} onChange={(e) => setActive(e.currentTarget.checked)} />
							Active
						</label>
						<Button size="sm" onClick={handleSave}>Save</Button>
						<Button variant="outline" size="sm" onClick={handleResetPassword}>Reset PW</Button>
						<Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
					</div>
				</Show>
			</CardContent>
		</Card>
	);
}
