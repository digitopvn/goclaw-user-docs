/**
 * App configuration — simplified for GoClaw Docs CMS
 */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export const appConfig = {
	get siteName(): string {
		return import.meta.env.VITE_APP_TITLE || process.env.VITE_APP_TITLE || "GoClaw Docs";
	},
	get description(): string {
		return import.meta.env.VITE_APP_DESCRIPTION || process.env.VITE_APP_DESCRIPTION || "GoClaw User Manual";
	},
	get tz(): string {
		return import.meta.env.TZ || "Asia/Ho_Chi_Minh";
	},

	normalize(str: string) {
		if (typeof str != "string") return "";
		let result = str ?? "";
		if (result?.endsWith?.("/")) result = result.slice(0, -1);
		if (!result?.startsWith?.("/")) result = `/${result}`;
		return result;
	},

	getBaseUrl(url = "") {
		url = appConfig.normalize(url);
		const viteBaseUrl = import.meta.env.VITE_BASE_URL || process.env.VITE_BASE_URL;
		return viteBaseUrl ? `${viteBaseUrl}${url}` : url;
	},

	route: {
		callbackAfterAuth: "/en/docs",

		root(path: string = "", fullHref = false) {
			path = appConfig.normalize(path);
			return fullHref ? appConfig.getBaseUrl(path) : path;
		},

		auth: {
			login(path: string = "") {
				path = appConfig.normalize(path);
				return `/login${path}`;
			},
		},
	},
} as const;

export const isLocal = import.meta.env.VITE_ENV == "local";
export const isDev = import.meta.env.VITE_ENV == "development";
export const isProd = import.meta.env.VITE_ENV == "production";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(appConfig.tz);
