import { ParentComponent } from 'solid-js';
import { isLogin } from '@/store/authAction';
import createAuthProtecter from '@/lib/hook/createAuthProtecter';

const PrivateAuthRoute: ParentComponent<{}> = (props) => {
	createAuthProtecter();

	return props.children;
};

export default PrivateAuthRoute;
