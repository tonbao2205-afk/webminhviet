export const origin = "https://thueminhviet.vn";

const redirectDestinations = {
  "dich-vu/thu-tuc-doanh-nghiep.html": "dich-vu/dang-ky-doanh-nghiep.html",
  "dich-vu/tu-van-tai-chinh-quan-tri.html": "dich-vu/tu-van-tai-chinh-doanh-nghiep.html",
  "dich-vu/dao-tao-nghiep-vu.html": "dich-vu.html",
};

const excluded = new Set([
  "404.html",
  "quan-tri.html",
  ...Object.keys(redirectDestinations),
]);

export const indexable = path => path.endsWith(".html") && !path.startsWith("assets/") && !excluded.has(path);

export const canonical = path => origin + "/" + path.replace(/(^|\/)index\.html$/, "$1");

const esc = text =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const decode = text =>
  String(text || "")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");

/**
 * Tối ưu độ dài <title> chuẩn Google Search Console & Google SERP (48–64 ký tự giải mã —
 * nằm trọn trong khung hiển thị SERP không bị cắt "..." và phân tách rõ chủ đích từ khóa, 0 Cannibalization,
 * tham chiếu bộ khung phân tích CTR/GSC evemilano/Google_Search_Console_Data_Analysis).
 */
export const titles = {
  "index.html": "Dịch vụ Kế toán Thuế, Pháp lý & Tư vấn Doanh nghiệp | Minh Việt",
  "gioi-thieu.html": "Giới thiệu Công ty TNHH Tư vấn & Đào tạo Minh Việt | Hà Nội",
  "dich-vu.html": "Hệ thống 18 Dịch vụ Kế toán, Thuế & Pháp lý | Minh Việt",
  "dich-vu/dang-ky-doanh-nghiep.html": "Dịch vụ Đăng ký Doanh nghiệp & Pháp lý tại Hà Nội | Minh Việt",
  "dich-vu/ke-toan-va-thue.html": "Phân hệ Dịch vụ Kế toán, Kê khai & Quyết toán Thuế | Minh Việt",
  "dich-vu/tu-van-tai-chinh-doanh-nghiep.html": "Phân hệ Tư vấn Tài chính Doanh nghiệp & Dòng tiền SME | Minh Việt",
  "dich-vu/tu-van-quan-ly.html": "Nhóm dịch vụ Tư vấn Quản lý & Vận hành Doanh nghiệp | Minh Việt",
  "dich-vu/dang-ky-doanh-nghiep/thanh-lap-doanh-nghiep.html": "Dịch vụ Thành lập Doanh nghiệp trọn gói tại Hà Nội | Minh Việt",
  "dich-vu/dang-ky-doanh-nghiep/thay-doi-dang-ky-doanh-nghiep.html": "Dịch vụ Thay đổi Đăng ký Kinh doanh Doanh nghiệp | Minh Việt",
  "dich-vu/dang-ky-doanh-nghiep/thay-doi-ten-doanh-nghiep.html": "Dịch vụ Thay đổi Tên Doanh nghiệp & Hồ sơ Pháp lý | Minh Việt",
  "dich-vu/dang-ky-doanh-nghiep/giai-the-doanh-nghiep.html": "Dịch vụ Giải thể Doanh nghiệp & Khóa Mã số thuế | Minh Việt",
  "dich-vu/dang-ky-doanh-nghiep/tu-van-hop-nhat-va-sap-nhap-doanh-nghiep.html": "Dịch vụ Tư vấn Hợp nhất và Sáp nhập Doanh nghiệp | Minh Việt",
  "dich-vu/dang-ky-doanh-nghiep/tu-van-mua-ban-doanh-nghiep.html": "Dịch vụ Tư vấn Mua bán & Chuyển nhượng Doanh nghiệp | Minh Việt",
  "dich-vu/ke-toan-va-thue/thiet-lap-thue-ban-dau.html": "Dịch vụ Thiết lập Hồ sơ Thuế ban đầu cho Doanh nghiệp | Minh Việt",
  "dich-vu/ke-toan-va-thue/ke-toan-thue-tron-goi.html": "Dịch vụ Kế toán Thuế trọn gói định kỳ tại Hà Nội | Minh Việt",
  "dich-vu/ke-toan-va-thue/ke-toan-noi-bo.html": "Dịch vụ Kế toán Nội bộ & Kiểm soát số liệu quản trị | Minh Việt",
  "dich-vu/ke-toan-va-thue/lam-lai-so-sach-ke-toan.html": "Dịch vụ Làm lại & Rà soát Sổ sách Kế toán nhiều kỳ | Minh Việt",
  "dich-vu/ke-toan-va-thue/lap-bao-cao-tai-chinh-cuoi-nam.html": "Dịch vụ Lập Báo cáo Tài chính cuối năm chuẩn mực | Minh Việt",
  "dich-vu/ke-toan-va-thue/bao-cao-thue-cuoi-nam.html": "Dịch vụ Lập Báo cáo Thuế cuối năm & Đối chiếu tờ khai | Minh Việt",
  "dich-vu/ke-toan-va-thue/quyet-toan-thue-cuoi-nam.html": "Dịch vụ Quyết toán Thuế cuối năm & Giải trình số liệu | Minh Việt",
  "dich-vu/ke-toan-va-thue/hoan-thue-gia-tri-gia-tang.html": "Dịch vụ Hoàn thuế Giá trị gia tăng (GTGT) chuẩn hồ sơ | Minh Việt",
  "dich-vu/ke-toan-va-thue/hoan-thue-thu-nhap-ca-nhan.html": "Dịch vụ Hoàn thuế Thu nhập cá nhân (TNCN) đúng hạn | Minh Việt",
  "dich-vu/tu-van-tai-chinh-doanh-nghiep/tu-van-tai-chinh-doanh-nghiep.html": "Dịch vụ Tư vấn Tài chính, Vốn & Hiệu quả Đầu tư | Minh Việt",
  "dich-vu/tu-van-quan-ly/tu-van-tai-cau-truc-doanh-nghiep.html": "Dịch vụ Tư vấn Tái cấu trúc Tổ chức & Vận hành | Minh Việt",
  "dich-vu/tu-van-quan-ly/xay-dung-he-thong-quan-tri-doanh-nghiep.html": "Dịch vụ Xây dựng Hệ thống Quản trị & Quy chế Nội bộ | Minh Việt",
  "bai-viet.html": "Chuyên san Bài viết Kế toán, Thuế & Quản trị SME | Minh Việt",
  "bai-viet/quan-ly-ho-so-ke-toan-co-he-thong.html": "Hướng dẫn Quản lý Hồ sơ Kế toán có hệ thống cho SME | Minh Việt",
  "bai-viet/doanh-nghiep-moi-can-chuan-bi-gi.html": "Doanh nghiệp mới thành lập cần chuẩn bị hồ sơ gì? | Minh Việt",
  "bai-viet/bao-cao-quan-tri-cho-doanh-nghiep-nho-va-vua.html": "Báo cáo quản trị cho doanh nghiệp nhỏ và vừa (SME) | Minh Việt",
  "hinh-anh-hoat-dong/index.html": "Hình ảnh Hoạt động Đội ngũ & Văn hóa Doanh nghiệp | Minh Việt",
  "tuyen-dung/index.html": "Tuyển dụng Nhân sự Kế toán & Chuyên viên Tư vấn Thuế | Minh Việt",
  "tuyen-dung/nhan-vien-ke-toan.html": "Mô tả vị trí Nhân viên Kế toán Tổng hợp tại Hà Nội | Minh Việt",
  "lien-he.html": "Hồ sơ Pháp lý (MST 0109123183) & Liên hệ Tư vấn | Minh Việt",
};

