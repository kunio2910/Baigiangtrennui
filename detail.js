let content = null;
const typeLabels = {
  saints: "Các thánh",
  churches: "Nhà thờ",
  articles: "Bài viết & suy niệm",
  events: "Sự kiện",
};

const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const id = params.get("id");
const allowedTypes = ["saints", "churches", "articles", "events"];
const detailArticle = document.querySelector("#detailArticle");

function detailLink(nextType, nextId) {
  return `detail.html?type=${encodeURIComponent(nextType)}&id=${encodeURIComponent(nextId)}`;
}

function sanitizeContentHtml(value) {
  const template = document.createElement("template");
  template.innerHTML = String(value || "");
  const allowedTags = new Set([
    "P",
    "BR",
    "STRONG",
    "B",
    "EM",
    "I",
    "U",
    "H2",
    "H3",
    "H4",
    "UL",
    "OL",
    "LI",
    "BLOCKQUOTE",
    "IMG",
    "A",
  ]);
  const allowedAttributes = {
    A: new Set(["href", "title", "target", "rel"]),
    IMG: new Set(["src", "alt", "title"]),
  };

  template.content.querySelectorAll("*").forEach((element) => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...element.childNodes);
      return;
    }

    [...element.attributes].forEach((attribute) => {
      const allowed = allowedAttributes[element.tagName]?.has(attribute.name);
      if (!allowed) element.removeAttribute(attribute.name);
    });

    if (element.tagName === "A") {
      const href = element.getAttribute("href") || "";
      if (!/^https?:\/\//i.test(href) && !href.startsWith("#") && !href.startsWith("mailto:")) {
        element.removeAttribute("href");
      }
      element.setAttribute("rel", "noopener noreferrer");
      if (!element.getAttribute("target")) element.setAttribute("target", "_blank");
    }

    if (element.tagName === "IMG") {
      const src = element.getAttribute("src") || "";
      if (!/^https?:\/\//i.test(src)) element.remove();
    }
  });

  return template.innerHTML;
}

function defaultBodyHtml(item) {
  return `
    <p>${item.description}</p>
    <p>
      Nội dung này được xây dựng để hỗ trợ việc học hỏi, cầu nguyện và chia sẻ Tin Mừng
      trong cộng đoàn. Bạn có thể cập nhật phần chữ, hình ảnh và thông tin phụ tại trang quản lý.
    </p>
    <p>
      Ước mong mỗi bài viết, mỗi hình ảnh và mỗi sự kiện nơi đây trở thành một lời mời gọi
      sống đức tin cụ thể hơn trong đời sống hằng ngày.
    </p>
  `;
}

function renderMissing() {
  document.title = "Không tìm thấy nội dung - Truyền Giáo Kitô";
  detailArticle.innerHTML = `
    <div class="detail-empty">
      <p class="eyebrow">Không tìm thấy</p>
      <h1>Nội dung này không còn tồn tại</h1>
      <p>Vui lòng quay lại trang chủ hoặc vào trang quản lý để kiểm tra lại dữ liệu.</p>
      <a class="primary-button" href="index.html">Về trang chủ</a>
    </div>
  `;
}

function renderDetail() {
  const currentList = allowedTypes.includes(type) ? content[type] : [];
  const item = currentList.find((entry) => entry.id === id);
  if (!item) {
    renderMissing();
    return;
  }

  const dateInfo = item.date ? formatDateParts(item.date) : null;
  document.title = `${item.title} - Truyền Giáo Kitô`;
  detailArticle.innerHTML = `
    <figure class="detail-cover">
      <img src="${item.image || fallbackImage}" alt="${item.title}" />
    </figure>
    <header class="detail-heading">
      <p class="eyebrow">${typeLabels[type]}</p>
      <h1>${item.title}</h1>
      <div class="detail-meta">
        ${item.meta ? `<span>${item.meta}</span>` : ""}
        ${dateInfo ? `<span>${dateInfo.day} ${dateInfo.month}</span>` : ""}
      </div>
      <p class="lead">${item.description}</p>
    </header>
    <div class="detail-content">
      <div class="detail-body">${sanitizeContentHtml(item.bodyHtml || defaultBodyHtml(item))}</div>
    </div>
  `;
}

function renderRelated() {
  const currentList = allowedTypes.includes(type) ? content[type] : [];
  const related = currentList.filter((entry) => entry.id !== id).slice(0, 3);
  document.querySelector("#relatedList").innerHTML = related
    .map(
      (entry) => `
        <article class="article-card">
          <img src="${entry.image || fallbackImage}" alt="${entry.title}" />
          <div>
            <h3>${entry.title}</h3>
            <p>${entry.description}</p>
            <a href="${detailLink(type, entry.id)}">Chi tiết</a>
          </div>
        </article>
      `
    )
    .join("");
}

async function initDetail() {
  try {
    content = await getContent();
    renderDetail();
    renderRelated();
  } catch (error) {
    content = structuredClone(defaultContent);
    renderDetail();
    renderRelated();
  }
}

initDetail();
