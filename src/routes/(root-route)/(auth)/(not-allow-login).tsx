import { createEffect, ParentComponent } from 'solid-js';
import { isLogin, isNotLogin } from '@/store/authAction';
import { Navigate, useSearchParams } from '@solidjs/router';
import { appConfig } from '@/config';
import { CALLBACK_URL_KEY } from '@/lib/auth/data';
import { isServer } from 'solid-js/web';
import { appState } from '@/store/appStore';

const NotAllowLoginLayout: ParentComponent<{}> = (props) => {
	const [searchParams] = useSearchParams();
	const callbackQuery = () => (searchParams[CALLBACK_URL_KEY] as string) || appConfig.route.callbackAfterAuth;

	if (isServer && isLogin()) return <Navigate href={callbackQuery()} />;

	if (appState.session.sessionId) return <Navigate href={callbackQuery()} />;

	return <>{props.children}</>;
};

export default NotAllowLoginLayout;