/**
 * Tối ưu độ dài <meta name="description"> chuẩn snippet Google SERP (115–158 ký tự giải mã,
 * hiển thị trọn vẹn trên cả Desktop & Mobile, 0 trùng lặp giữa 33 trang lập chỉ mục).
 */
const descriptions = {
  "index.html":
    "Công ty TNHH Tư vấn và Đào tạo Minh Việt (MST: 0109123183) cung cấp dịch vụ đăng ký doanh nghiệp, kế toán thuế, tư vấn tài chính và quản lý tại Hà Nội.",
  "gioi-thieu.html":
    "Hồ sơ năng lực Công ty TNHH Tư vấn và Đào tạo Minh Việt (MST: 0109123183): 250+ khách hàng thường xuyên, 120+ dự án soát xét và 1.500+ hồ sơ pháp lý.",
  "dich-vu.html":
    "Tra cứu 18 dịch vụ thuộc 04 phân hệ của Minh Việt tại Hà Nội: Đăng ký doanh nghiệp, Kế toán và thuế, Tư vấn tài chính doanh nghiệp và Tư vấn quản lý.",
  "dich-vu/dang-ky-doanh-nghiep.html":
    "Phân hệ đăng ký doanh nghiệp tại Hà Nội của Minh Việt: thành lập mới, thay đổi ĐKKD, đổi tên, mua bán, hợp nhất sáp nhập và giải thể đúng quy định.",
  "dich-vu/ke-toan-va-thue.html":
    "Phân hệ dịch vụ kế toán và thuế của Minh Việt tại Hà Nội: thiết lập thuế ban đầu, kế toán trọn gói, làm lại sổ sách, báo cáo tài chính và quyết toán.",
  "dich-vu/tu-van-tai-chinh-doanh-nghiep.html":
    "Phân hệ tư vấn tài chính doanh nghiệp của Minh Việt: phân tích cấu trúc vốn, lập kế hoạch dòng tiền, dự báo ngân sách và đánh giá hiệu quả đầu tư SME.",
  "dich-vu/tu-van-quan-ly.html":
    "Phân hệ tư vấn quản lý doanh nghiệp của Minh Việt tại Hà Nội: tái cấu trúc mô hình tổ chức, chuẩn hóa quy trình phối hợp và xây dựng hệ thống quản trị.",
  "bai-viet.html":
    "Chuyên mục chia sẻ kinh nghiệm thực tiễn về quản lý hồ sơ chứng từ kế toán, thủ tục thuế ban đầu cho doanh nghiệp mới và hệ thống báo cáo quản trị SME.",
  "hinh-anh-hoat-dong/index.html":
    "Tư liệu hình ảnh hoạt động tập thể, du lịch hè, sinh nhật nhân sự, kỷ niệm Quốc khánh và khai trương cơ sở của Công ty TNHH Tư vấn và Đào tạo Minh Việt.",
  "tuyen-dung/index.html":
    "Thông tin tuyển dụng tại Công ty TNHH Tư vấn và Đào tạo Minh Việt (Hà Nội): môi trường nghiệp vụ kế toán - thuế bài bản, lộ trình phát triển rõ ràng.",
  "tuyen-dung/nhan-vien-ke-toan.html":
    "Bản mô tả vị trí Nhân viên Kế toán tại Minh Việt (Hà Nội): thực hiện hạch toán chứng từ, kê khai thuế định kỳ, lập báo cáo tài chính và hồ sơ doanh nghiệp.",
  "lien-he.html":
    "Thông tin pháp lý và liên hệ Công ty TNHH Tư vấn và Đào tạo Minh Việt — MST: 0109123183, ĐT: 0987 038 192, Số 37/64 phố Đông Thiên, Phường Vĩnh Hưng, Hà Nội.",
};

