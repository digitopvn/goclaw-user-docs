# Traces (Vết Theo Dõi)

**Route:** `/traces`
**Nhóm Sidebar:** Giám Sát
**Quyền truy cập:** Operator+

## Hiển Thị
Bảng phân trang các trace yêu cầu LLM: tên, trạng thái, thời lượng, token vào/ra + cache, số span, thời gian. Bộ lọc theo agent và kênh.

## Thao Tác
- **Lọc theo agent** | **Lọc theo kênh** — dropdown
- **Dừng trace đang chạy** — nút dừng trên dòng đang xử lý
- **Xem chi tiết trace** — nhấp dòng để mở hộp thoại

## Hộp Thoại

### Chi Tiết Trace
**Thao tác header:** **Sao chép Trace ID** | **Xuất** (tải `trace-{id}.json.gz`) | **Dừng** (trace đang chạy)

**Lưới tóm tắt:** Tên, Trạng thái, Thời lượng, Kênh, Token (vào/ra/cache), Số span (tổng/llm/công cụ), Thời gian bắt đầu, Trace cha (có thể nhấp)

**Khối xem trước:** Xem trước đầu vào + sao chép | Xem trước đầu ra + sao chép | Khối lỗi (viền đỏ)

**Cây Span (phân cấp):**
- Mỗi span: huy hiệu loại, tên, token, cache/suy nghĩ, thời lượng, trạng thái
- Nhấp span → bảng chi tiết: thời gian bắt/kết, model, phân tích token, metadata suy luận, xem trước vào/ra

**Thao tác:** Mở rộng/thu gọn span | Nhấp để xem chi tiết | Điều hướng trace cha | Sao chép nội dung
