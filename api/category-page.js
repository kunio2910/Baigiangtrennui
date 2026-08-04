const fs = require("fs");
const path = require("path");

const SITE_URL = "https://www.baigiangtrennui.com";
const TEMPLATE_PATH = path.join(process.cwd(), "category.html");
const CATEGORY_INFO = {
  saints: {
    path: "cac-thanh",
    title: "Các thánh tiêu biểu",
    description: "Tổng hợp những bài viết về các thánh, các mẫu gương đức tin và đời sống thánh thiện.",
  },
  churches: {
    path: "nha-tho",
    title: "Giới thiệu nhà thờ",
    description: "Những địa điểm nhà thờ, giáo xứ và dấu ấn đức tin được cộng đoàn yêu mến.",
  },
  articles: {
    path: "bai-viet",
    title: "Bài Viết & Suy Niệm",
    description: "Các bài suy niệm, chia sẻ Lời Chúa và nội dung nâng đỡ đời sống cầu nguyện.",
  },
  events: {
    path: "su-kien",
    title: "Sự Kiện sắp tới",
    description: "Các thánh lễ, giờ cầu nguyện, khóa tĩnh tâm và sinh hoạt cộng đoàn.",
  },
  prayers: {
    path: "cau-nguyen",
    title: "Cầu Nguyện",
    description: "Những lời cầu nguyện giúp nâng đỡ đời sống đức tin trong từng hoàn cảnh hằng ngày.",
  },
  catechism: {
    path: "giao-ly",
    title: "Giáo Lý",
    description: "Tổng hợp các kinh nguyện và nội dung giáo lý căn bản trong đời sống Công Giáo.",
  },
};

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function replaceMeta(html, selector, content) {
  const escaped = escapeHtml(content);
  const pattern = selector.type === "name"
    ? new RegExp(`<meta\\s+name="${selector.value}"[^>]*>`, "i")
    : new RegExp(`<meta\\s+property="${selector.value}"[^>]*>`, "i");
  const attribute = selector.type === "name" ? "name" : "property";
  const replacement = `<meta ${attribute}="${selector.value}" content="${escaped}" />`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace("</head>", `    ${replacement}\n  </head>`);
}

function enrichTemplate(template, info) {
  const canonical = `${SITE_URL}/${info.path}`;
  const pageTitle = `${info.title} - Bài Giảng Trên Núi`;
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: info.title,
    description: info.description,
    url: canonical,
    inLanguage: "vi-VN",
    isPartOf: { "@type": "WebSite", name: "Bài Giảng Trên Núi", url: SITE_URL },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: info.title, item: canonical },
    ],
  };

  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`);
  html = replaceMeta(html, { type: "name", value: "description" }, info.description);
  html = replaceMeta(html, { type: "property", value: "og:title" }, pageTitle);
  html = replaceMeta(html, { type: "property", value: "og:description" }, info.description);
  html = replaceMeta(html, { type: "property", value: "og:url" }, canonical);
  html = replaceMeta(html, { type: "name", value: "twitter:title" }, pageTitle);
  html = replaceMeta(html, { type: "name", value: "twitter:description" }, info.description);
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHtml(canonical)}" />`);
  html = html.replace('<h1 id="categoryTitle">Nội dung</h1>', `<h1 id="categoryTitle">${escapeHtml(info.title)}</h1>`);
  html = html.replace('<p id="categoryDescription"></p>', `<p id="categoryDescription">${escapeHtml(info.description)}</p>`);
  html = html.replace(
    "</head>",
    `    <script id="categorySchema" type="application/ld+json">${escapeJson(collectionSchema)}</script>\n` +
      `    <script id="categoryBreadcrumbSchema" type="application/ld+json">${escapeJson(breadcrumbSchema)}</script>\n  </head>`
  );
  return html;
}

module.exports = function handler(req, res) {
  if (req.method && req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    res.end("Method Not Allowed");
    return;
  }

  const type = String(req.query?.type || "");
  const info = CATEGORY_INFO[type];
  const template = fs.readFileSync(TEMPLATE_PATH, "utf8");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (!info) {
    res.statusCode = 404;
    res.setHeader("X-Robots-Tag", "noindex");
    res.end(req.method === "HEAD" ? "" : template);
    return;
  }

  res.statusCode = 200;
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.end(req.method === "HEAD" ? "" : enrichTemplate(template, info));
};
