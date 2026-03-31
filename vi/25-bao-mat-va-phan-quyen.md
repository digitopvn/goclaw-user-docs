# 25 - Bao Mat va Phan Quyen

Huong dan quan tri he thong bao mat va phan quyen trong GoClaw.

---

## 1. Authentication — Xac Thuc

GoClaw ho tro 3 phuong thuc xac thuc, uu tien theo thu tu:

1. **Gateway token** — token chinh cau hinh trong `config.json` (`gateway.token`), cap quyen Admin toan he thong
2. **API key** — khoa co pham vi gioi han, cap quyen theo scopes da gan
3. **Browser pairing** — trinh duyet duoc cap quyen qua QR/code, cap quyen Operator (chi HTTP)

**Su dung gateway token**:
```
Authorization: Bearer <gateway-token>
```

**Backward compatibility**: Neu khong cau hinh gateway token, he thong chap nhan tat ca request khong xac thuc (dev mode). Khi gan token, moi request phai xac thuc.

---

## 2. API Keys — Khoa API

API keys dung cho CI/CD, tich hop ben ngoai, hoac uy quyen co pham vi gioi han.

### Format Khoa

```
goclaw_a1b2c3d4e5f6789012345678901234567890abcdef
```
Prefix `goclaw_` + 32 ky tu hex (128 bit entropy).

### Tao API Key

1. Vao **System > API Keys** (can quyen Admin)
2. Nhan **Create Key**
3. Dien ten, chon scopes, dat han su dung (tuy chon)
4. **Sao chep khoa ngay** — chi hien thi 1 lan duy nhat khi tao

### Thu Hoi API Key

Vao danh sach API Keys, click **Revoke** — key mat hieu luc ngay lap tuc.

### Bao Mat Luu Tru

- Raw key **khong bao gio luu** trong database — chi luu SHA-256 hash
- Xac thuc dung `crypto/subtle.ConstantTimeCompare` (tranh timing attack)
- Cache in-memory 5 phut de giam tai database, ho tro negative caching

---

## 3. RBAC — 3 Cap Quyen

| Role | Cap | Quyen Chinh |
|------|:---:|------------|
| Viewer | 1 | Xem danh sach agents, sessions, skills, trang thai he thong |
| Operator | 2 | Viewer + gui chat, quan ly sessions, chay cron jobs, cap nhat skills |
| Admin | 3 | Operator + sua cau hinh, tao/xoa agents, quan ly kenh ket noi, duyet device pairing |

Roles phan cap: Admin bao gom tat ca quyen Operator, Operator bao gom tat ca quyen Viewer.

### Scopes cho API Key

| Scope | Quyen |
|-------|-------|
| `operator.admin` | Toan quyen, tuong duong gateway token |
| `operator.read` | Chi doc (Viewer) |
| `operator.write` | Doc + ghi (Operator) |
| `operator.approvals` | Duyet/tu choi lenh shell |
| `operator.pairing` | Quan ly browser device pairing |

---

## 4. 5 Lop Bao Ve

GoClaw ap dung bao mat theo chieu sau (defense-in-depth) voi 5 lop doc lap:

| Lop | Co Che | Chi Tiet |
|-----|--------|---------|
| 1 - Transport | CORS, gioi han kich thuoc message | WebSocket: kiem tra `allowed_origins`; WS max 512KB; HTTP body max 1MB |
| 2 - Input | Phat hien injection | 6 mau: ignore_instructions, role_override, system_tags, instruction_injection, null_bytes, delimiter_escape |
| 3 - Tool | Shell deny, path traversal, SSRF | Cam lenh nguy hiem, kiem tra thu muc, bao ve DNS rebinding |
| 4 - Output | Scrub credentials | Xoa token LLM, GitHub, AWS, connection strings khoi output |
| 5 - Isolation | Workspace per-user, Docker sandbox | Moi user co thu muc rieng; shell co the chay trong container cach ly |

---

## 5. Rate Limiting

### Gateway Level

| Tham So | Mac Dinh | Mo Ta |
|---------|----------|-------|
| `rate_limit_rpm` | 0 (tat) | So request toi da moi phut moi user/IP |
| Burst | 5 | So request cho phep vuot gioi han tuc thoi |

Cau hinh trong `config.json`: `gateway.rate_limit_rpm`. Dat gia tri duong de bat. Request vuot gioi han nhan HTTP 429 hoac WebSocket error.

### Tool Level

Tool call duoc ghi nhan theo sliding window 1 gio. Khi vuot `maxPerHour`, tra loi loi rate limit cho agent.

---

## 6. Input Guard — Phat Hien Injection

He thong quet 6 mau prompt injection truoc khi xu ly:

| Mau | Vi Du Bi Phat Hien |
|-----|--------------------|
| `ignore_instructions` | "ignore all previous instructions" |
| `role_override` | "you are now...", "pretend you are..." |
| `system_tags` | `<system>`, `[SYSTEM]`, `[INST]` |
| `instruction_injection` | "new instructions:", "override:" |
| `null_bytes` | Ky tu `\x00` (obfuscation) |
| `delimiter_escape` | `</instructions>`, "end of system" |

**Hanh dong** (`gateway.injection_action`):

| Gia Tri | Hanh Vi |
|---------|---------|
| `off` | Tat phat hien |
| `log` | Ghi log, tiep tuc xu ly |
| `warn` (mac dinh) | Ghi warning log, tiep tuc xu ly |
| `block` | Chan request, tra loi loi |

---

## 7. Shell Deny Patterns

7 nhom lenh bi chan bat ke cau hinh:

| Nhom | Vi Du |
|------|-------|
| Xoa file nguy hiem | `rm -rf`, `del /f`, `rmdir /s` |
| Thao tac dia | `mkfs`, `dd if=`, ghi vao `/dev/sd*` |
| Lenh he thong | `shutdown`, `reboot`, `poweroff` |
| Fork bomb | `:(){ ... };:` |
| Remote code execution | `curl | sh`, `wget -O - | sh` |
| Reverse shell | `/dev/tcp/`, `nc -e` |
| Eval injection | `eval $()`, `base64 -d | sh` |

---

## 8. SSRF Protection

Tat ca URL duoc kiem tra 3 buoc truoc khi fetch:

1. Kiem tra hostname bi chan: `localhost`, `*.local`, `*.internal`, `metadata.google.internal`
2. Kiem tra dai IP noi bo: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.0/8`, `169.254.0.0/16`
3. DNS pinning: resolve domain, kiem tra tung IP ket qua (ke ca redirect target)

---

## 9. Ma Hoa AES-256-GCM

Cac secret luu trong PostgreSQL duoc ma hoa AES-256-GCM:

| Du Lieu | Bang | Cot |
|---------|------|-----|
| API key cua LLM provider | `llm_providers` | `api_key` |
| API key cua MCP server | `mcp_servers` | `api_key` |
| Env vars cua custom tool | `custom_tools` | `env` |

**Khoa ma hoa**: cung cap qua bien moi truong `GOCLAW_ENCRYPTION_KEY`.

Format luu tru: `"aes-gcm:" + base64(12-byte nonce + ciphertext + GCM tag)`.

---

## Xem Them

- [09-security.md](../09-security.md) — Chi tiet ky thuat bao mat
- [20-api-keys-auth.md](../20-api-keys-auth.md) — API keys va authentication flow
- [23-tools-va-mcp.md](./23-tools-va-mcp.md) — Exec approval va tool security