const groupLabels = {
  "dang-ky-doanh-nghiep": "Dịch vụ đăng ký doanh nghiệp",
  "ke-toan-va-thue": "Dịch vụ kế toán và thuế",
  "tu-van-tai-chinh-doanh-nghiep": "Dịch vụ tư vấn tài chính doanh nghiệp",
  "tu-van-quan-ly": "Dịch vụ tư vấn quản lý",
};

const topBreadcrumbLabels = {
  "gioi-thieu.html": "Giới thiệu",
  "dich-vu.html": "Dịch vụ",
  "bai-viet.html": "Bài viết",
  "hinh-anh-hoat-dong/index.html": "Hình ảnh hoạt động",
  "tuyen-dung/index.html": "Tuyển dụng",
  "lien-he.html": "Pháp lý & Liên hệ",
};

function trimToBudget(text, maxLen = 158) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  const sliced = clean.slice(0, maxLen - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return (lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).replace(/[.,;:–—-\s]+$/, "") + "…";
}

function buildDescription(path, rawDesc, headline) {
  if (descriptions[path]) return descriptions[path];
  const cleanRaw = String(rawDesc || "").replace(/\s+/g, " ").trim().replace(/\.*$/, "");
  if (cleanRaw.length >= 115 && cleanRaw.length <= 158) return `${cleanRaw}.`.length <= 158 ? `${cleanRaw}.` : cleanRaw;
  if (cleanRaw.length > 158) return trimToBudget(cleanRaw, 158);

  if (path.startsWith("dich-vu/")) {
    const mediumSuffix = " Triển khai bởi đội ngũ chuyên viên Minh Việt tại Hà Nội.";
    const fullSuffix = " Thực hiện bởi đội ngũ chuyên viên Minh Việt tại Hà Nội, bàn giao hồ sơ đầy đủ.";
    const withMedium = `${cleanRaw}.${mediumSuffix}`;
    if (withMedium.length >= 115 && withMedium.length <= 158) return withMedium;
    const withFull = `${cleanRaw}.${fullSuffix}`;
    if (withFull.length <= 158) return withFull;
    return trimToBudget(`${cleanRaw} tại Công ty TNHH Tư vấn và Đào tạo Minh Việt (Hà Nội).`, 158);
  }

  const fallback = cleanRaw
    ? `${cleanRaw}. Chia sẻ nghiệp vụ thực tiễn từ Công ty TNHH Tư vấn và Đào tạo Minh Việt tại Hà Nội.`
    : `${headline} — Công ty TNHH Tư vấn và Đào tạo Minh Việt (MST: 0109123183) tại Hà Nội.`;
  return trimToBudget(fallback, 158);
}

