/**
 * Server-side markdown rendering pipeline
 * Pre-processes YouTube components, then remark → rehype-raw → sanitize → stringify
 */
"use server";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

/** Convert VitePress <YouTube id="xxx" title="yyy" /> to iframe HTML */
function preprocessYouTube(markdown: string): string {
	return markdown.replace(
		/<YouTube\s+id="([^"]+)"(?:\s+title="([^"]*)")?\s*\/>/g,
		(_match, id: string, title: string) => {
			const t = title || "YouTube video";
			return `<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${id}" title="${t}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;aspect-ratio:16/9;border-radius:8px;"></iframe></div>`;
		},
	);
}

/** Sanitization schema — allows YouTube iframes, tables, common HTML */
const sanitizeSchema = {
	...defaultSchema,
	tagNames: [
		...(defaultSchema.tagNames || []),
		"iframe", "div", "span",
		"table", "thead", "tbody", "tr", "th", "td", "caption", "colgroup", "col",
	],
	attributes: {
		...defaultSchema.attributes,
		iframe: ["src", "title", "frameborder", "allow", "allowfullscreen", "style"],
		div: [...(defaultSchema.attributes?.div || []), "class", "style"],
		span: [...(defaultSchema.attributes?.span || []), "class", "style"],
		th: ["align", "valign", "scope", "colspan", "rowspan"],
		td: ["align", "valign", "colspan", "rowspan"],
		table: ["class"],
		col: ["span", "width"],
	},
};

/** Render markdown string to HTML (server-side only) */
export async function renderMarkdown(markdown: string): Promise<string> {
	const processed = preprocessYouTube(markdown);

	const result = await unified()
		.use(remarkParse)
		.use(remarkGfm) // GFM: tables, strikethrough, autolinks, task lists
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw) // Parse raw HTML into proper hast nodes
		.use(rehypeSanitize, sanitizeSchema)
		.use(rehypeStringify)
		.process(processed);

	return String(result);
}
