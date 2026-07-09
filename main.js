let content = null;
let dailyIndex = 0;
let dailyTimer = null;

const imageOrFallback = (item) => item.image || fallbackImage;
const detailLink = (type, id) => `detail.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
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
  const link = detailLink(type, item.id);
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
  const link = detailLink("churches", item.id);
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
  const link = detailLink("articles", item.id);
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
  const link = detailLink("events", item.id);
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
  const link = detailLink("prayers", item.id);
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
  document.querySelector("#eventsList").innerHTML = activeItems(content.events).slice(0, 3).map(eventTemplate).join("");
  const prayerItems = dailyRandomItems(content.prayers, "prayers", 6);
  const prayerTrackItems = prayerItems.length > 1 ? [...prayerItems, ...prayerItems] : prayerItems;
  document.querySelector("#prayersList").innerHTML = prayerTrackItems.map(prayerTemplate).join("");
  renderDaily();
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
        <h3>ChÆ°a káº¿t ná»‘i Firebase</h3>
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
  const searchToggle = document.querySelector("#searchToggle");
  const allItems = ["saints", "churches", "articles", "events", "prayers", "catechism"].flatMap((type) =>
    activeItems(content[type]).map((item) => ({ ...item, type }))
  );

  function closeSearchDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  }

  searchToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = drawer.classList.toggle("open");
    drawer.setAttribute("aria-hidden", String(!open));
    if (open) {
      const rect = searchToggle.getBoundingClientRect();
      drawer.style.top = `${Math.round(rect.top)}px`;
      drawer.style.left = `${Math.round(rect.right + 10)}px`;
      drawer.style.right = "auto";
      input.focus();
    }
  });

  drawer.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", (event) => {
    if (!drawer.classList.contains("open")) return;
    if (drawer.contains(event.target) || searchToggle.contains(event.target)) return;
    closeSearchDrawer();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSearchDrawer();
  });

  input.addEventListener("input", () => {
    const keyword = input.value.trim().toLowerCase();
    const matches = allItems.filter((item) =>
      `${item.title} ${item.description} ${item.meta || ""}`.toLowerCase().includes(keyword)
    );

    resultBox.innerHTML = keyword
      ? matches.map((item) => `<a href="${detailLink(item.type, item.id)}"><strong>${item.title}</strong><span>${summarizeText(item.description, 120)}</span></a>`).join("")
      : "";
  });
}

function setupComingSoonLinks() {
  document.querySelectorAll("[data-coming-soon]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      alert("Ná»™i dung nÃ y Ä‘ang hoÃ n thÃ nh, vui lÃ²ng Ä‘á»£i !");
    });
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
    setupSearch();
  }
  setupComingSoonLinks();
  rememberCurrentPage("Trang chủ");
}

initHome();




