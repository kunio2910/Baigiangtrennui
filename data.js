const fallbackImage = "/Default.jpg";
const CONTENT_TYPES = ["saints", "churches", "articles", "events", "prayers", "catechism", "daily", "banners"];
const CONTENT_TYPE_PATHS = {
  saints: "cac-thanh",
  churches: "nha-tho",
  articles: "bai-viet",
  events: "su-kien",
  prayers: "cau-nguyen",
  catechism: "giao-ly",
};
const CONTENT_PATH_TYPES = Object.fromEntries(Object.entries(CONTENT_TYPE_PATHS).map(([type, path]) => [path, type]));
const THEME_STORAGE_KEY = "kitoTheme";

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch (error) {
    return "light";
  }
}

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  } catch (error) {
    // Theme still applies for this page even if storage is unavailable.
  }
}

applyTheme(getStoredTheme());

function setupThemeToggle() {
  if (document.querySelector("#themeToggle")) return;

  const button = document.createElement("button");
  button.id = "themeToggle";
  button.className = "theme-toggle";
  button.type = "button";
  document.body.appendChild(button);

  const syncLabel = () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    button.textContent = isDark ? "☀" : "☾";
    button.setAttribute("aria-label", isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
    button.title = isDark ? "Chế độ sáng" : "Chế độ tối";
  };

  syncLabel();
  button.addEventListener("click", () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    applyTheme(isDark ? "light" : "dark");
    syncLabel();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupThemeToggle);
} else {
  setupThemeToggle();
}
const LANGUAGE_STORAGE_KEY = "kitoLanguage";

function getStoredLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "vi";
  } catch (error) {
    return "vi";
  }
}

function setTranslateCookie(language) {
  const value = language === "en" ? "/vi/en" : "/vi/vi";
  const hostParts = window.location.hostname.split(".");
  const domains = ["", window.location.hostname];
  if (hostParts.length > 2) domains.push(`.${hostParts.slice(-2).join(".")}`);

  domains.forEach((domain) => {
    const domainPart = domain ? `;domain=${domain}` : "";
    document.cookie = `googtrans=${value};path=/${domainPart};max-age=31536000`;
  });
}

function initializeGoogleTranslateWidget() {
  if (!window.google?.translate?.TranslateElement) return false;
  if (document.querySelector(".goog-te-combo")) return true;
  if (!document.querySelector("#googleTranslateElement")) return false;

  new window.google.translate.TranslateElement(
    {
      pageLanguage: "vi",
      includedLanguages: "vi,en",
      autoDisplay: false,
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
    },
    "googleTranslateElement"
  );
  return true;
}

function loadGoogleTranslate() {
  if (initializeGoogleTranslateWidget()) return;
  if (document.querySelector('script[src*="translate.google.com/translate_a/element.js"]')) return;

  window.googleTranslateElementInit = () => {
    initializeGoogleTranslateWidget();
    setTimeout(() => reapplyStoredGoogleLanguage(12, true), 100);
  };

  const script = document.createElement("script");
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.head.appendChild(script);
}

function applyGoogleLanguage(language, shouldReload = false) {
  const nextLanguage = language === "en" ? "en" : "vi";
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  } catch (error) {
    // Language still applies through Google Translate cookies.
  }

  setTranslateCookie(nextLanguage);
  const combo = document.querySelector(".goog-te-combo");
  if (combo) {
    combo.value = nextLanguage;
    combo.dispatchEvent(new Event("change"));
  } else if (shouldReload) {
    window.location.reload();
  }
}

function reapplyStoredGoogleLanguage(maxAttempts = 10, force = false) {
  const language = getStoredLanguage();
  setTranslateCookie(language);

  if (language !== "en") return;
  loadGoogleTranslate();

  let attempts = 0;
  const applyWhenReady = () => {
    initializeGoogleTranslateWidget();
    const combo = document.querySelector(".goog-te-combo");
    if (combo) {
      const shouldDispatch = force || combo.value !== language;
      combo.value = language;
      if (shouldDispatch) {
        combo.dispatchEvent(new Event("change"));
      }
      return;
    }

    attempts += 1;
    if (attempts < maxAttempts) {
      setTimeout(applyWhenReady, 350);
    }
  };

  setTimeout(applyWhenReady, 150);
}


