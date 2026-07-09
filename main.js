let content = null;
let dailyIndex = 0;
let dailyTimer = null;

const imageOrFallback = (item) => item.image || fallbackImage;
const detailLink = (type, id) => `detail.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
const activeItems = (items = []) => items.filter((item) => item.status !== "unactived");

function summarizeText(text, maxLength = 115) {
  const value = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .trim();
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

function cardTemplate(item, type = "saints") {
  const link = detailLink(type, item.id);
  return `
    <article class="content-card clickable-card" onclick="window.location.href='${link}'">
      <img src="${imageOrFallback(item)}" alt="${item.title}" />
      <div>
        <h3>${item.title}</h3>
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
      <img src="${imageOrFallback(item)}" alt="${item.title}" />
      <div>
        <h3>${item.title}</h3>
        <p>📍 ${item.meta || "Việt Nam"}</p>
        <a href="${link}" onclick="event.stopPropagation()">Chi tiết</a>
      </div>
    </article>
  `;
}

function articleTemplate(item) {
  const link = detailLink("articles", item.id);
  return `
    <article class="article-card clickable-card" onclick="window.location.href='${link}'">
      <img src="${imageOrFallback(item)}" alt="${item.title}" />
      <div>
        <h3>${item.title}</h3>
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
        <h3>${item.title}</h3>
        <p>${item.meta || item.description}</p>
        <small>${summarizeText(item.description, 85)}</small>
        <a href="${link}" onclick="event.stopPropagation()">Chi tiết</a>
      </div>
    </article>
  `;
}

function prayerTemplate(item) {
  const link = detailLink("prayers", item.id);
  return `
    <article class="prayer-card clickable-card" style="--prayer-image: url('${imageOrFallback(item)}')" onclick="window.location.href='${link}'">
      <div>
        <p>${item.meta || "Cầu nguyện"}</p>
        <h3>${item.title}</h3>
        <blockquote>“${summarizeText(item.description, 125)}”</blockquote>
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
  document.querySelector("#dailyQuote").textContent = `“${quote}”`;
  document.querySelector("#dailyRef").textContent = ref ? `(${ref})` : "";
  document.querySelector(".daily-card").style.setProperty("--daily-image", `url("${imageOrFallback(daily)}")`);
  document.querySelector("#dailyDots").innerHTML = dailyItems
    .map((_, index) => `<span class="${index === dailyIndex ? "active" : ""}"></span>`)
    .join("");
}

function renderHeroBanner() {
  const banner = activeItems(content.banners)?.[0];
  if (!banner) return;
  document.querySelector("#heroTitle").textContent = banner.title || "";
  document.querySelector(".hero-content p").textContent = banner.description || "";
  document.querySelector(".hero-bg").style.setProperty("--hero-image", `url("${imageOrFallback(banner)}")`);
}

function renderHome() {
  renderHeroBanner();
  document.querySelector("#saintsList").innerHTML = activeItems(content.saints).slice(0, 5).map((item) => cardTemplate(item, "saints")).join("");
  document.querySelector("#churchesList").innerHTML = activeItems(content.churches).slice(0, 3).map(churchTemplate).join("");
  document.querySelector("#articlesList").innerHTML = activeItems(content.articles).slice(0, 3).map(articleTemplate).join("");
  document.querySelector("#eventsList").innerHTML = activeItems(content.events).slice(0, 3).map(eventTemplate).join("");
  const prayerItems = activeItems(content.prayers).slice(0, 6);
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
  const allItems = ["saints", "churches", "articles", "events", "prayers"].flatMap((type) =>
    activeItems(content[type]).map((item) => ({ ...item, type }))
  );

  document.querySelector("#searchToggle").addEventListener("click", () => {
    const open = drawer.classList.toggle("open");
    drawer.setAttribute("aria-hidden", String(!open));
    if (open) {
      const rect = document.querySelector("#searchToggle").getBoundingClientRect();
      drawer.style.top = `${Math.round(rect.top)}px`;
      drawer.style.left = `${Math.round(rect.right + 10)}px`;
      drawer.style.right = "auto";
      input.focus();
    }
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
  rememberCurrentPage("Trang chủ");
}

initHome();
