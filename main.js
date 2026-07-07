let content = null;
let dailyIndex = 0;

const imageOrFallback = (item) => item.image || fallbackImage;
const detailLink = (type, id) => `detail.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;

function summarizeText(text, maxLength = 115) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
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
      <div class="event-date">
        <strong>${date.day}</strong>
        <span>${date.month}</span>
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

function renderDaily() {
  const daily = content.daily[dailyIndex];
  document.querySelector("#dailyQuote").textContent = `“${daily.quote}”`;
  document.querySelector("#dailyRef").textContent = `(${daily.ref})`;
  document.querySelector("#dailyDots").innerHTML = content.daily
    .map((_, index) => `<span class="${index === dailyIndex ? "active" : ""}"></span>`)
    .join("");
}

function renderHome() {
  document.querySelector("#saintsList").innerHTML = content.saints.slice(0, 5).map((item) => cardTemplate(item, "saints")).join("");
  document.querySelector("#churchesList").innerHTML = content.churches.map(churchTemplate).join("");
  document.querySelector("#articlesList").innerHTML = content.articles.map(articleTemplate).join("");
  document.querySelector("#eventsList").innerHTML = content.events.map(eventTemplate).join("");
  renderDaily();
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
}

function setupSearch() {
  const drawer = document.querySelector("#searchDrawer");
  const input = document.querySelector("#searchInput");
  const resultBox = document.querySelector("#searchResults");
  const allItems = ["saints", "churches", "articles", "events"].flatMap((type) =>
    content[type].map((item) => ({ ...item, type }))
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
  dailyIndex = (dailyIndex - 1 + content.daily.length) % content.daily.length;
  renderDaily();
});

document.querySelector("#nextDaily").addEventListener("click", () => {
  dailyIndex = (dailyIndex + 1) % content.daily.length;
  renderDaily();
});

async function initHome() {
  try {
    content = await getContent();
    renderHome();
    setupSearch();
  } catch (error) {
    content = structuredClone(defaultContent);
    renderDaily();
    renderLoadError(error);
    setupSearch();
  }
}

initHome();
