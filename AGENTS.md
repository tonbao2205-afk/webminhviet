# Quy tắc Chuẩn Dự án Website Minh Việt (AGENTS.md)

Tài liệu này quy định các nguyên tắc bắt buộc khi phát triển, chỉnh sửa và nâng cấp giao diện cho dự án **Website Công ty TNHH Tư vấn và Đào tạo Minh Việt**.

---

## 1. Quy tắc Hình ảnh (Strict Local Assets Only — Không tạo ảnh thêm)

1. **Cấm tuyệt đối việc tạo hoặc thêm ảnh mới:**
   - **KHÔNG** sử dụng công cụ AI sinh ảnh (`image-generator`) để tạo ảnh mới.
   - **KHÔNG** tải ảnh từ internet, kho ảnh miễn phí (Unsplash, Pexels, Picsum, Placehold.co...) hoặc nhúng URL ảnh bên ngoài.
   - **KHÔNG** thêm bất kỳ tệp ảnh mới nào (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`) vào thư mục `src/` hoặc `dist/assets/`.
2. **Chỉ sử dụng các tệp hình ảnh có sẵn trong thư mục dự án (đã chuẩn hóa định dạng `.webp`):**
   - Biểu tượng trang: `favicon.svg` (`src/favicon.svg` / `dist/favicon.svg`)
   - Logo thương hiệu: `assets/logo-minh-viet.webp`
   - Ảnh Hero Trang chủ: `assets/doi-ngu-minh-viet.webp` (`1280×853`)
   - Ảnh Trang Giới thiệu: `assets/doi-ngu-cong-so.webp` (`2048×1365`)
   - Bộ 8 ảnh trong `assets/hoat-dong/` (khai báo tại `src/gallery-content.mjs`):
     - `assets/hoat-dong/du-lich-he-2026.webp` (`1280×960`)
     - `assets/hoat-dong/tiec-gala-he-2026.webp` (`1280×960`)
     - `assets/hoat-dong/sinh-nhat-nhan-vien.webp` (`2048×1365`)
     - `assets/hoat-dong/sinh-nhat-quy.webp` (`2048×1365`)
     - `assets/hoat-dong/quoc-khanh-01.webp` (`2048×1452`)
     - `assets/hoat-dong/quoc-khanh-02.webp` (`2048×1365`)
     - `assets/hoat-dong/chuc-tet-co-so-2.webp` (`2048×1536`)
     - `assets/hoat-dong/khai-truong-co-so-2.webp` (`1280×853`)
3. **Trang trí giao diện không dùng ảnh ngoài:**
   - Mọi biểu tượng minh họa cho nhóm dịch vụ, quy trình, thông tin liên hệ hoặc chỉ số năng lực chỉ được phép dùng **Inline SVG**, **CSS thuần** (gradients, borders, badges) hoặc **Typography**.
   - Luôn khai báo đầy đủ `width`, `height`, `alt`, `loading="lazy"` (hoặc `fetchpriority="high"` cho ảnh Hero chính) để tránh nhảy bố cục (CLS = 0).

---

## 2. Quy tắc Nội dung (Strict Local Content Only — Giữ nguyên dữ liệu gốc)

1. **Lấy 100% nội dung từ các tệp nguồn trong `src/`:**
   - Thông tin công ty, số liệu năng lực & bài viết chia sẻ: `src/site-data.mjs`
   - 4 nhóm dịch vụ & 18 trang dịch vụ chi tiết: `src/service-content.mjs`
   - Hồ sơ giới thiệu công ty & hệ sinh thái vòng đời doanh nghiệp: `src/company-content.mjs`
   - Thông tin tuyển dụng vị trí Nhân viên Kế toán: `src/career-content.mjs`
   - Danh mục 5 album hình ảnh hoạt động: `src/gallery-content.mjs`
   - Cấu hình SEO, Open Graph, Canonical & Schema.org JSON-LD: `src/seo.mjs`
2. **Bảo toàn tính chính xác nghiệp vụ:**
   - Không tự ý bịa đặt số liệu, địa chỉ, giá dịch vụ hoặc thay đổi nội dung chuyên môn kế toán – thuế – pháp lý – tài chính.
   - Giữ nguyên cấu trúc URL của toàn bộ 35 trang HTML đầu ra trong `dist/` (bao gồm cả 3 trang chuyển hướng dịch vụ cũ) và `sitemap.xml`.

---

## 3. Quy tắc Phạm vi Công việc (Frontend-Only Scope)

1. **Chỉ làm phần Frontend:**
   - Tập trung hoàn toàn vào kiến trúc giao diện HTML (`src/build.mjs`), hệ thống thiết kế thẩm mỹ UX/UI (`src/styles.css`), tương tác người dùng trên trình duyệt (`src/site.js`, `src/admin.js`) và kịch bản kiểm tra tĩnh (`src/validate.mjs`).
2. **Không can thiệp phần Backend:**
   - Không tự ý cài đặt cơ sở dữ liệu, viết API máy chủ, hệ thống đăng nhập/xác thực phía server hoặc thay đổi kiến trúc dữ liệu phục vụ Backend (phần Backend sẽ do chủ dự án trực tiếp triển khai sau).
   - Thiết kế HTML/DOM rõ ràng, có cấu trúc ngữ nghĩa (semantic HTML5) và thuộc tính chuẩn để thuận tiện khi tích hợp Backend về sau.

---

## 4. Quy tắc Chuẩn UX/UI & Kiểm thử (Design System & QC)

1. **Định hướng thẩm mỹ (Editorial Corporate B2B):**
   - Phong cách chuyên nghiệp, chuẩn mực, đáng tin cậy dành cho doanh nghiệp nhỏ và vừa (SME).
   - Bảng màu chủ đạo: Đỏ Minh Việt (`#b91f2e`, `#8d1422`), Vàng kim (`#e8b24a`), Mực đậm (`#121621`), Nền sáng ấm (`#faf8f6`, `#f3efe9`).
   - **Cấm tuyệt đối dùng kiểu box tròn nhỏ / nhãn viên thuốc (`border-radius: 999px` / `.eyebrow-pill`)** bao quanh dòng tiêu đề phụ hoặc nhãn chữ. Sử dụng chữ in hoa `.eyebrow` kèm vạch nhấn dọc (`border-left`) hoặc định dạng chữ thuần túy.
   - **Cấm tuyệt đối đóng hộp màu bo góc quanh số thứ tự (`01`, `02`...):** Không dùng hộp vuông/chữ nhật bo góc tô nền màu (như `background: var(--red-soft)` / `var(--soft)` kèm `border-radius`) bọc quanh chỉ số mục hoặc giai đoạn (`.prose-sec-no`, `.stage-badge`, `.journey-badge`, `.dropdown-group-num`, `.matrix-tab-idx`). Chỉ trình bày dưới dạng chữ số biên tập thuần túy (`01.`, `02.`).
   - **Cấm tuyệt đối đóng khung hộp kèm chấm tròn đỏ cho từng dòng danh sách (`<li>` trong `.prose-list`):** Không chia từng ý liệt kê thành các ô đóng viền bo góc riêng lẻ có dấu chấm tròn đỏ (`•`). Trình bày danh sách dưới dạng các dòng văn bản thoáng đãng không đóng hộp, phân tách bằng đường kẻ ngang mảnh (`border-top` / `border-bottom`).
2. **Trải nghiệm người dùng (UX) & Khả năng tiếp cận (Accessibility):**
   - Phân cấp chữ rõ ràng, chiều rộng dòng đọc văn bản (`prose`) từ `65ch–75ch` giúp đọc tài liệu pháp lý/kế toán dài không bị mỏi mắt.
   - Bảng biểu (`service-table`, `company-stats`) hỗ trợ cuộn ngang mượt trên màn hình nhỏ, có tiêu đề cột nổi bật.
   - Hỗ trợ đầy đủ điều hướng bàn phím (`:focus-visible`), nút bỏ qua điều hướng (`.skip`), tương thích `prefers-reduced-motion`.
3. **Kiểm tra chất lượng (QC Gate) bắt buộc sau mỗi lần sửa Frontend:**
   - Luôn biên dịch lại `dist/` từ `src/build.mjs` và chạy `src/validate.mjs` để đảm bảo 100% trang HTML không có liên kết hoặc tài nguyên ảnh bị thiếu.
4. **Quy tắc Hỏi Phiên bản Thiết bị trước khi Cập nhật / Sửa chữa:**
   - Khi triển khai cập nhật hoặc sửa chữa giao diện, **bắt buộc phải hỏi rõ** người dùng muốn sửa cho **phiên bản Điện thoại (Mobile)** hay **phiên bản Máy tính (Desktop)** (hoặc cả hai) trước khi thực hiện.
