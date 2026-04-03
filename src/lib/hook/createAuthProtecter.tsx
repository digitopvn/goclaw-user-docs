/**
 * Auth route protection — waits for session to load, then redirects if not logged in
 */
import { CALLBACK_URL_KEY } from "@/lib/auth/data";
import { appState } from "@/store/appStore";
import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

const createAuthProtecter = () => {
	const navigate = useNavigate();
	const location = useLocation();

	createEffect(() => {
		const status = appState.session.status;

		// Wait until session is resolved (not "init")
		if (status === "init") return;

		// Not logged in → redirect to login
		if (status === "unauthorized") {
			return navigate(`/login?${CALLBACK_URL_KEY}=${location.pathname}`, { replace: true });
		}
	});

	return true;
};

export default createAuthProtecter;
