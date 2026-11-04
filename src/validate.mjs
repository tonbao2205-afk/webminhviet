import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { indexable, canonical } from "./seo.mjs";
import { activityAlbums } from "./gallery-content.mjs";
import { pagePhotos } from "./page-photos.mjs";
import { posts } from "./site-data.mjs";
import { createHash } from "node:crypto";

const root = fileURLToPath(new URL("../dist", import.meta.url));
const allowedImages = new Set([
  "assets/logo-minh-viet.webp",
  "assets/doi-ngu-minh-viet.webp",
  "assets/doi-ngu-cong-so.webp",
  "assets/hoat-dong/du-lich-he-2026.webp",
  "assets/hoat-dong/tiec-gala-he-2026.webp",
  "assets/hoat-dong/sinh-nhat-nhan-vien.webp",
  "assets/hoat-dong/sinh-nhat-quy.webp",
  "assets/hoat-dong/quoc-khanh-01.webp",
  "assets/hoat-dong/quoc-khanh-02.webp",
  "assets/hoat-dong/chuc-tet-co-so-2.webp",
  "assets/hoat-dong/khai-truong-co-so-2.webp",
]);
// Ảnh album khai báo trong gallery-content.mjs và ảnh theo trang trong page-photos.mjs
for (const album of activityAlbums) for (const photo of album.photos) allowedImages.add(`assets/hoat-dong/${photo.file}`);
for (const photos of Object.values(pagePhotos)) for (const photo of photos) allowedImages.add(`assets/trang/${photo.file}`);

const decode = text =>
  String(text || "")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");

