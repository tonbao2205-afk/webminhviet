import { enhanceHtml, sitemap } from "./seo.mjs";
// Trình biên tập chạy trên trình duyệt. Không gửi bài viết đến máy chủ.
const form = document.querySelector("#post-form");
const list = document.querySelector("#post-list");
const status = document.querySelector("#draft-status");
const exportStatus = document.querySelector("#export-status");
const encoder = new TextEncoder();
const draftKey = "minh-viet-posts-draft-v1";
let posts = [];
let selected = null;
let dirty = false;

const displayBody = post => post.paragraphs.map(([heading, paragraph]) => `## ${heading}\n${paragraph}`).join("\n\n");
const isoDate = date => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : date;
};
const vnDate = date => {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};
const slugify = title => title.toLowerCase().replaceAll("đ", "d").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90);
const saveDrafts = () => {
  try { localStorage.setItem(draftKey, JSON.stringify(posts)); status.textContent = "Đã lưu bản nháp trên máy này"; }
  catch { status.textContent = "Không lưu được bản nháp. Hãy xuất website ngay."; }
};
function renderList() {
  list.replaceChildren();
  if (!posts.length) list.textContent = "Chưa có bài viết.";
  posts.forEach(post => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "admin-post" + (post.slug === selected ? " current" : "");
    button.textContent = post.title;
    button.addEventListener("click", () => select(post.slug));
    list.append(button);
  });
}
function select(slug) {
  if (dirty && !confirm("Nội dung đang sửa chưa được lưu. Chuyển sang bài khác?")) return;
  selected = slug;
  dirty = false;
  const post = posts.find(item => item.slug === slug);
  form.reset();
  if (post) {
    for (const field of ["title", "category", "excerpt"]) form.elements[field].value = post[field];
    form.elements.date.value = isoDate(post.date);
    form.elements.body.value = displayBody(post);
  } else {
    form.elements.date.value = new Date().toISOString().slice(0, 10);
  }
  document.querySelector("#editor-title").textContent = post ? "Chỉnh sửa bài viết" : "Viết bài mới";
  document.querySelector("#delete-post").disabled = !post;
  status.textContent = "";
  renderList();
  form.elements.title.focus();
}
function readForm() {
  if (!form.reportValidity()) return null;
  const value = name => form.elements[name].value.trim();
  const sections = value("body").split(/\n\s*\n/).map(block => block.trim()).filter(Boolean);
  const paragraphs = [];
  for (const block of sections) {
    if (block.startsWith("## ")) {
      const [heading, ...lines] = block.split("\n");
      if (!lines.join("").trim()) {
        alert("Mỗi tiêu đề mục cần có ít nhất một đoạn nội dung bên dưới.");
        return null;
      }
      paragraphs.push([heading.slice(3).trim(), lines.join("\n").trim()]);
    } else if (paragraphs.length) {
      paragraphs[paragraphs.length - 1][1] += "\n\n" + block;
    } else paragraphs.push(["Nội dung chính", block]);
  }
  if (!paragraphs.length || paragraphs.some(([h, p]) => !h || !p)) {
    alert("Vui lòng viết nội dung cho bài.");
    return null;
  }
  const title = value("title");
  let slug = selected || slugify(title);
  if (!slug) { alert("Tiêu đề cần có ký tự để tạo đường dẫn bài viết."); return null; }
  if (!selected) {
    const base = slug;
    let number = 2;
    while (posts.some(post => post.slug === slug)) slug = `${base}-${number++}`;
  }
  const words = value("body").split(/\s+/).length;
  return { slug, title, category: value("category"), date: vnDate(value("date")),
    excerpt: value("excerpt"), reading: `${Math.max(1, Math.ceil(words / 220))} phút đọc`, paragraphs };
}
function savePost() {
  const post = readForm();
  if (!post) return false;
  const index = posts.findIndex(item => item.slug === post.slug);
  if (index >= 0) posts[index] = post;
  else posts.unshift(post);
  selected = post.slug;
  dirty = false;
  renderList();
  saveDrafts();
  return true;
}
form.addEventListener("input", () => { dirty = true; status.textContent = "Có thay đổi chưa lưu"; });
form.addEventListener("submit", event => { event.preventDefault(); savePost(); });
document.querySelector("#new-post").addEventListener("click", () => select(null));
document.querySelector("#delete-post").addEventListener("click", () => {
  if (!selected || !confirm("Xóa bài viết này khỏi gói website tiếp theo?")) return;
  posts = posts.filter(item => item.slug !== selected);
  selected = null;
  dirty = false;
  saveDrafts();
  select(posts[0]?.slug || null);
});
document.querySelector("#reload-published").addEventListener("click", async () => {
  if (!confirm("Bỏ tất cả bản nháp trên máy này và nạp lại bài viết đang đăng?")) return;
  localStorage.removeItem(draftKey);
  await loadPosts();
});

