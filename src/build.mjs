import { mkdir, readFile, rm, writeFile, cp, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { enhanceHtml, sitemap } from "./seo.mjs";
import { company, posts } from "./site-data.mjs";
import { groups, serviceArticles } from "./service-content.mjs";
import { companyProfile } from "./company-content.mjs";
import { activityAlbums } from "./gallery-content.mjs";
import { pagePhotos } from "./page-photos.mjs";
import { careerProfile } from "./career-content.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");

await mkdir(join(dist, "assets"), { recursive: true });
for (const entry of await readdir(dist)) {
  if (entry !== "assets") {
    await rm(join(dist, entry), { recursive: true, force: true });
  }
}
await cp(join(root, "src/styles.css"), join(dist, "assets/styles.css"));
await cp(join(root, "src/site.js"), join(dist, "assets/site.js"));
await cp(join(root, "src/admin.js"), join(dist, "assets/admin.js"));
await cp(join(root, "src/seo.mjs"), join(dist, "assets/seo.mjs"));await cp(join(root, "src/favicon.svg"), join(dist, "favicon.svg"));

const esc = value =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const prefixFor = depth => (depth ? "../".repeat(depth) : "./");

const icons = {
  phone: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mail: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  pin: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  arrowRight: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  shield: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
  building: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
  calculator: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>`,
  chart: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
  layers: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>`,
  users: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  fileCheck: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg>`,
  briefcase: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  chevronDown: `<svg class="icon icon-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
  search: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  calendar: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  copy: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  sun: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  moon: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
};

const groupIconMap = {
  "dang-ky-doanh-nghiep": icons.building,
  "ke-toan-va-thue": icons.calculator,
  "tu-van-tai-chinh-doanh-nghiep": icons.chart,
  "tu-van-quan-ly": icons.layers,
};

function header(depth, active) {
  const p = prefixFor(depth);
  const item = (key, href, label) =>
    `<a class="nav-link${active === key ? " active" : ""}" href="${p}${href}">${label}</a>`;
  return `
<header class="site-header">
  <div class="header-bar">
    <button class="menu" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="Mở menu điều hướng">
      <span class="menu-bars" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>

    <a class="brand" href="${p}index.html" aria-label="Minh Việt, về trang chủ">
      <span class="brand-logo">
        <img src="${p}assets/logo-minh-viet.webp" alt="Logo Minh Việt" width="240" height="92" decoding="async">
      </span>
    </a>

    <div class="drawer-backdrop" id="drawer-backdrop" hidden></div>

    <nav class="links" id="nav-links" aria-label="Điều hướng chính">
      <div class="drawer-head">
        <a class="drawer-brand" href="${p}index.html" aria-label="Minh Việt">
          <img src="${p}assets/logo-minh-viet.webp" alt="Logo Minh Việt" width="180" height="68" fetchpriority="low" decoding="async">
        </a>
        <button class="drawer-close" type="button" id="drawer-close" aria-label="Đóng menu">✕</button>
      </div>

      <div class="nav-menu">
        ${item("home", "index.html", "TRANG CHỦ")}
        ${item("about", "gioi-thieu.html", "GIỚI THIỆU")}
        <div class="nav-item-dropdown${active === "services" ? " active" : ""}">
          <div class="nav-dropdown-trigger">
            <a class="nav-link${active === "services" ? " active" : ""}" href="${p}dich-vu.html">
              <span>DỊCH VỤ</span>${icons.chevronDown}
            </a>
            <button class="sub-toggle" type="button" aria-expanded="false" aria-label="Mở danh mục nhóm dịch vụ">${icons.chevronDown}</button>
          </div>
          <div class="nav-dropdown" aria-label="Bốn nhóm dịch vụ Minh Việt">
            <div class="nav-dropdown-inner">
              ${groups
                .map((g, idx) => {
                  const count = serviceArticles.filter(a => a.group === g.slug).length;
                  return `<a class="dropdown-group-link" href="${p}dich-vu/${g.slug}.html"><span class="dropdown-group-num">0${idx + 1}</span><span><strong>${esc(g.title)}</strong><small>${count} nghiệp vụ chuyên sâu</small></span></a>`;
                })
                .join("")}
              <div class="dropdown-foot">
                <a href="${p}dich-vu.html">Tra cứu toàn bộ ${serviceArticles.length} dịch vụ</a>
              </div>
            </div>
          </div>
        </div>
        ${item("posts", "bai-viet.html", "BÀI VIẾT")}
        ${item("gallery", "hinh-anh-hoat-dong/index.html", "HOẠT ĐỘNG")}
        ${item("career", "tuyen-dung/index.html", "TUYỂN DỤNG")}
        <a class="nav-link${active === "contact" ? " active" : ""}" href="${p}lien-he.html"><span class="only-pc">PHÁP LÝ &amp; </span>LIÊN HỆ</a>
      </div>

      <div class="drawer-foot">
        <button class="drawer-theme-toggle" type="button" data-theme-toggle>
          <span class="drawer-theme-title">Chế độ hiển thị</span>
          <span class="theme-toggle-option theme-to-dark">${icons.moon}<span>Giao diện Tối</span></span>
          <span class="theme-toggle-option theme-to-light">${icons.sun}<span>Giao diện Sáng</span></span>
        </button>
        <a class="drawer-cta-btn" href="${p}lien-he.html#tru-so">KẾT NỐI TƯ VẤN</a>
        <div class="drawer-contacts">
          <a href="tel:${esc(company.phoneHref)}">${icons.phone}<span>${esc(company.phone)}</span></a>
          <a href="mailto:${esc(company.email)}">${icons.mail}<span>${esc(company.email)}</span></a>
        </div>
      </div>
    </nav>

    <div class="header-actions">
      <button class="theme-toggle" type="button" data-theme-toggle title="Chuyển chế độ Sáng / Tối">
        <span class="theme-toggle-option theme-to-dark">${icons.moon}<span class="sr-only">Chuyển sang giao diện tối</span></span>
        <span class="theme-toggle-option theme-to-light">${icons.sun}<span class="sr-only">Chuyển sang giao diện sáng</span></span>
      </button>
      <a class="header-cta" href="${p}lien-he.html#tru-so">TƯ VẤN</a>
    </div>
  </div>
</header>`;
}