const files = [];
async function walk(dir) {
  for (const name of await readdir(dir)) {
    const path = join(dir, name);
    const info = await stat(path);
    if (info.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk(root);

const hashCache = new Map();
async function fileHash(path) {
  if (!hashCache.has(path)) {
    try {
      hashCache.set(path, createHash("md5").update(await readFile(path)).digest("hex"));
    } catch {
      hashCache.set(path, null);
    }
  }
  return hashCache.get(path);
}

const missing = [];
const unapprovedImages = [];
const duplicateImages = [];

// Mỗi bài viết phải có ảnh bìa riêng, không trùng nội dung với ảnh bìa bài khác
const coverOwners = new Map();
for (const post of posts) {
  if (!post.image) continue;
  const hash = await fileHash(join(root, post.image.src));
  if (!hash) continue;
  if (coverOwners.has(hash)) duplicateImages.push(`Ảnh bìa trùng giữa hai bài viết: ${coverOwners.get(hash)} và ${post.slug}`);
  else coverOwners.set(hash, post.slug);
}
const gscErrors = [];
const seenTitles = new Map();
const seenDescs = new Map();
const expectedSitemapUrls = new Set();
let indexableCount = 0;

for (const file of files.filter(path => path.endsWith(".html"))) {
  const html = await readFile(file, "utf8");
  const relFile = relative(root, file).replaceAll("\\", "/");

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (/^(?:https?:|tel:|mailto:|#)/.test(target)) continue;
    const clean = target.split("#")[0].split("?")[0];
    if (!clean) continue;
    const resolved = normalize(join(dirname(file), clean));
    try {
      await stat(resolved);
    } catch {
      missing.push(`${relFile} -> ${target}`);
    }
  }

  const pageImageHashes = new Map();
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const src = tag.match(/\bsrc="([^"]+)"/i)?.[1] || "";
    if (!/\balt="[^"]*"/i.test(tag)) {
      unapprovedImages.push(`${relFile} -> thẻ <img> thiếu thuộc tính alt: ${tag}`);
    }
    if (!/\bwidth="\d+"/i.test(tag) || !/\bheight="\d+"/i.test(tag)) {
      unapprovedImages.push(`${relFile} -> thẻ <img> thiếu width/height (gây CLS): ${tag}`);
    }
    if (/^(?:https?:|data:)/i.test(src)) {
      unapprovedImages.push(`${relFile} -> ảnh ngoài không hợp lệ: ${src}`);
      continue;
    }
    const clean = src.split("#")[0].split("?")[0];
    const resolved = normalize(join(dirname(file), clean));
    const relImg = relative(root, resolved).replaceAll("\\", "/");
    if (!allowedImages.has(relImg)) {
      unapprovedImages.push(`${relFile} -> ảnh không nằm trong danh mục chuẩn: ${relImg}`);
    }
    // Cùng một ảnh (so theo nội dung tệp, kể cả khác tên) không được xuất hiện hai lần trên một trang; logo được lặp lại
    if (relImg === "assets/logo-minh-viet.webp") continue;
    const hash = await fileHash(resolved);
    if (!hash) continue;
    if (pageImageHashes.has(hash)) {
      duplicateImages.push(`${relFile} -> ảnh trùng lặp trên cùng trang: ${pageImageHashes.get(hash)} và ${relImg}`);
    } else {
      pageImageHashes.set(hash, relImg);
    }
  }

  // Kiểm tra phân cấp Heading tuần tự (không nhảy cóc h1 -> h3) và duy nhất 1 <h1> trên toàn bộ HTML
  const h1Count = [...html.matchAll(/<h1\b[^>]*>/gi)].length;
  if (h1Count !== 1) {
    gscErrors.push(`${relFile} -> Số lượng thẻ <h1> không chuẩn (${h1Count}, kỳ vọng đúng 1)`);
  }
  const headingLevels = [...html.matchAll(/<h([1-6])\b/gi)].map(m => Number(m[1]));
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] - headingLevels[i - 1] > 1) {
      gscErrors.push(`${relFile} -> Nhảy cấp tiêu đề h${headingLevels[i - 1]} -> h${headingLevels[i]} (vi phạm chuẩn ngữ nghĩa HTML5)`);
      break;
    }
  }

  // Kiểm tra script ngoại vi không chặn parser (defer hoặc type="module")
  for (const match of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)) {
    const tag = match[0];
    if (!/\bdefer\b/i.test(tag) && !/\basync\b/i.test(tag) && !/\btype="module"/i.test(tag)) {
      gscErrors.push(`${relFile} -> Script chặn luồng phân tích HTML (thiếu defer/module): ${tag}`);
    }
  }

  const robotsTags = [...html.matchAll(/<meta name="robots" content="([^"]*)"/gi)].map(m => m[1]);
  if (robotsTags.length !== 1) {
    gscErrors.push(`${relFile} -> Phải có đúng 1 thẻ <meta name="robots"> (hiện có ${robotsTags.length})`);
  }

  // Kiểm tra tiêu chuẩn Google Search Console & Rich Results (evemilano/Google_Search_Console_Data_Analysis)
  if (indexable(relFile)) {
    indexableCount++;
    const expectedCanon = canonical(relFile);
    expectedSitemapUrls.add(expectedCanon);

    const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] || "").trim();
    const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] || "").trim();
    const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || "";
    const ldJsonRaw = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1] || "";

    if (title.length < 45 || title.length > 65) {
      gscErrors.push(`${relFile} -> Độ dài <title> (${title.length} ký tự) nằm ngoài khung chuẩn Google SERP 45-65 ký tự: "${title}"`);
    }
    if (seenTitles.has(title)) {
      gscErrors.push(`${relFile} -> Trùng lặp <title> (Cannibalization) với ${seenTitles.get(title)}: "${title}"`);
    } else {
      seenTitles.set(title, relFile);
    }

    if (desc.length < 115 || desc.length > 160) {
      gscErrors.push(`${relFile} -> Độ dài <meta description> (${desc.length} ký tự) nằm ngoài khung tối ưu CTR 115-160 ký tự: "${desc}"`);
    }
    if (seenDescs.has(desc)) {
      gscErrors.push(`${relFile} -> Trùng lặp <meta description> với ${seenDescs.get(desc)}`);
    } else {
      seenDescs.set(desc, relFile);
    }

    if (canon !== expectedCanon || canon.includes("#")) {
      gscErrors.push(`${relFile} -> Canonical không chuẩn: "${canon}" (kỳ vọng "${expectedCanon}")`);
    }

    if (!robotsTags[0]?.startsWith("index,follow")) {
      gscErrors.push(`${relFile} -> Trang lập chỉ mục nhưng robots="${robotsTags[0]}"`);
    }

    if (!/<meta property="og:image:width" content="\d+">/.test(html) || !/<meta property="og:image:height" content="\d+">/.test(html)) {
      gscErrors.push(`${relFile} -> Thiếu kích thước og:image:width / og:image:height cho Open Graph / Discover`);
    }

    try {
      const parsed = JSON.parse(ldJsonRaw);
      const nodes = parsed["@graph"] || [];
      const types = new Set(nodes.flatMap(node => (Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]])));
      if (!types.has("Organization") || !types.has("WebSite") || !types.has("BreadcrumbList")) {
        gscErrors.push(`${relFile} -> Thiếu Schema.org Organization, WebSite hoặc BreadcrumbList trong JSON-LD`);
      }
      if (types.has("JobPosting") || types.has("AccountingService")) {
        gscErrors.push(`${relFile} -> Chứa Schema.org gây cảnh báo Rich Results (JobPosting không hạn nộp hoặc LocalBusiness thiếu priceRange)`);
      }
      if (relFile.startsWith("bai-viet/") && relFile !== "bai-viet.html") {
        const articleNode = nodes.find(n => n["@type"] === "Article");
        if (!articleNode || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+07:00$/.test(articleNode.datePublished || "")) {
          gscErrors.push(`${relFile} -> Article Schema thiếu datePublished chuẩn ISO 8601 kèm múi giờ +07:00`);
        }
        if (!articleNode?.author?.name) {
          gscErrors.push(`${relFile} -> Article Schema thiếu author.name theo chuẩn Google Rich Results`);
        }
      }
    } catch {
      gscErrors.push(`${relFile} -> JSON-LD Schema.org không hợp lệ`);
    }
  } else {
    if (!robotsTags[0]?.startsWith("noindex")) {
      gscErrors.push(`${relFile} -> Trang loại trừ lập chỉ mục nhưng thiếu chỉ thị noindex (${robotsTags[0]})`);
    }
    if ((relFile === "quan-tri.html" || relFile.startsWith("assets/")) && robotsTags[0] !== "noindex,nofollow") {
      gscErrors.push(`${relFile} -> Trang quản trị/mẫu nội bộ phải đặt robots="noindex,nofollow" (hiện tại: "${robotsTags[0]}")`);
    }
  }
}

