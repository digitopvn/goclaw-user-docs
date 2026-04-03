import { appState } from '@/store/appStore';
import { getRequestEvent, isServer } from 'solid-js/web';

export const isNotLogin = () => {
	return isServer ? !getRequestEvent()?.locals?.isLogin : appState.session.status == 'unauthorized';
};

export const isLogin = () => {
	return isServer
		? !!getRequestEvent()?.locals?.isLogin
		: appState.session.status == 'loaded' && !!appState.session.sessionId;
};
