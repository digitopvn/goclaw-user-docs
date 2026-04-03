# Example Page

Trang ví dụ minh họa cách sử dụng hình ảnh và video YouTube trong docs.

## Hình ảnh

Đặt file ảnh vào `guide/public/images/`, sau đó dùng cú pháp markdown:

![Example image](/images/example.jpg)

## Video YouTube

Dùng component `<YouTube>` với `id` là mã video (phần sau `v=` trong URL):

<YouTube id="dQw4w9WgXcQ" title="GoClaw Demo Video" />

## Kết hợp trong hướng dẫn

Có thể xen kẽ text, ảnh và video trong cùng một trang:

```markdown
Bước 1: Mở trang **Agents** trên Web UI.

![Agents Page](/images/agents-page.png)

Bước 2: Xem video hướng dẫn:

<YouTube id="VIDEO_ID" title="Tiêu đề video" />
```
