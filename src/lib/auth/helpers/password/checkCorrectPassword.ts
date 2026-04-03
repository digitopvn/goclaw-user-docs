import { scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

import passwordAddPepper from '@/lib/auth/helpers/password/passwordAddPepper';

const scryptAsync = promisify(scrypt);

export default async function checkCorrectPassword(userPassword: string, password: string) {
	try {
		// Extract salt and hash from stored password
		// Assuming userPassword format is: salt:hash
		const [salt, storedHash] = userPassword.split(':');

		if (!salt || !storedHash) {
			throw new Error('Invalid password format');
		}

		// Hash the provided password with the same salt
		const derivedKey = (await scryptAsync(passwordAddPepper(password), salt, 64)) as Buffer;
		const derivedHash = derivedKey.toString('hex');

		// Use timing-safe comparison
		return timingSafeEqual(
			new Uint8Array(Buffer.from(storedHash, 'hex')),
			new Uint8Array(Buffer.from(derivedHash, 'hex'))
		);
	} catch (error) {
		console.error(`checkCorrectPassword error`, error);
		throw new Error('Check Correct Password');
	}
}
