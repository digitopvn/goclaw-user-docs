import { defineConfig } from "vitepress";

export default defineConfig({
  title: "GoClaw Docs",
  description: "GoClaw AI Agent Gateway - User Documentation",

  locales: {
    en: {
      label: "English",
      lang: "en",
      link: "/en/",
      themeConfig: {
        nav: [
          { text: "Guide", link: "/en/getting-started/01-introduction" },
          { text: "API Reference", link: "/en/reference/01-api-reference" },
        ],
        sidebar: {
          "/en/": [
            {
              text: "Getting Started",
              items: [
                { text: "Introduction", link: "/en/getting-started/01-introduction" },
                { text: "Installation", link: "/en/getting-started/02-installation" },
                { text: "Sign In & Select Tenant", link: "/en/getting-started/03-login" },
                { text: "Setup Wizard & Dashboard", link: "/en/getting-started/04-setup-wizard" },
              ],
            },
            {
              text: "Chat & Sessions",
              items: [
                { text: "Basic Chat", link: "/en/chat-and-sessions/01-basic-chat" },
                { text: "Managing Sessions", link: "/en/chat-and-sessions/02-session-management" },
                { text: "Channels", link: "/en/chat-and-sessions/03-channels" },
              ],
            },
            {
              text: "Agents",
              items: [
                { text: "Agents Overview", link: "/en/agents/01-agents-overview" },
                { text: "Agent Configuration", link: "/en/agents/02-agent-config" },
                { text: "Skills", link: "/en/agents/03-skills" },
                { text: "Codex Pool", link: "/en/agents/04-codex-pool" },
              ],
            },
            {
              text: "Teams",
              items: [
                { text: "Agent Teams", link: "/en/teams/01-teams" },
                { text: "Contacts", link: "/en/teams/02-contacts" },
              ],
            },
            {
              text: "Files & Media",
              items: [
                { text: "Files and Media", link: "/en/files-and-media/01-files-and-media" },
              ],
            },
            {
              text: "Admin",
              collapsed: true,
              items: [
                { text: "LLM Providers", link: "/en/admin/01-providers" },
                { text: "Channels Setup", link: "/en/admin/02-channels-setup" },
                { text: "Tools & MCP Servers", link: "/en/admin/03-tools-and-mcp" },
                { text: "Cron & Scheduling", link: "/en/admin/04-cron" },
                { text: "Security & Access Control", link: "/en/admin/05-security" },
                { text: "Monitoring & Logs", link: "/en/admin/06-monitoring" },
                { text: "Backup & Restore", link: "/en/admin/07-backup" },
                { text: "Text-to-Speech", link: "/en/admin/08-tts" },
                { text: "Memory & Knowledge Graph", link: "/en/admin/09-memory-kg" },
                { text: "System Configuration", link: "/en/admin/10-config" },
                { text: "Tenant Management", link: "/en/admin/11-tenants" },
                { text: "Nodes (Device Pairing)", link: "/en/admin/12-nodes" },
                { text: "Pending Messages", link: "/en/admin/13-pending-messages" },
              ],
            },
            {
              text: "Reference",
              collapsed: true,
              items: [
                { text: "HTTP REST API", link: "/en/reference/01-api-reference" },
                { text: "WebSocket RPC", link: "/en/reference/02-websocket-rpc" },
                { text: "Configuration Reference", link: "/en/reference/03-configuration" },
                { text: "Desktop Edition (Lite)", link: "/en/reference/04-desktop-lite" },
              ],
            },
          ],
        },
      },
    },
    vi: {
      label: "Tiếng Việt",
      lang: "vi",
      link: "/vi/",
      themeConfig: {
        nav: [
          { text: "Hướng dẫn", link: "/vi/getting-started/01-gioi-thieu" },
          { text: "API", link: "/vi/reference/01-api-reference" },
        ],
        sidebar: {
          "/vi/": [
            {
              text: "Bắt đầu",
              items: [
                { text: "Giới thiệu GoClaw", link: "/vi/getting-started/01-gioi-thieu" },
                { text: "Cài đặt và khởi động", link: "/vi/getting-started/02-cai-dat" },
                { text: "Đăng nhập và chọn tổ chức", link: "/vi/getting-started/03-dang-nhap" },
                { text: "Setup Wizard và Dashboard", link: "/vi/getting-started/04-setup-wizard" },
              ],
            },
            {
              text: "Chat và Sessions",
              items: [
                { text: "Chat cơ bản", link: "/vi/chat-and-sessions/01-chat-co-ban" },
                { text: "Quản lý Sessions", link: "/vi/chat-and-sessions/02-quan-ly-sessions" },
                { text: "Kênh kết nối", link: "/vi/chat-and-sessions/03-kenh-ket-noi" },
              ],
            },
            {
              text: "Agents",
              items: [
                { text: "Tổng quan về Agents", link: "/vi/agents/01-tong-quan-agents" },
                { text: "Cấu hình Agent", link: "/vi/agents/02-cau-hinh-agent" },
                { text: "Skills (Kỹ năng)", link: "/vi/agents/03-skills" },
                { text: "Codex Pool", link: "/vi/agents/04-codex-pool" },
              ],
            },
            {
              text: "Đội nhóm",
              items: [
                { text: "Agent Teams", link: "/vi/teams/01-doi-nhom" },
                { text: "Danh bạ liên hệ", link: "/vi/teams/02-contacts" },
              ],
            },
            {
              text: "File và Media",
              items: [
                { text: "File và Media", link: "/vi/files-and-media/01-file-va-media" },
              ],
            },
            {
              text: "Quản trị",
              collapsed: true,
              items: [
                { text: "Cấu hình LLM Providers", link: "/vi/admin/01-providers" },
                { text: "Cấu hình Channels", link: "/vi/admin/02-channels-setup" },
                { text: "Tools và MCP Servers", link: "/vi/admin/03-tools-va-mcp" },
                { text: "Cron và lịch trình", link: "/vi/admin/04-cron" },
                { text: "Bảo mật và phân quyền", link: "/vi/admin/05-bao-mat" },
                { text: "Theo dõi và Logs", link: "/vi/admin/06-theo-doi" },
                { text: "Sao lưu và khôi phục", link: "/vi/admin/07-sao-luu" },
                { text: "Text-to-Speech", link: "/vi/admin/08-tts" },
                { text: "Bộ nhớ và đồ thị tri thức", link: "/vi/admin/09-memory-kg" },
                { text: "Cấu hình hệ thống", link: "/vi/admin/10-config" },
                { text: "Quản lý tổ chức", link: "/vi/admin/11-tenants" },
                { text: "Nodes (Ghép nối thiết bị)", link: "/vi/admin/12-nodes" },
                { text: "Tin nhắn chờ xử lý", link: "/vi/admin/13-pending-messages" },
              ],
            },
            {
              text: "Tham chiếu",
              collapsed: true,
              items: [
                { text: "HTTP REST API", link: "/vi/reference/01-api-reference" },
                { text: "WebSocket RPC", link: "/vi/reference/02-websocket-rpc" },
                { text: "Cấu hình tham chiếu", link: "/vi/reference/03-cau-hinh" },
                { text: "Phiên bản Desktop (Lite)", link: "/vi/reference/04-desktop-lite" },
              ],
            },
          ],
        },
      },
    },
  },

  themeConfig: {
    search: {
      provider: "local",
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/nextlevelbuilder/goclaw" },
    ],
  },
});
