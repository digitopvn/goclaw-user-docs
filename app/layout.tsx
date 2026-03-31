import './global.css';
import { Be_Vietnam_Pro } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';

const font = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: { template: '%s | GoClaw Docs', default: 'GoClaw Documentation' },
  description: 'Huong dan su dung GoClaw — Multi-Tenant AI Agent Platform',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={font.className + ' flex flex-col min-h-screen'}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
