const fs = require("fs");
const path = require("path");

const SITE_URL = "https://www.baigiangtrennui.com";
const FIREBASE_PROJECT_ID = "truyen-giao-kito";
const FIREBASE_API_KEY = "AIzaSyDIwxGKJCMo5_BJv9fWTaFN-vIz-7CMpLc";
const DETAIL_TEMPLATE_PATH = path.join(process.cwd(), "detail.html");
const FALLBACK_IMAGE = `${SITE_URL}/Default.jpg`;

const TYPE_PATHS = {
  saints: "cac-thanh",
  churches: "nha-tho",
  articles: "bai-viet",
  events: "su-kien",
  prayers: "cau-nguyen",
  catechism: "giao-ly",
};

const TYPE_LABELS = {
  saints: "Các Thánh",
  churches: "Nhà Thờ",
  articles: "Bài Viết",
  events: "Sự Kiện",
  prayers: "Cầu Nguyện",
  catechism: "Giáo Lý",
};

function repairMojibakeText(value) {
  const text = String(value || "");
  if (!/[\u00c3\u00c4\u00c6]|\u00e1\u00ba|\u00e1\u00bb|\u00e2|\u00f0/.test(text)) return text;

  const windows1252 = {
    0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84, 0x2026: 0x85,
    0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88, 0x2030: 0x89, 0x0160: 0x8a,
    0x2039: 0x8b, 0x0152: 0x8c, 0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92,
    0x201c: 0x93, 0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
    0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b, 0x0153: 0x9c,
    0x017e: 0x9e, 0x0178: 0x9f,
  };

  try {
    const bytes = [];
    for (const char of text) {
      const code = char.charCodeAt(0);
      if (windows1252[code]) bytes.push(windows1252[code]);
      else if (code <= 0xff) bytes.push(code);
      else return text;
    }
    const fixed = new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(bytes));
    return fixed && !fixed.includes("\ufffd") ? fixed : text;
  } catch (error) {
    return text;
  }
}

function slugifyText(value) {
  return repairMojibakeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .replace(/\u0110/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fieldValue(field) {
  if (!field) return "";
  if ("stringValue" in field) return field.stringValue;
  if ("timestampValue" in field) return field.timestampValue;
  if ("integerValue" in field) return Number(field.integerValue);
  if ("doubleValue" in field) return Number(field.doubleValue);
  if ("booleanValue" in field) return Boolean(field.booleanValue);
  if ("nullValue" in field) return null;
  if ("arrayValue" in field) return (field.arrayValue.values || []).map(fieldValue);
  if ("mapValue" in field) return firestoreFieldsToObject(field.mapValue.fields || {});
  return "";
}

function firestoreFieldsToObject(fields = {}) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, fieldValue(value)]));
}

function documentToItem(document) {
  if (!document) return null;
  const id = document.name ? document.name.split("/").pop() : "";
  return { id, ...firestoreFieldsToObject(document.fields || {}) };
}

