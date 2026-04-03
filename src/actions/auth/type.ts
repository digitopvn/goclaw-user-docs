/**
 * Auth types — simplified for self-contained Drizzle-backed auth
 * No external API, no JWT access/refresh tokens
 */

export interface UserResponse {
	id: number;
	email: string;
	name: string;
	role: string; // "admin" | "editor" | "viewer"
	isActive: boolean;
	createdAt: Date | null;
}

export interface AuthSession {
	sessionId: string;
	userId: number;
	role: string;
	name: string;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface CreateUserInput {
	email: string;
	name: string;
	password: string;
	role?: string;
}
