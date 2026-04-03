import { z } from 'zod';
import type { SubmitHandler } from '@modular-forms/solid';
import { createForm, zodForm } from '@modular-forms/solid';

import { Button } from '@/components/ui/button';
import { Grid } from '@/components/ui/grid';
import { TextField, TextFieldInput, TextFieldLabel } from '@/components/ui/text-field';
import LoadingSpinner from '@/components/ui/loader/LoadingSpinner';
import { showError } from '@/components/context/MainProvider';
import { useLocation, useNavigate, useSearchParams } from '@solidjs/router';
import { checkCredential } from '@/lib/auth';
import { CALLBACK_URL_KEY } from '@/lib/auth/data';
import { searchParamsToString } from '@/lib/utils';
import { appConfig } from '@/config';

export const AuthSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address' }),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type AuthForm = z.infer<typeof AuthSchema>;

export default function FormLoginPassword(props: { callbackUrl?: string }) {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchParams] = useSearchParams();

	// Connect the form to Zod validation using valiForm
	const [authForm, { Form, Field }] = createForm<AuthForm>({
		validate: zodForm(AuthSchema as any), // Chưa support zod mới nhất
	});

	const handleLogin: SubmitHandler<AuthForm> = async (values) => {
		const res = await checkCredential(values);
		if (res.status) {
			const nextPage =
				props.callbackUrl || searchParamsToString(searchParams[CALLBACK_URL_KEY]) || "/en/docs";
			window.location.href = nextPage;
		} else {
			showError(res.message || "Login Failed");
		}
	};

	return (
		<Form class="grid gap-6" onSubmit={handleLogin}>
			<Grid class="gap-4">
				<Field name="email">
					{(field, props) => (
						<TextField class="gap-1">
							<TextFieldLabel class="sr-only">Email</TextFieldLabel>
							<TextFieldInput {...props} type="email" placeholder="me@email.com" autocomplete="email" required />
							{field.error && <p class="text-destructive mt-1 text-sm">{field.error}</p>}
						</TextField>
					)}
				</Field>
				<Field name="password">
					{(field, props) => (
						<TextField class="gap-1">
							<TextFieldLabel class="sr-only">Password</TextFieldLabel>
							<TextFieldInput
								{...props}
								type="password"
								placeholder="••••••••"
								autocomplete="current-password"
								required
							/>
							{field.error && <p class="text-destructive mt-1 text-sm">{field.error}</p>}
						</TextField>
					)}
				</Field>
				<Button class="mx-auto w-fit" type="submit" disabled={authForm.submitting}>
					{authForm.submitting && <LoadingSpinner class="mr-2 size-4 animate-spin" />}
					Login
				</Button>
			</Grid>
		</Form>
	);
}