function buildTitle(path, rawTitle, post) {
  if (titles[path]) return titles[path];
  const candidate = post ? `${post.title} | Minh Việt` : rawTitle;
  if (candidate.length <= 65) return candidate;
  const suffix = " | Minh Việt";
  const base = (post ? post.title : rawTitle.replace(/\s*\|\s*Minh Việt$/, "")).trim();
  return trimToBudget(base, 65 - suffix.length) + suffix;
}

function buildBreadcrumbList(path, url, headline) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Trang chủ",
      item: origin + "/",
    },
  ];
  if (path === "index.html") return items;

  const parts = path.split("/");
  if (parts[0] === "dich-vu" && parts.length === 2) {
    const groupSlug = parts[1].replace(/\.html$/, "");
    items.push({ "@type": "ListItem", position: 2, name: "Dịch vụ", item: origin + "/dich-vu.html" });
    items.push({ "@type": "ListItem", position: 3, name: groupLabels[groupSlug] || headline, item: url });
  } else if (parts[0] === "dich-vu" && parts.length === 3) {
    const groupSlug = parts[1];
    items.push({ "@type": "ListItem", position: 2, name: "Dịch vụ", item: origin + "/dich-vu.html" });
    items.push({
      "@type": "ListItem",
      position: 3,
      name: groupLabels[groupSlug] || "Nhóm dịch vụ",
      item: `${origin}/dich-vu/${groupSlug}.html`,
    });
    items.push({ "@type": "ListItem", position: 4, name: headline, item: url });
  } else if (parts[0] === "bai-viet" && parts.length === 2) {
    items.push({ "@type": "ListItem", position: 2, name: "Bài viết", item: origin + "/bai-viet.html" });
    items.push({ "@type": "ListItem", position: 3, name: headline, item: url });
  } else if (parts[0] === "tuyen-dung" && parts[1] !== "index.html") {
    items.push({ "@type": "ListItem", position: 2, name: "Tuyển dụng", item: origin + "/tuyen-dung/" });
    items.push({ "@type": "ListItem", position: 3, name: headline, item: url });
  } else {
    items.push({ "@type": "ListItem", position: 2, name: topBreadcrumbLabels[path] || headline, item: url });
  }
  return items;
}

