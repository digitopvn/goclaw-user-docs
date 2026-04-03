// ============================================
// Pagination Types
// ============================================

export interface IPagination {
	total: number;
	page: number;
	limit: number;
	pages: number;
}

export interface IList<T> {
	list: T[];
	pagination: IPagination;
}

// ============================================
// Base Search Parameters
// ============================================

export interface IBaseSearchParams {
	limit?: number | string;
	page?: number | string;
}

export interface SearchPageList extends IBaseSearchParams {
	[key: string]: any;
	q?: string;
}

// ============================================
// Common API Response Types
// ============================================

export interface IMessageResponse {
	message: string;
}

export interface ICountResponse {
	count: number;
}

export interface IDeleteResponse extends IMessageResponse {}

export interface ISlugResponse {
	slug: string;
}

export interface INextNumberResponse {
	nextNumber: number;
}