function setupLanguageToggle() {
  if (document.querySelector("#languageToggle")) return;

  const googleContainer = document.createElement("div");
  googleContainer.id = "googleTranslateElement";
  googleContainer.className = "google-translate-element";
  document.body.appendChild(googleContainer);

  const toggle = document.createElement("div");
  toggle.id = "languageToggle";
  toggle.className = "language-toggle";
  toggle.setAttribute("aria-label", "Chọn ngôn ngữ");
  toggle.innerHTML = `
    <button type="button" data-language="vi">VI</button>
    <span aria-hidden="true">/</span>
    <button type="button" data-language="en">EN</button>
  `;
  document.body.appendChild(toggle);

  const syncLanguage = () => {
    const language = getStoredLanguage();
    toggle.querySelectorAll("button").forEach((button) => {
      const isActive = button.dataset.language === language;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const reapplyAfterContentRender = () => {
    setTimeout(() => reapplyStoredGoogleLanguage(14, true), 180);
  };

  syncLanguage();
  setTranslateCookie(getStoredLanguage());
  loadGoogleTranslate();
  reapplyStoredGoogleLanguage();

  window.addEventListener("pageshow", () => {
    reapplyAfterContentRender();
    syncLanguage();
  });
  document.addEventListener("kito:content-rendered", reapplyAfterContentRender);

  toggle.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-language]");
    if (!button) return;
    applyGoogleLanguage(button.dataset.language, true);
    syncLanguage();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupLanguageToggle);
} else {
  setupLanguageToggle();
}

function slugifyText(value) {
  const repaired = typeof repairMojibakeText === "function" ? repairMojibakeText(value) : value;
  return String(repaired || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function contentSlug(item = {}) {
  return item.slug || slugifyText(item.title || item.ref || item.meta || item.id) || String(item.id || "");
}

function contentRouteSlug(item = {}) {
  const baseSlug = contentSlug(item);
  const itemId = String(item.id || "").trim();
  if (!itemId) return baseSlug;
  if (baseSlug.endsWith(`--${itemId}`)) return baseSlug;
  return `${baseSlug}--${itemId}`;
}

function contentDetailUrl(type, item = {}) {
  const path = CONTENT_TYPE_PATHS[type] || type;
  const slug = contentRouteSlug(item);
  if (!path || !slug) {
    return `detail.html?type=${encodeURIComponent(type || "")}&id=${encodeURIComponent(item.id || "")}`;
  }
  return `/${path}/${encodeURIComponent(slug)}`;
}

function categoryUrl(type) {
  const path = CONTENT_TYPE_PATHS[type];
  return path ? `/${path}` : `/category.html?type=${encodeURIComponent(type || "")}`;
}

function parseContentRoute(location = window.location) {
  const params = new URLSearchParams(location.search);
  const queryType = params.get("type");
  const queryId = params.get("id");
  const querySlug = params.get("slug");
  if (queryType || queryId || querySlug) {
    return { type: queryType, id: queryId, slug: querySlug };
  }

  const parts = location.pathname.split("/").filter(Boolean);
  const pathType = CONTENT_PATH_TYPES[parts[0]];
  const pathSlug = pathType ? decodeURIComponent(parts[1] || "") : null;
  const slugIdMatch = pathSlug ? pathSlug.match(/--([^/]+)$/) : null;
  return {
    type: pathType || null,
    id: slugIdMatch ? slugIdMatch[1] : null,
    slug: pathSlug,
  };
}

function parseCategoryRoute(location = window.location) {
  const params = new URLSearchParams(location.search);
  const queryType = params.get("type");
  if (queryType) return queryType;

  const firstSegment = location.pathname.split("/").filter(Boolean)[0];
  return CONTENT_PATH_TYPES[firstSegment] || "saints";
}

const defaultContent = {
  daily: [
    {
      quote: "HÃ£y Ä‘áº¿n cÃ¹ng Tháº§y, há»¡i nhá»¯ng ai khÃ³ nhá»c vÃ  gÃ¡nh náº·ng ná», Tháº§y sáº½ cho nghá»‰ ngÆ¡i bá»“i dÆ°á»¡ng.",
      ref: "Mt 11,28",
    },
    {
      quote: "Anh em hÃ£y yÃªu thÆ°Æ¡ng nhau nhÆ° Tháº§y Ä‘Ã£ yÃªu thÆ°Æ¡ng anh em.",
      ref: "Ga 15,12",
    },
    {
      quote: "PhÃºc thay ai xÃ¢y dá»±ng hÃ²a bÃ¬nh, vÃ¬ há» sáº½ Ä‘Æ°á»£c gá»i lÃ  con ThiÃªn ChÃºa.",
      ref: "Mt 5,9",
    },
  ],
  saints: [
    {
      id: "saint-1",
      type: "saints",
      title: "ThÃ¡nh Giuse",
      description: "NgÆ°á»i cÃ´ng chÃ­nh, Ä‘áº¥ng báº£o trá»£ GiÃ¡o Há»™i hoÃ n vÅ©.",
      meta: "GÆ°Æ¡ng máº«u tháº§m láº·ng",
      image: "https://images.unsplash.com/photo-1594808830893-c41d8f5ff5d2?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "saint-2",
      type: "saints",
      title: "ThÃ¡nh Maria",
      description: "Máº¹ ThiÃªn ChÃºa, máº«u gÆ°Æ¡ng cá»§a Ä‘á»©c tin vÃ  vÃ¢ng phá»¥c.",
      meta: "Máº¹ cá»§a niá»m hy vá»ng",
      image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "saint-3",
      type: "saints",
      title: "ThÃ¡nh PhanxicÃ´ Assisi",
      description: "Sá»‘ng khÃ³ nghÃ¨o, yÃªu thiÃªn nhiÃªn vÃ  muÃ´n loÃ i.",
      meta: "Niá»m vui Tin Má»«ng",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "saint-4",
      type: "saints",
      title: "ThÃ¡nh TÃªrÃªsa HÃ i Äá»“ng GiÃªsu",
      description: "Con Ä‘Æ°á»ng nhá»: tin tÆ°á»Ÿng vÃ  yÃªu máº¿n ChÃºa má»—i ngÃ y.",
      meta: "Bá»•n máº¡ng truyá»n giÃ¡o",
      image: "https://images.unsplash.com/photo-1548625361-58a9b86aa83b?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "saint-5",
      type: "saints",
      title: "ThÃ¡nh PhaolÃ´",
      description: "TÃ´ng Ä‘á»“ dÃ¢n ngoáº¡i, rao giáº£ng Tin Má»«ng kháº¯p nÆ¡i.",
      meta: "NhÃ  truyá»n giÃ¡o tiÃªn khá»Ÿi",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=80",
    },
  ],
  churches: [
    {
      id: "church-1",
      type: "churches",
      title: "NhÃ  thá» Äá»©c BÃ  SÃ i GÃ²n",
      description: "Biá»ƒu tÆ°á»£ng Ä‘á»©c tin giá»¯a trung tÃ¢m thÃ nh phá»‘.",
      meta: "TP Há»“ ChÃ­ Minh",
      image: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "church-2",
      type: "churches",
      title: "NhÃ  thá» Lá»›n HÃ  Ná»™i",
      description: "KhÃ´ng gian cáº§u nguyá»‡n cá»• kÃ­nh vÃ  trang nghiÃªm.",
      meta: "HÃ  Ná»™i",
      image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "church-3",
      type: "churches",
      title: "NhÃ  thá» PhÃº Nhai",
      description: "Má»™t trong nhá»¯ng Ä‘á»n thÃ¡nh lá»›n táº¡i miá»n Báº¯c.",
      meta: "Nam Äá»‹nh",
      image: "https://images.unsplash.com/photo-1514896856000-91cb6de818e0?auto=format&fit=crop&w=900&q=80",
    },
  ],
  articles: [
    {
      id: "article-1",
      type: "articles",
      title: "Sá»©c máº¡nh cá»§a lá»i cáº§u nguyá»‡n",
      description: "Cáº§u nguyá»‡n lÃ  hÆ¡i thá»Ÿ cá»§a linh há»“n. Khi chÃºng ta Ä‘áº¿n vá»›i ChÃºa trong cáº§u nguyá»‡n, NgÃ i ban bÃ¬nh an.",
      meta: "Suy niá»‡m",
      image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "article-2",
      type: "articles",
      title: "Ã nghÄ©a cá»§a Tháº­p GiÃ¡",
      description: "Tháº­p GiÃ¡ khÃ´ng pháº£i lÃ  dáº¥u cháº¥m háº¿t, nhÆ°ng lÃ  khá»Ÿi Ä‘áº§u cá»§a Æ¡n cá»©u Ä‘á»™ vÃ  niá»m hy vá»ng cho nhÃ¢n loáº¡i.",
      meta: "GiÃ¡o lÃ½",
      image: "https://images.unsplash.com/photo-1528357136257-0c25517acfea?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "article-3",
      type: "articles",
      title: "ChÃºa Ä‘Ã£ sá»‘ng láº¡i!",
      description: "Niá»m vui Phá»¥c Sinh nháº¯c nhá»Ÿ chÃºng ta ráº±ng sá»± cháº¿t Ä‘Ã£ bá»‹ Ä‘Ã¡nh báº¡i vÃ  sá»± sá»‘ng Ä‘á»i Ä‘á»i Ä‘Ã£ Ä‘Æ°á»£c ban cho.",
      meta: "Tin Má»«ng",
      image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  events: [
    {
      id: "event-1",
      type: "events",
      title: "ThÃ¡nh Lá»… ChÃºa Nháº­t",
      description: "CÃ¹ng cá»™ng Ä‘oÃ n tham dá»± ThÃ¡nh Lá»… vÃ  láº¯ng nghe Lá»i ChÃºa.",
      meta: "08:00 - NhÃ  thá» Äá»©c BÃ  SÃ i GÃ²n",
      date: "2026-08-25",
      image: fallbackImage,
    },
    {
      id: "event-2",
      type: "events",
      title: "Giá» Cháº§u ThÃ¡nh Thá»ƒ",
      description: "Thinh láº·ng bÃªn ChÃºa GiÃªsu ThÃ¡nh Thá»ƒ.",
      meta: "19:30 - NhÃ  thá» Lá»›n HÃ  Ná»™i",
      date: "2026-08-31",
      image: fallbackImage,
    },
    {
      id: "event-3",
      type: "events",
      title: "KhÃ³a TÄ©nh TÃ¢m",
      description: "Má»™t ngÃ y trá»Ÿ vá» vá»›i ChÃºa qua cáº§u nguyá»‡n vÃ  chia sáº».",
      meta: "08:00 - Trung tÃ¢m Má»¥c vá»¥",
      date: "2026-09-05",
      image: fallbackImage,
    },
  ],
  prayers: [
    {
      id: "prayer-1",
      type: "prayers",
      title: "Cáº§u nguyá»‡n buá»•i sÃ¡ng",
      description: "Láº¡y ChÃºa, xin dáº«n con bÆ°á»›c vÃ o ngÃ y má»›i vá»›i trÃ¡i tim bÃ¬nh an, biáº¿t yÃªu thÆ°Æ¡ng vÃ  phá»¥c vá»¥ má»i ngÆ°á»i.",
      meta: "DÃ¢ng ngÃ y má»›i",
      image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80",
      bodyHtml: "<p>Láº¡y ChÃºa, con xin dÃ¢ng lÃªn ChÃºa ngÃ y sá»‘ng hÃ´m nay. Xin soi sÃ¡ng suy nghÄ©, lá»i nÃ³i vÃ  viá»‡c lÃ m cá»§a con, Ä‘á»ƒ má»i sá»± con lÃ m Ä‘á»u trá»Ÿ nÃªn lá»i ca tá»¥ng ChÃºa.</p><p>Xin cho con biáº¿t sá»‘ng hiá»n hÃ²a, kiÃªn nháº«n vÃ  quáº£ng Ä‘áº¡i vá»›i nhá»¯ng ngÆ°á»i con gáº·p gá»¡.</p>",
    },
    {
      id: "prayer-2",
      type: "prayers",
      title: "Cáº§u nguyá»‡n trÆ°á»›c khi há»c há»i Lá»i ChÃºa",
      description: "Xin ChÃºa ThÃ¡nh Tháº§n má»Ÿ lÃ²ng con, Ä‘á»ƒ con láº¯ng nghe Lá»i ChÃºa báº±ng Ä‘á»©c tin vÃ  Ä‘em ra thá»±c hÃ nh.",
      meta: "Xin Æ¡n soi sÃ¡ng",
      image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=80",
      bodyHtml: "<p>Láº¡y ChÃºa ThÃ¡nh Tháº§n, xin Ä‘áº¿n soi sÃ¡ng trÃ­ lÃ²ng con. Xin giÃºp con Ä‘á»c Lá»i ChÃºa vá»›i tÃ¢m há»“n khiÃªm tá»‘n, biáº¿t láº¯ng nghe Ä‘iá»u ChÃºa muá»‘n nÃ³i vá»›i con hÃ´m nay.</p><p>Xin biáº¿n Ä‘á»•i Lá»i ChÃºa thÃ nh Ã¡nh sÃ¡ng dáº«n Ä‘Æ°á»ng cho Ä‘á»i sá»‘ng cá»§a con.</p>",
    },
    {
      id: "prayer-3",
      type: "prayers",
      title: "Cáº§u nguyá»‡n cho gia Ä‘Ã¬nh",
      description: "Xin ChÃºa gÃ¬n giá»¯ gia Ä‘Ã¬nh con trong yÃªu thÆ°Æ¡ng, tha thá»© vÃ  hiá»‡p nháº¥t má»—i ngÃ y.",
      meta: "Gia Ä‘Ã¬nh yÃªu thÆ°Æ¡ng",
      image: "https://images.unsplash.com/photo-1514896856000-91cb6de818e0?auto=format&fit=crop&w=1200&q=80",
      bodyHtml: "<p>Láº¡y ChÃºa GiÃªsu, xin á»Ÿ láº¡i trong gia Ä‘Ã¬nh con. Xin dáº¡y chÃºng con biáº¿t láº¯ng nghe, tha thá»© vÃ  nÃ¢ng Ä‘á»¡ nhau trong má»i hoÃ n cáº£nh.</p><p>Xin cho má»—i thÃ nh viÃªn trong gia Ä‘Ã¬nh con biáº¿t trá»Ÿ nÃªn dáº¥u chá»‰ tÃ¬nh yÃªu cá»§a ChÃºa.</p>",
    },
    {
      id: "prayer-4",
      type: "prayers",
      title: "Cáº§u nguyá»‡n khi gáº·p khÃ³ khÄƒn",
      description: "Láº¡y ChÃºa, xin nÃ¢ng Ä‘á»¡ con trong thá»­ thÃ¡ch vÃ  giÃºp con tÃ­n thÃ¡c vÃ o tÃ¬nh yÃªu quan phÃ²ng cá»§a NgÃ i.",
      meta: "TÃ­n thÃ¡c",
      image: "https://images.unsplash.com/photo-1528357136257-0c25517acfea?auto=format&fit=crop&w=1200&q=80",
      bodyHtml: "<p>Láº¡y ChÃºa, khi con má»‡t má»i vÃ  lo Ã¢u, xin nháº¯c con nhá»› ráº±ng ChÃºa váº«n Ä‘á»“ng hÃ nh. Xin ban cho con sá»©c máº¡nh Ä‘á»ƒ bÆ°á»›c tiáº¿p trong tin tÆ°á»Ÿng.</p><p>Xin giÃºp con nhÃ¬n tháº¥y hy vá»ng ngay cáº£ giá»¯a nhá»¯ng Ä‘iá»u chÆ°a rÃµ rÃ ng.</p>",
    },
    {
      id: "prayer-5",
      type: "prayers",
      title: "Cáº§u nguyá»‡n buá»•i tá»‘i",
      description: "Xin ChÃºa Ä‘Ã³n nháº­n ngÃ y sá»‘ng Ä‘Ã£ qua, tha thá»© nhá»¯ng thiáº¿u sÃ³t vÃ  ban cho con giáº¥c ngá»§ bÃ¬nh an.",
      meta: "Táº¡ Æ¡n cuá»‘i ngÃ y",
      image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80",
      bodyHtml: "<p>Láº¡y ChÃºa, con táº¡ Æ¡n ChÃºa vÃ¬ má»™t ngÃ y Ä‘Ã£ qua. Xin tha thá»© nhá»¯ng Ä‘iá»u con thiáº¿u sÃ³t vÃ  chá»¯a lÃ nh nhá»¯ng gÃ¬ cÃ²n náº·ng ná» trong lÃ²ng con.</p><p>Xin gÃ¬n giá»¯ con trong bÃ¬nh an cá»§a ChÃºa suá»‘t Ä‘Ãªm nay.</p>",
    },
  ],
  catechism: [
    {
      id: "catechism-1",
      type: "catechism",
      title: "Kinh Láº¡y Cha",
      description: "Kinh nguyá»‡n ChÃºa GiÃªsu dáº¡y, giÃºp ngÆ°á»i tÃ­n há»¯u hÆ°á»›ng lÃ²ng vá» ThiÃªn ChÃºa lÃ  Cha vÃ  sá»‘ng tinh tháº§n phÃ³ thÃ¡c.",
      meta: "Kinh cÄƒn báº£n",
      image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80",
      bodyHtml:
        "<p>Kinh Láº¡y Cha lÃ  lá»i cáº§u nguyá»‡n trung tÃ¢m cá»§a Ä‘á»i sá»‘ng KitÃ´ há»¯u, Ä‘Æ°á»£c chÃ­nh ChÃºa GiÃªsu dáº¡y cho cÃ¡c mÃ´n Ä‘á»‡.</p><p>Láº¡y Cha chÃºng con á»Ÿ trÃªn trá»i, chÃºng con nguyá»‡n danh Cha cáº£ sÃ¡ng, nÆ°á»›c Cha trá»‹ Ä‘áº¿n, Ã½ Cha thá»ƒ hiá»‡n dÆ°á»›i Ä‘áº¥t cÅ©ng nhÆ° trÃªn trá»i. Xin Cha cho chÃºng con hÃ´m nay lÆ°Æ¡ng thá»±c háº±ng ngÃ y, vÃ  tha ná»£ chÃºng con nhÆ° chÃºng con cÅ©ng tha káº» cÃ³ ná»£ chÃºng con. Xin chá»› Ä‘á»ƒ chÃºng con sa chÆ°á»›c cÃ¡m dá»—, nhÆ°ng cá»©u chÃºng con cho khá»i sá»± dá»¯. Amen.</p>",
    },
    {
      id: "catechism-2",
      type: "catechism",
      title: "Kinh KÃ­nh Má»«ng",
      description: "Lá»i kinh tÃ´n kÃ­nh Äá»©c Maria, Máº¹ ThiÃªn ChÃºa, vÃ  xin Máº¹ chuyá»ƒn cáº§u cho ngÆ°á»i tÃ­n há»¯u trong Ä‘á»i sá»‘ng Ä‘á»©c tin.",
      meta: "KÃ­nh Äá»©c Máº¹",
      image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=1200&q=80",
      bodyHtml:
        "<p>Kinh KÃ­nh Má»«ng káº¿t há»£p lá»i chÃ o cá»§a sá»© tháº§n Gabriel, lá»i chÃºc tá»¥ng cá»§a bÃ  ÃŠlisabÃ©t vÃ  lá»i kháº©n cáº§u cá»§a Há»™i ThÃ¡nh.</p><p>KÃ­nh má»«ng Maria Ä‘áº§y Æ¡n phÃºc, Äá»©c ChÃºa Trá»i á»Ÿ cÃ¹ng BÃ . BÃ  cÃ³ phÃºc láº¡ hÆ¡n má»i ngÆ°á»i ná»¯, vÃ  GiÃªsu con lÃ²ng BÃ  gá»“m phÃºc láº¡. ThÃ¡nh Maria Äá»©c Máº¹ ChÃºa Trá»i, cáº§u cho chÃºng con lÃ  káº» cÃ³ tá»™i, khi nay vÃ  trong giá» lÃ¢m tá»­. Amen.</p>",
    },
    {
      id: "catechism-3",
      type: "catechism",
      title: "Kinh SÃ¡ng Danh",
      description: "Lá»i kinh chÃºc tá»¥ng Ba NgÃ´i ThiÃªn ChÃºa, thÆ°á»ng Ä‘Æ°á»£c Ä‘á»c Ä‘á»ƒ káº¿t thÃºc cÃ¡c lá»i cáº§u nguyá»‡n.",
      meta: "ChÃºc tá»¥ng Ba NgÃ´i",
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80",
      bodyHtml:
        "<p>Kinh SÃ¡ng Danh lÃ  lá»i tuyÃªn xÆ°ng vÃ  chÃºc tá»¥ng vinh quang ChÃºa Cha, ChÃºa Con vÃ  ChÃºa ThÃ¡nh Tháº§n.</p><p>SÃ¡ng danh Äá»©c ChÃºa Cha, vÃ  Äá»©c ChÃºa Con, vÃ  Äá»©c ChÃºa ThÃ¡nh Tháº§n. NhÆ° Ä‘Ã£ cÃ³ trÆ°á»›c vÃ´ cÃ¹ng, vÃ  bÃ¢y giá», vÃ  háº±ng cÃ³, vÃ  Ä‘á»i Ä‘á»i cháº³ng cÃ¹ng. Amen.</p>",
    },
    {
      id: "catechism-4",
      type: "catechism",
      title: "Kinh Tin KÃ­nh",
      description: "Lá»i tuyÃªn xÆ°ng Ä‘á»©c tin cá»§a Há»™i ThÃ¡nh, tÃ³m lÆ°á»£c nhá»¯ng Ä‘iá»u cÄƒn báº£n ngÆ°á»i CÃ´ng GiÃ¡o tin nháº­n.",
      meta: "TuyÃªn xÆ°ng Ä‘á»©c tin",
      image: "https://images.unsplash.com/photo-1528357136257-0c25517acfea?auto=format&fit=crop&w=1200&q=80",
      bodyHtml:
        "<p>Kinh Tin KÃ­nh giÃºp ngÆ°á»i tÃ­n há»¯u tuyÃªn xÆ°ng niá»m tin vÃ o ThiÃªn ChÃºa Ba NgÃ´i, máº§u nhiá»‡m Nháº­p Thá»ƒ, Cá»©u Äá»™ vÃ  sá»± sá»‘ng Ä‘á»i Ä‘á»i.</p><p>TÃ´i tin kÃ­nh Äá»©c ChÃºa Trá»i lÃ  Cha phÃ©p táº¯c vÃ´ cÃ¹ng dá»±ng nÃªn trá»i Ä‘áº¥t. TÃ´i tin kÃ­nh Äá»©c ChÃºa GiÃªsu KitÃ´ lÃ  Con Má»™t Äá»©c ChÃºa Cha cÃ¹ng lÃ  ChÃºa chÃºng tÃ´i...</p><p>Trong phá»¥ng vá»¥, Kinh Tin KÃ­nh thÆ°á»ng Ä‘Æ°á»£c Ä‘á»c trong ThÃ¡nh lá»… ChÃºa Nháº­t vÃ  cÃ¡c lá»… trá»ng nhÆ° lá»i Ä‘Ã¡p tráº£ Ä‘á»©c tin cá»§a cá»™ng Ä‘oÃ n.</p>",
    },
    {
      id: "catechism-5",
      type: "catechism",
      title: "Kinh Ä‚n NÄƒn Tá»™i",
      description: "Lá»i kinh diá»…n táº£ lÃ²ng sÃ¡m há»‘i, xin ChÃºa tha thá»© vÃ  quyáº¿t tÃ¢m trá»Ÿ vá» vá»›i tÃ¬nh yÃªu cá»§a NgÆ°á»i.",
      meta: "SÃ¡m há»‘i",
      image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80",
      bodyHtml:
        "<p>Kinh Ä‚n NÄƒn Tá»™i giÃºp ngÆ°á»i tÃ­n há»¯u nhÃ¬n nháº­n lá»—i láº§m trÆ°á»›c máº·t ChÃºa, tin vÃ o lÃ²ng thÆ°Æ¡ng xÃ³t cá»§a NgÆ°á»i vÃ  quyáº¿t tÃ¢m Ä‘á»•i má»›i Ä‘á»i sá»‘ng.</p><p>Láº¡y ChÃºa con, ChÃºa lÃ  Äáº¥ng trá»n tá»‘t trá»n lÃ nh vÃ´ cÃ¹ng. ChÃºa Ä‘Ã£ dá»±ng nÃªn con, vÃ  cho Con ChÃºa ra Ä‘á»i chá»‹u náº¡n chá»‹u cháº¿t vÃ¬ con, mÃ  con Ä‘Ã£ cáº£ lÃ²ng pháº£n nghá»‹ch lá»—i nghÄ©a cÃ¹ng ChÃºa, thÃ¬ con lo buá»“n Ä‘au Ä‘á»›n cÃ¹ng chÃª ghÃ©t má»i tá»™i con trÃªn háº¿t má»i sá»±...</p>",
    },
  ],
};

defaultContent.daily = defaultContent.daily.map((item, index) => ({
  id: item.id || `daily-${index + 1}`,
  type: "daily",
  title: item.title || item.ref || `Loi Chua ${index + 1}`,
  description: item.description || item.quote || "",
  meta: item.meta || item.ref || "",
  image:
    item.image ||
    [
      "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528357136257-0c25517acfea?auto=format&fit=crop&w=1200&q=80",
    ][index % 3],
  ...item,
}));

defaultContent.banners = [
  {
    id: "banner-main",
    type: "banners",
    title: "Duc Kito la anh sang the gian",
    description:
      "Thay la anh sang the gian: ai theo Thay, se khong di trong bong toi, nhung se duoc anh sang dem lai su song. (Ga 8,12)",
    meta: "Banner chinh",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
  },
];

const saintBiographyDefaults = {
  "thanh-giuse": {
    meta: "Äáº¥ng cÃ´ng chÃ­nh",
    description: "ThÃ¡nh Giuse lÃ  báº¡n trÄƒm nÄƒm cá»§a Äá»©c Maria, cha nuÃ´i cá»§a ChÃºa GiÃªsu vÃ  lÃ  máº«u gÆ°Æ¡ng Ã¢m tháº§m cá»§a Ä‘á»i sá»‘ng gia Ä‘Ã¬nh.",
    bodyHtml: `
      <h2>Tiá»ƒu sá»­</h2>
      <p>ThÃ¡nh Giuse lÃ  ngÆ°á»i cÃ´ng chÃ­nh thuá»™c dÃ²ng dÃµi vua ÄavÃ­t. Tin Má»«ng mÃ´ táº£ ngÃ i lÃ  báº¡n trÄƒm nÄƒm cá»§a Äá»©c Maria vÃ  lÃ  ngÆ°á»i Ä‘Æ°á»£c ThiÃªn ChÃºa trao phÃ³ trÃ¡ch nhiá»‡m chÄƒm sÃ³c ChÃºa GiÃªsu trong gia Ä‘Ã¬nh Nazareth.</p>
      <p>Khi biáº¿t Äá»©c Maria mang thai bá»Ÿi quyá»n nÄƒng ChÃºa ThÃ¡nh Tháº§n, thÃ¡nh Giuse Ä‘Ã£ láº¯ng nghe lá»i sá»© tháº§n trong má»™ng vÃ  Ä‘Ã³n nháº­n Máº¹ Maria vá» nhÃ . NgÃ i hiá»‡n diá»‡n trong nhá»¯ng biáº¿n cá»‘ Ä‘áº§u Ä‘á»i cá»§a ChÃºa GiÃªsu: hÃ nh trÃ¬nh vá» BÃªlem, cuá»™c trá»‘n sang Ai Cáº­p, rá»“i trá»Ÿ vá» Nazareth Ä‘á»ƒ sá»‘ng Ä‘á»i lao Ä‘á»™ng khiÃªm tá»‘n.</p>
      <h3>NhÃ¢n Ä‘á»©c ná»•i báº­t</h3>
      <p>ThÃ¡nh Giuse nÃªu gÆ°Æ¡ng vá» sá»± vÃ¢ng phá»¥c, thinh láº·ng, trÃ¡ch nhiá»‡m vÃ  lÃ²ng tÃ­n thÃ¡c. NgÃ i khÃ´ng Ä‘á»ƒ láº¡i lá»i nÃ³i nÃ o trong Kinh ThÃ¡nh, nhÆ°ng Ä‘á»i sá»‘ng cá»§a ngÃ i lÃ  má»™t chá»©ng tÃ¡ máº¡nh máº½ vá» Ä‘á»©c tin Ä‘Æ°á»£c diá»…n táº£ báº±ng hÃ nh Ä‘á»™ng.</p>
      <h3>Ã nghÄ©a thiÃªng liÃªng</h3>
      <p>GiÃ¡o Há»™i tÃ´n kÃ­nh thÃ¡nh Giuse nhÆ° bá»•n máº¡ng cá»§a Há»™i ThÃ¡nh hoÃ n vÅ©, cá»§a cÃ¡c gia Ä‘Ã¬nh, ngÆ°á»i lao Ä‘á»™ng vÃ  nhá»¯ng ai muá»‘n sá»‘ng Ä‘á»i cÃ´ng chÃ­nh trong Ã¢m tháº§m.</p>
    `,
  },
  "thanh-maria": {
    meta: "Máº¹ ThiÃªn ChÃºa",
    description: "Äá»©c Maria lÃ  Máº¹ ChÃºa GiÃªsu, máº«u gÆ°Æ¡ng cá»§a Ä‘á»©c tin, sá»± vÃ¢ng phá»¥c vÃ  lÃ²ng tÃ­n thÃ¡c trá»n váº¹n vÃ o ThiÃªn ChÃºa.",
    bodyHtml: `
      <h2>Tiá»ƒu sá»­</h2>
      <p>Äá»©c Maria lÃ  ngÆ°á»i ná»¯ Do ThÃ¡i táº¡i Nazareth, Ä‘Æ°á»£c ThiÃªn ChÃºa tuyá»ƒn chá»n Ä‘á»ƒ lÃ m Máº¹ Äáº¥ng Cá»©u Tháº¿. Trong biáº¿n cá»‘ Truyá»n Tin, Máº¹ Ä‘Ã£ thÆ°a lá»i xin vÃ¢ng, Ä‘Ã³n nháº­n Ã½ Ä‘á»‹nh cá»§a ThiÃªn ChÃºa vá»›i lÃ²ng khiÃªm nhÆ°á»ng vÃ  tÃ­n thÃ¡c.</p>
      <p>Máº¹ Maria Ä‘á»“ng hÃ nh vá»›i ChÃºa GiÃªsu tá»« máº§u nhiá»‡m Nháº­p Thá»ƒ, sinh háº¡ NgÆ°á»i táº¡i BÃªlem, chÄƒm sÃ³c NgÆ°á»i trong Ä‘á»i sá»‘ng áº©n dáº­t táº¡i Nazareth, cho Ä‘áº¿n khi Ä‘á»©ng dÆ°á»›i chÃ¢n tháº­p giÃ¡. Sau Phá»¥c Sinh, Máº¹ hiá»‡n diá»‡n vá»›i cÃ¡c mÃ´n Ä‘á»‡ trong cáº§u nguyá»‡n.</p>
      <h3>NhÃ¢n Ä‘á»©c ná»•i báº­t</h3>
      <p>Máº¹ lÃ  máº«u gÆ°Æ¡ng cá»§a Ä‘á»©c tin láº¯ng nghe, lÃ²ng khiÃªm nhÆ°á»ng, sá»± vÃ¢ng phá»¥c vÃ  tÃ¬nh máº«u tá»­. Máº¹ ghi nhá»› vÃ  suy niá»‡m má»i biáº¿n cá»‘ trong lÃ²ng, Ä‘á»ƒ luÃ´n tÃ¬m kiáº¿m thÃ¡nh Ã½ ThiÃªn ChÃºa.</p>
      <h3>Ã nghÄ©a thiÃªng liÃªng</h3>
      <p>NgÆ°á»i KitÃ´ há»¯u tÃ´n kÃ­nh Äá»©c Maria nhÆ° Máº¹ ThiÃªn ChÃºa vÃ  ngÆ°á»i Máº¹ dáº«n Ä‘Æ°a con cÃ¡i Ä‘áº¿n vá»›i ChÃºa GiÃªsu. NÆ¡i Máº¹, Há»™i ThÃ¡nh nháº­n ra hÃ¬nh áº£nh cá»§a ngÆ°á»i mÃ´n Ä‘á»‡ hoÃ n háº£o.</p>
    `,
  },
  "thanh-phanxico-assisi": {
    meta: "Sá»‘ng nghÃ¨o khÃ³ vÃ  yÃªu thiÃªn nhiÃªn",
    description: "ThÃ¡nh PhanxicÃ´ Assisi lÃ  ngÆ°á»i sÃ¡ng láº­p DÃ²ng Anh Em HÃ¨n Má»n, ná»•i báº­t vá»›i tinh tháº§n nghÃ¨o khÃ³, hÃ²a bÃ¬nh vÃ  yÃªu máº¿n cÃ´ng trÃ¬nh táº¡o dá»±ng.",
    bodyHtml: `
      <h2>Tiá»ƒu sá»­</h2>
      <p>ThÃ¡nh PhanxicÃ´ Assisi sinh khoáº£ng nÄƒm 1181 táº¡i Assisi, nÆ°á»›c Ã, trong má»™t gia Ä‘Ã¬nh thÆ°Æ¡ng gia khÃ¡ giáº£. Sau thá»i tráº» nhiá»u mÆ¡ má»™ng vÃ  biáº¿n cá»‘ bá»‡nh táº­t, ngÃ i dáº§n nháº­n ra tiáº¿ng gá»i cá»§a ThiÃªn ChÃºa nÆ¡i ngÆ°á»i nghÃ¨o, ngÆ°á»i phong cÃ¹i vÃ  trong cáº§u nguyá»‡n.</p>
      <p>TrÆ°á»›c thÃ¡nh giÃ¡ táº¡i nhÃ  nguyá»‡n San Damiano, ngÃ i nghe lá»i má»i gá»i hÃ£y sá»­a láº¡i Há»™i ThÃ¡nh. Tá»« Ä‘Ã³, PhanxicÃ´ tá»« bá» cá»§a cáº£i, chá»n Ä‘á»i sá»‘ng nghÃ¨o khÃ³, rao giáº£ng Tin Má»«ng báº±ng sá»± Ä‘Æ¡n sÆ¡ vÃ  thÃ nh láº­p DÃ²ng Anh Em HÃ¨n Má»n.</p>
      <h3>NhÃ¢n Ä‘á»©c ná»•i báº­t</h3>
      <p>NgÃ i sá»‘ng tinh tháº§n nghÃ¨o khÃ³ triá»‡t Ä‘á»ƒ, yÃªu máº¿n hÃ²a bÃ¬nh, khiÃªm háº¡ vÃ  gáº§n gÅ©i má»i thá»¥ táº¡o. TÃ¬nh yÃªu dÃ nh cho thiÃªn nhiÃªn cá»§a ngÃ i xuáº¥t phÃ¡t tá»« niá»m tin ráº±ng má»i loÃ i Ä‘á»u pháº£n chiáº¿u váº» Ä‘áº¹p cá»§a Äáº¥ng Táº¡o HÃ³a.</p>
      <h3>Ã nghÄ©a thiÃªng liÃªng</h3>
      <p>ThÃ¡nh PhanxicÃ´ nháº¯c ngÆ°á»i KitÃ´ há»¯u sá»‘ng Ä‘Æ¡n sÆ¡, phá»¥c vá»¥ ngÆ°á»i nghÃ¨o vÃ  xÃ¢y dá»±ng hÃ²a bÃ¬nh. NgÃ i cÅ©ng lÃ  bá»•n máº¡ng cá»§a mÃ´i sinh vÃ  nhá»¯ng ai dáº¥n thÃ¢n chÄƒm sÃ³c cÃ´ng trÃ¬nh táº¡o dá»±ng.</p>
    `,
  },
  "thanh-teresa-hai-dong-giesu": {
    meta: "Con Ä‘Æ°á»ng nhá»",
    description: "ThÃ¡nh TÃªrÃªsa HÃ i Äá»“ng GiÃªsu lÃ  ná»¯ tu CÃ¡t Minh, tiáº¿n sÄ© Há»™i ThÃ¡nh, ná»•i tiáº¿ng vá»›i linh Ä‘áº¡o con Ä‘Æ°á»ng nhá» cá»§a tÃ¬nh yÃªu vÃ  tÃ­n thÃ¡c.",
    bodyHtml: `
      <h2>Tiá»ƒu sá»­</h2>
      <p>ThÃ¡nh TÃªrÃªsa HÃ i Äá»“ng GiÃªsu, tÃªn khai sinh lÃ  Marie-FranÃ§oise-ThÃ©rÃ¨se Martin, sinh nÄƒm 1873 táº¡i AlenÃ§on, PhÃ¡p. Tá»« nhá», TÃªrÃªsa Ä‘Ã£ cÃ³ lÃ²ng yÃªu máº¿n ChÃºa sÃ¢u xa vÃ  khao khÃ¡t dÃ¢ng mÃ¬nh trong Ä‘á»i sá»‘ng tu trÃ¬.</p>
      <p>NÄƒm 15 tuá»•i, sau nhiá»u khÃ³ khÄƒn, ngÃ i Ä‘Æ°á»£c vÃ o Ä‘an viá»‡n CÃ¡t Minh Lisieux. Trong Ä‘á»i sá»‘ng Ã¢m tháº§m cá»§a Ä‘an viá»‡n, TÃªrÃªsa khÃ¡m phÃ¡ con Ä‘Æ°á»ng nÃªn thÃ¡nh qua nhá»¯ng viá»‡c nhá» bÃ© Ä‘Æ°á»£c lÃ m vá»›i tÃ¬nh yÃªu lá»›n lao.</p>
      <h3>NhÃ¢n Ä‘á»©c ná»•i báº­t</h3>
      <p>Linh Ä‘áº¡o cá»§a thÃ¡nh TÃªrÃªsa Ä‘Æ°á»£c gá»i lÃ  con Ä‘Æ°á»ng nhá»: sá»‘ng khiÃªm nhÆ°á»ng, tin tÆ°á»Ÿng nhÆ° tráº» thÆ¡, yÃªu máº¿n ChÃºa trong tá»«ng bá»•n pháº­n nhá» háº±ng ngÃ y vÃ  phÃ³ thÃ¡c cáº£ nhá»¯ng yáº¿u Ä‘uá»‘i cho lÃ²ng thÆ°Æ¡ng xÃ³t cá»§a ThiÃªn ChÃºa.</p>
      <h3>Ã nghÄ©a thiÃªng liÃªng</h3>
      <p>DÃ¹ sá»‘ng Ä‘á»i kÃ­n áº©n vÃ  qua Ä‘á»i khi cÃ²n ráº¥t tráº», TÃªrÃªsa trá»Ÿ thÃ nh bá»•n máº¡ng cÃ¡c xá»© truyá»n giÃ¡o. NgÃ i cho tháº¥y sá»± thÃ¡nh thiá»‡n khÃ´ng há»‡ táº¡i nhá»¯ng viá»‡c phi thÆ°á»ng, nhÆ°ng á»Ÿ tÃ¬nh yÃªu trung thÃ nh trong Ä‘iá»u bÃ© nhá».</p>
    `,
  },
  "thanh-phaolo": {
    meta: "TÃ´ng Ä‘á»“ dÃ¢n ngoáº¡i",
    description: "ThÃ¡nh PhaolÃ´ lÃ  vá»‹ tÃ´ng Ä‘á»“ lá»›n cá»§a Há»™i ThÃ¡nh sÆ¡ khai, ngÆ°á»i rao giáº£ng Tin Má»«ng cho muÃ´n dÃ¢n sau biáº¿n cá»‘ hoÃ¡n cáº£i trÃªn Ä‘Æ°á»ng Äamas.",
    bodyHtml: `
      <h2>Tiá»ƒu sá»­</h2>
      <p>ThÃ¡nh PhaolÃ´, trÆ°á»›c kia lÃ  SaolÃ´ thÃ nh TarsÃ´, lÃ  ngÆ°á»i Do ThÃ¡i nhiá»‡t thÃ nh vá»›i Lá» Luáº­t. Ban Ä‘áº§u, Ã´ng tham gia bÃ¡ch háº¡i cÃ¡c mÃ´n Ä‘á»‡ ChÃºa GiÃªsu. TrÃªn Ä‘Æ°á»ng Ä‘i Äamas, SaolÃ´ gáº·p Äá»©c KitÃ´ Phá»¥c Sinh vÃ  Ä‘Æ°á»£c biáº¿n Ä‘á»•i táº­n cÄƒn.</p>
      <p>Sau khi chá»‹u phÃ©p rá»­a, PhaolÃ´ trá»Ÿ thÃ nh nhÃ  truyá»n giÃ¡o lá»›n cá»§a Há»™i ThÃ¡nh. NgÃ i thá»±c hiá»‡n nhiá»u hÃ nh trÃ¬nh rao giáº£ng, thÃ nh láº­p cÃ¡c cá»™ng Ä‘oÃ n KitÃ´ há»¯u vÃ  viáº¿t nhiá»u thÆ° tÃ­n quan trá»ng trong TÃ¢n Æ¯á»›c.</p>
      <h3>NhÃ¢n Ä‘á»©c ná»•i báº­t</h3>
      <p>ThÃ¡nh PhaolÃ´ ná»•i báº­t vá»›i lÃ²ng nhiá»‡t thÃ nh truyá»n giÃ¡o, tÃ¬nh yÃªu dÃ nh cho Äá»©c KitÃ´ vÃ  kháº£ nÄƒng giáº£i thÃ­ch Ä‘á»©c tin cho cÃ¡c dÃ¢n ngoáº¡i. NgÃ i chá»‹u nhiá»u gian nan nhÆ°ng luÃ´n xÃ¡c tÃ­n ráº±ng khÃ´ng gÃ¬ cÃ³ thá»ƒ tÃ¡ch ngÆ°á»i tÃ­n há»¯u khá»i tÃ¬nh yÃªu cá»§a ThiÃªn ChÃºa.</p>
      <h3>Ã nghÄ©a thiÃªng liÃªng</h3>
      <p>Cuá»™c Ä‘á»i thÃ¡nh PhaolÃ´ lÃ  chá»©ng tÃ¡ vá» sá»©c máº¡nh cá»§a Æ¡n hoÃ¡n cáº£i. Tá»« má»™t ngÆ°á»i bÃ¡ch háº¡i, ngÃ i trá»Ÿ thÃ nh khÃ­ cá»¥ loan bÃ¡o Tin Má»«ng cho muÃ´n dÃ¢n.</p>
    `,
  },
  "thanh-phero": {
    meta: "ÄÃ¡ táº£ng cá»§a Há»™i ThÃ¡nh",
    description: "ThÃ¡nh PhÃªrÃ´ lÃ  má»™t trong MÆ°á»i Hai TÃ´ng Äá»“, ngÆ°á»i Ä‘Æ°á»£c ChÃºa GiÃªsu trao sá»© máº¡ng cá»§ng cá»‘ anh em vÃ  chÄƒm sÃ³c Ä‘oÃ n chiÃªn.",
    bodyHtml: `
      <h2>Tiá»ƒu sá»­</h2>
      <p>ThÃ¡nh PhÃªrÃ´, tÃªn ban Ä‘áº§u lÃ  Simon, lÃ  má»™t ngÆ° phá»§ miá»n GalilÃª. ChÃºa GiÃªsu gá»i Ã´ng Ä‘i theo NgÆ°á»i vÃ  Ä‘áº·t tÃªn lÃ  PhÃªrÃ´, nghÄ©a lÃ  Ä‘Ã¡ táº£ng. Ã”ng thuá»™c nhÃ³m mÃ´n Ä‘á»‡ thÃ¢n tÃ­n, chá»©ng kiáº¿n nhiá»u biáº¿n cá»‘ quan trá»ng trong sá»© vá»¥ cá»§a ChÃºa.</p>
      <p>DÃ¹ tá»«ng yáº¿u Ä‘uá»‘i vÃ  chá»‘i Tháº§y trong cuá»™c ThÆ°Æ¡ng KhÃ³, PhÃªrÃ´ Ä‘Ã£ Ä‘Æ°á»£c ChÃºa Phá»¥c Sinh tha thá»© vÃ  trao sá»© máº¡ng chÄƒn dáº¯t Ä‘oÃ n chiÃªn. Sau lá»… NgÅ© Tuáº§n, ngÃ i máº¡nh dáº¡n rao giáº£ng Äá»©c KitÃ´ vÃ  trá»Ÿ thÃ nh má»™t trong nhá»¯ng trá»¥ cá»™t cá»§a Há»™i ThÃ¡nh sÆ¡ khai.</p>
      <h3>NhÃ¢n Ä‘á»©c ná»•i báº­t</h3>
      <p>ThÃ¡nh PhÃªrÃ´ cho tháº¥y hÃ nh trÃ¬nh Ä‘á»©c tin cá»§a ngÆ°á»i mÃ´n Ä‘á»‡: cÃ³ nhiá»‡t thÃ nh, cÃ³ yáº¿u Ä‘uá»‘i, cÃ³ nÆ°á»›c máº¯t sÃ¡m há»‘i vÃ  cÃ³ Æ¡n biáº¿n Ä‘á»•i. Sá»± khiÃªm nhÆ°á»ng sau váº¥p ngÃ£ giÃºp ngÃ i trá»Ÿ nÃªn chá»©ng nhÃ¢n máº¡nh máº½ cá»§a lÃ²ng thÆ°Æ¡ng xÃ³t.</p>
      <h3>Ã nghÄ©a thiÃªng liÃªng</h3>
      <p>NgÃ i Ä‘Æ°á»£c truyá»n thá»‘ng KitÃ´ giÃ¡o tÃ´n kÃ­nh nhÆ° vá»‹ lÃ£nh Ä‘áº¡o Ä‘áº§u tiÃªn cá»§a Há»™i ThÃ¡nh táº¡i RÃ´ma. Cuá»™c Ä‘á»i PhÃªrÃ´ nháº¯c ngÆ°á»i tÃ­n há»¯u biáº¿t Ä‘á»©ng dáº­y sau yáº¿u Ä‘uá»‘i vÃ  Ä‘á»ƒ ChÃºa dÃ¹ng mÃ¬nh trong sá»© máº¡ng phá»¥c vá»¥.</p>
    `,
  },
};

function normalizeSaintKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/Ä‘/g, "d")
    .replace(/Ä/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function enrichSaintBiography(item) {
  const key = normalizeSaintKey(item.title || item.id);
  const fallback = saintBiographyDefaults[key];
  if (!fallback) return item;

  return {
    ...item,
    meta: item.meta || fallback.meta,
    description:
      !item.description || item.description.length < 80 ? fallback.description : item.description,
    bodyHtml: item.bodyHtml || fallback.bodyHtml,
  };
}

defaultContent.saints = defaultContent.saints.map(enrichSaintBiography);

function isFirebaseConfigured() {
  return Boolean(
    window.KITO_FIREBASE_CONFIG &&
      window.KITO_FIREBASE_CONFIG.apiKey &&
      !window.KITO_FIREBASE_CONFIG.apiKey.includes("DAN_")
  );
}

function requireFirebase() {
  if (!isFirebaseConfigured()) {
    throw new Error("Báº¡n chÆ°a cáº¥u hÃ¬nh Firebase. HÃ£y dÃ¡n firebaseConfig vÃ o file firebase-config.js.");
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(window.KITO_FIREBASE_CONFIG);
  }

  return {
    db: firebase.firestore(),
    storage: firebase.storage(),
  };
}

async function seedDefaultContentIfEmpty(force = false) {
  const { db } = requireFirebase();
  const sample = await db.collection("contents").limit(1).get();
  if (!force && !sample.empty) {
    const current = await db.collection("contents").get();
    const existingTypes = new Set();
    current.forEach((doc) => {
      const item = doc.data();
      if (item.type) existingTypes.add(item.type);
    });

    const missingTypes = CONTENT_TYPES.filter((type) => !existingTypes.has(type));
    if (!missingTypes.length) return;

    const missingBatch = db.batch();
    missingTypes.forEach((type) => {
      defaultContent[type].forEach((item, index) => {
        const ref = db.collection("contents").doc(item.id);
        missingBatch.set(ref, {
          ...item,
          slug: contentSlug(item),
          status: item.status || "actived",
          sortOrder: index,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
    });
    await missingBatch.commit();
    return;
  }

  if (force) {
    const current = await db.collection("contents").get();
    const deleteBatch = db.batch();
    current.forEach((doc) => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
  }

  const batch = db.batch();
  CONTENT_TYPES.forEach((type) => {
    defaultContent[type].forEach((item, index) => {
      const ref = db.collection("contents").doc(item.id);
      batch.set(ref, {
        ...item,
        slug: contentSlug(item),
        status: item.status || "actived",
        sortOrder: index,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });
  });
  await batch.commit();
}

async function getContent() {
  await seedDefaultContentIfEmpty();
  const { db } = requireFirebase();
  const snapshot = await db.collection("contents").get();
  const content = {
    daily: [],
    banners: [],
    saints: [],
    churches: [],
    articles: [],
    events: [],
    prayers: [],
    catechism: [],
  };

  snapshot.forEach((doc) => {
    const rawItem = { id: doc.id, ...doc.data() };
    const enrichedItem = rawItem.type === "saints" ? enrichSaintBiography(rawItem) : rawItem;
    const item = { ...enrichedItem, slug: contentSlug(enrichedItem) };
    if (CONTENT_TYPES.includes(item.type)) {
      content[item.type].push(item);
    }
  });

  CONTENT_TYPES.forEach((type) => {
    content[type].sort((a, b) => {
      const orderA = Number.isFinite(a.sortOrder) ? a.sortOrder : 9999;
      const orderB = Number.isFinite(b.sortOrder) ? b.sortOrder : 9999;
      return orderA - orderB || String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });
  });

  if (!content.daily.length) content.daily = structuredClone(defaultContent.daily);
  if (!content.banners.length) content.banners = structuredClone(defaultContent.banners);
  if (!content.prayers.length) content.prayers = structuredClone(defaultContent.prayers);
  if (!content.catechism.length) content.catechism = structuredClone(defaultContent.catechism);

  CONTENT_TYPES.forEach((type) => {
    content[type] = content[type].map((item) => ({ ...item, slug: contentSlug(item) }));
  });

  return content;
}

async function saveContentItem(type, item) {
  const { db } = requireFirebase();
  const id = item.id || `${type}-${Date.now()}`;
  const ref = db.collection("contents").doc(id);
  const exists = (await ref.get()).exists;
  const preparedItem = type === "saints" ? enrichSaintBiography({ ...item, id, type }) : item;
  const payload = {
    ...preparedItem,
    id,
    type,
    slug: preparedItem.slug || slugifyText(preparedItem.title || preparedItem.ref || preparedItem.meta || id),
    status: preparedItem.status || "actived",
    createdDate: preparedItem.createdDate || new Date().toISOString(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  if (!exists) {
    payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  }

  await ref.set(payload, { merge: true });
  return id;
}

async function fillSaintBiographies() {
  const { db } = requireFirebase();
  const snapshot = await db.collection("contents").where("type", "==", "saints").get();
  const batch = db.batch();
  let updatedCount = 0;

  snapshot.forEach((doc) => {
    const current = { id: doc.id, ...doc.data() };
    const enriched = enrichSaintBiography(current);
    const patch = {};

    if (!current.meta && enriched.meta) patch.meta = enriched.meta;
    if ((!current.description || current.description.length < 80) && enriched.description) {
      patch.description = enriched.description;
    }
    if (!current.bodyHtml && enriched.bodyHtml) patch.bodyHtml = enriched.bodyHtml;
    if (!current.status) patch.status = "actived";

    if (Object.keys(patch).length) {
      patch.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      batch.set(doc.ref, patch, { merge: true });
      updatedCount += 1;
    }
  });

  if (updatedCount) await batch.commit();
  return updatedCount;
}

async function updateContentOrder(type, orderedIds) {
  const { db } = requireFirebase();
  const batch = db.batch();

  orderedIds.forEach((id, index) => {
    batch.set(
      db.collection("contents").doc(id),
      {
        sortOrder: index,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  await batch.commit();
}

async function deleteContentItem(id) {
  const { db } = requireFirebase();
  await db.collection("contents").doc(id).delete();
}

async function submitContentRating(id, ratings) {
  const contentRating = Math.max(1, Math.min(5, Number(ratings?.content || 0)));
  const layoutRating = Math.max(1, Math.min(5, Number(ratings?.layout || 0)));
  if (!contentRating || !layoutRating) throw new Error("Vui lÃ²ng chá»n Ä‘á»§ Ä‘Ã¡nh giÃ¡ ná»™i dung vÃ  trÃ¬nh bÃ y.");

  const { db } = requireFirebase();
  await db.collection("contents").doc(id).set(
    {
      contentRatingCount: firebase.firestore.FieldValue.increment(1),
      contentRatingTotal: firebase.firestore.FieldValue.increment(contentRating),
      layoutRatingCount: firebase.firestore.FieldValue.increment(1),
      layoutRatingTotal: firebase.firestore.FieldValue.increment(layoutRating),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

async function submitContentFeedback(item, message) {
  const feedbackMessage = String(message || "").trim();
  if (!feedbackMessage) throw new Error("Vui lÃ²ng nháº­p Ã½ kiáº¿n Ä‘Ã³ng gÃ³p.");

  const { db } = requireFirebase();
  await db.collection("feedbacks").add({
    contentId: item.id,
    contentType: item.type || "",
    contentTitle: item.title || "",
    message: feedbackMessage,
    pageUrl: window.location.href,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    createdAtText: new Date().toISOString(),
  });
}

async function getContentFeedbacks(limit = 100) {
  const { db } = requireFirebase();
  const snapshot = await db
    .collection("feedbacks")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  const feedbacks = [];
  snapshot.forEach((doc) => {
    feedbacks.push({ id: doc.id, ...doc.data() });
  });
  return feedbacks;
}

async function deleteContentFeedback(id) {
  const { db } = requireFirebase();
  await db.collection("feedbacks").doc(id).delete();
}

async function submitPrayerRequest(payload) {
  const prayerTitle = String(payload?.prayerTitle || "").trim();
  if (!prayerTitle) throw new Error("Vui lÃ²ng nháº­p tiÃªu Ä‘á».");

  const prayerText = String(payload?.prayerText || "").trim();
  if (!prayerText) throw new Error("Vui lÃ²ng nháº­p lá»i cáº§u nguyá»‡n.");

  const anonymous = Boolean(payload?.anonymous);
  const displayName = anonymous ? "Anonymous" : String(payload?.displayName || "").trim();
  if (!anonymous && !displayName) throw new Error("Vui lÃ²ng nháº­p há» tÃªn hoáº·c chá»n áº©n danh.");

  const { db } = requireFirebase();
  await db.collection("prayerRequests").add({
    displayName,
    anonymous,
    prayerTitle,
    prayerText,
    status: "pending",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    createdAtText: new Date().toISOString(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

async function getPrayerRequests(limit = 100) {
  const { db } = requireFirebase();
  const snapshot = await db.collection("prayerRequests").orderBy("createdAt", "desc").limit(limit).get();
  const requests = [];
  snapshot.forEach((doc) => {
    requests.push({ id: doc.id, ...doc.data() });
  });
  return requests;
}

async function savePrayerRequest(id, payload) {
  const { db } = requireFirebase();
  const patch = {
    displayName: payload.displayName || "Anonymous",
    anonymous: Boolean(payload.anonymous),
    prayerTitle: payload.prayerTitle || "",
    prayerText: payload.prayerText || "",
    status: payload.status || "pending",
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };
  if (payload.contentId) patch.contentId = payload.contentId;
  await db.collection("prayerRequests").doc(id).set(patch, { merge: true });
}

async function approvePrayerRequest(id, payload) {
  const { db } = requireFirebase();
  const displayName = payload.anonymous ? "Anonymous" : payload.displayName || "Anonymous";
  const prayerTitle = String(payload.prayerTitle || "").trim() || `Lá»i cáº§u nguyá»‡n cá»§a ${displayName}`;

  const prayerText = String(payload.prayerText || "").trim();
  if (!prayerText) throw new Error("Lá»i cáº§u nguyá»‡n khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng.");

  const contentId = `prayer-request-${id}`;
  const batch = db.batch();
  batch.set(
    db.collection("prayerRequests").doc(id),
    {
      displayName,
      anonymous: Boolean(payload.anonymous),
      prayerTitle,
      prayerText,
      status: "approved",
      approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      contentId,
    },
    { merge: true }
  );
  batch.set(
    db.collection("contents").doc(contentId),
    {
      id: contentId,
      type: "prayers",
      title: prayerTitle,
      description: prayerTitle,
      meta: displayName,
      bodyHtml: `<p>${prayerText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "</p><p>")}</p>`,
      image: fallbackImage,
      status: "actived",
      source: "prayer-request",
      createdDate: new Date().toISOString(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  await batch.commit();
}

async function deletePrayerRequest(id) {
  const { db } = requireFirebase();
  const ref = db.collection("prayerRequests").doc(id);
  const snapshot = await ref.get();
  const request = snapshot.exists ? snapshot.data() : null;

  if (request?.status === "approved" || request?.contentId) {
    await ref.set(
      {
        reviewHidden: true,
        hiddenFromReviewAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return "hidden";
  }

  const batch = db.batch();
  batch.delete(ref);
  if (request?.contentId) {
    batch.delete(db.collection("contents").doc(request.contentId));
  }
  await batch.commit();
  return "deleted";
}

async function resetContentRating(id) {
  const { db } = requireFirebase();
  await db.collection("contents").doc(id).set(
    {
      ratingCount: 0,
      ratingTotal: 0,
      contentRatingCount: 0,
      contentRatingTotal: 0,
      layoutRatingCount: 0,
      layoutRatingTotal: 0,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

async function resetContent() {
  await seedDefaultContentIfEmpty(true);
}

function analyticsDocId(value) {
  return String(value || "page_unknown").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 140) || "page_unknown";
}

function shouldCountPageView(key, cooldownMs = 5 * 60 * 1000) {
  const storageKey = `kito-view:${key}`;
  const now = Date.now();
  try {
    const last = Number(localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey) || 0);
    if (last && now - last < cooldownMs) return false;
    localStorage.setItem(storageKey, String(now));
    sessionStorage.setItem(storageKey, String(now));
  } catch (error) {
    return true;
  }
  return true;
}

async function trackPageView(options = {}) {
  const key = analyticsDocId(options.key || window.location.pathname || "page_unknown");
  if (!shouldCountPageView(key, options.cooldownMs)) return false;

  try {
    const { db } = requireFirebase();
    const batch = db.batch();
    const now = firebase.firestore.FieldValue.serverTimestamp();
    const siteRef = db.collection("analytics").doc("site_total");
    const pageRef = db.collection("analytics").doc(key);

    batch.set(
      siteRef,
      {
        key: "site_total",
        label: "Toàn website",
        kind: "site",
        count: firebase.firestore.FieldValue.increment(1),
        updatedAt: now,
      },
      { merge: true }
    );

    batch.set(
      pageRef,
      {
        key,
        label: options.label || document.title || key,
        kind: options.kind || "page",
        contentType: options.contentType || "",
        contentId: options.contentId || "",
        path: window.location.pathname + window.location.search,
        count: firebase.firestore.FieldValue.increment(1),
        updatedAt: now,
      },
      { merge: true }
    );

    await batch.commit();
    return true;
  } catch (error) {
    console.warn("Không thể ghi lượt truy cập", error);
    return false;
  }
}

async function getVisitStats(limit = 200) {
  const { db } = requireFirebase();
  const snapshot = await db.collection("analytics").orderBy("count", "desc").limit(limit).get();
  const stats = [];
  snapshot.forEach((doc) => stats.push({ id: doc.id, ...doc.data() }));
  return stats;
}

function clearLocalVisitCooldowns() {
  try {
    [localStorage, sessionStorage].forEach((storage) => {
      for (let index = storage.length - 1; index >= 0; index -= 1) {
        const key = storage.key(index);
        if (key?.startsWith("kito-view:")) storage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn("Không thể xóa bộ nhớ lượt truy cập cục bộ", error);
  }
}

async function resetVisitStats() {
  const { db } = requireFirebase();
  const snapshot = await db.collection("analytics").get();
  const batch = db.batch();
  snapshot.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
  clearLocalVisitCooldowns();
}
function formatDateParts(value) {
  const rawValue = String(value || "").trim();
  if (!rawValue) return { day: "--", month: "THÁNG --", display: "" };

  if (!/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    return {
      day: "",
      month: rawValue,
      display: rawValue,
      isText: true,
    };
  }

  const date = new Date(`${rawValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return {
      day: "",
      month: rawValue,
      display: rawValue,
      isText: true,
    };
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = `THÁNG ${String(date.getMonth() + 1).padStart(2, "0")}`;
  return {
    day,
    month,
    display: `${day} ${month}`,
    isText: false,
  };
}

const navigationPageTitles = {
  saints: "Các thánh tiêu biểu",
  churches: "Giới thiệu nhà thờ",
  articles: "Bài Viết & Suy Niệm",
  events: "Sự Kiện sắp tới",
  prayers: "Cầu Nguyện",
  catechism: "Giáo Lý",
};

function repairMojibakeText(value) {
  const text = String(value || "");
  if (!/[ÃÄÆ]|áº|á»|â|ð/.test(text)) return text;

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
    return fixed && !fixed.includes("�") ? fixed : text;
  } catch (error) {
    return text
      .replace(/â†/g, "←")
      .replace(/â€œ/g, "“")
      .replace(/â€/g, "”")
      .replace(/Quay láº¡i/g, "Quay lại")
      .replace(/Trang chá»§/g, "Trang chủ")
      .replace(/CÃ¡c thÃ¡nh tiÃªu biá»ƒu/g, "Các thánh tiêu biểu")
      .replace(/Truyá»n GiÃ¡o KitÃ´/g, "Truyền Giáo Kitô");
  }
}
function cleanNavigationTitle(title) {
  const value = repairMojibakeText(title)
    .replace(/\s+-\s+Truyền Giáo Kitô\s*$/i, "")
    .trim();

  if (!value || value === "Truyền Giáo Kitô") return "Trang chủ";
  return value;
}

function getNavigationTitleFromUrl(url) {
  try {
    const parsed = new URL(url, window.location.href);
    const path = parsed.pathname.toLowerCase();

    if (path.endsWith("/") || path.endsWith("/index.html")) return "Trang chủ";
    if (path.endsWith("/admin.html")) return "trang quản lý";
    if (path.endsWith("/accounts.html")) return "trang tài khoản";
    if (path.endsWith("/gui-loi-cau-nguyen") || path.endsWith("/prayer-request.html")) return "Gửi lời cầu nguyện";
    const firstSegment = path.split("/").filter(Boolean)[0];
    if (CONTENT_PATH_TYPES[firstSegment] && path.split("/").filter(Boolean).length === 1) {
      return navigationPageTitles[CONTENT_PATH_TYPES[firstSegment]] || "trang danh mục";
    }
    if (path.endsWith("/category.html")) {
      return navigationPageTitles[parsed.searchParams.get("type")] || "trang danh mục";
    }
  } catch (error) {
    return "";
  }

  return "";
}

function getStoredNavigationPage() {
  try {
    const current = JSON.parse(sessionStorage.getItem("kitoCurrentPage") || "null");
    if (!current?.url) return null;
    const currentUrl = new URL(window.location.href);
    const storedUrl = new URL(current.url, window.location.href);
    if (currentUrl.href === storedUrl.href) return null;
    return current;
  } catch (error) {
    return null;
  }
}

function setupBackLink(fallbackUrl = "/", fallbackTitle = "Trang chủ", options = {}) {
  const link = document.querySelector(".back-link");
  if (!link) return;

  const storedPage = options.useStored === false ? null : getStoredNavigationPage();
  let sameOriginReferrer = false;
  if (document.referrer) {
    try {
      sameOriginReferrer = new URL(document.referrer).origin === window.location.origin;
    } catch (error) {
      sameOriginReferrer = false;
    }
  }
  const referrerTitle = sameOriginReferrer ? getNavigationTitleFromUrl(document.referrer) : "";
  const referrerPage = sameOriginReferrer && referrerTitle
    ? {
        url: document.referrer,
        title: referrerTitle,
      }
    : null;
  const target = referrerPage || storedPage || {
    url: sameOriginReferrer ? document.referrer : fallbackUrl,
    title: referrerTitle || fallbackTitle,
  };

  link.href = target.url || fallbackUrl;
  link.textContent = `← Quay lại ${cleanNavigationTitle(target.title)}`;
  link.addEventListener("click", (event) => {
    if (options.useHistory !== false && target.url && window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  });
}

function rememberCurrentPage(title = document.title) {
  try {
    sessionStorage.setItem(
      "kitoCurrentPage",
      JSON.stringify({
        title: cleanNavigationTitle(title),
        url: window.location.href,
      })
    );
  } catch (error) {
    // Session history is a small enhancement; navigation still works without it.
  }
}
















