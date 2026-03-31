import { sourceEn } from '@/lib/source-en';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import Link from 'next/link';
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={sourceEn.pageTree}
      nav={{
        title: (
          <span className="flex items-center gap-2">
            <img src="https://goclaw.sh/logo/goclaw-icon.svg" alt="GoClaw" className="w-6 h-6" />
            <span className="font-semibold">GoClaw Docs</span>
            <span className="text-xs text-fd-muted-foreground">Enterprise AI Agent Platform</span>
          </span>
        ),
        url: '/',
        children: (
          <div className="flex items-center gap-2">
            <Link href="/docs" className="px-2 py-1 text-xs font-semibold rounded hover:bg-fd-accent transition-colors">
              VI
            </Link>
            <Link href="/en/docs" className="px-2 py-1 text-xs font-semibold rounded bg-fd-primary text-fd-primary-foreground">
              EN
            </Link>
            <a href="https://goclaw.sh" target="_blank" rel="noopener noreferrer"
              className="px-2 py-1 text-xs hover:text-fd-foreground text-fd-muted-foreground transition-colors">
              Home
            </a>
            <a href="https://github.com/digitopvn/goclaw-user-docs" target="_blank" rel="noopener noreferrer"
              className="hover:text-fd-foreground text-fd-muted-foreground transition-colors">
              <GithubIcon />
            </a>
          </div>
        ),
      }}
      sidebar={{
        defaultOpenLevel: 1,
        footer: (
          <div className="border-t border-fd-border pt-4 pb-2 px-2 text-xs text-fd-muted-foreground space-y-1">
            <div className="flex items-center justify-between">
              <span>© {new Date().getFullYear()} GoClaw</span>
              <a href="https://goclaw.sh" className="hover:text-fd-foreground transition-colors">goclaw.sh</a>
            </div>
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
