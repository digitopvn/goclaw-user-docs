/**
 * Admin route protection — redirects non-admin users
 */
import { CALLBACK_URL_KEY } from "@/lib/auth/data";
import { appState } from "@/store/appStore";
import { isNotLogin } from "@/store/authAction";
import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

const createAdminProtecter = () => {
	const navigate = useNavigate();
	const location = useLocation();

	createEffect(() => {
		if (isNotLogin()) {
			return navigate(`/login?${CALLBACK_URL_KEY}=${location.pathname}`, { replace: true });
		}

		if (appState.user?.role === "admin") return;

		// Non-admin user — redirect to docs
		navigate("/en/docs", { replace: true });
	});

	return true;
};

export default createAdminProtecter;
