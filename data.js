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

const defaultContent = CONTENT_TYPES.reduce((content, type) => {
  content[type] = [];
  return content;
}, {});

function normalizeSaintKey(value) {
  return slugifyText(value);
}

function enrichSaintBiography(item) {
  return item;
}

function isFirebaseConfigured() {
  return Boolean(
    window.KITO_FIREBASE_CONFIG &&
      window.KITO_FIREBASE_CONFIG.apiKey &&
      !window.KITO_FIREBASE_CONFIG.apiKey.includes("DAN_")
  );
}

function requireFirebase() {
  if (!isFirebaseConfigured()) {
    throw new Error("Bạn chưa cấu hình Firebase. Hãy dán firebaseConfig vào file firebase-config.js.");
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
  // Automatic content seeding is disabled. Firestore must only contain data created or imported by admins.
  return;
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
    const normalizedItem = normalizeContentItem(enrichedItem);
    const item = {
      ...normalizedItem,
      slug: slugifyText(normalizedItem.title || normalizedItem.ref || normalizedItem.meta || normalizedItem.id),
    };
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

CONTENT_TYPES.forEach((type) => {
    content[type] = content[type].map((item) => {
      const normalizedItem = normalizeContentItem(item);
      return {
        ...normalizedItem,
        slug: slugifyText(normalizedItem.title || normalizedItem.ref || normalizedItem.meta || normalizedItem.id),
      };
    });
  });

  return content;
}

async function saveContentItem(type, item) {
  const { db } = requireFirebase();
  const id = item.id || `${type}-${Date.now()}`;
  const ref = db.collection("contents").doc(id);
  const exists = (await ref.get()).exists;
  const preparedItem = normalizeContentItem(item);
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
  // Default saint biography seeding is disabled to avoid writing generated data to Firestore.
  return 0;
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
  if (!contentRating || !layoutRating) throw new Error("Vui lòng chọn đủ đánh giá nội dung và trình bày.");

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
  if (!feedbackMessage) throw new Error("Vui lòng nhập ý kiến đóng góp.");

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
    feedbacks.push(normalizeContentItem({ id: doc.id, ...doc.data() }));
  });
  return feedbacks;
}

async function deleteContentFeedback(id) {
  const { db } = requireFirebase();
  await db.collection("feedbacks").doc(id).delete();
}

async function submitPrayerRequest(payload) {
  const prayerTitle = String(payload?.prayerTitle || "").trim();
  if (!prayerTitle) throw new Error("Vui lòng nhập tiêu đề.");

  const prayerText = String(payload?.prayerText || "").trim();
  if (!prayerText) throw new Error("Vui lòng nhập lời cầu nguyện.");

  const anonymous = Boolean(payload?.anonymous);
  const displayName = anonymous ? "Anonymous" : String(payload?.displayName || "").trim();
  if (!anonymous && !displayName) throw new Error("Vui lòng nhập họ tên hoặc chọn ẩn danh.");

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
    requests.push(normalizeContentItem({ id: doc.id, ...doc.data() }));
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
  const prayerTitle = repairMojibakeText(String(payload.prayerTitle || "").trim() || `Lời cầu nguyện của ${displayName}`);

  const prayerText = repairMojibakeText(String(payload.prayerText || "").trim());
  if (!prayerText) throw new Error("Lời cầu nguyện không được để trống.");

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
  // Resetting to sample content is disabled to prevent accidental Firestore writes.
  return;
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
  snapshot.forEach((doc) => stats.push(normalizeContentItem({ id: doc.id, ...doc.data() })));
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

async function getFaithDiscoverySettings() {
  const { db } = requireFirebase();
  const snapshot = await db.collection("siteSettings").doc("faithDiscovery").get();
  if (!snapshot.exists) return null;
  return normalizeContentItem({ id: snapshot.id, ...snapshot.data() });
}

async function saveFaithDiscoverySettings(settings = {}) {
  const { db } = requireFirebase();
  const questions = Array.isArray(settings.questions) ? settings.questions : [];
  const sets = Array.isArray(settings.sets) ? settings.sets : [];
  const infographicUrl = String(settings.infographicUrl || "").trim();
  const bannerImageUrl = String(settings.bannerImageUrl || "").trim();
  const pickerImageUrl = String(settings.pickerImageUrl || "").trim();

  await db.collection("siteSettings").doc("faithDiscovery").set(
    {
      infographicUrl,
      
      bannerImageUrl,
      pickerImageUrl,
      questions,
      sets,
      activeSetId: settings.activeSetId || "",
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAtText: new Date().toISOString(),
    },
    { merge: true }
  );
}

const BACKUP_COLLECTIONS = ["contents", "users", "feedbacks", "prayerRequests", "analytics", "siteSettings"];

function serializeBackupValue(value) {
  if (value?.toDate && typeof value.toDate === "function") {
    return {
      __type: "timestamp",
      value: value.toDate().toISOString(),
    };
  }

  if (Array.isArray(value)) return value.map(serializeBackupValue);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, serializeBackupValue(entryValue)])
    );
  }

  return value;
}

