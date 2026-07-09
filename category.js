const categoryLabels = {
  saints: {
    eyebrow: "Các thánh",
    title: "Các thánh tiêu biểu",
    description: "Tổng hợp những bài viết về các thánh, các mẫu gương đức tin và đời sống thánh thiện.",
    action: "Chi tiết",
  },
  churches: {
    eyebrow: "Nhà thờ",
    title: "Giới thiệu nhà thờ",
    description: "Những địa điểm nhà thờ, giáo xứ và dấu ấn đức tin được cộng đoàn yêu mến.",
    action: "Chi tiết",
  },
  articles: {
    eyebrow: "Bài Viết & Suy Niệm",
    title: "Bài Viết & Suy Niệm",
    description: "Các bài suy niệm, chia sẻ Lời Chúa và nội dung nâng đỡ đời sống cầu nguyện.",
    action: "Đọc thêm",
  },
  events: {
    eyebrow: "Sự Kiện",
    title: "Sự Kiện sắp tới",
    description: "Các thánh lễ, giờ cầu nguyện, khóa tĩnh tâm và sinh hoạt cộng đoàn.",
    action: "Chi tiết",
  },
  prayers: {
    eyebrow: "Cầu Nguyện",
    title: "Cầu Nguyện",
    description: "Những lời cầu nguyện giúp nâng đỡ đời sống đức tin trong từng hoàn cảnh hằng ngày.",
    action: "Chi tiết",
  },
  catechism: {
    eyebrow: "Giáo Lý",
    title: "Giáo Lý",
    description: "Tổng hợp các kinh nguyện và nội dung giáo lý căn bản trong đời sống Công Giáo.",
    action: "Chi tiết",
  },
};

const categoryParams = new URLSearchParams(window.location.search);
const categoryType = categoryParams.get("type") || "saints";
const categoryAllowedTypes = ["saints", "churches", "articles", "events", "prayers", "catechism"];
const activeType = categoryAllowedTypes.includes(categoryType) ? categoryType : "saints";
const categoryInfo = categoryLabels[activeType];
const activeCategoryItems = (items = []) => items.filter((item) => item.status !== "unactived");
const ITEMS_PER_PAGE = 9;
const lazyImageAttrs = 'loading="lazy" decoding="async"';
let allCategoryItems = [];
let currentPage = 1;

function categoryDetailLink(type, id) {
  return `detail.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
}

function itemTimeValue(item) {
  const createdDate = item.createdDate || item.createdAtText || item.createdAt;
  const createdTime = createdDate?.toDate ? createdDate.toDate().getTime() : Date.parse(String(createdDate || ""));
  if (!Number.isNaN(createdTime)) return createdTime;

  const dateText = String(item.date || "").trim();
  const directTime = Date.parse(dateText);
  if (!Number.isNaN(directTime)) return directTime;

  const dateParts = dateText.match(/(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?/);
  if (dateParts) {
    const year = dateParts[3] ? Number(dateParts[3].length === 2 ? `20${dateParts[3]}` : dateParts[3]) : new Date().getFullYear();
    const parsed = new Date(year, Number(dateParts[2]) - 1, Number(dateParts[1])).getTime();
    if (!Number.isNaN(parsed)) return parsed;
  }

  const idTime = String(item.id || "").match(/(\d{10,})$/);
  return idTime ? Number(idTime[1]) : 0;
}

function sortCategoryItems(items, sortValue) {
  const collator = new Intl.Collator("vi", { sensitivity: "base", numeric: true });
  const sorted = [...items];

  if (sortValue === "title-asc") {
    sorted.sort((a, b) => collator.compare(a.title || "", b.title || ""));
  }
  if (sortValue === "title-desc") {
    sorted.sort((a, b) => collator.compare(b.title || "", a.title || ""));
  }
  if (sortValue === "time-desc") {
    sorted.sort((a, b) => itemTimeValue(b) - itemTimeValue(a));
  }
  if (sortValue === "time-asc") {
    sorted.sort((a, b) => itemTimeValue(a) - itemTimeValue(b));
  }

  return sorted;
}

function categorySummary(text, maxLength = 150) {
  const value = String(text || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .trim();
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

function searchCategoryItems(items, keyword) {
  const query = String(keyword || "").trim().toLowerCase();
  if (!query) return items;

  return items.filter((item) =>
    `${item.title || ""} ${item.description || ""} ${item.meta || ""} ${item.date || ""}`
      .toLowerCase()
      .includes(query)
  );
}

function renderPagination(totalItems) {
  const pagination = document.querySelector("#categoryPagination");
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  pagination.innerHTML = Array.from({ length: totalPages }, (_, index) => {
    const page = index + 1;
    return `<button type="button" class="${page === currentPage ? "active" : ""}" data-page="${page}">${page}</button>`;
  }).join("");
}

function renderCategoryItems(items) {
  const list = document.querySelector("#categoryList");
  if (!items.length) {
    list.innerHTML = `
      <article class="notice-panel">
        <h2>Chưa có nội dung</h2>
        <p>Không tìm thấy nội dung phù hợp.</p>
      </article>
    `;
    renderPagination(0);
    return;
  }

  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  list.innerHTML = pageItems
    .map((item) => {
      const date = item.date ? formatDateParts(item.date) : null;
      const link = categoryDetailLink(activeType, item.id);
      return `
        <article class="category-card clickable-card" onclick="window.location.href='${link}'">
          <img src="${item.image || fallbackImage}" alt="${item.title}" ${lazyImageAttrs} />
          <div>
            <p class="eyebrow">${item.meta || categoryInfo.eyebrow}</p>
            <h2>${item.title}</h2>
            <p>${categorySummary(item.description)}</p>
            ${date ? `<small>${date.display}</small>` : ""}
            <a href="${link}" onclick="event.stopPropagation()">${categoryInfo.action}</a>
          </div>
        </article>
      `;
    })
    .join("");
  renderPagination(items.length);
}

function renderCategoryView() {
  const keyword = document.querySelector("#categorySearch").value;
  const sortValue = document.querySelector("#categorySort").value;
  renderCategoryItems(sortCategoryItems(searchCategoryItems(allCategoryItems, keyword), sortValue));
}

async function initCategory() {
  trackPageView({ key: `category_${activeType}`, label: `Danh mục: ${categoryInfo.title}`, kind: "category", contentType: activeType });
  setupBackLink("index.html", "Trang chủ", { useStored: false, useHistory: false });
  document.querySelector("#categoryTitle").textContent = categoryInfo.title;
  document.querySelector("#categoryDescription").textContent = categoryInfo.description;
  document.title = `${categoryInfo.title} - Truyền Giáo Kitô`;

  document.querySelectorAll(".main-nav a").forEach((link) => {
    if (link.getAttribute("href") === `category.html?type=${activeType}`) {
      link.classList.add("active");
    }
  });

  document.querySelector("#categorySearch").addEventListener("input", () => {
    currentPage = 1;
    renderCategoryView();
  });

  document.querySelector("#categorySort").addEventListener("change", () => {
    currentPage = 1;
    renderCategoryView();
  });

  document.querySelector("#categoryPagination").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page]");
    if (!button) return;
    currentPage = Number(button.dataset.page);
    renderCategoryView();
    document.querySelector(".category-intro").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  try {
    const content = await getContent();
    allCategoryItems = activeCategoryItems(content[activeType] || []);
    renderCategoryView();
  } catch (error) {
    allCategoryItems = activeCategoryItems(defaultContent[activeType] || []);
    renderCategoryView();
  }
  rememberCurrentPage(categoryInfo.title);
}

initCategory();



