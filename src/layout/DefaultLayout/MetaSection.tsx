/**
 * Meta section — simplified, no external API fetch
 */
import { Title, Meta, Link } from "@solidjs/meta";
import { createMemo, ParentComponent } from "solid-js";
import { appConfig } from "@/config";
import { useLocation } from "@solidjs/router";

interface MetaSectionProps {
	title?: string;
	description?: string;
}

const MetaSection: ParentComponent<MetaSectionProps> = (props) => {
	const location = useLocation();
	const title = createMemo(() => props.title || appConfig.siteName);
	const description = createMemo(() => props.description || appConfig.description);
	const canonicalUrl = () => appConfig.getBaseUrl(location.pathname);

	return (
		<>
			<Title>{title()}</Title>
			<Meta name="description" content={description()} />
			<Meta property="og:type" content="website" />
			<Meta property="og:title" content={title()} />
			<Meta property="og:description" content={description()} />
			<Meta property="og:url" content={canonicalUrl()} />
			<Meta property="og:site_name" content={appConfig.siteName} />
			<Link rel="canonical" href={canonicalUrl()} />
		</>
	);
};

export default MetaSection;
