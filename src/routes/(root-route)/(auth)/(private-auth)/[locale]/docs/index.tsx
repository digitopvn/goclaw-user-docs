/**
 * Docs landing — redirects to first document in first section
 */
import { Navigate, useParams } from "@solidjs/router";

export default function DocsLanding() {
	const params = useParams<{ locale: string }>();

	// Redirect to first doc (getting-started/introduction)
	return <Navigate href={`/${params.locale}/docs/getting-started/introduction`} />;
}
