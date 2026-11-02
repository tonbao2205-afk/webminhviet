# Quy tắc Frontend, Hình ảnh & Nội dung (Minh Việt Website)

1. **Không tạo ảnh mới:** Chỉ sử dụng đúng các tệp ảnh có sẵn trong `dist/assets/` (`logo-minh-viet.webp`, `doi-ngu-minh-viet.webp`, `doi-ngu-cong-so.webp`, và 8 ảnh `.webp` trong `assets/hoat-dong/`) cùng `favicon.svg`. Không sinh ảnh AI, không dùng ảnh từ URL ngoài.
2. **Giữ nguyên nội dung gốc:** Lấy toàn bộ dữ liệu từ `src/site-data.mjs`, `src/service-content.mjs`, `src/company-content.mjs`, `src/career-content.mjs`, `src/gallery-content.mjs` và `src/seo.mjs`.
3. **Chỉ thực hiện Frontend:** Chỉ nâng cấp HTML, CSS, Client-side JS và quy trình build giao diện tĩnh (`src/build.mjs`, `src/styles.css`, `src/site.js`, `src/admin.js`, `src/validate.mjs`). Không can thiệp vào phần Backend.
4. **Cấm dùng Pill Badge, Box số thứ tự màu & Box danh sách chấm tròn:** Không bao giờ sử dụng kiểu hộp bo tròn nhỏ (`border-radius: 999px` / `.eyebrow-pill`) cho tiêu đề phụ/nhãn chữ; không bọc số thứ tự (`01`, `02`...) trong hộp nhỏ bo góc tô nền màu (chỉ dùng chữ số biên tập `01.`); và không đóng khung viền riêng từng dòng `<li>` kèm chấm tròn đỏ (`•`) trong `.prose-list` (chỉ dùng dòng văn bản thoáng ngăn cách bằng đường kẻ ngang mảnh).
5. **Kiểm tra sau khi build:** Luôn chạy lại build và validate để đảm bảo toàn bộ trang trong `dist/` hoạt động hoàn hảo và không đứt gãy liên kết.
6. **Luôn hỏi phiên bản thiết bị trước khi sửa chữa:** Khi triển khai cập nhật hoặc sửa chữa giao diện, bắt buộc phải hỏi người dùng muốn áp dụng cho phiên bản Điện thoại (Mobile) hay phiên bản Máy tính (Desktop) trước khi thực hiện.
