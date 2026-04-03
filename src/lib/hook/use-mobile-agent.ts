/** Returns true when running on a mobile/tablet user agent. SSR-safe. */
export const isMobileAgent = (): boolean => {
	if (typeof navigator === 'undefined') return false;
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
