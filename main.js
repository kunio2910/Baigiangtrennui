let content = null;
let dailyIndex = 0;
let dailyTimer = null;

const imageOrFallback = (item) => item.image || fallbackImage;
const detailLink = (type, item) =>
  typeof contentDetailUrl === "function"
    ? contentDetailUrl(type, item)
    : `detail.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(item?.id || item || "")}`;
const activeItems = (items = []) => items.filter((item) => item.status !== "unactived");
const lazyImageAttrs = 'loading="lazy" decoding="async"';
const preloadedImages = new Set();

function preloadImage(src) {
  const imageUrl = String(src || "").trim();
  if (!imageUrl || preloadedImages.has(imageUrl)) return;
  preloadedImages.add(imageUrl);
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = imageUrl;
  link.fetchPriority = "high";
  document.head.appendChild(link);
}

function dailySeed(key) {
  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  const text = `${today}:${key}`;
  let seed = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    seed ^= text.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  return seed >>> 0;
}

function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = Math.imul(value + 0x6d2b79f5, 1);
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function dailyShuffle(items, key) {
  const shuffled = [...items];
  const random = seededRandom(dailySeed(key));
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function dailyRandomItems(items = [], key, limit) {
  return dailyShuffle(activeItems(items), key).slice(0, limit);
}

function fixedHomeItems(items = [], limit) {
  return activeItems(items).slice(0, limit);
}

function displayText(value) {
  const text = String(value || "");
  return typeof repairMojibakeText === "function" ? repairMojibakeText(text) : text;
}
function summarizeText(text, maxLength = 115) {
  const value = displayText(text)
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .trim();
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

function htmlToText(value) {
  const template = document.createElement("template");
  template.innerHTML = String(value || "");
  return (template.content.textContent || "").replace(/\s+/g, " ").trim();
}

function cardTemplate(item, type = "saints") {
  const link = detailLink(type, item);
  return `
    <article class="content-card clickable-card" onclick="window.location.href='${link}'">
      <img src="${imageOrFallback(item)}" alt="${item.title}" ${lazyImageAttrs} />
      <div>
        <h3>${displayText(item.title)}</h3>
        <p>${summarizeText(item.description, 105)}</p>
        <a href="${link}" onclick="event.stopPropagation()">Chi tiết</a>
      </div>
    </article>
  `;
}

function churchTemplate(item) {
  const link = detailLink("churches", item);
  return `
    <article class="church-card clickable-card" onclick="window.location.href='${link}'">
      <img src="${imageOrFallback(item)}" alt="${item.title}" ${lazyImageAttrs} />
      <div>
        <h3>${displayText(item.title)}</h3>
        <p>📍 ${displayText(item.meta || "Việt Nam")}</p>
        <a href="${link}" onclick="event.stopPropagation()">Chi tiết</a>
      </div>
    </article>
  `;
}

function articleTemplate(item) {
  const link = detailLink("articles", item);
  return `
    <article class="article-card clickable-card" onclick="window.location.href='${link}'">
      <img src="${imageOrFallback(item)}" alt="${item.title}" ${lazyImageAttrs} />
      <div>
        <h3>${displayText(item.title)}</h3>
        <p>${summarizeText(item.description, 105)}</p>
        <a href="${link}" onclick="event.stopPropagation()">Đọc thêm</a>
      </div>
    </article>
  `;
}

function eventTemplate(item) {
  const date = formatDateParts(item.date);
  const link = detailLink("events", item);
  return `
    <article class="event-card clickable-card" onclick="window.location.href='${link}'">
      <div class="event-date ${date.isText ? "is-text-date" : ""}">
        ${date.isText ? `<span>${date.display}</span>` : `<strong>${date.day}</strong><span>${date.month}</span>`}
      </div>
      <div>
        <h3>${displayText(item.title)}</h3>
        <p>${displayText(item.meta || item.description)}</p>
        <small>${summarizeText(item.description, 85)}</small>
        <a href="${link}" onclick="event.stopPropagation()">Chi tiết</a>
      </div>
    </article>
  `;
}

function prayerTemplate(item) {
  const link = detailLink("prayers", item);
  const prayerExcerpt = htmlToText(item.bodyHtml) || item.description || "";
  return `
    <article class="prayer-card clickable-card" style="--prayer-image: url('${imageOrFallback(item)}')" onclick="window.location.href='${link}'">
      <div>
        <h3>${displayText(item.title)}</h3>
        <blockquote>“${summarizeText(prayerExcerpt, 125)}”</blockquote>
      </div>
    </article>
  `;
}

function renderDaily() {
  const dailyItems = activeItems(content.daily);
  if (!dailyItems.length) return;
  if (dailyIndex >= dailyItems.length) dailyIndex = 0;
  const daily = dailyItems[dailyIndex];
  const quote = daily.quote || daily.description || daily.title || "";
  const ref = daily.ref || daily.meta || daily.title || "";
  preloadImage(imageOrFallback(daily));
  document.querySelector("#dailyQuote").textContent = `“${displayText(quote)}”`;
  document.querySelector("#dailyRef").textContent = ref ? `(${displayText(ref)})` : "";
  document.querySelector(".daily-card").style.setProperty("--daily-image", `url("${imageOrFallback(daily)}")`);
  document.querySelector("#dailyDots").innerHTML = dailyItems
    .map((_, index) => `<span class="${index === dailyIndex ? "active" : ""}"></span>`)
    .join("");
  document.dispatchEvent(new Event("kito:content-rendered"));
}

function renderHeroBanner() {
  const banner = activeItems(content.banners)?.[0];
  if (!banner) return;
  preloadImage(imageOrFallback(banner));
  document.querySelector("#heroTitle").textContent = displayText(banner.title);
  document.querySelector(".hero-content p").textContent = displayText(banner.description);
  document.querySelector(".hero-bg").style.setProperty("--hero-image", `url("${imageOrFallback(banner)}")`);
}

function renderHome() {
  renderHeroBanner();
  document.querySelector("#saintsList").innerHTML = dailyRandomItems(content.saints, "saints", 5).map((item) => cardTemplate(item, "saints")).join("");
  document.querySelector("#churchesList").innerHTML = dailyRandomItems(content.churches, "churches", 3).map(churchTemplate).join("");
  document.querySelector("#articlesList").innerHTML = dailyRandomItems(content.articles, "articles", 3).map(articleTemplate).join("");
  document.querySelector("#eventsList").innerHTML = fixedHomeItems(content.events, 3).map(eventTemplate).join("");
  const prayerItems = dailyRandomItems(content.prayers, "prayers", 6);
  const prayerTrackItems = prayerItems.length > 1 ? [...prayerItems, ...prayerItems] : prayerItems;
  const prayerList = document.querySelector("#prayersList");
  prayerList.classList.toggle("is-static", prayerItems.length < 2);
  prayerList.innerHTML = prayerTrackItems.map(prayerTemplate).join("");
  restartPrayerMarquee();
  renderDaily();
  document.dispatchEvent(new Event("kito:content-rendered"));
}

function restartPrayerMarquee() {
  const prayerList = document.querySelector("#prayersList");
  if (!prayerList || prayerList.classList.contains("is-static")) return;
  prayerList.classList.remove("is-ready");
  window.requestAnimationFrame(() => {
    void prayerList.offsetWidth;
    prayerList.classList.add("is-ready");
  });
}

function startDailyAutoSlide() {
  clearInterval(dailyTimer);
  const dailyItems = activeItems(content.daily);
  if (dailyItems.length < 2) return;
  dailyTimer = setInterval(() => {
    dailyIndex = (dailyIndex + 1) % dailyItems.length;
    renderDaily();
  }, 5000);
}

function renderLoadError(error) {
  document.querySelector("#saintsList").innerHTML = `
    <article class="content-card">
      <div>
        <h3>Chưa kết nối Firebase</h3>
        <p>${error.message}</p>
      </div>
    </article>
  `;
  document.querySelector("#churchesList").innerHTML = "";
  document.querySelector("#articlesList").innerHTML = "";
  document.querySelector("#eventsList").innerHTML = "";
  document.querySelector("#prayersList").innerHTML = "";
}

function setupSearch() {
  const drawer = document.querySelector("#searchDrawer");
  const input = document.querySelector("#searchInput");
  const resultBox = document.querySelector("#searchResults");
  const searchBox = document.querySelector("#headerSearchBox");
  const allItems = ["saints", "churches", "articles", "events", "prayers", "catechism"].flatMap((type) =>
    activeItems(content[type]).map((item) => ({ ...item, type }))
  );

  function positionSearchDrawer() {
    const rect = searchBox.getBoundingClientRect();
    drawer.style.top = `${Math.round(rect.bottom + 8)}px`;
    drawer.style.left = `${Math.round(rect.left)}px`;
    drawer.style.right = "auto";
    drawer.style.width = `${Math.round(Math.max(rect.width, 300))}px`;
  }

  function openSearchDrawer() {
    positionSearchDrawer();
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
  }

  function closeSearchDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  }

  searchBox.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  input.addEventListener("focus", () => {
    if (input.value.trim()) openSearchDrawer();
  });

  drawer.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", (event) => {
    if (!drawer.classList.contains("open")) return;
    if (drawer.contains(event.target) || searchBox.contains(event.target)) return;
    closeSearchDrawer();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSearchDrawer();
  });

  window.addEventListener("resize", () => {
    if (drawer.classList.contains("open")) positionSearchDrawer();
  });

  input.addEventListener("input", () => {
    const keyword = input.value.trim().toLowerCase();
    const matches = allItems.filter((item) =>
      `${item.title} ${item.description} ${item.meta || ""}`.toLowerCase().includes(keyword)
    );

    resultBox.innerHTML = keyword
      ? matches.map((item) => `<a href="${detailLink(item.type, item)}"><strong>${item.title}</strong><span>${summarizeText(item.description, 120)}</span></a>`).join("")
      : "";
    if (keyword && matches.length) {
      openSearchDrawer();
    } else {
      closeSearchDrawer();
    }
  });
}

