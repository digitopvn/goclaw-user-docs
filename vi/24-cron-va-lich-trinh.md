# 24 - Cron va Lich Trinh

Huong dan quan tri he thong cron va lich trinh tu dong trong GoClaw.

---

## 1. Cron La Gi

Cron la he thong lich trinh cho phep agent tu dong chay theo thoi gian dat truoc — khong can gui tin nhan thu cong. Moi cron job kich hoat mot agent turn voi mot prompt cu the, chay trong lane rieng (`cron` lane, toi da 30 luong song song).

Ung dung tien biet:
- Bao cao hang ngay tu dong
- Kiem tra dinh ky he thong, dich vu
- Nhac nho lich truc tiep den kenh chat
- Dong bo du lieu theo chu ky

---

## 2. 3 Loai Bieu Thuc Lich

| Loai | Tham So | Vi Du | Hanh Vi |
|------|---------|-------|---------|
| `at` | Thoi diem cu the (epoch ms) | Ngay mai 15:00 | Chay 1 lan, tu xoa sau khi chay |
| `every` | Khoang cach lap lai (ms) | `1800000` (30 phut) | Lap lai theo khoang cach co dinh |
| `cron` | Bieu thuc 5 truong | `"0 9 * * 1-5"` | Lich linh hoat theo cron expression |

**Cron expression** 5 truong: `phut gio ngay-thang thang ngay-trong-tuan`

Vi du bieu thuc hay dung:
- `"0 9 * * 1-5"` — 9:00 sang cac ngay trong tuan
- `"0 */6 * * *"` — moi 6 tieng
- `"30 8 * * 0"` — Chu nhat 8:30 sang

---

## 3. Tao Cron Job

1. Vao **Cron** trong menu chinh
2. Nhan **New Job**
3. Dien cac truong:
   - **Name**: ten mo ta job
   - **Agent**: chon agent se chay
   - **Prompt/Message**: noi dung tin nhan gui cho agent
   - **Schedule**: chon loai lich (`at` / `every` / `cron`) va nhap gia tri
4. Nhan **Save** — job bat dau hoat dong ngay

**Luu y**: Lane `cron` co toi da 30 jobs chay dong thoi. Cac jobs tren cung session se chay tuan tu (tranh race condition).

---

## 4. Quan Ly Jobs

### Danh Sach Jobs

Trang **Cron** hien thi tat ca jobs voi cac thong tin:
- Trang thai: dang hoat dong / tam dung
- Lich trinh va lan chay ke tiep
- Lan chay gan nhat va ket qua

### Enable / Disable

Bat / tat job ma khong can xoa:
- Click icon toggle tren row hoac vao chi tiet job
- Job bi tat (`Enabled = false`) se bi bo qua trong vong kiem tra dinh ky

### Xoa Job

- Click **Delete** tren row — xac nhan truoc khi xoa
- `at` jobs tu dong xoa sau khi chay xong (`deleteAfterRun = true`)

### Xem Lich Su Chay

Vao chi tiet job de xem **Run Log**:
- Thoi diem chay, thoi gian thuc hien
- Trang thai: thanh cong / that bai
- Output va thong bao loi (neu co)
- He thong luu toi da 200 ban ghi gan nhat trong bo nho

---

## 5. Manual Trigger

Chay thu job ngay lap tuc ma khong can doi den lich:

1. Vao chi tiet job
2. Nhan **Run Now**
3. Xem ket qua trong Run Log

Dung de kiem tra xem job chay dung khong truoc khi dat lich chinh thuc.

---

## 6. Lane-Based Concurrency

GoClaw dung lane de phan tach loai cong viec:

| Lane | Concurrency Mac Dinh | Override Env | Muc Dich |
|------|:-------------------:|--------------|---------|
| `main` | 30 | `GOCLAW_LANE_MAIN` | Chat truc tiep voi user |
| `subagent` | 50 | `GOCLAW_LANE_SUBAGENT` | Subagent duoc spawn boi main agent |
| `team` | 100 | `GOCLAW_LANE_TEAM` | Delegation trong doi nhom |
| `cron` | 30 | `GOCLAW_LANE_CRON` | Cron jobs lich trinh |

Cron jobs khong tranh chap tai nguyen voi chat sessions — moi lane doc lap nhau.

**Per-session serialization**: Neu cung mot session co nhieu cron job can chay, chung se xep hang tuan tu, tranh race condition voi lich su hoi thoai.

---

## 7. Retry Tu Dong

Khi job that bai, he thong tu dong thu lai voi backoff:

| Tham So | Gia Tri Mac Dinh |
|---------|-----------------|
| So lan thu toi da | 3 |
| Delay ban dau | 2 giay |
| Delay toi da | 30 giay |

Cong thuc: `delay = min(2 x 2^lan, 30)` ± 25% jitter. Sau khi het so lan thu, ket qua `error` duoc ghi vao Run Log.

---

## 8. Vi Du Thuc Te

### Bao Cao Hang Ngay

```
Loai: cron
Bieu thuc: "0 8 * * 1-5"
Agent: Analyst Agent
Prompt: "Tao bao cao hoat dong he thong trong 24 gio qua va gui tom tat qua kenh #reports"
```

### Kiem Tra Dinh Ky

```
Loai: every
Khoang cach: 1800000 (30 phut)
Agent: Monitor Agent
Prompt: "Kiem tra trang thai cac service chinh, bao cao neu phat hien bat thuong"
```

---

## Xem Them

- [08-scheduling-cron.md](../08-scheduling-cron.md) — Chi tiet ky thuat scheduler va cron
- [12-agents-va-skills.md](./12-agents-va-skills.md) — Cau hinh agent
