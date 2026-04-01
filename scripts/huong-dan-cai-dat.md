trỏ domain

chạy 
curl -sSL -H "Cache-Control: no-cache" https://f.ult.vn/test/setup.sh | bash -s -- --mode docker

trả lời câu hỏi

── PostgreSQL ──

  1) Bundled   — spin up a postgres container automatically (easiest)
  2) External  — connect to your own PostgreSQL (managed service, existing server)

  Choice [1-2, default=1]: 1

  Include web dashboard UI? [Y/n]: y

── Domain & SSL ──

  Set up custom domain with Nginx + SSL? [Y/n]: y
  Domain (e.g. api.example.com): s77.goclaw.ult.vn
  Email for SSL certificate: tamlam@wearetopgroup.com

  ⚠  Docker is not installed.
  Install Docker automatically? [Y/n]: y