function ctaBand(depth = 0, heading = "Trao đổi về nhu cầu của doanh nghiệp anh/chị", subtext = `Đội ngũ Minh Việt tiếp nhận tư vấn tại ${company.location}.`) {
  const p = prefixFor(depth);
  return `
<section class="band-section">
  <div class="wrap">
    <div class="band-card">
      <div class="band-copy">
        <div class="eyebrow">HỘI ĐỒNG TƯ VẤN NGHIỆP VỤ</div>
        <h2>${esc(heading)}</h2>
        <p>${esc(subtext)}</p>
        <ul class="band-points">
          <li>Xác định rõ phạm vi và lộ trình thực hiện</li>
          <li>Đầu mối chuyên môn phối hợp xuyên suốt</li>
          <li>Bảo mật hồ sơ và dữ liệu doanh nghiệp</li>
        </ul>
      </div>
      <div class="band-panel">
        <div class="band-panel-head">MST: ${esc(company.taxCode)} · ĐẠI DIỆN PHÁP LUẬT: ${esc(company.director.toUpperCase())}</div>
        <a class="band-hotline" href="tel:${esc(company.phoneHref)}">
          <span class="band-hotline-icon">${icons.phone}</span>
          <span>
            <small>Hotline Tư vấn Nghiệp vụ</small>
            <strong>${esc(company.phone)}</strong>
          </span>
        </a>
        <div class="band-panel-actions">
          <a class="button" href="${p}lien-he.html"><span>Thông tin liên hệ</span>${icons.arrowRight}</a>
          <a class="button band-form-btn" href="https://forms.gle/pGnZmKFd3xCt4GBBA" target="_blank" rel="noopener noreferrer">Đăng ký tư vấn</a>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function footer(depth) {
  const p = prefixFor(depth);
  return `
<footer class="site-footer">
  <h2 class="sr-only">Thông tin liên hệ và điều hướng cuối trang</h2>
  <div class="footer-main wrap">
    <div class="footer-brand">
      <a class="footer-logo" href="${p}index.html" aria-label="Minh Việt, về trang chủ">
        <img src="${p}assets/logo-minh-viet.webp" alt="Logo Minh Việt" width="148" height="110" loading="lazy">
      </a>
      <strong class="footer-company-name">${esc(company.legalName)}</strong>
      <p>${esc(company.positioning)}</p>
    </div>
    <div class="footer-col">
      <h3>Nhóm dịch vụ</h3>
      <nav aria-label="Nhóm dịch vụ cuối trang">
        ${groups.map(g => `<a href="${p}dich-vu/${g.slug}.html">${esc(g.title)}</a>`).join("")}
      </nav>
    </div>
    <div class="footer-col">
      <h3>Danh mục</h3>
      <nav class="footer-nav" aria-label="Điều hướng cuối trang">
        <a href="${p}gioi-thieu.html">Giới thiệu</a>
        <a href="${p}dich-vu.html">Dịch vụ</a>
        <a href="${p}bai-viet.html">Bài viết</a>
        <a href="${p}hinh-anh-hoat-dong/index.html">Hình ảnh hoạt động</a>
        <a href="${p}tuyen-dung/index.html">Tuyển dụng</a>
        <a href="${p}lien-he.html">Liên hệ</a>
      </nav>
    </div>
    <div class="footer-col footer-col-contact">
      <h3>Thông tin liên hệ</h3>
      <ul class="footer-contact">
        <li>${icons.pin}<span>${esc(company.address)}</span></li>
        <li>${icons.phone}<a href="tel:${esc(company.phoneHref)}">${esc(company.phone)}</a></li>
        <li>${icons.mail}<a href="mailto:${esc(company.email)}">${esc(company.email)}</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom wrap">
    <span class="footer-copy-text">© ${esc(company.name)}. Bảo lưu mọi quyền.</span>
    <span class="footer-design-text">Design by <strong class="footer-credit">harryduong</strong></span>
  </div>
</footer>
<div class="floating-actions" aria-label="Công cụ nhanh">
  <button class="fab-top" type="button" id="scroll-top" aria-label="Lên đầu trang" title="Lên đầu trang" hidden>↑</button>
  <div class="fab-speed-dial" id="fab-speed-dial">
    <div class="fab-dropup-list" id="fab-dropup-menu" role="menu" aria-label="Kênh kết nối tư vấn Minh Việt" aria-hidden="true">
      <a class="fab-dropup-item" role="menuitem" style="--i: 2" href="mailto:${esc(company.email)}" aria-label="Gửi Email tới ${esc(company.email)}" tabindex="-1">
        <span class="fab-item-label" aria-hidden="true">${esc(company.email)}</span>
        <span class="fab-circle-btn fab-btn-mail" aria-hidden="true">${icons.mail}</span>
      </a>
      <a class="fab-dropup-item" role="menuitem" style="--i: 1" href="https://forms.gle/pGnZmKFd3xCt4GBBA" target="_blank" rel="noopener noreferrer" aria-label="Đăng ký lịch tư vấn trực tuyến" tabindex="-1">
        <span class="fab-item-label" aria-hidden="true">Đăng ký tư vấn</span>
        <span class="fab-circle-btn fab-btn-form" aria-hidden="true">${icons.calendar}</span>
      </a>
      <a class="fab-dropup-item" role="menuitem" style="--i: 0" href="tel:${esc(company.phoneHref)}" aria-label="Gọi Hotline ${esc(company.phone)}" tabindex="-1">
        <span class="fab-item-label" aria-hidden="true">Gọi <strong>${esc(company.phone)}</strong></span>
        <span class="fab-circle-btn fab-btn-phone" aria-hidden="true">${icons.phone}</span>
      </a>
    </div>
    <button class="fab-brand-cta" type="button" id="fab-trigger" aria-expanded="false" aria-controls="fab-dropup-menu" aria-haspopup="true" aria-label="Mở menu nút tròn liên hệ tư vấn Minh Việt" title="Liên hệ tư vấn Minh Việt">
      <span class="fab-brand-logo-wrap">
        <img src="${p}assets/logo-minh-viet.webp" alt="Tư vấn Minh Việt" width="60" height="45" decoding="async">
      </span>
      <span class="fab-close-icon" aria-hidden="true">✕</span>
      <span class="fab-badge-dot" aria-hidden="true"></span>
    </button>
  </div>
</div>`;
}

const logoFilterSvg = `<svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none" aria-hidden="true" focusable="false"><defs><filter id="mv-logo-dark" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 1 0 0 -0.54 0.54 1 0 0 -1.95 1.95 1 0 3.25 3.25 -7.54 1 0"/></filter><filter id="mv-logo-knockout" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -2.2 -2.2 -2.2 0 6.6"/></filter></defs></svg>`;

function layout({ title, description, active, depth = 0, body }) {
  const p = prefixFor(depth);
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><script>try{const s=localStorage.getItem("color-scheme");if(s==="light"||s==="dark")document.querySelector('meta[name="color-scheme"]').content=s}catch{}</script><script>try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches){var d=document.documentElement;d.classList.add("mv-anim");setTimeout(function(){if(!window.__mvReveal)d.classList.remove("mv-anim")},4000)}}catch(e){}</script><title>${esc(title)} | Minh Việt</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#8d1422" media="(prefers-color-scheme: light)"><meta name="theme-color" content="#121621" media="(prefers-color-scheme: dark)"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&display=swap" rel="stylesheet"><link rel="icon" type="image/svg+xml" href="${p}favicon.svg"><style>:root{--mv-logo-dark-filter:url(#mv-logo-dark);--mv-logo-knockout-filter:url(#mv-logo-knockout)}</style><link rel="stylesheet" href="${p}assets/styles.css?v=68"></head><body>${logoFilterSvg}<a class="skip" href="#noi-dung">Chuyển đến nội dung chính</a>${header(depth, active)}<main id="noi-dung">${body}</main>${footer(depth)}<script defer src="${p}assets/site.js?v=68"></script></body></html>`;
}

function pageHero(depth, eyebrow, title, intro) {
  return `
<section class="page-hero">
  <div class="wrap page-hero-inner">
    <div class="page-hero-grid">
      <div class="page-hero-main">
        <div class="eyebrow">${esc(eyebrow)}</div>
        <h1>${esc(title)}</h1>
      </div>
      <div class="page-hero-side">
        <p class="lead">${esc(intro)}</p>
      </div>
    </div>
  </div>
</section>`;
}

function groupCard(group, depth = 0, index = 0) {
  const p = prefixFor(depth);
  const items = serviceArticles.filter(article => article.group === group.slug);
  const icon = groupIconMap[group.slug] || icons.layers;
  return `
<article class="card group-card">
  <div class="card-top">
    <span class="card-no">NHÓM DỊCH VỤ 0${index + 1}</span>
    <span class="card-count">${String(items.length).padStart(2, "0")} DỊCH VỤ</span>
  </div>
  <div class="card-title-row">
    <span class="card-icon">${icon}</span>
    <h3><a href="${p}dich-vu/${group.slug}.html">${esc(group.title)}</a></h3>
  </div>
  <p>${esc(group.intro)}</p>
  <ul class="card-sublist" aria-label="Các dịch vụ trong ${esc(group.title)}">
    ${items
      .map(
        (item, idx) =>
          `<li><a href="${p}dich-vu/${item.group}/${item.slug}.html"><span class="sublist-idx">${String(idx + 1).padStart(2, "0")}</span><span>${esc(item.title)}</span></a></li>`
      )
      .join("")}
  </ul>
  <a class="more" href="${p}dich-vu/${group.slug}.html"><span>Xem toàn bộ nhóm dịch vụ</span>${icons.arrowRight}</a>
</article>`;
}

