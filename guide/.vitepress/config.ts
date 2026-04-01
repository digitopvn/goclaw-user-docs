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
          { text: "Guide", link: "/en/getting-started/01-gioi-thieu" },
          { text: "API Reference", link: "/en/reference/01-api-reference" },
        ],
        sidebar: {
          "/en/": [
            {
              text: "Getting Started",
              items: [
                { text: "Introduction", link: "/en/getting-started/01-gioi-thieu" },
                { text: "Installation", link: "/en/getting-started/02-cai-dat" },
                { text: "Sign In & Select Tenant", link: "/en/getting-started/03-dang-nhap" },
                { text: "Setup Wizard & Dashboard", link: "/en/getting-started/04-setup-wizard" },
              ],
            },
            {
              text: "Chat & Sessions",
              items: [
                { text: "Basic Chat", link: "/en/chat-and-sessions/01-chat-co-ban" },
                { text: "Managing Sessions", link: "/en/chat-and-sessions/02-quan-ly-sessions" },
                { text: "Channels", link: "/en/chat-and-sessions/03-kenh-ket-noi" },
              ],
            },
            {
              text: "Agents",
              items: [
                { text: "Agents Overview", link: "/en/agents/01-tong-quan-agents" },
                { text: "Agent Configuration", link: "/en/agents/02-cau-hinh-agent" },
                { text: "Skills", link: "/en/agents/03-skills" },
                { text: "Codex Pool", link: "/en/agents/04-codex-pool" },
              ],
            },
            {
              text: "Teams",
              items: [
                { text: "Agent Teams", link: "/en/teams/01-doi-nhom" },
                { text: "Contacts", link: "/en/teams/02-contacts" },
              ],
            },
            {
              text: "Files & Media",
              items: [
                { text: "Files and Media", link: "/en/files-and-media/01-file-va-media" },
              ],
            },
            {
              text: "Admin",
              collapsed: true,
              items: [
                { text: "LLM Providers", link: "/en/admin/01-providers" },
                { text: "Channels Setup", link: "/en/admin/02-channels-setup" },
                { text: "Tools & MCP Servers", link: "/en/admin/03-tools-va-mcp" },
                { text: "Cron & Scheduling", link: "/en/admin/04-cron" },
                { text: "Security & Access Control", link: "/en/admin/05-bao-mat" },
                { text: "Monitoring & Logs", link: "/en/admin/06-theo-doi" },
                { text: "Backup & Restore", link: "/en/admin/07-sao-luu" },
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
                { text: "Configuration Reference", link: "/en/reference/03-cau-hinh" },
                { text: "Desktop Edition (Lite)", link: "/en/reference/04-desktop-lite" },
              ],
            },
          ],
        },
      },
    },
    vi: {
      label: "Tieng Viet",
      lang: "vi",
      link: "/vi/",
      themeConfig: {
        nav: [
          { text: "Huong dan", link: "/vi/getting-started/01-gioi-thieu" },
          { text: "API", link: "/vi/reference/01-api-reference" },
        ],
        sidebar: {
          "/vi/": [
            {
              text: "Bat dau",
              items: [
                { text: "Gioi thieu GoClaw", link: "/vi/getting-started/01-gioi-thieu" },
                { text: "Cai dat va khoi dong", link: "/vi/getting-started/02-cai-dat" },
                { text: "Dang nhap va chon to chuc", link: "/vi/getting-started/03-dang-nhap" },
                { text: "Setup Wizard va Dashboard", link: "/vi/getting-started/04-setup-wizard" },
              ],
            },
            {
              text: "Chat va Sessions",
              items: [
                { text: "Chat co ban", link: "/vi/chat-and-sessions/01-chat-co-ban" },
                { text: "Quan ly Sessions", link: "/vi/chat-and-sessions/02-quan-ly-sessions" },
                { text: "Kenh ket noi", link: "/vi/chat-and-sessions/03-kenh-ket-noi" },
              ],
            },
            {
              text: "Agents",
              items: [
                { text: "Tong quan ve Agents", link: "/vi/agents/01-tong-quan-agents" },
                { text: "Cau hinh Agent", link: "/vi/agents/02-cau-hinh-agent" },
                { text: "Skills (Ky nang)", link: "/vi/agents/03-skills" },
                { text: "Codex Pool", link: "/vi/agents/04-codex-pool" },
              ],
            },
            {
              text: "Doi nhom",
              items: [
                { text: "Agent Teams", link: "/vi/teams/01-doi-nhom" },
                { text: "Danh ba lien he", link: "/vi/teams/02-contacts" },
              ],
            },
            {
              text: "File va Media",
              items: [
                { text: "File va Media", link: "/vi/files-and-media/01-file-va-media" },
              ],
            },
            {
              text: "Quan tri",
              collapsed: true,
              items: [
                { text: "Cau hinh LLM Providers", link: "/vi/admin/01-providers" },
                { text: "Cau hinh Channels", link: "/vi/admin/02-channels-setup" },
                { text: "Tools va MCP Servers", link: "/vi/admin/03-tools-va-mcp" },
                { text: "Cron va lich trinh", link: "/vi/admin/04-cron" },
                { text: "Bao mat va phan quyen", link: "/vi/admin/05-bao-mat" },
                { text: "Theo doi va Logs", link: "/vi/admin/06-theo-doi" },
                { text: "Sao luu va khoi phuc", link: "/vi/admin/07-sao-luu" },
                { text: "Text-to-Speech", link: "/vi/admin/08-tts" },
                { text: "Bo nho va do thi tri thuc", link: "/vi/admin/09-memory-kg" },
                { text: "Cau hinh he thong", link: "/vi/admin/10-config" },
                { text: "Quan ly to chuc", link: "/vi/admin/11-tenants" },
                { text: "Nodes (Ghep noi thiet bi)", link: "/vi/admin/12-nodes" },
                { text: "Tin nhan cho xu ly", link: "/vi/admin/13-pending-messages" },
              ],
            },
            {
              text: "Tham chieu",
              collapsed: true,
              items: [
                { text: "HTTP REST API", link: "/vi/reference/01-api-reference" },
                { text: "WebSocket RPC", link: "/vi/reference/02-websocket-rpc" },
                { text: "Cau hinh tham chieu", link: "/vi/reference/03-cau-hinh" },
                { text: "Phien ban Desktop (Lite)", link: "/vi/reference/04-desktop-lite" },
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
