# 13 - Doi Nhom (Agent Teams)

## 1. Team la gi?

Mot **agent team** la nhom cac AI agent hop tac voi nhau thong qua mot **task board chung**. Moi team co:

- **Lead agent** — dieu phoi cong viec, tao task, phan cong cho member, tong hop ket qua
- **Member agents** — nhan task, thuc thi doc lap, bao cao ket qua lai

Lead nhan tin nhan tu user, chia viec ra cac task tren board, roi dispatch tung task den dung member. Cac member co the chay **song song** — ket qua duoc gop lai va tra ve user trong mot luot.

---

## 2. Khi nao can dung team?

| Tinh huong | Vi du |
|-----------|-------|
| Research + viet bao cao | Member A tim tai lieu, Member B soan van ban |
| Viet code + review | Member A code, Member B kiem tra loi |
| Tao noi dung da dang | Member A viet caption, Member B tao hinh anh |
| Phan tich nhieu nguon | Moi member xu ly mot tap du lieu rieng |
| Luong duyet (human-in-the-loop) | Task can nguoi duyet truoc khi xong |

---

## 3. Tao team

Tao team trong **Web UI > Teams > New Team**:

1. Dat ten va mo ta team
2. Chon **lead agent** (chi mot lead)
3. Them **member agents** (nhieu thanh vien)
4. Luu — he thong tu dong tao cac delegation link tu lead den tung member

**Lite edition:** toi da 1 team, 5 member.
**Standard edition:** khong gioi han.

---

## 4. Task Board

Task board la noi lead tao task, member nhan va thuc thi. Moi task co:

- **Subject** — tieu de ngan gon
- **Description** — mo ta chi tiet
- **Assignee** — member duoc giao (bat buoc)
- **Priority** — so nguyen, so cao = uu tien hon
- **Status** — xem vong doi duoi

### Vong doi task

```
pending → in_progress → completed
    ↓           ↓
  blocked     in_review → approved → completed
                       → rejected → cancelled
    ↓
  failed → (retry) → pending
```

| Status | Y nghia |
|--------|---------|
| `pending` | Moi tao, cho xu ly |
| `in_progress` | Member dang lam |
| `in_review` | Member gui duyet |
| `completed` | Hoan thanh |
| `blocked` | Dang cho task phu thuoc |
| `failed` | Gap loi / blocker escalation |
| `cancelled` | Bi huy |
| `stale` | Khong co hoat dong trong thoi gian dai |

---

## 5. Task Dependencies (Phu thuoc)

Dat `blocked_by` khi mot task can task khac xong truoc:

- Task se o trang thai `blocked` cho den khi **tat ca** task phu thuoc hoan thanh
- Khi task phu thuoc xong, task dang `blocked` tu dong chuyen sang `pending` va duoc dispatch
- Task bi huy (`cancelled`) cung giai phong phu thuoc

Dung de xay dung luong: viet code → review → deploy.

---

## 6. Comments va Attachments

### Binh luan (comments)

Ca nguoi dung lan agent deu co the them binh luan vao task:

- **Binh luan thuong** — phan hoi, giai thich
- **Blocker comment** — khi agent gap can tro, task tu dong chuyen sang `failed` va lead nhan thong bao escalation

Vi du agent bao blocker:
```
team_tasks(action="comment", task_id="...", text="Khong tim thay tai lieu API", type="blocker")
```

### File dinh kem (attachments)

File tao ra trong qua trinh thuc thi task duoc tu dong:
- Luu vao **team workspace**
- Gan voi task hien tai
- Hien thi tren trang chi tiet task

---

## 7. Delegation giua cac agent

Lead khong giao viec truc tiep qua ham goi — phai thong qua task board:

1. Lead tao task voi `assignee=member`
2. He thong dispatch task den member qua message bus
3. Member thuc thi trong session rieng biet
4. Member goi `team_tasks(action="complete")` khi xong
5. Ket qua gui toi lead, lead tong hop va tra loi user

**Chay song song:** Lead co the tao nhieu task cung luc. Ket qua tu cac member duoc gop lai va gui ve lead trong mot luot.

---

## 8. Team Workspace

Moi team co mot thu muc chung de luu file sinh ra khi lam viec:

| Che do | Thu muc | Dung khi |
|--------|---------|---------|
| Isolated (mac dinh) | `teams/{teamID}/{chatID}/` | Phan tach file theo cuoc tro chuyen |
| Shared | `teams/{teamID}/` | Tat ca member dung chung mot thu muc |

Gioi han workspace:

| Gioi han | Gia tri |
|---------|--------|
| Kich thuoc file toi da | 10 MB |
| So file toi da | 100 file/scope |

---

## 9. Gioi han theo phien ban

| Tinh nang | Lite | Standard |
|-----------|:----:|:--------:|
| So team toi da | 1 | Khong gioi han |
| So member/team | 5 | Khong gioi han |
| Comment / Review / Attach | Khong ho tro | Day du |
| Ask user reminder | Khong ho tro | Day du |

---

## Xem them

- [11-agent-teams.md](../11-agent-teams.md) — Tai lieu ky thuat day du (tieng Anh)
- [13-ws-team-events.md](../13-ws-team-events.md) — WebSocket events lien quan den team
