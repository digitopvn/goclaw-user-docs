/**
 * Auth route protection — redirects unauthenticated users to login
 */
import { CALLBACK_URL_KEY } from "@/lib/auth/data";
import { isNotLogin } from "@/store/authAction";
import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

const createAuthProtecter = () => {
	const navigate = useNavigate();
	const location = useLocation();

	createEffect(() => {
		if (isNotLogin()) {
			return navigate(`/login?${CALLBACK_URL_KEY}=${location.pathname}`, { replace: true });
		}
	});

	return true;
};

export default createAuthProtecter;
