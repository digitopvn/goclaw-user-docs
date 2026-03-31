import Link from 'next/link';
import {
  Rocket,
  MessageCircle,
  Bot,
  Users,
  FileImage,
  Settings,
  BookOpen,
} from 'lucide-react';
/* eslint-disable @next/next/no-img-element */

const sections = [
  {
    title: 'Bắt đầu',
    description: 'Cài đặt, đăng nhập và thiết lập GoClaw lần đầu',
    href: '/docs/getting-started/01-gioi-thieu',
    icon: Rocket,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-100 dark:border-blue-900',
  },
  {
    title: 'Chat & Sessions',
    description: 'Tương tác với AI agents qua chat và quản lý phiên làm việc',
    href: '/docs/chat-and-sessions',
    icon: MessageCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-100 dark:border-emerald-900',
  },
  {
    title: 'Agents',
    description: 'Cấu hình, tùy chỉnh và quản lý AI agents của bạn',
    href: '/docs/agents/01-tong-quan-agents',
    icon: Bot,
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    border: 'border-violet-100 dark:border-violet-900',
  },
  {
    title: 'Đội nhóm',
    description: 'Làm việc nhóm, chia sẻ agents và quản lý contacts',
    href: '/docs/teams/01-doi-nhom',
    icon: Users,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    border: 'border-orange-100 dark:border-orange-900',
  },
  {
    title: 'Files & Media',
    description: 'Tải lên, quản lý và chia sẻ tài liệu với AI',
    href: '/docs/files-and-media',
    icon: FileImage,
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    border: 'border-pink-100 dark:border-pink-900',
  },
  {
    title: 'Quản trị',
    description: 'Cài đặt nâng cao, phân quyền và quản lý hệ thống',
    href: '/docs/admin',
    icon: Settings,
    color: 'text-slate-500',
    bg: 'bg-slate-50 dark:bg-slate-950/40',
    border: 'border-slate-100 dark:border-slate-800',
  },
  {
    title: 'Tham khảo',
    description: 'API reference, thuật ngữ và tài liệu kỹ thuật chi tiết',
    href: '/docs/reference',
    icon: BookOpen,
    color: 'text-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    border: 'border-cyan-100 dark:border-cyan-900',
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 bg-gradient-to-b from-fd-primary/5 to-transparent">
        {/* Logo */}
        <img
          src="https://goclaw.sh/logo/goclaw-icon.svg"
          alt="GoClaw"
          className="mb-6 w-20 h-20"
        />

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          GoClaw Documentation
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-xl mb-8">
          Hướng dẫn sử dụng GoClaw — nền tảng AI Agent đa người dùng dành cho doanh nghiệp
        </p>

        {/* Language selector */}
        <div className="flex gap-4 mb-8">
          <Link
            href="/docs"
            className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-fd-primary bg-fd-primary/5 hover:bg-fd-primary/10 transition-colors"
          >
            <span className="text-lg">🇻🇳</span>
            <span className="font-semibold">Tiếng Việt</span>
          </Link>
          <Link
            href="/en/docs"
            className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-fd-border hover:border-fd-primary hover:bg-fd-primary/5 transition-colors"
          >
            <span className="text-lg">🇬🇧</span>
            <span className="font-semibold">English</span>
          </Link>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/docs/getting-started/01-gioi-thieu"
            className="px-6 py-2.5 bg-fd-primary text-fd-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Bắt đầu →
          </Link>
          <Link
            href="/en/docs"
            className="px-6 py-2.5 rounded-lg font-medium border border-fd-border hover:bg-fd-accent transition-colors"
          >
            English Docs
          </Link>
        </div>
      </section>

      {/* Feature cards grid */}
      <section className="px-4 pb-16 max-w-5xl mx-auto w-full">
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-fd-muted-foreground mb-8">
          Nội dung tài liệu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className={`group flex flex-col gap-3 p-5 rounded-xl border ${s.border} ${s.bg} hover:shadow-md transition-all hover:-translate-y-0.5`}
              >
                <div className={`w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-fd-background/60 shadow-sm`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-fd-muted-foreground mt-1 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-fd-border py-6 px-4 text-center text-sm text-fd-muted-foreground">
        <div className="flex items-center justify-center gap-4">
          <span>© {new Date().getFullYear()} GoClaw</span>
          <span>·</span>
          <a
            href="https://github.com/digitopvn/goclaw-user-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-fd-foreground transition-colors"
          >
            GitHub
          </a>
          <span>·</span>
          <Link href="/docs" className="hover:text-fd-foreground transition-colors">
            Docs
          </Link>
        </div>
      </footer>
    </main>
  );
}
