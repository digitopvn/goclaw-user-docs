/**
 * Server action: get sidebar navigation tree by scanning filesystem
 * Cached in memory — scans once per locale, instant on subsequent calls
 */
"use server";

import * as fs from "fs";
import * as path from "path";

/** In-memory cache: locale → SidebarSection[] */
const sidebarCache = new Map<string, SidebarSection[]>();

export interface SidebarItem {
	slug: string;
	title: string;
	order: number;
}

export interface SidebarSection {
	section: string;
	label: string;
	items: SidebarItem[];
}

/** Section display labels */
const SECTION_LABELS: Record<string, string> = {
	"getting-started": "Getting Started",
	"chat-and-sessions": "Chat & Sessions",
	agents: "Agents",
	teams: "Teams",
	"files-and-media": "Files & Media",
	admin: "Admin",
	reference: "Reference",
};

/** Section display order */
const SECTION_ORDER = [
	"getting-started",
	"chat-and-sessions",
	"agents",
	"teams",
	"files-and-media",
	"admin",
	"reference",
];

/** Resolve content directory */
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

/** Extract title from first # heading in markdown file */
function extractTitle(filePath: string): string {
	try {
		const content = fs.readFileSync(filePath, "utf-8");
		const match = content.match(/^#\s+(.+)/m);
		return match ? match[1].trim() : "Untitled";
	} catch {
		return "Untitled";
	}
}

/** Parse filename: "01-introduction.md" → { order: 1, slug: "introduction" } */
function parseFilename(filename: string): { order: number; slug: string } {
	const name = filename.replace(/\.md$/, "");
	const match = name.match(/^(\d+)-(.+)/);
	if (match) return { order: parseInt(match[1], 10), slug: match[2] };
	return { order: 0, slug: name };
}

export async function getSidebarAction(locale: string): Promise<SidebarSection[]> {
	// Return from cache if available
	if (sidebarCache.has(locale)) {
		return sidebarCache.get(locale)!;
	}

	const contentDir = getContentDir();
	const localeDir = path.join(contentDir, locale);

	if (!fs.existsSync(localeDir)) return [];

	const entries = fs.readdirSync(localeDir, { withFileTypes: true });
	const grouped = new Map<string, SidebarItem[]>();

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;
		const section = entry.name;
		const sectionDir = path.join(localeDir, section);
		const files = fs.readdirSync(sectionDir).filter((f) => f.endsWith(".md"));

		const items: SidebarItem[] = files.map((file) => {
			const { order, slug } = parseFilename(file);
			const title = extractTitle(path.join(sectionDir, file));
			return { slug, title, order };
		});

		items.sort((a, b) => a.order - b.order);
		grouped.set(section, items);
	}

	// Sort sections by predefined order
	const sections: SidebarSection[] = [];
	for (const key of SECTION_ORDER) {
		const items = grouped.get(key);
		if (items) {
			sections.push({ section: key, label: SECTION_LABELS[key] || key, items });
			grouped.delete(key);
		}
	}
	// Append remaining sections
	for (const [key, items] of grouped) {
		sections.push({ section: key, label: SECTION_LABELS[key] || key, items });
	}

	sidebarCache.set(locale, sections);
	return sections;
}