function detailCard(article, depth = 1, index = 0) {
  const p = prefixFor(depth);
  return `
<article class="post-card service-detail-card" data-service-group="${esc(article.group)}" data-service-search="${esc((article.title + " " + article.lead).toLowerCase())}">
  <div class="service-card-head">
    <span class="post-meta">NGHIỆP VỤ ${String(index + 1).padStart(2, "0")}</span>
    <span class="stage-count">${article.stages.length} GIAI ĐOẠN</span>
  </div>
  <h3><a href="${p}dich-vu/${article.group}/${article.slug}.html">${esc(article.title)}</a></h3>
  <p>${esc(article.lead)}</p>
  <a class="more" href="${p}dich-vu/${article.group}/${article.slug}.html"><span>Hồ sơ quy trình chi tiết</span>${icons.arrowRight}</a>
</article>`;
}

function postCard(post, depth = 0, index = 0) {
  const p = prefixFor(depth);
  return `<article class="post-card"><div class="post-meta">${esc(post.category)}</div><h3><a href="${p}bai-viet/${post.slug}.html">${esc(post.title)}</a></h3><p>${esc(post.excerpt)}</p><a class="more" href="${p}bai-viet/${post.slug}.html">Đọc bài viết</a></article>`;
}

function renderSections(sections, startIdx = 2) {
  return sections
    .map(
      (section, idx) =>
        `<section class="prose-section" id="muc-${startIdx + idx}"><div class="prose-section-head"><span class="prose-sec-no">${String(startIdx + idx).padStart(2, "0")}</span><h2>${esc(section.title)}</h2></div>${section.paragraphs.map(p => `<p>${esc(p)}</p>`).join("")}${section.bullets.length ? `<ul class="prose-list">${section.bullets.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}</section>`
    )
    .join("");
}

function stagesTable(stages) {
  return `<div class="table-scroll" tabindex="0" role="region" aria-label="Quy trình các giai đoạn thực hiện"><table class="service-table" style="--label-2: 'Nghiệp vụ Minh Việt triển khai'; --label-3: 'Kết quả &amp; Hồ sơ bàn giao'"><thead><tr><th scope="col">Giai đoạn thực hiện</th><th scope="col">Nghiệp vụ Minh Việt triển khai</th><th scope="col">Kết quả &amp; Hồ sơ bàn giao</th></tr></thead><tbody>${stages.map((row, idx) => `<tr><th scope="row"><span class="stage-badge">${String(idx + 1).padStart(2, "0")}</span><span>${esc(row.stage)}</span></th><td>${esc(row.work)}</td><td>${esc(row.result)}</td></tr>`).join("")}</tbody></table></div>`;
}

async function save(relative, content, meta) {
  const target = join(dist, relative);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, relative.endsWith(".html") ? enhanceHtml(relative, content, meta) : content, "utf8");
}

const ecosystem = companyProfile.tables[1].slice(1);
const albumPhoto = photo => ({ ...photo, src: `assets/hoat-dong/${photo.file}` });
const pagePhoto = photo => ({ ...photo, src: `assets/trang/${photo.file}` });
const featuredPhotos = [
  pagePhoto(pagePhotos["trang-chu"][0]), // ảnh tập thể trước văn phòng (ô lớn)
  albumPhoto(activityAlbums[4].photos[0]), // khai-truong-co-so-2
  pagePhoto(pagePhotos["trang-chu"][1]), // nâng ly chúc mừng
  albumPhoto(activityAlbums[0].photos[0]), // du-lich-he-2026 (ô ngang)
];

// Dải ảnh theo trang: tiêu đề + hàng ảnh giữ đúng tỉ lệ gốc
function photoBand({ eyebrow, title, photos, depth = 0, wide = false }) {
  const p = prefixFor(depth);
  return `
<section class="section photo-band${wide ? " photo-band--wide" : ""}">
  <div class="wrap photo-band-grid">
    <div class="photo-band-head">
      <div class="eyebrow">${esc(eyebrow)}</div>
      <h2>${esc(title)}</h2>
    </div>
    <div class="photo-row">${photos
      .map(
        photo => `
      <figure class="photo-cell${photo.height > photo.width ? " is-portrait" : ""}" style="--ar: ${photo.width} / ${photo.height}; --grow: ${(photo.width / photo.height).toFixed(3)}">
        <img src="${p}assets/trang/${photo.file}" alt="${esc(photo.caption)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">
        <figcaption>${esc(photo.caption)}</figcaption>
      </figure>`
      )
      .join("")}
    </div>
  </div>
</section>`;
}

// Interactive Service Matrix HTML for Homepage
const interactiveServiceMatrix = `
<div class="matrix-shell" data-service-matrix>
  <div class="matrix-nav" role="tablist" aria-label="Bốn nhóm dịch vụ Minh Việt">
    ${groups
      .map((g, i) => {
        const items = serviceArticles.filter(a => a.group === g.slug);
        return `
    <button class="matrix-tab${i === 0 ? " is-active" : ""}" type="button" role="tab" aria-selected="${i === 0 ? "true" : "false"}" aria-controls="matrix-panel-${g.slug}" id="matrix-tab-${g.slug}" data-matrix-target="${g.slug}">
      <span class="matrix-tab-idx">0${i + 1}</span>
      <span class="matrix-tab-body">
        <strong>${esc(g.title)}</strong>
        <small>${items.length} dịch vụ chuyên sâu</small>
      </span>
    </button>`;
      })
      .join("")}
  </div>
  <div class="matrix-panels">
    ${groups
      .map((g, i) => {
        const items = serviceArticles.filter(a => a.group === g.slug);
        return `
    <section class="matrix-panel${i === 0 ? " is-active" : ""}" id="matrix-panel-${g.slug}" role="tabpanel" aria-labelledby="matrix-tab-${g.slug}" ${i === 0 ? "" : "hidden"}>
      <div class="matrix-panel-head">
        <div>
          <span class="matrix-panel-kicker">NHÓM DỊCH VỤ 0${i + 1} / 04</span>
          <h3><a href="dich-vu/${g.slug}.html">${esc(g.title)}</a></h3>
          <p>${esc(g.intro)}</p>
        </div>
        <a class="button subtle" href="dich-vu/${g.slug}.html"><span>Toàn bộ dịch vụ (${items.length})</span>${icons.arrowRight}</a>
      </div>
      <div class="matrix-service-list">
        ${items
          .map(
            (item, idx) => `
        <a class="matrix-service-item" href="dich-vu/${item.group}/${item.slug}.html">
          <div class="matrix-service-top">
            <span class="matrix-service-code">${String(i + 1).padStart(2, "0")}.${String(idx + 1).padStart(2, "0")}</span>
            <span class="matrix-service-stages">${item.stages.length} giai đoạn</span>
          </div>
          <h4>${esc(item.title)}</h4>
          <p>${esc(item.lead)}</p>
        </a>`
          )
          .join("")}
      </div>
    </section>`;
      })
      .join("")}
  </div>
</div>`;

const home = layout({
  title: "Dịch vụ doanh nghiệp cho doanh nghiệp nhỏ và vừa",
  description: company.positioning,
  active: "home",
  body: `
<section class="hero">
  <div class="hero-grid wrap">
    <div class="hero-copy">
      <div class="eyebrow">${esc(company.positioning)}</div>
      <h1>Đồng hành để doanh nghiệp vận hành vững vàng</h1>
      <p class="lead">Minh Việt hỗ trợ doanh nghiệp từ đăng ký doanh nghiệp, kế toán và thuế đến tư vấn tài chính, quản lý. Mỗi nhóm có các dịch vụ cụ thể để anh/chị tìm đúng nhu cầu.</p>
      <div class="actions">
        <a class="button" href="dich-vu.html"><span>Xem các dịch vụ</span>${icons.arrowRight}</a>
        <a class="button light" href="tel:${esc(company.phoneHref)}">${icons.phone}<span>Gọi ${esc(company.phone)}</span></a>
      </div>
    </div>
    <figure class="hero-visual">
      <img src="assets/doi-ngu-minh-viet.webp" alt="Ảnh tập thể đội ngũ Công ty Minh Việt" width="1280" height="853" fetchpriority="high">
      <figcaption>Đội ngũ Minh Việt tại ${esc(company.location)}</figcaption>
    </figure>
  </div>
</section>

<section class="metrics-ledger-section" aria-label="Số liệu năng lực Minh Việt">
  <div class="wrap">
    <dl class="metrics">
      <div class="metric"><dt>Khách hàng thường xuyên</dt><dd>${esc(company.customers)}</dd></div>
      <div class="metric"><dt>Dự án quyết toán, kiểm toán và soát xét</dt><dd>${esc(company.projects)}</dd></div>
      <div class="metric"><dt>Hồ sơ hành chính pháp lý</dt><dd>${esc(company.dossiers)}</dd></div>
      <div class="metric"><dt>Chuyên viên và chuyên gia trong mạng lưới</dt><dd>${esc(company.specialists)}</dd></div>
    </dl>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow">Hệ thống nghiệp vụ Minh Việt</div>
        <h2>Ma trận 04 nhóm dịch vụ &amp; ${serviceArticles.length} giải pháp chuyên môn</h2>
      </div>
      <p>Chọn từng dịch vụ bên trái để tra cứu ngay phạm vi công việc, số giai đoạn thực hiện và đi thẳng vào hồ sơ chi tiết của từng dịch vụ.</p>
    </div>
    ${interactiveServiceMatrix}
  </div>
</section>

<section class="section lifecycle-section">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow">Chuỗi giá trị liên hoàn</div>
        <h2>Hệ sinh thái dịch vụ theo vòng đời doanh nghiệp</h2>
      </div>
      <p>Tổ chức dịch vụ theo một chuỗi thống nhất, có đầu mối phối hợp, phạm vi rõ ràng và cách làm phù hợp với từng giai đoạn phát triển.</p>
    </div>
    <div class="lifecycle-grid">
      ${ecosystem
        .map(
          ([stage, work, result], idx) => `
      <article class="lifecycle-card">
        <span class="lifecycle-step">Giai đoạn 0${idx + 1}</span>
        <h3>${esc(stage)}</h3>
        <div class="lifecycle-block">
          <small>NGHIỆP VỤ THỰC HIỆN</small>
          <p>${esc(work)}</p>
        </div>
        <div class="lifecycle-result">
          <small>KẾT QUẢ BÀN GIAO</small>
          <strong>${esc(result)}</strong>
        </div>
      </article>`
        )
        .join("")}
    </div>
  </div>
</section>

<section class="section soft">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow">Chuyên san nghiệp vụ</div>
        <h2>Bài viết &amp; hướng dẫn thực hành quản trị</h2>
      </div>
      <p>Đúc kết từ các tình huống thực tế doanh nghiệp nhỏ và vừa thường gặp trong tổ chức hồ sơ kế toán, thuế và điều hành tài chính.</p>
    </div>
    <div class="post-grid">${posts.map((p, i) => postCard(p, 0, i)).join("")}</div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow">Văn hóa &amp; Đội ngũ</div>
        <h2>Hình ảnh hoạt động tại Minh Việt</h2>
      </div>
      <p>Những khoảnh khắc gắn kết của đội ngũ chuyên viên trong công việc và các sự kiện tập thể.</p>
    </div>
    <div class="home-gallery-strip">
      ${featuredPhotos
        .map(
          (photo, idx) => `
      <figure class="strip-photo">
        <a href="hinh-anh-hoat-dong/index.html">
          <img src="${photo.src}" alt="${esc(photo.caption)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">
        </a>
        <figcaption>${esc(photo.caption)}</figcaption>
      </figure>`
        )
        .join("")}
    </div>
    <div class="section-foot">
      <a class="button subtle" href="hinh-anh-hoat-dong/index.html"><span>Xem toàn bộ ${String(activityAlbums.length).padStart(2, "0")} album hoạt động</span>${icons.arrowRight}</a>
    </div>
  </div>
</section>

${ctaBand(0)}`,
});
await save("index.html", home);

const legalFactsItems = [
  { label: "Mã số thuế / Số ĐKKD", value: company.taxCode, highlight: true },
  { label: "Tên chính thức", value: company.legalName },
  { label: "Tên quốc tế", value: company.internationalName },
  { label: "Tên viết tắt", value: company.abbreviatedName },
  { label: "Người đại diện pháp luật", value: `Bà ${company.director} (Giám đốc)` },
  { label: "Loại hình pháp lý", value: company.legalType },
  { label: "Ngày cấp phép / Hoạt động", value: `${company.foundedDate} (Hoạt động: ${company.operatingDate})` },
  { label: "Cơ quan thuế quản lý", value: company.taxAuthority },
  { label: "Tình trạng pháp lý", value: company.status },
  { label: "Lĩnh vực hoạt động chính", value: company.mainBusiness },
  { label: "Địa chỉ trụ sở chính", value: company.address, contactOnlyExclude: true },
  { label: "Văn phòng giao dịch & làm việc", value: company.workingOffices, contactOnlyExclude: true },
  { label: "Điện thoại liên hệ", value: company.phone, isPhone: true, contactOnlyExclude: true },
  { label: "Email tiếp nhận chính thức", value: company.email, isEmail: true, contactOnlyExclude: true },
];

function renderLegalFacts({ isContactPage = false } = {}) {
  return legalFactsItems
    .filter(item => !(isContactPage && item.contactOnlyExclude))
    .map(item => {
      const cls = item.highlight ? ' class="fact-highlight"' : "";
      const valHtml = item.isEmail
        ? `<a href="mailto:${esc(item.value)}">${esc(item.value)}</a>`
        : item.isPhone
          ? `<a href="tel:${esc(company.phoneHref)}">${esc(item.value)}</a>`
          : `<span class="fact-val-text">${esc(item.value)}</span>`;
      return `<div${cls}><dt>${esc(item.label)}</dt><dd>${valHtml}</dd></div>`;
    })
    .join("");
}

const aboutSections = companyProfile.sections.filter(
  section => section.title !== "Thông tin liên hệ" && section.title !== "Hệ sinh thái dịch vụ theo vòng đời doanh nghiệp"
);
await save(
  "gioi-thieu.html",
  layout({
    title: companyProfile.title,
    description: companyProfile.lead,
    active: "about",
    body: `
<section class="page-hero about-hero">
  <div class="wrap page-hero-inner">
    <div class="page-hero-grid">
      <div class="page-hero-main">
        <div class="eyebrow">Hồ sơ năng lực định chế · MST: ${esc(company.taxCode)}</div>
        <h1>
          <span class="about-title-label">Giới thiệu </span>
          <span class="about-title-name">CÔNG TY TNHH TƯ VẤN VÀ ĐÀO TẠO </span>
          <span class="about-title-brand">MINH VIỆT</span>
        </h1>
      </div>
      <div class="page-hero-side">
        <p class="lead">${esc(companyProfile.lead)}</p>
      </div>
    </div>
  </div>
</section>
<figure class="company-photo wrap">
  <img src="assets/doi-ngu-cong-so.webp" alt="Đội ngũ Công ty Minh Việt" width="2048" height="1365" fetchpriority="high">
  <figcaption>Đội ngũ chuyên viên Công ty TNHH Tư vấn và Đào tạo Minh Việt tại Hà Nội.</figcaption>
</figure>
<section class="section">
  <div class="wrap dossier-layout">
    <aside class="dossier-toc" aria-label="Mục lục hồ sơ công ty">
      <div class="dossier-toc-inner">
        <div class="dossier-toc-title">MỤC LỤC HỒ SƠ</div>
        <nav class="dossier-toc-nav">
          <a href="#muc-1"><span class="toc-idx">01</span><span>${esc(aboutSections[0].title)}</span></a>
          <a href="#muc-2"><span class="toc-idx">02</span><span>Dịch vụ theo vòng đời doanh nghiệp</span></a>
          ${aboutSections
            .slice(1)
            .map(
              (sec, idx) =>
                `<a href="#muc-${idx + 3}"><span class="toc-idx">${String(idx + 3).padStart(2, "0")}</span><span>${esc(sec.title)}</span></a>`
            )
            .join("")}
          <a href="#muc-7"><span class="toc-idx">07</span><span>Hồ sơ pháp lý &amp; Thông tin liên hệ</span></a>
        </nav>
      </div>
    </aside>
    <article class="prose">
      <div class="service-intro">${companyProfile.intro.map(p => `<p>${esc(p)}</p>`).join("")}</div>
      <section class="prose-section" id="muc-1">
        <div class="prose-section-head">
          <span class="prose-sec-no">01</span>
          <h2>${esc(aboutSections[0].title)}</h2>
        </div>
        <p>${esc(aboutSections[0].paragraphs[0])}</p>
        <div class="table-scroll" tabindex="0" role="region" aria-labelledby="company-stats-caption">
          <table class="company-stats">
            <caption id="company-stats-caption">Năng lực Minh Việt đến tháng 01/2026</caption>
            <thead><tr><th scope="col">Chỉ tiêu năng lực</th><th scope="col">Số liệu ghi nhận</th></tr></thead>
            <tbody>${companyProfile.tables[0][0].map((value, i) => `<tr><th scope="row">${esc(companyProfile.tables[0][1][i])}</th><td>${esc(value)}</td></tr>`).join("")}</tbody>
          </table>
        </div>
        <p>${esc(aboutSections[0].paragraphs[1])}</p>
      </section>
      <section class="prose-section" id="muc-2">
        <div class="prose-section-head">
          <span class="prose-sec-no">02</span>
          <h2>Dịch vụ theo vòng đời doanh nghiệp</h2>
        </div>
        <div class="journey-list">
          ${ecosystem.map(([stage, work, result], i) => `<div class="journey-item"><span class="journey-badge">0${i + 1}</span><div><h3>${esc(stage)}</h3><p>${esc(work)}</p><p class="journey-result"><strong>Kết quả bàn giao:</strong> ${esc(result)}</p></div></div>`).join("")}
        </div>
      </section>
      ${renderSections(aboutSections.slice(1), 3)}
      <section class="prose-section" id="muc-7">
        <div class="prose-section-head">
          <span class="prose-sec-no">07</span>
          <h2>Hồ sơ pháp lý &amp; Thông tin liên hệ chính thức</h2>
        </div>
        <p>Thông tin đăng ký doanh nghiệp và kênh tiếp nhận chính thức của Công ty TNHH Tư vấn và Đào tạo Minh Việt theo dữ liệu đăng ký kinh doanh quốc gia:</p>
        <dl class="legal-facts">
          ${renderLegalFacts({ isContactPage: false })}
        </dl>
      </section>
    </article>
  </div>
</section>
${photoBand({ eyebrow: "Đội ngũ Minh Việt", title: "Con người tại Minh Việt", photos: pagePhotos["gioi-thieu"], wide: true })}
${ctaBand(0)}`,
  })
);

await save(
  "dich-vu.html",
  layout({
    title: "Dịch vụ Minh Việt",
    description: "Bốn nhóm dịch vụ: đăng ký doanh nghiệp, kế toán và thuế, tư vấn tài chính doanh nghiệp, tư vấn quản lý.",
    active: "services",
    body: `
${pageHero(0, "Hệ thống nghiệp vụ", "Chọn nhóm dịch vụ phù hợp với doanh nghiệp", "Mỗi nhóm dịch vụ dẫn đến các hồ sơ nghiệp vụ chi tiết giới thiệu phạm vi công việc, thông tin cần chuẩn bị và kết quả bàn giao.")}
<section class="section soft">
  <div class="wrap">
    <h2 class="sr-only">Bốn nhóm dịch vụ trọng tâm</h2>
    <div class="cards">${groups.map((g, i) => groupCard(g, 0, i)).join("")}</div>
  </div>
</section>
<section class="section" id="tra-cuu-dich-vu">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow">Danh mục đầy đủ</div>
        <h2>Tra cứu nhanh toàn bộ ${serviceArticles.length} dịch vụ chuyên môn</h2>
      </div>
      <p>Tìm theo tên nghiệp vụ hoặc lọc theo 04 nhóm dịch vụ chuyên môn của Minh Việt.</p>
    </div>
    <search class="finder-bar" aria-label="Bộ lọc tra cứu dịch vụ">
      <div class="finder-search">
        ${icons.search}
        <input type="search" id="service-search-input" placeholder="Nhập từ khóa nghiệp vụ (VD: quyết toán, thành lập, dòng tiền, hóa đơn...)" aria-label="Tìm kiếm dịch vụ">
      </div>
      <div class="finder-filters" role="group" aria-label="Lọc theo nhóm dịch vụ">
        <button class="finder-filter is-active" type="button" data-filter-group="all">Tất cả (${serviceArticles.length})</button>
        ${groups
          .map(g => {
            const c = serviceArticles.filter(a => a.group === g.slug).length;
            return `<button class="finder-filter" type="button" data-filter-group="${g.slug}">${esc(g.title.replace(/^Dịch vụ\s+/i, ""))} (${c})</button>`;
          })
          .join("")}
      </div>
    </search>
    <div class="directory-groups" id="directory-groups">
      ${groups
        .map((g, gIdx) => {
          const items = serviceArticles.filter(a => a.group === g.slug);
          return `<div class="directory-block" data-directory-group="${g.slug}"><div class="directory-head"><div><span class="directory-idx">NHÓM DỊCH VỤ 0${gIdx + 1}</span><h3><a href="dich-vu/${g.slug}.html">${esc(g.title)}</a></h3></div><span>${items.length} DỊCH VỤ CHUYÊN SÂU</span></div><div class="service-grid">${items.map((a, idx) => detailCard(a, 0, idx)).join("")}</div></div>`;
        })
        .join("")}
    </div>
  </div>
</section>
${photoBand({ eyebrow: "Đội ngũ tư vấn", title: "Chuyên viên đồng hành cùng doanh nghiệp", photos: pagePhotos["dich-vu"] })}
${ctaBand(0, "Cần làm rõ phạm vi hỗ trợ?", "Minh Việt sẽ trao đổi về nhu cầu và xác định công việc phù hợp.")}`,
  })
);

for (const group of groups) {
  const articles = serviceArticles.filter(article => article.group === group.slug);
  await save(
    `dich-vu/${group.slug}.html`,
    layout({
      title: group.title,
      description: group.intro,
      active: "services",
      depth: 1,
      body: `
${pageHero(1, "Nhóm dịch vụ", group.title, group.intro)}
<nav class="group-tabs wrap" aria-label="Chuyển nhanh nhóm dịch vụ">
  ${groups.map((g, idx) => `<a class="group-tab${g.slug === group.slug ? " current" : ""}" href="${g.slug}.html">0${idx + 1}. ${esc(g.title)}</a>`).join("")}
</nav>
<section class="section soft">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow">${articles.length} dịch vụ chuyên sâu</div>
        <h2>Danh mục nghiệp vụ thuộc ${esc(group.title)}</h2>
      </div>
    </div>
    <div class="service-grid">${articles.map((article, idx) => detailCard(article, 1, idx)).join("")}</div>
  </div>
</section>
${ctaBand(1, "Cần tư vấn trước khi lựa chọn?", "Chúng tôi cùng anh/chị xác định mục tiêu và phạm vi thực hiện.")}`,
    })
  );

  for (const article of articles) {
    await save(
      `dich-vu/${group.slug}/${article.slug}.html`,
      layout({
        title: article.title,
        description: article.lead,
        active: "services",
        depth: 2,
        body: `
<section class="page-hero">
  <div class="wrap page-hero-inner">
    <div class="page-hero-grid">
      <div class="page-hero-main">
        <div class="eyebrow">${esc(group.title)}</div>
        <h1>${esc(article.title)}</h1>
      </div>
      <div class="page-hero-side">
        <p class="lead">${esc(article.lead)}</p>
      </div>
    </div>
  </div>
</section>
<nav class="group-tabs wrap" aria-label="Dịch vụ cùng nhóm">
  <a class="group-tab" href="../${group.slug}.html">← ${esc(group.title)}</a>
  ${articles
    .map(
      (sibling, sIdx) =>
        `<a class="group-tab${sibling.slug === article.slug ? " current" : ""}" href="${sibling.slug}.html">${String(sIdx + 1).padStart(2, "0")}. ${esc(sibling.title)}</a>`
    )
    .join("")}
</nav>
<section class="section">
  <div class="wrap dossier-layout">
    <aside class="dossier-toc" aria-label="Mục lục hồ sơ dịch vụ">
      <div class="dossier-toc-inner">
        <div class="dossier-toc-title">CẤU TRÚC HỒ SƠ DỊCH VỤ</div>
        <nav class="dossier-toc-nav">
          <a href="#muc-1"><span class="toc-idx">01</span><span>Cách Minh Việt thực hiện (${article.stages.length} bước)</span></a>
          ${article.sections
            .map(
              (sec, idx) =>
                `<a href="#muc-${idx + 2}"><span class="toc-idx">${String(idx + 2).padStart(2, "0")}</span><span>${esc(sec.title)}</span></a>`
            )
            .join("")}
        </nav>
      </div>
    </aside>
    <article class="prose">
      <div class="service-intro">${article.intro.map(p => `<p>${esc(p)}</p>`).join("")}</div>
      <section class="prose-section" id="muc-1">
        <div class="prose-section-head">
          <span class="prose-sec-no">01</span>
          <h2>Cách Minh Việt thực hiện</h2>
        </div>
        ${stagesTable(article.stages)}
      </section>
      ${renderSections(article.sections, 2)}
    </article>
  </div>
</section>
${ctaBand(2, "Trao đổi về dịch vụ", "Phạm vi, tiến độ và chi phí được xác định sau khi trao đổi hồ sơ và nhu cầu cụ thể.")}`,
      })
    );
  }
}

for (const [oldSlug, destination] of [
  ["thu-tuc-doanh-nghiep", "dang-ky-doanh-nghiep.html"],
  ["tu-van-tai-chinh-quan-tri", "tu-van-tai-chinh-doanh-nghiep.html"],
  ["dao-tao-nghiep-vu", "../dich-vu.html"],
]) {
  const redirect = layout({
    title: "Đường dẫn dịch vụ đã thay đổi",
    description: "Trang dịch vụ đã được sắp xếp lại.",
    active: "services",
    depth: 1,
    body: `<section class="page-hero"><div class="wrap page-hero-inner"><h1>Trang dịch vụ đã chuyển</h1><p class="lead">Vui lòng xem nội dung tại <a href="${destination}">trang dịch vụ mới</a>.</p></div></section>`,
  });
  await save(
    `dich-vu/${oldSlug}.html`,
    redirect.replace("<head>", `<head><meta http-equiv="refresh" content="0; url=${destination}">`)
  );
}

await save(
  "bai-viet.html",
  layout({
    title: "Bài viết",
    description: "Bài viết chia sẻ về kế toán, thuế, thủ tục doanh nghiệp, tài chính và quản trị.",
    active: "posts",
    body: `
${pageHero(0, "Chuyên san nghiệp vụ", "Bài viết và hướng dẫn thực hành", "Nội dung được xây dựng từ các vấn đề doanh nghiệp nhỏ và vừa thường gặp trong quá trình tổ chức kế toán, hồ sơ và công việc quản trị.")}
<section class="section soft">
  <div class="wrap">
    <h2 class="sr-only">Danh sách bài viết chia sẻ</h2>
    <div class="post-grid">${posts.map((p, i) => postCard(p, 0, i)).join("")}</div>
  </div>
</section>`,
  })
);

for (const post of posts) {
  await save(
    `bai-viet/${post.slug}.html`,
    layout({
      title: post.title,
      description: post.excerpt,
      active: "posts",
      depth: 1,
      body: `
<section class="page-hero">
  <div class="article-head wrap">
    <div class="eyebrow">${esc(post.category)}</div>
    <h1>${esc(post.title)}</h1>
    <p class="lead">${esc(post.excerpt)}</p>
    <div class="article-meta"><span>Ngày đăng: ${esc(post.date)}</span><span>${esc(post.reading)}</span></div>
  </div>
</section>
<section class="section">
  <article class="article wrap">
    ${post.paragraphs.map(([h, p]) => `<h2>${esc(h)}</h2><p>${esc(p)}</p>`).join("")}
    <div class="quote">Doanh nghiệp nên điều chỉnh cách áp dụng theo quy mô, ngành nghề và tình hình thực tế của mình.</div>
    <p><strong>Lưu ý:</strong> Bài viết cung cấp thông tin tham khảo về quản trị và tổ chức công việc. Với vấn đề cụ thể, doanh nghiệp nên trao đổi trực tiếp với người có chuyên môn.</p>
  </article>
</section>
${ctaBand(1, "Cần trao đổi về trường hợp cụ thể?", "Minh Việt tiếp nhận tư vấn tại Hà Nội.")}`,
    }),
    post
  );
}

const careerSlug = "nhan-vien-ke-toan";
const careerInfo = careerProfile.tables[0];
const careerTasks = careerProfile.tables[1].slice(1);
const careerKpis = careerProfile.tables[2].slice(1);
const careerSections = careerProfile.sections.filter(section =>
  ["Mục tiêu công việc", "Quyền hạn và trách nhiệm", "Yêu cầu tuyển dụng", "Quyền lợi", "Cơ hội phát triển tại Minh Việt", "Cách thức ứng tuyển"].includes(
    section.title
  )
);

await save(
  "tuyen-dung/index.html",
  layout({
    title: "Tuyển dụng",
    description: "Thông tin các vị trí công việc tại Công ty Minh Việt.",
    active: "career",
    depth: 1,
    body: `
${pageHero(1, "Tuyển dụng nhân sự", "Cùng làm việc tại Minh Việt", "Xem mô tả công việc, yêu cầu chuyên môn và cách thức ứng tuyển. Vui lòng xác nhận đợt tuyển dụng hiện tại trước khi gửi hồ sơ.")}
<section class="section soft">
  <div class="wrap">
    <div class="section-head">
      <div>
        <div class="eyebrow">Thông tin vị trí</div>
        <h2>Các vị trí tuyển dụng tại Minh Việt</h2>
      </div>
    </div>
    <div class="career-grid">
      <article class="post-card career-card">
        <div class="service-card-head">
          <span class="post-meta">DỊCH VỤ KẾ TOÁN &amp; THUẾ</span>
          <span class="stage-count">HÀ NỘI</span>
        </div>
        <h3><a href="${careerSlug}.html">Nhân viên Kế toán</a></h3>
        <p>Hạch toán, kiểm tra số liệu và thực hiện báo cáo theo khách hàng hoặc phần hành được phân công.</p>
        <ul class="career-Quickfacts">
          <li><strong>Địa điểm làm việc:</strong> Văn phòng Đền Lừ hoặc Vĩnh Hưng, Hà Nội</li>
          <li><strong>Thu nhập:</strong> 8.000.000 – 12.000.000 đồng/tháng</li>
        </ul>
        <a class="more" href="${careerSlug}.html"><span>Xem hồ sơ mô tả công việc</span>${icons.arrowRight}</a>
      </article>
    </div>
    <p class="career-note">Thông tin vị trí được biên tập từ bản mô tả công việc do Minh Việt cung cấp. Vui lòng liên hệ để xác nhận thời gian tiếp nhận hồ sơ.</p>
  </div>
</section>
${photoBand({ eyebrow: "Môi trường làm việc", title: "Đội ngũ và hoạt động nhân sự", photos: pagePhotos["tuyen-dung"], depth: 1, wide: true })}`,
  })
);

await save(
  `tuyen-dung/${careerSlug}.html`,
  layout({
    title: "Nhân viên Kế toán",
    description: "Mô tả công việc Nhân viên Kế toán tại Công ty Minh Việt.",
    active: "career",
    depth: 1,
    body: `
<section class="page-hero">
  <div class="wrap page-hero-inner">
    <div class="page-hero-grid">
      <div class="page-hero-main">
        <div class="eyebrow">Hồ sơ vị trí tuyển dụng</div>
        <h1>Nhân viên Kế toán</h1>
      </div>
      <div class="page-hero-side">
        <p class="lead">${esc(careerProfile.intro[0])}</p>
      </div>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap dossier-layout">
    <aside class="dossier-toc" aria-label="Mục lục tuyển dụng">
      <div class="dossier-toc-inner">
        <div class="dossier-toc-title">MỤC LỤC VỊ TRÍ</div>
        <nav class="dossier-toc-nav">
          <a href="#muc-1"><span class="toc-idx">01</span><span>Thông tin vị trí</span></a>
          <a href="#muc-2"><span class="toc-idx">02</span><span>Nhiệm vụ chính</span></a>
          <a href="#muc-3"><span class="toc-idx">03</span><span>Chỉ tiêu đánh giá (KPI)</span></a>
          ${careerSections
            .map(
              (sec, idx) =>
                `<a href="#muc-${idx + 4}"><span class="toc-idx">${String(idx + 4).padStart(2, "0")}</span><span>${esc(sec.title)}</span></a>`
            )
            .join("")}
        </nav>
      </div>
    </aside>
    <article class="prose">
      <p class="career-note-box">Đây là bản mô tả vị trí chuẩn; anh/chị vui lòng liên hệ Minh Việt để xác nhận đợt tuyển dụng hiện tại.</p>
      <section class="prose-section" id="muc-1">
        <div class="prose-section-head">
          <span class="prose-sec-no">01</span>
          <h2>Thông tin vị trí</h2>
        </div>
        <dl class="job-facts">
          ${careerInfo.map(([key, value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join("")}
        </dl>
      </section>
      <section class="prose-section" id="muc-2">
        <div class="prose-section-head">
          <span class="prose-sec-no">02</span>
          <h2>Nhiệm vụ chính</h2>
        </div>
        <div class="task-cards">
          ${careerTasks
            .map(
              ([no, heading, body]) => `
          <div class="task-card">
            <h3><span class="stage-badge">0${esc(no)}</span><span>${esc(heading)}</span></h3>
            <ul class="prose-list">${body
              .split(/\n/)
              .map(line => line.replace(/^•\s*/, "").trim())
              .filter(Boolean)
              .map(line => `<li>${esc(line)}</li>`)
              .join("")}</ul>
          </div>`
            )
            .join("")}
        </div>
      </section>
      <section class="prose-section" id="muc-3">
        <div class="prose-section-head">
          <span class="prose-sec-no">03</span>
          <h2>Chỉ tiêu đánh giá công việc</h2>
        </div>
        <div class="table-scroll" tabindex="0" role="region" aria-label="Bảng chỉ tiêu đánh giá công việc">
          <table class="service-table" style="--label-2: 'Phương thức ghi nhận &amp; soát xét'">
            <thead><tr><th scope="col">Tiêu chí đánh giá</th><th scope="col">Phương thức ghi nhận &amp; soát xét</th></tr></thead>
            <tbody>${careerKpis.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody>
          </table>
        </div>
      </section>
      ${renderSections(careerSections, 4)}
    </article>
  </div>
</section>
${ctaBand(1, "Ứng tuyển vị trí Nhân viên Kế toán", "Vui lòng ghi rõ vị trí Nhân viên Kế toán khi gửi hồ sơ qua email chính thức hoặc biểu mẫu trực tuyến của Minh Việt.")}`,
  })
);

await save(
  "lien-he.html",
  layout({
    title: "Hồ sơ Pháp lý & Liên hệ",
    description: `Thông tin pháp lý và liên hệ Công ty TNHH Tư vấn và Đào tạo Minh Việt — Mã số thuế ${company.taxCode}, Giám đốc ${company.director}, trụ sở tại Phường Vĩnh Hưng, Quận Hoàng Mai, Hà Nội.`,
    active: "contact",
    body: `
${pageHero(0, "Hồ sơ pháp lý & Kênh tiếp nhận chính thức", "Thông tin Pháp lý & Liên hệ Minh Việt", `Hồ sơ đăng ký doanh nghiệp chính thức của ${company.name} (MST: ${company.taxCode} — Đại diện pháp luật: Giám đốc ${company.director}) cùng kênh tiếp nhận yêu cầu dịch vụ tại ${company.location}.`)}
<section class="section contact-page-section">
  <div class="contact-stack wrap">
    <section class="contact-band" id="ho-so-phap-ly">
      <div class="contact-band-head">
        <div>
          <div class="eyebrow">Dữ liệu đăng ký kinh doanh &amp; thuế</div>
          <h2>Hồ sơ Pháp lý Doanh nghiệp</h2>
        </div>
      </div>
      <dl class="legal-facts">
        ${renderLegalFacts({ isContactPage: true })}
      </dl>
    </section>

    <section class="contact-band" id="tru-so">
      <div class="contact-band-head">
        <div>
          <div class="eyebrow">Kênh tiếp nhận chính thức</div>
          <h2>${esc(company.name)}</h2>
        </div>
        <div class="contact-actions">
          <a class="button" href="https://forms.gle/pGnZmKFd3xCt4GBBA" target="_blank" rel="noopener noreferrer"><span>Đăng ký tư vấn</span>${icons.arrowRight}</a>
          <a class="button subtle" href="tel:${esc(company.phoneHref)}">${icons.phone}<span>Gọi ${esc(company.phone)}</span></a>
        </div>
      </div>
      <dl class="contact-ledger">
        <div>
          <dt>Điện thoại trực tiếp</dt>
          <dd><a class="contact-phone-link" href="tel:${esc(company.phoneHref)}">${esc(company.phone)}</a></dd>
        </div>
        <div>
          <dt>Email tiếp nhận</dt>
          <dd><a href="mailto:${esc(company.email)}">${esc(company.email)}</a></dd>
        </div>
        <div>
          <dt>Địa chỉ trụ sở ĐKKD</dt>
          <dd>${esc(company.address)}</dd>
        </div>
        <div>
          <dt>Văn phòng làm việc (${esc(company.location)})</dt>
          <dd>${esc(company.workingOffices)}</dd>
        </div>
      </dl>
    </section>

    <section class="contact-band" id="quy-trinh-tiep-nhan">
      <div class="contact-band-head">
        <div>
          <div class="eyebrow">Quy trình phối hợp</div>
          <h2>Ba bước tiếp nhận &amp; triển khai hồ sơ</h2>
        </div>
      </div>
      <div class="contact-steps">
        <div class="contact-step">
          <h3 class="contact-step-heading"><span class="stage-badge">01</span><span>Tiếp nhận thông tin ban đầu</span></h3>
          <p>Ghi nhận loại hình doanh nghiệp, mã số thuế, giai đoạn hoạt động và vấn đề kế toán, thuế, pháp lý hoặc quản trị cần hỗ trợ qua Email hoặc Biểu mẫu.</p>
        </div>
        <div class="contact-step">
          <h3 class="contact-step-heading"><span class="stage-badge">02</span><span>Rà soát &amp; xác định phạm vi</span></h3>
          <p>Đội ngũ chuyên môn đánh giá hiện trạng hồ sơ, đề xuất phương án thực hiện, lộ trình và danh mục tài liệu cần chuẩn bị.</p>
        </div>
        <div class="contact-step">
          <h3 class="contact-step-heading"><span class="stage-badge">03</span><span>Phối hợp triển khai &amp; bàn giao</span></h3>
          <p>Cử đầu mối phụ trách xuyên suốt, cập nhật tiến độ định kỳ và bàn giao đầy đủ hồ sơ, báo cáo theo cam kết.</p>
        </div>
      </div>
    </section>
  </div>
</section>
${photoBand({ eyebrow: "Văn phòng Minh Việt", title: "Không gian làm việc tại văn phòng", photos: pagePhotos["lien-he"] })}`,
  })
);

const totalActivityPhotos = activityAlbums.reduce((sum, album) => sum + album.photos.length, 0);

await save(
  "hinh-anh-hoat-dong/index.html",
  layout({
    title: "Hình ảnh hoạt động",
    description: "Hình ảnh du lịch hè, sinh nhật cán bộ nhân viên, hưởng ứng Quốc khánh, chúc Tết và khai trương cơ sở 2 của Minh Việt.",
    active: "gallery",
    depth: 1,
    body: `
${pageHero(1, "Tư liệu văn hóa & đội ngũ", "Hình ảnh hoạt động", "Những khoảnh khắc trong các hoạt động tập thể, dịp gặp mặt và sự kiện của Minh Việt.")}
<div class="album-filter-bar wrap">
  <ul class="album-tabs" role="tablist" aria-label="Lọc album hình ảnh hoạt động" data-album-tabs>
    <li class="is-active" role="presentation">
      <button class="album-tab is-active" type="button" role="tab" aria-selected="true" tabindex="0" data-album-filter="all">
        <span class="album-tab-label">Tất cả</span>
        <span class="album-tab-count">(${totalActivityPhotos})</span>
      </button>
    </li>
    ${activityAlbums
      .map(
        (album, idx) => `
    <li role="presentation">
      <button class="album-tab" type="button" role="tab" aria-selected="false" tabindex="-1" aria-controls="album-${idx + 1}" data-album-filter="album-${idx + 1}">
        <span class="album-tab-label">${esc(album.title)}</span>
        <span class="album-tab-count">(${album.photos.length})</span>
      </button>
    </li>`
      )
      .join("")}
  </ul>
</div>
<div class="activity-albums wrap">
  ${activityAlbums
    .map(
      (album, idx) => `
  <section class="activity-album" id="album-${idx + 1}">
    <div class="album-header">
      <h2>${esc(album.title)}</h2>
    </div>
    <div class="activity-grid">
      ${album.photos
        .map(
          photo => `
      <figure class="activity-photo${photo.height > photo.width ? " is-portrait" : ""}">
        <a class="lightbox-trigger" href="../assets/hoat-dong/${photo.file}" target="_blank" rel="noopener noreferrer" aria-label="Xem ảnh lớn: ${esc(photo.caption)}" data-caption="${esc(photo.caption)}">
          <img src="../assets/hoat-dong/${photo.file}" alt="${esc(photo.caption)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">
          <span class="photo-zoom-hint">PHÓNG TO TƯ LIỆU</span>
        </a>
        <figcaption>${esc(photo.caption)}</figcaption>
      </figure>`
        )
        .join("")}
    </div>
  </section>`
    )
    .join("")}
</div>`,
  })
);

await save(
  "404.html",
  layout({
    title: "Không tìm thấy trang",
    description: "Trang không tồn tại.",
    active: "",
    body: `<section class="page-hero"><div class="wrap page-hero-inner"><div class="eyebrow">Mã lỗi 404</div><h1>Không tìm thấy trang</h1><p class="lead">Đường dẫn có thể đã thay đổi hoặc nội dung chưa được xuất bản.</p><div class="actions"><a class="button" href="index.html">Về trang chủ</a><a class="button light" href="dich-vu.html">Xem các dịch vụ</a></div></div></section>`,
  })
);

const admin = layout({
  title: "Quản trị bài viết",
  description: "Biên tập bài viết cho website Minh Việt.",
  active: "",
  body: `<section class="admin-intro wrap"><div class="eyebrow">Dành cho người biên tập</div><h1>Quản trị bài viết</h1><p>Soạn bài, lưu bản nháp trên trình duyệt này, sau đó tải gói website mới để đăng lên hosting. Thay đổi chỉ xuất hiện với khách truy cập sau khi anh/chị tải gói mới lên máy chủ.</p></section><section class="admin-shell wrap"><aside class="admin-list"><div class="admin-list-head"><h2>Danh sách bài</h2><button class="button" id="new-post" type="button">+ Bài mới</button></div><div id="post-list" role="list"></div></aside><section class="admin-editor" aria-label="Biên tập bài viết"><form id="post-form"><div class="admin-editor-head"><h2 id="editor-title">Chỉnh sửa bài viết</h2><span id="draft-status" role="status" aria-live="polite"></span></div><label>Tiêu đề bài viết <input name="title" required maxlength="180"></label><div class="admin-fields"><label>Chuyên mục <input name="category" required maxlength="80"></label><label>Ngày đăng <input name="date" type="date" required></label></div><label>Đoạn giới thiệu <textarea name="excerpt" rows="3" required maxlength="500"></textarea></label><label>Nội dung bài viết <span class="hint">Mỗi đoạn cách nhau một dòng trống. Dòng bắt đầu bằng “## ” sẽ là tiêu đề mục.</span><textarea name="body" rows="15" required></textarea></label><div class="admin-actions"><button class="button" type="submit">Lưu bản nháp</button><button class="button subtle" type="button" id="preview-post">Xem trước</button><button class="button danger" type="button" id="delete-post">Xóa bài</button></div></form><div class="publish-box"><h2>Đăng thay đổi</h2><ol><li>Chọn <strong>Tải gói website mới</strong>.</li><li>Vào mục <strong>Triển khai website → Tải file ZIP</strong> trên Vibe Host và tải gói vừa nhận lên.</li><li>Kiểm tra trang chủ, trang bài viết và bài vừa đăng.</li></ol><button class="button" id="export-site" type="button">Tải gói website mới (.zip)</button><p id="export-status" role="status" aria-live="polite"></p><button class="text-button" id="reload-published" type="button">Nạp lại bài viết đang đăng (bỏ bản nháp trên máy này)</button></div></section></section>`,
}).replace("</body></html>", '<script type="module" src="assets/admin.js"></script></body></html>');
await save("quan-tri.html", admin);
await save("assets/posts.json", JSON.stringify(posts, null, 2));
await save("assets/article-template.html", await readFile(join(dist, `bai-viet/${posts[0].slug}.html`), "utf8"));
await writeFile(join(dist, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://thueminhviet.vn/sitemap.xml\n", "utf8");

async function listFiles(dir, prefix = "") {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) result.push(...(await listFiles(join(dir, entry.name), name + "/")));
    else result.push(name);
  }
  return result;
}
await save("sitemap.xml", sitemap(await listFiles(dist)));
const builtFiles = await listFiles(dist);
await save("assets/manifest.json", JSON.stringify(builtFiles));

console.log(`Đã tạo ${builtFiles.filter(name => name.endsWith(".html") && !name.startsWith("assets/")).length} trang HTML trong dist/`);