function parseHtml(source) { return new DOMParser().parseFromString(source, "text/html"); }
function html(doc) { return "<!doctype html>\n" + doc.documentElement.outerHTML; }
function articleHtml(template, post) {
  const doc = parseHtml(template);
  const set = (selector, value) => { const node = doc.querySelector(selector); if (node) node.textContent = value; };
  set("title", `${post.title} | Minh Việt`);
  doc.querySelector('meta[name="description"]').content = post.excerpt;
  doc.querySelector('meta[name="robots"]')?.remove();
  const crumbs = doc.querySelector(".article-head .breadcrumbs");
  if (crumbs) {
    crumbs.replaceChildren();
    const home = document.createElement("a"); home.href = "../index.html"; home.textContent = "Trang chủ";
    const archive = document.createElement("a"); archive.href = "../bai-viet.html"; archive.textContent = "Bài viết";
    crumbs.append(home, " / ", archive, " / " + post.category);
  }
  set(".article-head .eyebrow", post.category);
  set(".article-head h1", post.title);
  set(".article-head .lead", post.excerpt);
  set(".article-meta span:first-child", "Ngày đăng: " + post.date);
  set(".article-meta span:last-child", post.reading);
  const content = doc.querySelector(".article");
  content.replaceChildren();
  post.paragraphs.forEach(([heading, paragraph]) => {
    const h = doc.createElement("h2"); h.textContent = heading;
    const p = doc.createElement("p"); p.textContent = paragraph;
    content.append(h, p);
  });
  const note = doc.createElement("p");
  note.textContent = "Lưu ý: Bài viết cung cấp thông tin tham khảo. Với vấn đề cụ thể, doanh nghiệp nên trao đổi trực tiếp với người có chuyên môn.";
  content.append(note);
  return enhanceHtml(`bai-viet/${post.slug}.html`, html(doc), post);
}
function listingHtml(source, depth = 0) {
  const doc = parseHtml(source);
  const grid = doc.querySelector(".post-grid");
  grid.replaceChildren();
  posts.forEach(post => {
    const href = (depth ? "../" : "") + "bai-viet/" + post.slug + ".html";
    const card = doc.createElement("article"); card.className = "post-card";
    const meta = doc.createElement("div"); meta.className = "post-meta"; meta.textContent = post.category;
    const h = doc.createElement("h3");
    const titleLink = doc.createElement("a"); titleLink.href = href; titleLink.textContent = post.title;
    h.append(titleLink);
    const p = doc.createElement("p"); p.textContent = post.excerpt;
    const a = doc.createElement("a"); a.className = "more"; a.href = href; a.textContent = "Đọc bài viết";
    card.append(meta, h, p, a); grid.append(card);
  });
  if (!posts.length) grid.textContent = "Bài viết mới sẽ được cập nhật tại đây.";
  return html(doc);
}
document.querySelector("#preview-post").addEventListener("click", async () => {
  const post = readForm();
  if (!post) return;
  const tab = window.open("", "_blank");
  if (!tab) { alert("Trình duyệt đã chặn cửa sổ xem trước."); return; }
  try {
    const response = await fetch("assets/article-template.html", { cache: "no-store" });
    if (!response.ok) throw Error("Không đọc được mẫu bài viết");
    // Trang xem trước chỉ hiển thị trên máy này, không ghi bài lên máy chủ.
    tab.document.open();
    const base = `<base href="${new URL("bai-viet/", location.href).href}">`;
    tab.document.write(articleHtml(await response.text(), post).replace("<head>", "<head>" + base));
    tab.document.close();
  } catch (error) { tab.close(); alert(error.message); }
});

