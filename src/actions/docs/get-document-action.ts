/**
 * Server action: fetch a single document from filesystem
 * Reads from src/content/[locale]/[section]/[slug].md
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
	// In dev: src/content/. In production: check common locations
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
	const contentDir = getContentDir();
	const filePath = path.join(contentDir, locale, section, `${slug}.md`);

	// Try with common filename patterns: slug.md, 01-slug.md, 02-slug.md, etc.
	let resolvedPath = filePath;
	if (!fs.existsSync(resolvedPath)) {
		// Scan directory for file matching slug
		const sectionDir = path.join(contentDir, locale, section);
		if (!fs.existsSync(sectionDir)) return null;

		const files = fs.readdirSync(sectionDir);
		const match = files.find((f) => f.replace(/^\d+-/, "").replace(/\.md$/, "") === slug);
		if (!match) return null;
		resolvedPath = path.join(sectionDir, match);
	}

	const raw = fs.readFileSync(resolvedPath, "utf-8");
	const { title, body } = parseMarkdown(raw);
	const htmlContent = await renderMarkdown(body);

	return { title, htmlContent, section, slug, locale };
}
