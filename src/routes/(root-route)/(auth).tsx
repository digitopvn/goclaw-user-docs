import { useNavigate } from '@solidjs/router';
import { createEffect, ParentComponent } from 'solid-js';

const AuthRoute: ParentComponent<{}> = (props) => {
	// const navigate = useNavigate();
	// navigate('/login');

	return <>{props.children}</>;
};

export default AuthRoute;