// Tạo ZIP chuẩn, không nén, ngay trong trình duyệt để không cần dịch vụ ngoài.
const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let i = 0; i < 8; i++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) value = crcTable[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}
function zipFile(entries) {
  const files = [];
  const central = [];
  let offset = 0;
  const now = new Date();
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  for (const [name, bytes] of entries) {
    const filename = encoder.encode(name);
    const checksum = crc32(bytes);
    const local = new Uint8Array(30 + filename.length);
    const l = new DataView(local.buffer);
    l.setUint32(0, 0x04034b50, true); l.setUint16(4, 20, true); l.setUint16(6, 0x800, true);
    l.setUint16(10, time, true); l.setUint16(12, date, true);
    l.setUint32(14, checksum, true); l.setUint32(18, bytes.length, true); l.setUint32(22, bytes.length, true);
    l.setUint16(26, filename.length, true); local.set(filename, 30);
    files.push(local, bytes);
    const record = new Uint8Array(46 + filename.length);
    const c = new DataView(record.buffer);
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true);
    c.setUint16(8, 0x800, true); c.setUint16(12, time, true); c.setUint16(14, date, true);
    c.setUint32(16, checksum, true); c.setUint32(20, bytes.length, true); c.setUint32(24, bytes.length, true);
    c.setUint16(28, filename.length, true); c.setUint32(42, offset, true); record.set(filename, 46);
    central.push(record);
    offset += local.length + bytes.length;
  }
  const centralLength = central.reduce((sum, record) => sum + record.length, 0);
  const end = new Uint8Array(22);
  const e = new DataView(end.buffer);
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, entries.size, true);
  e.setUint16(10, entries.size, true); e.setUint32(12, centralLength, true);
  e.setUint32(16, offset, true);
  return new Blob([...files, ...central, end], { type: "application/zip" });
}
document.querySelector("#export-site").addEventListener("click", async event => {
  if (dirty && !savePost()) return;
  const button = event.currentTarget;
  button.disabled = true;
  exportStatus.textContent = "Đang tạo gói website…";
  try {
    const response = await fetch("assets/manifest.json", { cache: "no-store" });
    if (!response.ok) throw Error("Không đọc được danh sách tệp website");
    const manifest = await response.json();
    const entries = new Map();
    for (const path of manifest) {
      if (/^bai-viet\/.+\.html$/.test(path) || ["index.html", "bai-viet.html", "assets/posts.json"].includes(path)) continue;
      const file = await fetch(path, { cache: "no-store" });
      if (!file.ok) throw Error("Không tải được tệp " + path);
      entries.set(path, new Uint8Array(await file.arrayBuffer()));
    }
    const [home, archive, template] = await Promise.all(["index.html", "bai-viet.html", "assets/article-template.html"].map(async path => {
      const res = await fetch(path, { cache: "no-store" }); if (!res.ok) throw Error("Không đọc được " + path); return res.text();
    }));
    entries.set("index.html", encoder.encode(listingHtml(home)));
    entries.set("bai-viet.html", encoder.encode(listingHtml(archive)));
    entries.set("assets/posts.json", encoder.encode(JSON.stringify(posts, null, 2)));
    for (const post of posts) entries.set(`bai-viet/${post.slug}.html`, encoder.encode(articleHtml(template, post)));
    entries.set("sitemap.xml", encoder.encode(sitemap([...entries.keys()])));
    entries.set("assets/manifest.json", encoder.encode(JSON.stringify([...entries.keys()].sort())));
    const url = URL.createObjectURL(zipFile(entries));
    const link = document.createElement("a");
    link.href = url; link.download = "minh-viet-website-cap-nhat.zip"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    exportStatus.textContent = "Đã tải gói website. Hãy tải tệp ZIP này lên hosting để đăng bài.";
  } catch (error) { exportStatus.textContent = "Không tạo được gói: " + error.message; }
  finally { button.disabled = false; }
});

async function loadPosts() {
  try {
    const response = await fetch("assets/posts.json", { cache: "no-store" });
    if (!response.ok) throw Error("Không tải được bài viết từ website");
    const published = await response.json();
    const draft = localStorage.getItem(draftKey);
    posts = draft ? JSON.parse(draft) : published;
    if (!Array.isArray(posts)) throw Error("Dữ liệu bài viết không hợp lệ");
    selected = null;
    dirty = false;
    select(posts[0]?.slug || null);
  } catch (error) {
    status.textContent = error.message + ". Hãy mở trang này từ địa chỉ website trên hosting.";
  }
}
loadPosts();
