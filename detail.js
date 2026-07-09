let content = null;
const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const id = params.get("id");
const allowedTypes = ["saints", "churches", "articles", "events", "prayers", "catechism"];
const detailArticle = document.querySelector("#detailArticle");
const lazyImageAttrs = 'loading="lazy" decoding="async"';
let currentItem = null;
let selectedRatings = {
  content: 0,
  layout: 0,
};

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
      element.setAttribute("loading", "lazy");
      element.setAttribute("decoding", "async");
    }
  });

  return template.innerHTML;
}

function defaultBodyHtml(item) {
  return `
    <p>${item.description}</p>
  `;
}

function sourceLinkHtml(value) {
  const sourceUrl = String(value || "").trim();
  if (!/^https?:\/\//i.test(sourceUrl)) return "";
  return `
    <p class="detail-source">
      Nguồn: <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${sourceUrl}</a>
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
  const currentList = allowedTypes.includes(type) ? content[type].filter((entry) => entry.status !== "unactived") : [];
  const item = currentList.find((entry) => entry.id === id);
  if (!item) {
    renderMissing();
    return;
  }

  currentItem = item;
  trackPageView({
    key: `content_${type}_${id}`,
    label: item.title || `${type}/${id}`,
    kind: "content",
    contentType: type,
    contentId: id,
  });
  const dateInfo = item.date ? formatDateParts(item.date) : null;
  const description = item.description || "";
  document.title = `${item.title} - Truyền Giáo Kitô`;
  detailArticle.innerHTML = `
    <figure class="detail-cover">
      <img src="${item.image || fallbackImage}" alt="${item.title}" fetchpriority="high" decoding="async" />
    </figure>
    <header class="detail-heading">
      <h1>${item.title}</h1>
      <div class="detail-meta">
        ${item.meta ? `<span><span class="detail-meta-icon cross-tile-icon" aria-hidden="true"></span>${item.meta}</span>` : ""}
        ${dateInfo ? `<span><span class="detail-meta-icon calendar-clock-icon" aria-hidden="true"></span>${dateInfo.display}</span>` : ""}
      </div>
      ${
        description
          ? `
            <div class="lead-box">
              <span class="lead-icon" aria-hidden="true">“</span>
              <p class="lead">${description}</p>
            </div>
          `
          : ""
      }
    </header>
    <div class="detail-content">
      <div class="detail-body">${sanitizeContentHtml(item.bodyHtml || defaultBodyHtml(item))}</div>
      ${sourceLinkHtml(item.sourceUrl)}
      <section class="rating-panel" aria-label="Đánh giá bài viết">
        <p class="rating-note">*Nội dung này được xây dựng để hỗ trợ việc học hỏi, cầu nguyện và chia sẻ Tin Mừng. Ước mong mỗi bài viết, mỗi hình ảnh và mỗi sự kiện nơi đây trở thành một lời mời gọi sống đức tin cụ thể hơn trong đời sống hằng ngày.<br />Trang có sử dụng tài nguyên AI. Bạn vui lòng dành ít phút để đánh giá về bài viết và chất lượng website.</p>
        <div class="rating-group">
          <strong>Đánh giá nội dung</strong>
          <div class="rating-stars" role="radiogroup" aria-label="Đánh giá nội dung">
            ${[1, 2, 3, 4, 5]
              .map((value) => `<button type="button" data-rating-kind="content" data-rating="${value}" aria-label="${value} sao">★</button>`)
              .join("")}
          </div>
        </div>
        <div class="rating-group">
          <strong>Đánh giá trình bày</strong>
          <div class="rating-stars" role="radiogroup" aria-label="Đánh giá trình bày">
            ${[1, 2, 3, 4, 5]
              .map((value) => `<button type="button" data-rating-kind="layout" data-rating="${value}" aria-label="${value} sao">★</button>`)
              .join("")}
          </div>
        </div>
        <div class="rating-row">
          <button class="primary-button" type="button" id="submitRating">Gửi</button>
        </div>
        <small id="ratingMessage"></small>
        <div class="feedback-box">
          <label for="feedbackMessage">Ý kiến đóng góp</label>
          <textarea id="feedbackMessage" rows="4" placeholder="Nhập ý kiến đóng góp của bạn..."></textarea>
          <div class="rating-row">
            <button class="primary-button" type="button" id="submitFeedback">Gửi ý kiến</button>
          </div>
          <small id="feedbackStatus"></small>
        </div>
      </section>
    </div>
  `;
  setupRating();
  setupFeedback();
}

function renderRelated() {
  const currentList = allowedTypes.includes(type) ? content[type].filter((entry) => entry.status !== "unactived") : [];
  const related = currentList.filter((entry) => entry.id !== id).slice(0, 3);
  document.querySelector("#relatedList").innerHTML = related
    .map(
      (entry) => `
        <article class="article-card clickable-card" onclick="window.location.href='${detailLink(type, entry.id)}'">
          <img src="${entry.image || fallbackImage}" alt="${entry.title}" ${lazyImageAttrs} />
          <div>
            <h3>${entry.title}</h3>
            <p>${entry.description}</p>
            <a href="${detailLink(type, entry.id)}" onclick="event.stopPropagation()">Chi ti\u1ebft</a>
          </div>
        </article>
      `
    )
    .join("");
}

function paintStars() {
  detailArticle.querySelectorAll("[data-rating]").forEach((button) => {
    const kind = button.dataset.ratingKind;
    button.classList.toggle("active", Number(button.dataset.rating) <= selectedRatings[kind]);
  });
}

function setupRating() {
  selectedRatings = {
    content: 0,
    layout: 0,
  };
  const message = detailArticle.querySelector("#ratingMessage");
  const submitButton = detailArticle.querySelector("#submitRating");

  detailArticle.querySelectorAll("[data-rating]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRatings[button.dataset.ratingKind] = Number(button.dataset.rating);
      message.textContent = "";
      paintStars();
    });
  });

  submitButton.addEventListener("click", async () => {
    if (!selectedRatings.content || !selectedRatings.layout) {
      message.textContent = "Vui lòng chọn đủ đánh giá nội dung và trình bày.";
      return;
    }

    submitButton.disabled = true;
    message.textContent = "Đang ghi nhận đánh giá...";
    try {
      await submitContentRating(currentItem.id, selectedRatings);
      selectedRatings = {
        content: 0,
        layout: 0,
      };
      paintStars();
      message.textContent = "Cảm ơn bạn đã đánh giá bài viết.";
    } catch (error) {
      message.textContent = error.message;
    } finally {
      submitButton.disabled = false;
    }
  });
}

function setupFeedback() {
  const textarea = detailArticle.querySelector("#feedbackMessage");
  const submitButton = detailArticle.querySelector("#submitFeedback");
  const status = detailArticle.querySelector("#feedbackStatus");

  submitButton.addEventListener("click", async () => {
    const message = textarea.value.trim();
    if (!message) {
      status.textContent = "Vui lòng nhập ý kiến đóng góp.";
      return;
    }

    submitButton.disabled = true;
    status.textContent = "Đang gửi ý kiến đóng góp...";

    try {
      await submitContentFeedback(
        {
          id: currentItem.id,
          type,
          title: currentItem.title,
        },
        message
      );
      textarea.value = "";
      status.textContent = "Cảm ơn bạn đã gửi ý kiến đóng góp.";
    } catch (error) {
      status.textContent = error.message;
    } finally {
      submitButton.disabled = false;
    }
  });
}

async function initDetail() {
  setupBackLink();
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




