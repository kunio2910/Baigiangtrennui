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

function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

function searchLink(item) {
  return item.url || detailLink(item.type, item);
}

function publicJourneyUrl() {
  return ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "/hanh-trinh-kinh-thanh-test.html"
    : "/hanh-trinh-kinh-thanh";
}

function publicJourneyTopicUrl(topicId) {
  const baseUrl = publicJourneyUrl();
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}topic=${encodeURIComponent(topicId || "")}`;
}

function normalizeTopicText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/Ä‘/g, "d")
    .replace(/Ä/g, "D")
    .toLowerCase();
}

function journeyTopicImage(topic = {}) {
  const configuredImage = String(topic.pickerImageUrl || topic.mapImageUrl || topic.image || "").trim();
  if (configuredImage) return configuredImage;
  const haystack = normalizeTopicText(`${topic.id || ""} ${topic.title || ""}`);
  if (haystack.includes("xuat hanh") || haystack.includes("mo se") || haystack.includes("mose")) return "/assets/journey-moses-exodus-map.png";
  if (haystack.includes("chua tao dung troi dat") || haystack.includes("tao dung") || haystack.includes("sang the")) return "/assets/journey-creation-map.png";
  if (haystack.includes("14 chang dang thanh gia") || haystack.includes("14 chan dang thanh gia") || haystack.includes("dang thanh gia")) return "/assets/journey-stations-cross-map.png";
  if (haystack.includes("chua lam phep la") || haystack.includes("cac phep la") || haystack.includes("phep la")) return "/assets/journey-miracles-map.png";
  return "/assets/journey-jesus-map.png";
}

function buildFaithSearchItems(settings) {
  const sets = Array.isArray(settings?.sets) && settings.sets.length
    ? settings.sets
    : Array.isArray(settings?.questions) && settings.questions.length
      ? [
          {
            id: settings.id || "legacy-faith-set",
            title: settings.title || "Khám Phá Đức Tin",
            questions: settings.questions,
          },
        ]
      : [];

  return sets.map((set, index) => {
    const questions = Array.isArray(set?.questions) ? set.questions : [];
    return {
      id: `faith-search-${set?.id || index}`,
      type: "faithDiscovery",
      title: set?.title || `Bộ câu hỏi ${index + 1}`,
      description: `Khám phá đức tin • ${questions.length} câu hỏi`,
      meta: "Khám Phá Đức Tin",
      url: "/kham-pha-duc-tin",
      searchText: questions
        .map((question) => `${question?.topic || ""} ${question?.question || ""}`)
        .join(" "),
    };
  });
}

function buildJourneySearchItems(settings) {
  const topics = Array.isArray(settings?.topics) ? settings.topics : [];
  return topics
    .filter((topic) => topic?.enabled !== false)
    .map((topic, index) => {
      const milestones = Array.isArray(topic?.milestones) ? topic.milestones : [];
      const milestoneText = milestones
        .map((milestone) => `${milestone?.title || ""} ${milestone?.reference || ""} ${milestone?.region || ""} ${milestone?.story || ""} ${milestone?.lesson || ""}`)
        .join(" ");
      return {
        id: `journey-search-${topic?.id || index}`,
        type: "journeyBible",
        title: topic?.title || `Chủ đề ${index + 1}`,
        description: topic?.description || topic?.label || `Hành trình Kinh Thánh • ${milestones.length} cột mốc`,
        meta: "Hành Trình Kinh Thánh",
        url: publicJourneyUrl(),
        searchText: `${topic?.label || ""} ${milestoneText}`,
      };
    });
}

async function loadSupplementalSearchItems() {
  const [faithSettings, journeySettings] = await Promise.all([
    typeof getFaithDiscoverySettings === "function"
      ? getFaithDiscoverySettings().catch((error) => {
          console.warn("Không thể nạp mục Khám Phá Đức Tin cho tìm kiếm.", error);
          return null;
        })
      : Promise.resolve(null),
    typeof getJourneyBibleSettings === "function"
      ? getJourneyBibleSettings().catch((error) => {
          console.warn("Không thể nạp mục Hành Trình Kinh Thánh cho tìm kiếm.", error);
          return null;
        })
      : Promise.resolve(null),
  ]);

  return [
    ...buildFaithSearchItems(faithSettings),
    ...buildJourneySearchItems(journeySettings),
  ];
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

function journeyHomeCardTemplate(topic) {
  const link = publicJourneyTopicUrl(topic.id);
  const imageUrl = journeyTopicImage(topic);
  return `
    <article class="content-card home-journey-card clickable-card" onclick="window.location.href='${link}'">
      <img src="${imageUrl}" alt="${displayText(topic.title)}" ${lazyImageAttrs} />
      <div>
        <h3>${displayText(topic.title)}</h3>
        <a href="${link}" onclick="event.stopPropagation()">KhÃ¡m phÃ¡</a>
      </div>
    </article>
  `;
}

async function renderHomeJourneyBible() {
  const journeyList = document.querySelector("#homeJourneyList");
  if (!journeyList || typeof getJourneyBibleSettings !== "function") return;
  try {
    const settings = await getJourneyBibleSettings();
    const topics = Array.isArray(settings?.topics) ? settings.topics : [];
    const visibleTopics = topics
      .filter((topic) => topic?.enabled !== false)
      .slice(0, 3)
      .map((topic, index) => ({
        ...topic,
        id: String(topic?.id || `journey-topic-${index + 1}`).trim(),
        title: topic?.title || `Chá»§ Ä‘á» ${index + 1}`,
        steps: Array.isArray(topic?.milestones) ? topic.milestones.length : Number(topic?.steps || 0),
      }))
      .filter((topic) => topic.id);

    const section = document.querySelector("#homeJourneyBible");
    if (section) section.hidden = !visibleTopics.length;
    journeyList.innerHTML = visibleTopics.map(journeyHomeCardTemplate).join("");
    document.dispatchEvent(new Event("kito:content-rendered"));
  } catch (error) {
    console.warn("KhÃ´ng thá»ƒ náº¡p má»¥c HÃ nh TrÃ¬nh Kinh ThÃ¡nh trÃªn trang chá»§.", error);
    journeyList.innerHTML = "";
  }
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
  renderHomeJourneyBible();
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
  let allItems = ["saints", "churches", "articles", "events", "prayers", "catechism"].flatMap((type) =>
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

  function renderSearchResults() {
    const keyword = normalizeSearchText(input.value.trim());
    const matches = allItems.filter((item) =>
      normalizeSearchText(`${item.title} ${item.description} ${item.meta || ""} ${item.searchText || ""}`).includes(keyword)
    );

    resultBox.innerHTML = keyword
      ? matches.map((item) => `<a href="${searchLink(item)}"><strong>${item.title}</strong><span>${summarizeText(item.description, 120)}</span></a>`).join("")
      : "";
    if (keyword && matches.length) {
      openSearchDrawer();
    } else {
      closeSearchDrawer();
    }
  }

  input.addEventListener("input", renderSearchResults);

  loadSupplementalSearchItems().then((items) => {
    allItems = [...allItems, ...items];
    if (input.value.trim()) renderSearchResults();
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
    link.href = publicJourneyUrl();
    if (icon) icon.textContent = "••";
    if (title) title.textContent = "Hành Trình Kinh Thánh";
    if (subtitle) subtitle.textContent = "Khám phá các cột mốc đức tin";
  });

  document.querySelectorAll("[data-local-journey-all]").forEach((link) => {
    link.href = publicJourneyUrl();
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





