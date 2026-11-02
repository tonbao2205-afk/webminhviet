# Website Công ty Minh Việt

## Cấu trúc trang

- `index.html`: trang chủ.
- `gioi-thieu.html`: giới thiệu công ty, theo hồ sơ do Minh Việt cung cấp.
- `dich-vu.html`: bốn nhóm dịch vụ. Mỗi nhóm có trang riêng trong `dich-vu/`, từng dịch vụ chi tiết có trang HTML riêng bên trong thư mục nhóm. Hiện có 18 trang dịch vụ.
- `bai-viet.html` và `bai-viet/`: bài viết chia sẻ, có thể biên tập qua `quan-tri.html`.
- `tuyen-dung/index.html` và `tuyen-dung/nhan-vien-ke-toan.html`: danh sách vị trí và bản mô tả vị trí Nhân viên Kế toán. Có thể bổ sung nhiều trang JD cùng cấp trong `tuyen-dung/` về sau.
- `lien-he.html`: số điện thoại và email công ty.

## Tải lên hosting

1. Dùng gói ZIP dành cho hosting. Nếu dùng Vibe Host, vào **Triển khai website → Tải file ZIP**, chọn tệp ZIP website này.
2. Tệp `index.html` phải nằm ở gốc gói ZIP, không nằm bên trong một thư mục con.
3. Sau khi triển khai, kiểm tra trang chủ, bốn nhóm dịch vụ, một số bài dịch vụ chi tiết, mục Tuyển dụng và Liên hệ trên điện thoại và máy tính.

Website dùng HTML tĩnh, không cần cài đặt cơ sở dữ liệu, PHP hoặc Node.js trên hosting.

## Quản trị bài viết chia sẻ

1. Mở `https://ten-mien-cua-ban/quan-tri.html` sau khi website đã được triển khai.
2. Chọn bài đang có hoặc chọn **+ Bài mới**, nhập nội dung. Dòng bắt đầu bằng `## ` tạo tiêu đề mục; để một dòng trống giữa các mục.
3. Chọn **Lưu bản nháp** và **Xem trước**. Bản nháp chỉ ở trên trình duyệt của thiết bị đang dùng.
4. Chọn **Tải gói website mới (.zip)** và tải gói đó lên Vibe Host để đăng thay đổi.

Trang quản trị chỉ xử lý **bài viết chia sẻ**, không sửa trang dịch vụ hoặc JD. Nó không có tài khoản hay mật khẩu và không thể tự sửa website trên máy chủ. Chỉ tài khoản hosting có quyền triển khai mới có thể công khai gói ZIP mới.

## Chỉnh sửa nội dung bằng mã nguồn

- Thông tin liên hệ và số liệu năng lực: `src/site-data.mjs`.
- Bốn nhóm và 18 trang dịch vụ: `src/service-content.mjs` (mỗi mục có `group`, `slug`, `title`, `lead`, `intro`, `sections`, `stages`).
- Trang giới thiệu: `src/company-content.mjs`.
- Bản mô tả vị trí kế toán: `src/career-content.mjs`.
- Cấu trúc HTML và đường dẫn: `src/build.mjs`; giao diện: `src/styles.css`.

Sau khi sửa nguồn, chạy `npm run build` rồi kiểm tra bằng `npm run check`. Đóng gói **nội dung bên trong thư mục `dist`** để triển khai. Nếu đã sửa bài chia sẻ trong trang quản trị, cần lấy `assets/posts.json` từ gói website mới nhất trước khi chạy lại bản mã nguồn cũ để tránh ghi đè nội dung đã đăng. Có thể gửi JD mới dạng Word để biên tập và bổ sung một trang riêng trong `tuyen-dung/`.

## Xác nhận trước khi công khai

- Số liệu giới thiệu công ty theo mốc tháng 01/2026 và phạm vi dịch vụ công bố.
- Email `thueminhviet.vn@gmail.com` và số điện thoại `0984 316 191`.
- Tình trạng tuyển dụng hiện tại, mức thu nhập và nơi làm việc của vị trí Nhân viên Kế toán. Trang đã ghi rõ người xem cần xác nhận đợt tuyển dụng.
- Địa chỉ văn phòng cụ thể nếu muốn đăng công khai; hiện trang Liên hệ chỉ ghi Hà Nội.

## SEO và tên miền

Thông tin SEO dùng tên miền chuẩn `https://thueminhviet.vn`. Nội dung và giọng văn được giữ nguyên; tiêu đề tìm kiếm, mô tả và dữ liệu có cấu trúc được quản lý tại `src/seo.mjs`. Tiêu đề trang Giới thiệu đã viết hoa tên công ty.

Sau khi tải bản mới lên hosting, khai báo `https://thueminhviet.vn/sitemap.xml` trong Google Search Console của tên miền. Việc xác minh quyền sở hữu và gửi sơ đồ cần thực hiện trong tài khoản của công ty; gói website không tự xác minh hoặc gửi sơ đồ. Sơ đồ loại trừ trang quản trị, mẫu bài viết, trang lỗi và các trang chuyển hướng. Nội dung tuyển dụng đang là mô tả vị trí nên không khai báo như một tin tuyển dụng đang mở.

Khi xuất ZIP từ trang quản trị, các bài mới được bổ sung địa chỉ chuẩn, thông tin SEO và sơ đồ website tương ứng. Nếu chuyển tên miền, cập nhật `origin` trong `src/seo.mjs` và đường dẫn sơ đồ ở `src/build.mjs`, sau đó tạo lại website.