function restoreBackupValue(value) {
  if (Array.isArray(value)) return value.map(restoreBackupValue);

  if (value && typeof value === "object") {
    if (value.__type === "timestamp" && value.value) {
      return firebase.firestore.Timestamp.fromDate(new Date(value.value));
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, restoreBackupValue(entryValue)])
    );
  }

  return value;
}

function summarizeFaithDiscoveryBackup(settings) {
  if (!settings || typeof settings !== "object") {
    return {
      hasData: false,
      activeSetId: "",
      setCount: 0,
      questionCount: 0,
      sets: [],
    };
  }

  const sets = Array.isArray(settings.sets) ? settings.sets : [];
  const legacyQuestions = Array.isArray(settings.questions) ? settings.questions : [];
  const normalizedSets = sets.map((set, index) => ({
    id: String(set?.id || `faith-set-${index + 1}`),
    title: String(set?.title || `Bộ ${index + 1}`),
    hasPickerImage: Boolean(String(set?.pickerImageUrl || "").trim()),
    hasBanner: Boolean(String(set?.bannerImageUrl || "").trim()),
    hasInfographic: Boolean(String(set?.infographicUrl || "").trim()),
    questionCount: Array.isArray(set?.questions) ? set.questions.length : 0,
  }));

  if (!normalizedSets.length && legacyQuestions.length) {
    normalizedSets.push({
      id: "legacy-faith-set",
      title: String(settings.title || "Khám Phá Đức Tin"),
      hasPickerImage: Boolean(String(settings.pickerImageUrl || "").trim()),
      hasBanner: Boolean(String(settings.bannerImageUrl || "").trim()),
      hasInfographic: Boolean(String(settings.infographicUrl || "").trim()),
      questionCount: legacyQuestions.length,
    });
  }

  return {
    hasData: normalizedSets.length > 0,
    activeSetId: String(settings.activeSetId || ""),
    setCount: normalizedSets.length,
    questionCount: normalizedSets.reduce((sum, set) => sum + set.questionCount, 0),
    sets: normalizedSets,
  };
}
async function exportFirestoreBackup() {
  const { db } = requireFirebase();
  const backup = {
    app: "Baigiangtrennui",
    version: 1,
    exportedAt: new Date().toISOString(),
    collections: {},
  };

  for (const collectionName of BACKUP_COLLECTIONS) {
    const snapshot = await db.collection(collectionName).get();
    backup.collections[collectionName] = [];
    snapshot.forEach((doc) => {
      backup.collections[collectionName].push({
        id: doc.id,
        data: serializeBackupValue(doc.data()),
      });
    });
  }
  const faithDiscoveryDoc = backup.collections.siteSettings?.find((doc) => doc.id === "faithDiscovery");
  backup.metadata = backup.metadata || {};
  backup.metadata.faithDiscovery = summarizeFaithDiscoveryBackup(faithDiscoveryDoc?.data);
  backup.faithDiscovery = faithDiscoveryDoc?.data || null;
  return backup;
}