function contentRouteSlug(item = {}) {
  const baseSlug = slugifyText(item.title || item.ref || item.meta || item.slug || item.id) || String(item.id || "");
  const itemId = String(item.id || "").trim();
  if (!itemId) return baseSlug;
  const safeId = itemId.replace(/[\/\\?#]+/g, "-");
  const idAsSlug = slugifyText(safeId);
  const baseWithoutId = idAsSlug
    ? baseSlug.replace(new RegExp(`-+${idAsSlug}$`), "").replace(/-+$/g, "")
    : baseSlug;
  return `${baseWithoutId || baseSlug}--${safeId}`;
}

function contentPath(type, item) {
  const typePath = TYPE_PATHS[type];
  const slug = contentRouteSlug(item);
  return typePath && slug ? `/${typePath}/${encodeURI(slug)}` : "";
}

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

function plainText(value) {
  return repairMojibakeText(String(value || ""))
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function descriptionText(item) {
  const description = plainText(item.description || item.meta || item.bodyHtml);
  if (!description) return "Nội dung Công Giáo trên Bài Giảng Trên Núi.";
  return description.length > 165 ? `${description.slice(0, 162).trim()}...` : description;
}

function absoluteUrl(value, fallback = "") {
  const source = String(value || fallback || "").trim();
  if (!source) return "";
  try {
    return new URL(source, SITE_URL).href;
  } catch (error) {
    return fallback;
  }
}

function schemaDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function sanitizeContentHtml(value) {
  const allowedTags = new Set(["p", "br", "strong", "b", "em", "i", "u", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "img", "a"]);
  const source = String(value || "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, "");

  return source.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (tag, rawName, rawAttributes) => {
    const name = rawName.toLowerCase();
    if (!allowedTags.has(name)) return "";
    if (tag.startsWith("</")) return name === "br" || name === "img" ? "" : `</${name}>`;
    if (name === "br") return "<br />";

    const attributes = {};
    rawAttributes.replace(/([a-zA-Z:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g, (_, key, doubleQuoted, singleQuoted) => {
      attributes[key.toLowerCase()] = doubleQuoted ?? singleQuoted ?? "";
      return "";
    });

    if (name === "a") {
      const href = String(attributes.href || "").trim();
      const safeHref = /^(https?:\/\/|mailto:|#)/i.test(href) ? href : "";
      const title = attributes.title ? ` title="${escapeHtml(attributes.title)}"` : "";
      const hrefAttribute = safeHref ? ` href="${escapeHtml(safeHref)}"` : "";
      return `<a${hrefAttribute}${title} target="_blank" rel="noopener noreferrer">`;
    }

    if (name === "img") {
      const src = String(attributes.src || "").trim();
      if (!/^https?:\/\//i.test(src)) return "";
      const alt = escapeHtml(attributes.alt || attributes.title || "Hình minh họa nội dung");
      return `<img src="${escapeHtml(src)}" alt="${alt}" loading="lazy" decoding="async" />`;
    }

    return `<${name}>`;
  });
}

function renderArticle(item) {
  const title = repairMojibakeText(item.title || "Nội dung Công Giáo");
  const description = repairMojibakeText(item.description || "");
  const image = absoluteUrl(item.image, FALLBACK_IMAGE);
  const bodyHtml = sanitizeContentHtml(item.bodyHtml || (description ? `<p>${escapeHtml(description)}</p>` : ""));
  const sourceUrl = /^https?:\/\//i.test(String(item.sourceUrl || "").trim()) ? String(item.sourceUrl).trim() : "";

  return `
      <figure class="detail-cover">
        <img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" fetchpriority="high" decoding="async" />
      </figure>
      <header class="detail-heading">
        <h1>${escapeHtml(title)}</h1>
        <div class="detail-meta">
          ${item.meta ? `<span><span class="detail-meta-icon cross-tile-icon" aria-hidden="true"></span>${escapeHtml(repairMojibakeText(item.meta))}</span>` : ""}
          ${item.date ? `<span><span class="detail-meta-icon calendar-clock-icon" aria-hidden="true"></span>${escapeHtml(repairMojibakeText(item.date))}</span>` : ""}
        </div>
        ${description ? `<div class="lead-box"><span class="lead-icon" aria-hidden="true">“</span><p class="lead">${escapeHtml(description)}</p></div>` : ""}
      </header>
      <div class="detail-content">
        <div class="detail-body">${bodyHtml}</div>
        ${sourceUrl ? `<p class="detail-source">Nguồn: <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sourceUrl)}</a></p>` : ""}
        <section class="rating-panel" aria-label="Đánh giá bài viết">
          <p class="rating-note">*Nội dung này được xây dựng để hỗ trợ việc học hỏi, cầu nguyện và chia sẻ Tin Mừng. Ước mong mỗi bài viết, mỗi hình ảnh và mỗi sự kiện nơi đây trở thành một lời mời gọi sống đức tin cụ thể hơn trong đời sống hằng ngày.<br />Trang có sử dụng tài nguyên AI. Bạn vui lòng dành ít phút để đánh giá về bài viết và chất lượng website.</p>
          <div class="rating-group">
            <strong>Đánh giá nội dung</strong>
            <div class="rating-stars" role="radiogroup" aria-label="Đánh giá nội dung">
              ${[1, 2, 3, 4, 5].map((value) => `<button type="button" data-rating-kind="content" data-rating="${value}" aria-label="${value} sao">★</button>`).join("")}
            </div>
          </div>
          <div class="rating-group">
            <strong>Đánh giá trình bày</strong>
            <div class="rating-stars" role="radiogroup" aria-label="Đánh giá trình bày">
              ${[1, 2, 3, 4, 5].map((value) => `<button type="button" data-rating-kind="layout" data-rating="${value}" aria-label="${value} sao">★</button>`).join("")}
            </div>
          </div>
          <div class="rating-row"><button class="primary-button" type="button" id="submitRating">Gửi</button></div>
          <small id="ratingMessage"></small>
          <div class="feedback-box">
            <label for="feedbackMessage">Ý kiến đóng góp</label>
            <textarea id="feedbackMessage" rows="4" placeholder="Nhập ý kiến đóng góp của bạn..."></textarea>
            <div class="rating-row"><button class="primary-button" type="button" id="submitFeedback">Gửi ý kiến</button></div>
            <small id="feedbackStatus"></small>
          </div>
        </section>
      </div>`;
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

function enrichTemplate(template, type, item) {
  const route = contentPath(type, item);
  const canonical = `${SITE_URL}${route}`;
  const title = `${plainText(item.title)} - Bài Giảng Trên Núi`;
  const description = descriptionText(item);
  const image = absoluteUrl(item.image, FALLBACK_IMAGE);
  const categoryUrl = `${SITE_URL}/${TYPE_PATHS[type]}`;
  const published = schemaDate(item.createdDate || item.createdAtText || item.createdAt);
  const modified = schemaDate(item.updatedAt || item.createdDate || item.createdAtText || item.createdAt);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: plainText(item.title),
    description,
    image: [image],
    url: canonical,
    inLanguage: "vi-VN",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    articleSection: TYPE_LABELS[type],
    author: { "@type": "Organization", name: "Bài Giảng Trên Núi", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Bài Giảng Trên Núi",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.png` },
    },
  };
  if (published) schema.datePublished = published;
  if (modified) schema.dateModified = modified;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: TYPE_LABELS[type], item: categoryUrl },
      { "@type": "ListItem", position: 3, name: plainText(item.title), item: canonical },
    ],
  };

  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, { type: "name", value: "description" }, description);
  html = replaceMeta(html, { type: "property", value: "og:title" }, title);
  html = replaceMeta(html, { type: "property", value: "og:description" }, description);
  html = replaceMeta(html, { type: "property", value: "og:image" }, image);
  html = replaceMeta(html, { type: "property", value: "og:url" }, canonical);
  html = replaceMeta(html, { type: "name", value: "twitter:image" }, image);
  html = replaceMeta(html, { type: "name", value: "twitter:title" }, title);
  html = replaceMeta(html, { type: "name", value: "twitter:description" }, description);
  html = html.replace(/<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHtml(canonical)}" />`);
  html = html.replace(
    "</head>",
    `    <script id="detailSchema" type="application/ld+json">${escapeJson(schema)}</script>\n` +
      `    <script id="detailBreadcrumbSchema" type="application/ld+json">${escapeJson(breadcrumb)}</script>\n  </head>`
  );
  html = html.replace(
    '<article class="detail-article" id="detailArticle"></article>',
    `<article class="detail-article" id="detailArticle">${renderArticle(item)}</article>`
  );
  return html;
}

async function fetchDocumentById(id) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/contents/${encodeURIComponent(id)}?key=${encodeURIComponent(FIREBASE_API_KEY)}`;
  const response = await fetch(url);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore returned ${response.status}`);
  return documentToItem(await response.json());
}

