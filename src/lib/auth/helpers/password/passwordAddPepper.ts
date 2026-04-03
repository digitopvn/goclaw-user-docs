import env from '@/config/env';

export default function passwordAddPepper(password: string) {
	return `${password}${env('PASSWORD_PEPPER_SECRET', false)}`;
}
