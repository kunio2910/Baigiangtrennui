const fs = require("fs");
const path = require("path");
const store = require('../lib/content-store');
const { group, card, embed, fill } = require('../lib/list-pages');

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

function enrichTemplate(template, info, page = 1) {
  const canonical = `${SITE_URL}/${info.path}${page > 1 ? `?page=${page}` : ''}`;
  const pageTitle = `${info.title}${page > 1 ? ` - Trang ${page}` : ''} - Bài Giảng Trên Núi`;
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

module.exports = async function handler(req, res) {
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

  try {
    const content = group(await store.query('type', type));
    const items = content[type];
    const page = Number(req.query?.page || 1);
    const count = Math.max(1, Math.ceil(items.length / 9));
    if (!Number.isInteger(page) || page < 1 || page > count) {
      res.statusCode = 404; res.setHeader('X-Robots-Tag', 'noindex'); res.end('Không tìm thấy trang.'); return;
    }
    let html = enrichTemplate(template, info, page);
    html = fill(html, 'categoryList', items.slice((page - 1) * 9, page * 9).map(item => card(item, type, info)).join('') || '<article class="notice-panel"><h2>Chưa có nội dung</h2><p>Không tìm thấy nội dung phù hợp.</p></article>');
    const links = count > 1 ? Array.from({ length: count }, (_, i) => `<a href="/${info.path}${i ? `?page=${i + 1}` : ''}" class="${page === i + 1 ? 'active' : ''}" data-page="${i + 1}"${page === i + 1 ? ' aria-current="page"' : ''}>${i + 1}</a>`).join('') : '';
    html = html.replace('<nav class="pagination" id="categoryPagination" aria-label="Phân trang"></nav>', `<nav class="pagination" id="categoryPagination" aria-label="Phân trang">${links}</nav>`);
    res.statusCode = 200;
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.end(req.method === 'HEAD' ? '' : embed(html, content));
  } catch (error) { store.unavailable(res); }
};