async function importFirestoreBackup(backup) {
  if (!backup?.collections || typeof backup.collections !== "object") {
    throw new Error("File backup không đúng định dạng.");
  }

  const { db } = requireFirebase();
  let restoredCount = 0;
  if (backup.faithDiscovery && !backup.collections.siteSettings) {
    backup.collections.siteSettings = [
      {
        id: "faithDiscovery",
        data: backup.faithDiscovery,
      },
    ];
  }

  for (const collectionName of BACKUP_COLLECTIONS) {
    const documents = backup.collections[collectionName];
    if (!Array.isArray(documents) || !documents.length) continue;

    for (let index = 0; index < documents.length; index += 400) {
      const batch = db.batch();
      documents.slice(index, index + 400).forEach((documentItem) => {
        if (!documentItem?.id || !documentItem.data || typeof documentItem.data !== "object") return;
        batch.set(
          db.collection(collectionName).doc(String(documentItem.id)),
          restoreBackupValue(documentItem.data),
          { merge: true }
        );
        restoredCount += 1;
      });
      await batch.commit();
    }
  }

  return restoredCount;
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

  const decodeWindows1252Text = (input) => {
    const bytes = [];
    for (const char of input) {
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
    return fixed && !fixed.includes("�") ? fixed : input;
  };

  const repairMixedText = (input) =>
    input.replace(/[^\s<>"']*(?:[ÃÄÆÂâð]|áº|á»)[^\s<>"']*/g, (chunk) => {
      try {
        return decodeWindows1252Text(chunk);
      } catch (error) {
        return chunk;
      }
    });

  try {
    const fixed = decodeWindows1252Text(text);
    return fixed !== text ? fixed : repairMixedText(text);
  } catch (error) {
    return repairMixedText(text)
      .replace(/â†/g, "←")
      .replace(/â€œ/g, "“")
      .replace(/â€/g, "”")
      .replace(/Quay láº¡i/g, "Quay lại")
      .replace(/Trang chá»§/g, "Trang chủ")
      .replace(/CÃ¡c thÃ¡nh tiÃªu biá»ƒu/g, "Các thánh tiêu biểu")
      .replace(/Truyá»n GiÃ¡o KitÃ´/g, "Truyền Giáo Kitô");
  }
}

const MOJIBAKE_TEXT_FIELDS = [
  "title",
  "description",
  "meta",
  "date",
  "quote",
  "ref",
  "bodyHtml",
  "contentTitle",
  "displayName",
  "prayerTitle",
  "prayerText",
  "message",
  "label",
  "name",
];

function normalizeContentItem(item = {}) {
  const normalized = { ...item };
  MOJIBAKE_TEXT_FIELDS.forEach((field) => {
    if (typeof normalized[field] === "string") {
      normalized[field] = repairMojibakeText(normalized[field]);
    }
  });
  return normalized;
}

function repairVisibleMojibake(root = document.body) {
  if (!root) return;
  const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (textWalker.nextNode()) textNodes.push(textWalker.currentNode);
  textNodes.forEach((node) => {
    const fixed = repairMojibakeText(node.nodeValue);
    if (fixed !== node.nodeValue) node.nodeValue = fixed;
  });

  root.querySelectorAll?.("*").forEach((element) => {
    ["alt", "title", "placeholder", "aria-label", "value"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const current = element.getAttribute(attribute);
      const fixed = repairMojibakeText(current);
      if (fixed !== current) element.setAttribute(attribute, fixed);
    });

    if (element !== document.activeElement && typeof element.value === "string") {
      const fixedValue = repairMojibakeText(element.value);
      if (fixedValue !== element.value) element.value = fixedValue;
    }
  });
}

function setupMojibakeRepair() {
  repairVisibleMojibake();
  document.addEventListener("kito:content-rendered", () => repairVisibleMojibake());

  let repairQueued = false;
  const queueRepair = () => {
    if (repairQueued) return;
    repairQueued = true;
    window.requestAnimationFrame(() => {
      repairQueued = false;
      repairVisibleMojibake();
    });
  };

  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length || mutation.type === "characterData")) {
      queueRepair();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupMojibakeRepair);
} else {
  setupMojibakeRepair();
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
    if (path.endsWith("/kham-pha-duc-tin") || path.endsWith("/faith-discovery.html")) return "Khám Phá Đức Tin";
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































