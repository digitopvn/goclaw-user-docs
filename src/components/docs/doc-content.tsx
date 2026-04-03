/**
 * Document content renderer — displays pre-rendered HTML from server
 */
import { Component } from "solid-js";

interface DocContentProps {
	title: string;
	htmlContent: string;
}

const DocContent: Component<DocContentProps> = (props) => {
	return (
		<article class="vp-doc">
			<h1>{props.title}</h1>
			{/* eslint-disable-next-line solid/no-innerhtml */}
			<div innerHTML={props.htmlContent} />
		</article>
	);
};

export default DocContent;