async function fetchDocumentBySlug(type, slug) {
  let pageToken = "";
  do {
    const url = new URL(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/contents`);
    url.searchParams.set("key", FIREBASE_API_KEY);
    url.searchParams.set("pageSize", "300");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Firestore returned ${response.status}`);
    const data = await response.json();
    const match = (data.documents || [])
      .map(documentToItem)
      .find((item) => item.type === type && slugifyText(item.title || item.ref || item.meta || item.slug || item.id) === slug);
    if (match) return match;
    pageToken = data.nextPageToken || "";
  } while (pageToken);
  return null;
}

async function findContent(type, slug) {
  const idMatch = String(slug || "").match(/--([^/]+)$/);
  if (idMatch) {
    const item = await fetchDocumentById(decodeURIComponent(idMatch[1]));
    return item && item.type === type ? item : null;
  }
  return fetchDocumentBySlug(type, String(slug || ""));
}

module.exports = async function handler(req, res) {
  if (req.method && req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    res.end("Method Not Allowed");
    return;
  }

  const type = String(req.query?.type || "");
  const slug = String(req.query?.slug || "");
  const template = fs.readFileSync(DETAIL_TEMPLATE_PATH, "utf8");
  if (!TYPE_PATHS[type] || !slug) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-Robots-Tag", "noindex");
    res.end(template);
    return;
  }

  try {
    const item = await findContent(type, slug);
    if (!item || item.status === "unactived") {
      res.statusCode = 404;
      res.setHeader("X-Robots-Tag", "noindex");
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(template);
      return;
    }

    const html = enrichTemplate(template, type, item);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    res.end(req.method === "HEAD" ? "" : html);
  } catch (error) {
    // Keep the existing client-rendered page available if Firestore is temporarily unavailable.
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=120");
    res.end(req.method === "HEAD" ? "" : template);
  }
};
