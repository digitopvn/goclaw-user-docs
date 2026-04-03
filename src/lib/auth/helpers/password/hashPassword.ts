import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

import passwordAddPepper from '@/lib/auth/helpers/password/passwordAddPepper';

const scryptAsync = promisify(scrypt);

export default async function hashPassword(password: string) {
	try {
		// Generate a random salt
		const salt = randomBytes(16).toString('hex');

		// Hash the password with salt
		const derivedKey = (await scryptAsync(passwordAddPepper(password), salt, 64)) as Buffer;
		const hash = derivedKey.toString('hex');

		// Return salt:hash format for storage
		return `${salt}:${hash}`;
	} catch (error) {
		console.error(`hashPassword error`, error);
		throw new Error('Hash Password');
	}
}
