/** Private auth root — redirect to English docs */
import { Navigate } from "@solidjs/router";

export default function PrivateRoot() {
	return <Navigate href="/en/docs" />;
}
