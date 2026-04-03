/**
 * Server action: fetch a single document from filesystem
 * Uses in-memory cache — first read from fs, subsequent reads from cache
 */
"use server";

import * as fs from "fs";
import * as path from "path";
import { renderMarkdown } from "@/lib/markdown/render-markdown";

export interface DocResult {
	title: string;
	htmlContent: string;
	section: string;
	slug: string;
	locale: string;
}

/** In-memory cache: "locale/section/slug" → DocResult */
const docCache = new Map<string, DocResult | null>();

/** Parse markdown: extract title from first # heading */
function parseMarkdown(content: string): { title: string; body: string } {
	const lines = content.split("\n");
	let title = "Untitled";
	let bodyStart = 0;

	for (let i = 0; i < lines.length; i++) {
		const match = lines[i].match(/^#\s+(.+)/);
		if (match) {
			title = match[1].trim();
			bodyStart = i + 1;
			break;
		}
	}

	return { title, body: lines.slice(bodyStart).join("\n").trim() };
}

/** Resolve content directory — works in both dev and production */
function getContentDir(): string {
	const candidates = [
		path.join(process.cwd(), "src", "content"),
		path.join(process.cwd(), "content"),
	];
	for (const dir of candidates) {
		if (fs.existsSync(dir)) return dir;
	}
	return candidates[0];
}

export async function getDocumentAction(
	locale: string,
	section: string,
	slug: string,
): Promise<DocResult | null> {
	const cacheKey = `${locale}/${section}/${slug}`;

	// Return from cache if available
	if (docCache.has(cacheKey)) {
		return docCache.get(cacheKey)!;
	}

	const contentDir = getContentDir();
	const filePath = path.join(contentDir, locale, section, `${slug}.md`);

	// Try exact path, then scan for numbered prefix (01-slug.md)
	let resolvedPath = filePath;
	if (!fs.existsSync(resolvedPath)) {
		const sectionDir = path.join(contentDir, locale, section);
		if (!fs.existsSync(sectionDir)) {
			docCache.set(cacheKey, null);
			return null;
		}

		const files = fs.readdirSync(sectionDir);
		const match = files.find((f) => f.replace(/^\d+-/, "").replace(/\.md$/, "") === slug);
		if (!match) {
			docCache.set(cacheKey, null);
			return null;
		}
		resolvedPath = path.join(sectionDir, match);
	}

	const raw = fs.readFileSync(resolvedPath, "utf-8");
	const { title, body } = parseMarkdown(raw);
	const htmlContent = await renderMarkdown(body);

	const result: DocResult = { title, htmlContent, section, slug, locale };
	docCache.set(cacheKey, result);
	return result;
}