export function enhanceHtml(path, source, post) {
  let text = source.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/g, "");
  text = text.replace(/<meta name="robots"[^>]*>/g, "");
  text = text.replace(/<link rel="canonical"[^>]*>/g, "");

  if (!indexable(path)) {
    if (redirectDestinations[path]) {
      const targetUrl = canonical(redirectDestinations[path]);
      return text.replace(
        "</head>",
        `<!--seo:start--><meta name="robots" content="noindex,follow"><link rel="canonical" href="${esc(targetUrl)}"><!--seo:end--></head>`
      );
    }
    const directive = path === "quan-tri.html" || path.startsWith("assets/") ? "noindex,nofollow" : "noindex,follow";
    return text.replace("</head>", `<!--seo:start--><meta name="robots" content="${directive}"><!--seo:end--></head>`);
  }

  const rawTitle = decode(text.match(/<title>(.*?)<\/title>/s)?.[1] || "Minh Việt");
  const title = buildTitle(path, rawTitle, post);
  const headline = decode(
    text
      .match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]
      ?.replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim() || title
  );
  const rawDescription = decode(text.match(/<meta name="description" content="([^"]*)"/)?.[1] || "");
  const description = buildDescription(path, rawDescription, headline);

  text = text
    .replace(/<title>.*?<\/title>/s, "<title>" + esc(title) + "</title>")
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(description) + '">');

  const url = canonical(path);
  const isAbout = path === "gioi-thieu.html";
  const isArticle = path.startsWith("bai-viet/") && path !== "bai-viet.html";
  const isServiceDetail = /^dich-vu\/[^/]+\/[^/]+\.html$/.test(path);
  const ogImage = isAbout ? `${origin}/assets/doi-ngu-cong-so.webp` : `${origin}/assets/doi-ngu-minh-viet.webp`;
  const ogWidth = isAbout ? 2048 : 1280;
  const ogHeight = isAbout ? 1365 : 853;
  const ogAlt = isAbout
    ? "Đội ngũ chuyên viên Công ty TNHH Tư vấn và Đào tạo Minh Việt tại Hà Nội"
    : "Đội ngũ Công ty TNHH Tư vấn và Đào tạo Minh Việt";

  const logoObject = {
    "@type": "ImageObject",
    "@id": origin + "/#logo",
    url: origin + "/assets/logo-minh-viet.webp",
    contentUrl: origin + "/assets/logo-minh-viet.webp",
    width: 2048,
    height: 1528,
    caption: "Logo Công ty TNHH Tư vấn và Đào tạo Minh Việt",
  };

  const primaryImageObject = {
    "@type": "ImageObject",
    "@id": url + "#primaryimage",
    url: ogImage,
    contentUrl: ogImage,
    width: ogWidth,
    height: ogHeight,
    caption: ogAlt,
  };

  const org = {
    "@type": "Organization",
    "@id": origin + "/#organization",
    name: "Công ty TNHH Tư vấn và Đào tạo Minh Việt",
    legalName: "CÔNG TY TNHH TƯ VẤN VÀ ĐÀO TẠO MINH VIỆT",
    alternateName: ["MINH VIET CONSULTING AND TRAINING COMPANY LIMITED", "MINH VIET CONSULTING", "Minh Việt"],
    description:
      "Công ty TNHH Tư vấn và Đào tạo Minh Việt cung cấp dịch vụ đăng ký doanh nghiệp, kế toán thuế, tư vấn tài chính và tư vấn quản lý cho doanh nghiệp nhỏ và vừa tại Hà Nội.",
    taxID: "0109123183",
    vatID: "0109123183",
    foundingDate: "2020-03-10",
    founder: {
      "@type": "Person",
      name: "Lê Thị Lan",
      jobTitle: "Giám đốc",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Số 37/64 phố Đông Thiên, Phường Vĩnh Hưng",
      addressLocality: "Hà Nội",
      addressRegion: "Hà Nội",
      postalCode: "100000",
      addressCountry: "VN",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Hà Nội",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+84-987-038-192",
        email: "thueminhviet.vn@gmail.com",
        contactType: "customer service",
        areaServed: "VN",
        availableLanguage: ["vi"],
      },
    ],
    url: origin + "/",
    telephone: "+84-987-038-192",
    email: "thueminhviet.vn@gmail.com",
    logo: logoObject,
    image: primaryImageObject,
  };

  const breadcrumbId = url + "#breadcrumb";
  const isCollection =
    path === "dich-vu.html" ||
    path === "bai-viet.html" ||
    path === "hinh-anh-hoat-dong/index.html" ||
    path === "tuyen-dung/index.html" ||
    /^dich-vu\/[^/]+\.html$/.test(path);
  const pageType = isAbout ? "AboutPage" : path === "lien-he.html" ? "ContactPage" : isCollection ? "CollectionPage" : "WebPage";

  const page = {
    "@type": pageType,
    "@id": url + "#webpage",
    url,
    name: headline,
    description,
    inLanguage: "vi-VN",
    isPartOf: { "@id": origin + "/#website" },
    about: { "@id": origin + "/#organization" },
    primaryImageOfPage: { "@id": primaryImageObject["@id"] },
    breadcrumb: { "@id": breadcrumbId },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: buildBreadcrumbList(path, url, headline),
  };

  const graph = [
    org,
    {
      "@type": "WebSite",
      "@id": origin + "/#website",
      url: origin + "/",
      name: "Minh Việt",
      alternateName: "Công ty TNHH Tư vấn và Đào tạo Minh Việt",
      publisher: { "@id": org["@id"] },
      inLanguage: "vi-VN",
    },
    primaryImageObject,
    page,
    breadcrumb,
  ];

  let articleIsoDateTime = "";
  if (isArticle) {
    const articleId = url + "#article";
    page.mainEntity = { "@id": articleId };
    const sectionName =
      post?.category ||
      decode(text.match(/<div class="article-head[^>]*>[\s\S]*?<div class="eyebrow">(.*?)<\/div>/)?.[1] || "").trim();
    const article = {
      "@type": "Article",
      "@id": articleId,
      headline,
      description,
      image: [primaryImageObject],
      mainEntityOfPage: { "@id": page["@id"] },
      author: {
        "@type": "Organization",
        "@id": org["@id"],
        name: org.name,
        url: org.url,
      },
      publisher: { "@id": org["@id"] },
      inLanguage: "vi-VN",
    };
    if (sectionName) article.articleSection = sectionName;

    const d = (post?.date || text.match(/Ngày đăng:\s*(\d{2}\/\d{2}\/\d{4})/)?.[1])?.split("/");
    if (d?.length === 3) {
      const isoDate = `${d[2]}-${d[1]}-${d[0]}`;
      articleIsoDateTime = `${isoDate}T08:00:00+07:00`;
      article.datePublished = articleIsoDateTime;
      article.dateModified = articleIsoDateTime;
      page.datePublished = articleIsoDateTime;
      page.dateModified = articleIsoDateTime;
    }
    graph.push(article);
  }

  if (isServiceDetail) {
    const groupSlug = path.split("/")[1];
    const serviceId = url + "#service";
    page.mainEntity = { "@id": serviceId };
    graph.push({
      "@type": "Service",
      "@id": serviceId,
      name: headline,
      serviceType: groupLabels[groupSlug] || "Dịch vụ doanh nghiệp",
      description,
      url,
      provider: { "@id": org["@id"] },
      areaServed: { "@type": "AdministrativeArea", name: "Hà Nội" },
    });
  }

  const data = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c");
  const articleMeta = articleIsoDateTime
    ? `<meta property="article:published_time" content="${esc(articleIsoDateTime)}">` +
      `<meta property="article:modified_time" content="${esc(articleIsoDateTime)}">`
    : "";

  const tags =
    `<!--seo:start-->` +
    `<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">` +
    `<link rel="canonical" href="${esc(url)}">` +
    `<meta property="og:locale" content="vi_VN">` +
    `<meta property="og:site_name" content="Công ty TNHH Tư vấn và Đào tạo Minh Việt">` +
    `<meta property="og:type" content="${isArticle ? "article" : "website"}">` +
    `<meta property="og:title" content="${esc(title)}">` +
    `<meta property="og:description" content="${esc(description)}">` +
    `<meta property="og:url" content="${esc(url)}">` +
    `<meta property="og:image" content="${esc(ogImage)}">` +
    `<meta property="og:image:type" content="image/webp">` +
    `<meta property="og:image:width" content="${ogWidth}">` +
    `<meta property="og:image:height" content="${ogHeight}">` +
    `<meta property="og:image:alt" content="${esc(ogAlt)}">` +
    articleMeta +
    `<meta name="twitter:card" content="summary_large_image">` +
    `<meta name="twitter:title" content="${esc(title)}">` +
    `<meta name="twitter:description" content="${esc(description)}">` +
    `<meta name="twitter:image" content="${esc(ogImage)}">` +
    `<meta name="twitter:image:alt" content="${esc(ogAlt)}">` +
    `<script type="application/ld+json">${data}</script>` +
    `<!--seo:end-->`;
  return text.replace("</head>", tags + "</head>");
}

export function sitemap(paths, lastmod = new Date().toISOString().slice(0, 10)) {
  const sorted = [...new Set(paths)].filter(indexable).sort((a, b) => {
    if (a === "index.html") return -1;
    if (b === "index.html") return 1;
    return canonical(a).localeCompare(canonical(b));
  });
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    sorted.map(path => `<url><loc>${esc(canonical(path))}</loc><lastmod>${esc(lastmod)}</lastmod></url>`).join("\n") +
    "\n</urlset>\n"
  );
}