function setupComingSoonLinks() {
  let notice = document.querySelector("#comingSoonNotice");
  if (!notice) {
    notice = document.createElement("div");
    notice.id = "comingSoonNotice";
    notice.className = "coming-soon-notice";
    notice.setAttribute("role", "status");
    notice.setAttribute("aria-live", "polite");
    document.body.appendChild(notice);
  }
  let noticeTimer = null;
  const showComingSoonNotice = () => {
    notice.textContent = "Nội dung này đang hoàn thành, vui lòng đợi !";
    notice.classList.add("show");
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => notice.classList.remove("show"), 2600);
  };

  document.querySelectorAll("[data-coming-soon]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      showComingSoonNotice();
    });
  });

  document.querySelectorAll("[data-local-journey]").forEach((link) => {
    const icon = link.querySelector("span");
    const title = link.querySelector("strong");
    const subtitle = link.querySelector("small");
    const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    link.href = isLocalhost ? "/hanh-trinh-kinh-thanh-test.html" : "/hanh-trinh-kinh-thanh";
    if (icon) icon.textContent = "••";
    if (title) title.textContent = "Hành Trình Kinh Thánh";
    if (subtitle) subtitle.textContent = "Khám phá các cột mốc đức tin";
  });
}

document.querySelector("#prevDaily").addEventListener("click", () => {
  const dailyItems = activeItems(content.daily);
  if (!dailyItems.length) return;
  dailyIndex = (dailyIndex - 1 + dailyItems.length) % dailyItems.length;
  renderDaily();
  startDailyAutoSlide();
});

document.querySelector("#nextDaily").addEventListener("click", () => {
  const dailyItems = activeItems(content.daily);
  if (!dailyItems.length) return;
  dailyIndex = (dailyIndex + 1) % dailyItems.length;
  renderDaily();
  startDailyAutoSlide();
});

window.addEventListener("resize", () => {
  restartPrayerMarquee();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) restartPrayerMarquee();
});

async function initHome() {
  trackPageView({ key: "page_home", label: "Trang chủ", kind: "page" });
  try {
    content = await getContent();
    renderHome();
    startDailyAutoSlide();
    setupSearch();
  } catch (error) {
    content = structuredClone(defaultContent);
    renderHeroBanner();
    renderDaily();
    startDailyAutoSlide();
    renderLoadError(error);
    document.dispatchEvent(new Event("kito:content-rendered"));
    setupSearch();
  }
  setupComingSoonLinks();
  rememberCurrentPage("Trang chủ");
}

initHome();





