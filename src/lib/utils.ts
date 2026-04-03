import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const wait = (ms: number) => new Promise((resolve, reject) => setTimeout(resolve, ms));

export const searchParamsToString = (query: any) => {
	if (typeof query == 'undefined' || query == null) return '';
	return (Array.isArray(query) ? `${query[0]}` : `${query}`) || '';
};

export const getAverage = (numbers: number[]): number => {
	if (numbers.length === 0) return 0;
	const sum = numbers.reduce((acc, val) => acc + val, 0);
	return sum / numbers.length;
};
