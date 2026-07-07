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
    eyebrow: "Bài viết & suy niệm",
    title: "Bài viết & suy niệm",
    description: "Các bài suy niệm, chia sẻ Lời Chúa và nội dung nâng đỡ đời sống cầu nguyện.",
    action: "Đọc thêm",
  },
  events: {
    eyebrow: "Sự kiện",
    title: "Sự kiện sắp tới",
    description: "Các thánh lễ, giờ cầu nguyện, khóa tĩnh tâm và sinh hoạt cộng đoàn.",
    action: "Chi tiết",
  },
};

const categoryParams = new URLSearchParams(window.location.search);
const categoryType = categoryParams.get("type") || "saints";
const categoryAllowedTypes = ["saints", "churches", "articles", "events"];
const activeType = categoryAllowedTypes.includes(categoryType) ? categoryType : "saints";
const categoryInfo = categoryLabels[activeType];

function categoryDetailLink(type, id) {
  return `detail.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
}

function categorySummary(text, maxLength = 150) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

function renderCategoryItems(items) {
  const list = document.querySelector("#categoryList");
  if (!items.length) {
    list.innerHTML = `
      <article class="notice-panel">
        <h2>Chưa có nội dung</h2>
        <p>Bạn có thể thêm nội dung mới trong trang quản lý.</p>
        <a class="primary-button" href="admin.html">Vào trang quản lý</a>
      </article>
    `;
    return;
  }

  list.innerHTML = items
    .map((item) => {
      const date = item.date ? formatDateParts(item.date) : null;
      const link = categoryDetailLink(activeType, item.id);
      return `
        <article class="category-card clickable-card" onclick="window.location.href='${link}'">
          <img src="${item.image || fallbackImage}" alt="${item.title}" />
          <div>
            <p class="eyebrow">${item.meta || categoryInfo.eyebrow}</p>
            <h2>${item.title}</h2>
            <p>${categorySummary(item.description)}</p>
            ${date ? `<small>${date.day} ${date.month}</small>` : ""}
            <a href="${link}" onclick="event.stopPropagation()">${categoryInfo.action}</a>
          </div>
        </article>
      `;
    })
    .join("");
}

async function initCategory() {
  document.querySelector("#categoryEyebrow").textContent = categoryInfo.eyebrow;
  document.querySelector("#categoryTitle").textContent = categoryInfo.title;
  document.querySelector("#categoryDescription").textContent = categoryInfo.description;
  document.title = `${categoryInfo.title} - Truyền Giáo Kitô`;

  document.querySelectorAll(".main-nav a").forEach((link) => {
    if (link.getAttribute("href") === `category.html?type=${activeType}`) {
      link.classList.add("active");
    }
  });

  try {
    const content = await getContent();
    renderCategoryItems(content[activeType] || []);
  } catch (error) {
    renderCategoryItems(defaultContent[activeType] || []);
  }
}

initCategory();
