/** Root index — redirect to English docs */
import { Navigate } from "@solidjs/router";

export default function Page() {
	return <Navigate href="/en/docs" />;
}