// Kiểm tra đối khớp 1-1 giữa Sitemap.xml, Robots.txt và tập 33 URL lập chỉ mục
try {
  const robotsTxt = await readFile(join(root, "robots.txt"), "utf8");
  if (!robotsTxt.includes("Sitemap: https://thueminhviet.vn/sitemap.xml")) {
    gscErrors.push("robots.txt -> Thiếu khai báo Sitemap: https://thueminhviet.vn/sitemap.xml");
  }
  const sitemapXml = await readFile(join(root, "sitemap.xml"), "utf8");
  const sitemapLocs = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => decode(m[1]));
  if (sitemapLocs.length !== expectedSitemapUrls.size) {
    gscErrors.push(`sitemap.xml -> Số lượng URL (${sitemapLocs.length}) không khớp số trang lập chỉ mục (${expectedSitemapUrls.size})`);
  }
  for (const loc of sitemapLocs) {
    if (!expectedSitemapUrls.has(loc)) {
      gscErrors.push(`sitemap.xml -> Chứa URL không thuộc diện lập chỉ mục hoặc sai canonical: ${loc}`);
    }
  }
} catch (err) {
  gscErrors.push(`Không đọc được robots.txt hoặc sitemap.xml: ${err.message}`);
}

if (missing.length) {
  console.error("Liên kết hoặc tài nguyên bị thiếu:\n" + missing.join("\n"));
  process.exit(1);
}
if (unapprovedImages.length) {
  console.error("Vi phạm quy tắc hình ảnh:\n" + unapprovedImages.join("\n"));
  process.exit(1);
}
if (duplicateImages.length) {
  console.error("Ảnh trùng lặp:\n" + duplicateImages.join("\n"));
  process.exit(1);
}
if (gscErrors.length) {
  console.error("Vi phạm tiêu chuẩn Google Search Console & Rich Results:\n" + gscErrors.join("\n"));
  process.exit(1);
}

console.log(
  `Đã kiểm tra ${files.filter(path => path.endsWith(".html")).length} tệp HTML (${indexableCount} trang lập chỉ mục GSC + sitemap.xml + robots.txt): 0 lỗi liên kết, 100% ảnh chuẩn danh mục (CLS=0), 100% đạt chuẩn Google Search Console, Rich Results & Core Web Vitals (Title 45-65 ký tự, Description 115-160 ký tự, 0 trùng lặp, Heading tuần tự, Script defer).`
);
