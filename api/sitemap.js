const SITE_URL = "https://www.baigiangtrennui.com";
const FIREBASE_PROJECT_ID = "truyen-giao-kito";
const FIREBASE_API_KEY = "AIzaSyDIwxGKJCMo5_BJv9fWTaFN-vIz-7CMpLc";

const TYPE_PATHS = {
  saints: "cac-thanh",
  churches: "nha-tho",
  articles: "bai-viet",
  events: "su-kien",
  prayers: "cau-nguyen",
  catechism: "giao-ly",
};

const CATEGORY_PATHS = [
  ["/", { changefreq: "daily", priority: "1.0" }],
  ["/category.html?type=saints", { changefreq: "weekly", priority: "0.8" }],
  ["/category.html?type=churches", { changefreq: "weekly", priority: "0.8" }],
  ["/category.html?type=articles", { changefreq: "weekly", priority: "0.8" }],
  ["/category.html?type=events", { changefreq: "weekly", priority: "0.8" }],
  ["/category.html?type=prayers", { changefreq: "weekly", priority: "0.8" }],
  ["/category.html?type=catechism", { changefreq: "weekly", priority: "0.8" }],
  ["/prayer-request.html", { changefreq: "monthly", priority: "0.7" }],
];

const FALLBACK_CONTENT_URLS = [
  "/cac-thanh/thanh-giuse",
  "/cac-thanh/thanh-maria",
  "/cac-thanh/thanh-phanxico-assisi",
  "/cac-thanh/thanh-teresa-hai-dong-giesu",
  "/cac-thanh/thanh-phaolo",
  "/cac-thanh/thanh-phero",
  "/cac-thanh/thanh-gioan-tong-do",
  "/nha-tho/nha-tho-duc-ba-sai-gon",
  "/nha-tho/nha-tho-lon-ha-noi",
  "/nha-tho/nha-tho-phu-nhai",
  "/bai-viet/suc-manh-cua-loi-cau-nguyen",
  "/bai-viet/y-nghia-cua-thap-gia",
  "/bai-viet/chua-da-song-lai",
  "/su-kien/thanh-le-chua-nhat",
  "/su-kien/gio-chau-thanh-the",
  "/su-kien/khoa-tinh-tam",
  "/cau-nguyen/cau-nguyen-buoi-sang",
  "/cau-nguyen/cau-nguyen-truoc-khi-hoc-hoi-loi-chua",
  "/cau-nguyen/cau-nguyen-cho-gia-dinh",
  "/cau-nguyen/cau-nguyen-khi-gap-kho-khan",
  "/cau-nguyen/cau-nguyen-buoi-toi",
  "/giao-ly/kinh-lay-cha",
  "/giao-ly/kinh-kinh-mung",
  "/giao-ly/kinh-sang-danh",
  "/giao-ly/kinh-tin-kinh",
  "/giao-ly/kinh-an-nan-toi",
];

function repairMojibakeText(value) {
  const text = String(value || "");
  if (!/[\u00c3\u00c4\u00c6]|\u00e1\u00ba|\u00e1\u00bb|\u00e2|\u00f0/.test(text)) return text;

  const windows1252 = {
    0x20ac: 0x80,
    0x201a: 0x82,
    0x0192: 0x83,
    0x201e: 0x84,
    0x2026: 0x85,
    0x2020: 0x86,
    0x2021: 0x87,
    0x02c6: 0x88,
    0x2030: 0x89,
    0x0160: 0x8a,
    0x2039: 0x8b,
    0x0152: 0x8c,
    0x017d: 0x8e,
    0x2018: 0x91,
    0x2019: 0x92,
    0x201c: 0x93,
    0x201d: 0x94,
    0x2022: 0x95,
    0x2013: 0x96,
    0x2014: 0x97,
    0x02dc: 0x98,
    0x2122: 0x99,
    0x0161: 0x9a,
    0x203a: 0x9b,
    0x0153: 0x9c,
    0x017e: 0x9e,
    0x0178: 0x9f,
  };

  try {
    const bytes = [];
    for (const char of text) {
      const code = char.charCodeAt(0);
      if (windows1252[code]) {
        bytes.push(windows1252[code]);
      } else if (code <= 0xff) {
        bytes.push(code);
      } else {
        throw new Error("mixed text");
      }
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

function dateOnly(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function contentPath(item) {
  const typePath = TYPE_PATHS[item.type];
  if (!typePath || item.status === "unactived") return "";
  const slug = item.slug || slugifyText(item.title || item.ref || item.meta || item.id);
  return slug ? `/${typePath}/${slug}` : "";
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sitemapEntry(path, options = {}) {
  const lastmod = options.lastmod || new Date().toISOString().slice(0, 10);
  const changefreq = options.changefreq || "monthly";
  const priority = options.priority || "0.7";
  return `  <url>
    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function fetchContentItems() {
  const items = [];
  let pageToken = "";

  do {
    const url = new URL(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/contents`);
    url.searchParams.set("key", FIREBASE_API_KEY);
    url.searchParams.set("pageSize", "300");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Firestore returned ${response.status}`);

    const data = await response.json();
    (data.documents || []).forEach((doc) => {
      const item = firestoreFieldsToObject(doc.fields || {});
      const id = doc.name ? doc.name.split("/").pop() : "";
      items.push({ id, ...item });
    });
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return items;
}

function buildSitemap(items = []) {
  const today = new Date().toISOString().slice(0, 10);
  const paths = new Map();

  CATEGORY_PATHS.forEach(([path, options]) => paths.set(path, { lastmod: today, ...options }));

  FALLBACK_CONTENT_URLS.forEach((path) => {
    paths.set(path, { lastmod: today, changefreq: "monthly", priority: path.startsWith("/cac-thanh/") ? "0.8" : "0.7" });
  });

  items.forEach((item) => {
    const path = contentPath(item);
    if (!path) return;
    paths.set(path, {
      lastmod: dateOnly(item.updatedAt || item.createdDate || item.createdAt),
      changefreq: item.type === "events" ? "weekly" : "monthly",
      priority: item.type === "saints" ? "0.8" : "0.7",
    });
  });

  const entries = Array.from(paths.entries()).map(([path, options]) => sitemapEntry(path, options));
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- dynamic-sitemap generated="${new Date().toISOString()}" urls="${entries.length}" -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;
}

module.exports = async function handler(req, res) {
  if (req.method && req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    res.end("Method Not Allowed");
    return;
  }

  try {
    const items = await fetchContentItems();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.statusCode = 200;
    res.end(buildSitemap(items));
  } catch (error) {
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    res.statusCode = 200;
    res.end(buildSitemap());
  }
};
