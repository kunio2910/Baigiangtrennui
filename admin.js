let content = null;
let currentImage = "";
let currentImagePath = "";
let canManageContent = false;
let feedbackItems = [];
let prayerRequests = [];
let editingPrayerRequestId = "";
let visitStatsItems = [];

const typeLabels = {
  saints: "Các thánh",
  churches: "Nhà thờ",
  articles: "Bài Viết",
  events: "Sự Kiện",
  prayers: "Cầu Nguyện",
  catechism: "Giáo Lý",
  daily: "Lời Chúa mỗi ngày",
  banners: "Banner chính",
};

const form = document.querySelector("#contentForm");
const itemId = document.querySelector("#itemId");
const itemType = document.querySelector("#itemType");
const itemTitle = document.querySelector("#itemTitle");
const itemDescription = document.querySelector("#itemDescription");
const itemBodyHtml = document.querySelector("#itemBodyHtml");
const itemMeta = document.querySelector("#itemMeta");
const itemDate = document.querySelector("#itemDate");
const itemCreatedDate = document.querySelector("#itemCreatedDate");
const itemStatus = document.querySelector("#itemStatus");
const itemImageUrl = document.querySelector("#itemImageUrl");
const cloudinaryUploadButton = document.querySelector("#cloudinaryUploadButton");
const itemSourceUrl = document.querySelector("#itemSourceUrl");
const imagePreview = document.querySelector("#imagePreview");
const filterType = document.querySelector("#filterType");
const adminSearch = document.querySelector("#adminSearch");
const adminSort = document.querySelector("#adminSort");
const adminList = document.querySelector("#adminList");
const feedbackList = document.querySelector("#feedbackList");
const prayerReviewList = document.querySelector("#prayerReviewList");
const visitSummary = document.querySelector("#visitSummary");
const visitStatsList = document.querySelector("#visitStatsList");
const visitSearch = document.querySelector("#visitSearch");
const visitSort = document.querySelector("#visitSort");
const resetVisitStatsButton = document.querySelector("#resetVisitStats");
const exportBackupButton = document.querySelector("#exportBackup");
const importBackupButton = document.querySelector("#importBackup");
const backupFileInput = document.querySelector("#backupFile");
const backupMessage = document.querySelector("#backupMessage");
const faithDiscoveryForm = document.querySelector("#faithDiscoveryForm");
const faithSetList = document.querySelector("#faithSetList");
const newFaithSetButton = document.querySelector("#newFaithSetButton");
const deleteFaithSetButton = document.querySelector("#deleteFaithSetButton");
const faithSetId = document.querySelector("#faithSetId");
const faithSetTitle = document.querySelector("#faithSetTitle");

const faithPickerImageUrl = document.querySelector("#faithPickerImageUrl");
const faithPickerCloudinaryUploadButton = document.querySelector("#faithPickerCloudinaryUploadButton");
const faithPickerPreview = document.querySelector("#faithPickerPreview");
const faithBannerImageUrl = document.querySelector("#faithBannerImageUrl");
const faithBannerCloudinaryUploadButton = document.querySelector("#faithBannerCloudinaryUploadButton");
const faithBannerPreview = document.querySelector("#faithBannerPreview");
const faithInfographicUrl = document.querySelector("#faithInfographicUrl");
const faithCloudinaryUploadButton = document.querySelector("#faithCloudinaryUploadButton");
const faithImagePreview = document.querySelector("#faithImagePreview");
const faithQuestionsFile = document.querySelector("#faithQuestionsFile");
const faithQuestionsJson = document.querySelector("#faithQuestionsJson");
const formatFaithQuestionsButton = document.querySelector("#formatFaithQuestions");
const faithDiscoveryMessage = document.querySelector("#faithDiscoveryMessage");
const adminTabButtons = document.querySelectorAll("[data-admin-tab]");
const adminTabPanels = document.querySelectorAll("[data-admin-panel]");
const loginPanel = document.querySelector("#loginPanel");
const protectedPanel = document.querySelector("#adminProtected");
const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const contentMessage = document.querySelector("#contentMessage");
let draggedItem = null;
let faithDiscoverySets = [];
let activeFaithAdminSetId = "";

function activateAdminTab(tabName) {
  if (!adminTabButtons.length || !adminTabPanels.length) return;

  adminTabButtons.forEach((button) => {
    const isActive = button.dataset.adminTab === tabName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  adminTabPanels.forEach((panel) => {
    const isActive = panel.dataset.adminPanel === tabName;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });
}

function setupAdminTabs() {
  if (!adminTabButtons.length || !adminTabPanels.length) return;

  adminTabButtons.forEach((button) => {
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", button.classList.contains("active") ? "true" : "false");
    button.addEventListener("click", () => activateAdminTab(button.dataset.adminTab));
  });

  adminTabPanels.forEach((panel) => panel.setAttribute("role", "tabpanel"));

  document.querySelector('a[href="#contentManager"]')?.addEventListener("click", () => {
    activateAdminTab("content");
  });
}

function detailLink(type, item) {
  return typeof contentDetailUrl === "function"
    ? contentDetailUrl(type, item)
    : `detail.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(item?.id || item || "")}`;
}

function summarizeText(text, maxLength = 120) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}...`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatFeedbackTime(feedback) {
  const value = feedback.createdAt?.toDate ? feedback.createdAt.toDate() : new Date(feedback.createdAtText || "");
  if (Number.isNaN(value.getTime())) return "Chưa có thời gian";
  return value.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatVisitTime(value) {
  const date = value?.toDate ? value.toDate() : new Date(value || "");
  if (Number.isNaN(date.getTime())) return "Chưa có thời gian";
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function visitKindLabel(kind) {
  const labels = {
    site: "Website",
    page: "Trang",
    category: "Danh mục",
    content: "Nội dung",
  };
  return labels[kind] || "Khác";
}

function visitTimeValue(item) {
  const date = item.updatedAt?.toDate ? item.updatedAt.toDate() : new Date(item.updatedAt || "");
  const time = date.getTime();
  return Number.isNaN(time) ? 0 : time;
}

function prepareVisitStats(items = []) {
  const keyword = String(visitSearch?.value || "").trim().toLowerCase();
  const sortValue = visitSort?.value || "views-desc";
  const collator = new Intl.Collator("vi", { sensitivity: "base", numeric: true });
  const filtered = items.filter((item) => {
    if (!keyword) return true;
    return `${item.label || ""} ${item.key || ""} ${item.path || ""} ${item.contentType || ""} ${item.contentId || ""} ${visitKindLabel(item.kind)}`
      .toLowerCase()
      .includes(keyword);
  });

  return filtered.sort((a, b) => {
    if (sortValue === "views-asc") return Number(a.count || 0) - Number(b.count || 0);
    if (sortValue === "time-desc") return visitTimeValue(b) - visitTimeValue(a);
    if (sortValue === "time-asc") return visitTimeValue(a) - visitTimeValue(b);
    if (sortValue === "title-asc") return collator.compare(a.label || a.key || "", b.label || b.key || "");
    if (sortValue === "title-desc") return collator.compare(b.label || b.key || "", a.label || a.key || "");
    return Number(b.count || 0) - Number(a.count || 0);
  });
}

function renderVisitStats(stats = visitStatsItems) {
  if (!visitSummary || !visitStatsList) return;
  visitStatsItems = stats;
  const siteStats = visitStatsItems.find((item) => item.id === "site_total" || item.key === "site_total");
  const detailStats = visitStatsItems.filter((item) => item.id !== "site_total" && item.key !== "site_total");
  const visibleStats = prepareVisitStats(detailStats);
  const total = Number(siteStats?.count || 0);

  visitSummary.innerHTML = `
    <article class="visit-total-card">
      <span>Tổng lượt truy cập website</span>
      <strong>${total.toLocaleString("vi-VN")}</strong>
      <small>Cập nhật: ${formatVisitTime(siteStats?.updatedAt)}</small>
    </article>
    <article class="visit-total-card">
      <span>Kết quả đang hiển thị</span>
      <strong>${visibleStats.length.toLocaleString("vi-VN")}/${detailStats.length.toLocaleString("vi-VN")}</strong>
      <small>Chỉ tính sau mỗi 5 phút cho cùng một người dùng.</small>
    </article>
  `;

  if (!detailStats.length) {
    visitStatsList.innerHTML = `
      <article class="visit-item">
        <div>
          <span>Chưa có dữ liệu</span>
          <h3>Chưa ghi nhận lượt truy cập nào</h3>
          <p>Khi người dùng mở website hoặc bài viết, dữ liệu sẽ xuất hiện tại đây.</p>
        </div>
      </article>
    `;
    return;
  }

  if (!visibleStats.length) {
    visitStatsList.innerHTML = `
      <article class="visit-item">
        <div>
          <span>Không có kết quả</span>
          <h3>Không tìm thấy thống kê phù hợp</h3>
          <p>Hãy thử đổi từ khóa tìm kiếm hoặc cách sắp xếp.</p>
        </div>
      </article>
    `;
    return;
  }

  visitStatsList.innerHTML = visibleStats
    .map(
      (item) => `
        <article class="visit-item">
          <div>
            <span>${visitKindLabel(item.kind)}</span>
            <h3>${escapeHtml(item.label || item.key || item.id)}</h3>
            <p>${escapeHtml(item.path || `${item.contentType || ""} ${item.contentId || ""}`.trim())}</p>
            <small>Cập nhật: ${formatVisitTime(item.updatedAt)}</small>
          </div>
          <strong>${Number(item.count || 0).toLocaleString("vi-VN")}</strong>
        </article>
      `
    )
    .join("");
}
function safeFeedbackUrl(value) {
  const url = String(value || "").trim();
  return /^https?:\/\//i.test(url) ? escapeHtml(url) : "";
}

function currentDateTimeLocal() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function toDateTimeLocal(value) {
  if (!value) return "";
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function displayCreatedDate(item) {
  const value = item.createdDate || item.createdAtText || item.createdAt;
  const date = value?.toDate ? value.toDate() : new Date(value || "");
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function backupFileName() {
  const now = new Date();
  const stamp = now
    .toLocaleString("sv-SE", { hour12: false })
    .replace(/[-:]/g, "")
    .replace(" ", "-");
  return `baigiangtrennui-backup-${stamp}.json`;
}

function downloadJsonFile(data, fileName) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        resolve(JSON.parse(String(reader.result || "{}")));
      } catch (error) {
        reject(new Error("File backup không phải JSON hợp lệ."));
      }
    });
    reader.addEventListener("error", () => reject(new Error("Không thể đọc file backup.")));
    reader.readAsText(file, "utf-8");
  });
}

function normalizeAdminFaithQuestion(question, index) {
  if (!question || typeof question !== "object") {
    throw new Error(`Câu ${index + 1} không đúng định dạng object.`);
  }

  const options = Array.isArray(question.options)
    ? question.options.map((option) => String(option || "").trim()).filter(Boolean)
    : [];
  const answer = Number(question.answer);
  const questionText = String(question.question || "").trim();
  const topic = String(question.topic || "").trim();

  if (!questionText) throw new Error(`Câu ${index + 1} chưa có nội dung question.`);
  if (options.length < 2) throw new Error(`Câu ${index + 1} cần ít nhất 2 đáp án trong options.`);
  if (Number.isNaN(answer) || answer < 0 || answer >= options.length) {
    throw new Error(`Câu ${index + 1} có answer không hợp lệ. answer bắt đầu từ 0.`);
  }

  return {
    topic: topic || `Câu ${index + 1}`,
    question: questionText,
    options,
    answer,
    explanation: String(question.explanation || "").trim(),
  };
}

function parseFaithQuestionsPayload(value, options = {}) {
  const rawText = typeof value === "string" ? value.trim() : value;
  if (options.allowEmpty && (!rawText || rawText === "[]")) return [];

  const parsed = typeof rawText === "string" ? JSON.parse(rawText) : rawText;
  const questions = Array.isArray(parsed) ? parsed : parsed?.questions;
  if (!Array.isArray(questions) || !questions.length) {
    throw new Error("Bộ câu hỏi phải là mảng JSON hoặc object có thuộc tính questions.");
  }
  return questions.map(normalizeAdminFaithQuestion);
}

function stringifyFaithQuestions(questions) {
  return JSON.stringify(questions || [], null, 2);
}

function uniqueFaithSetId() {
  return `faith-set-${Date.now()}`;
}

function normalizeAdminFaithSet(set, index) {
  const questions = Array.isArray(set?.questions)
    ? set.questions.map(normalizeAdminFaithQuestion).filter(Boolean)
    : [];

  return {
    id: String(set?.id || uniqueFaithSetId()).trim(),
    title: String(set?.title || `Bộ ${index + 1}`).trim(),
    
    pickerImageUrl: String(set?.pickerImageUrl || "").trim(),
    bannerImageUrl: String(set?.bannerImageUrl || "").trim(),
    infographicUrl: String(set?.infographicUrl || "").trim(),
    questions,
  };
}

function settingsToAdminFaithSets(settings) {
  const sets = Array.isArray(settings?.sets)
    ? settings.sets.map(normalizeAdminFaithSet).filter((set) => set.questions.length)
    : [];

  if (sets.length) return sets;

  if (Array.isArray(settings?.questions) && settings.questions.length) {
    return [
      {
        id: "legacy-faith-set",
        title: String(settings?.title || "Khám Phá Đức Tin").trim() || "Khám Phá Đức Tin",
        
        pickerImageUrl: String(settings?.pickerImageUrl || "").trim(),
        bannerImageUrl: String(settings?.bannerImageUrl || "").trim(),
        infographicUrl: String(settings?.infographicUrl || "").trim(),
        questions: settings.questions.map((question, index) => normalizeAdminFaithQuestion(question, index)),
      },
    ];
  }

  return [];
}

function renderFaithSetList() {
  if (!faithSetList) return;

  if (!faithDiscoverySets.length) {
    faithSetList.innerHTML = `<p class="admin-empty-note">Chưa có bộ câu hỏi nào. Bấm Tạo bộ mới để bắt đầu.</p>`;
    return;
  }

  faithSetList.innerHTML = faithDiscoverySets
    .map(
      (set) => `
        <button class="${set.id === activeFaithAdminSetId ? "active" : ""}" type="button" data-id="${escapeHtml(set.id)}">
          <strong>${escapeHtml(set.title)}</strong>
          <small>${set.questions.length} câu hỏi</small>
        </button>
      `
    )
    .join("");
}

function fillFaithSetForm(set) {
  if (!faithDiscoveryForm) return;
  const selectedSet = set || null;
  activeFaithAdminSetId = selectedSet?.id || "";
  faithSetId.value = selectedSet?.id || "";
  faithSetTitle.value = selectedSet?.title || "";
  
  faithPickerImageUrl.value = selectedSet?.pickerImageUrl || "";
  faithBannerImageUrl.value = selectedSet?.bannerImageUrl || "";
  faithInfographicUrl.value = selectedSet?.infographicUrl || "";
  faithQuestionsJson.value = stringifyFaithQuestions(selectedSet?.questions || []);
  
  updateFaithPickerPreview();
  updateFaithBannerPreview();
  updateFaithImagePreview();
  renderFaithSetList();
}

function selectedFaithSet() {
  return faithDiscoverySets.find((set) => set.id === activeFaithAdminSetId) || null;
}

function updateFaithPickerPreview() {
  if (!faithPickerPreview || !faithPickerImageUrl) return;
  const imageUrl = faithPickerImageUrl.value.trim();
  if (imageUrl) {
    faithPickerPreview.src = imageUrl;
    faithPickerPreview.classList.add("show");
  } else {
    faithPickerPreview.removeAttribute("src");
    faithPickerPreview.classList.remove("show");
  }
}
function updateFaithBannerPreview() {
  if (!faithBannerPreview || !faithBannerImageUrl) return;
  const imageUrl = faithBannerImageUrl.value.trim();
  if (imageUrl) {
    faithBannerPreview.src = imageUrl;
    faithBannerPreview.classList.add("show");
  } else {
    faithBannerPreview.removeAttribute("src");
    faithBannerPreview.classList.remove("show");
  }
}
function updateFaithImagePreview() {
  if (!faithImagePreview || !faithInfographicUrl) return;
  const imageUrl = faithInfographicUrl.value.trim();
  if (imageUrl) {
    faithImagePreview.src = imageUrl;
    faithImagePreview.classList.add("show");
  } else {
    faithImagePreview.removeAttribute("src");
    faithImagePreview.classList.remove("show");
  }
}

async function loadFaithDiscoveryAdmin() {
  if (!faithDiscoveryForm) return;
  try {
    const settings = typeof getFaithDiscoverySettings === "function" ? await getFaithDiscoverySettings() : null;
    faithDiscoverySets = settingsToAdminFaithSets(settings);
    const activeSet = faithDiscoverySets.find((set) => set.id === settings?.activeSetId) || faithDiscoverySets[0] || null;
    fillFaithSetForm(activeSet);
    if (faithDiscoveryMessage) {
      faithDiscoveryMessage.textContent = faithDiscoverySets.length
        ? `Đã tải ${faithDiscoverySets.length} bộ câu hỏi.`
        : "Chưa có bộ câu hỏi nào. Vui lòng tạo bộ mới để hiển thị trên website.";
    }
  } catch (error) {
    if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = error.message;
  }
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

function searchAdminItems(items) {
  const keyword = String(adminSearch?.value || "").trim().toLowerCase();
  if (!keyword) return items;
  return items.filter((item) =>
    `${item.title || ""} ${item.description || ""} ${item.quote || ""} ${item.meta || ""} ${item.date || ""} ${item.createdDate || ""} ${typeLabels[item.type] || ""}`
      .toLowerCase()
      .includes(keyword)
  );
}

function sortAdminItems(items) {
  const sortValue = adminSort?.value || "default";
  const collator = new Intl.Collator("vi", { sensitivity: "base", numeric: true });
  const sorted = [...items];

  if (sortValue === "title-asc") {
    sorted.sort((a, b) => collator.compare(a.title || a.ref || "", b.title || b.ref || ""));
  }
  if (sortValue === "title-desc") {
    sorted.sort((a, b) => collator.compare(b.title || b.ref || "", a.title || a.ref || ""));
  }
  if (sortValue === "time-desc") {
    sorted.sort((a, b) => itemTimeValue(b) - itemTimeValue(a));
  }
  if (sortValue === "time-asc") {
    sorted.sort((a, b) => itemTimeValue(a) - itemTimeValue(b));
  }

  return sorted;
}

function getItemsForAdmin() {
  if (!content) return [];
  const selected = filterType.value;
  const types = selected === "all" ? CONTENT_TYPES : [selected];
  return types.flatMap((type) => (content[type] || []).map((item) => ({ ...item, type })));
}

function ratingText(item) {
  const oldCount = Number(item.ratingCount || 0);
  const oldTotal = Number(item.ratingTotal || 0);
  const contentCount = Number(item.contentRatingCount || oldCount || 0);
  const contentTotal = Number(item.contentRatingTotal || oldTotal || 0);
  const layoutCount = Number(item.layoutRatingCount || 0);
  const layoutTotal = Number(item.layoutRatingTotal || 0);
  const contentText = contentCount ? `Nội dung: ${(contentTotal / contentCount).toFixed(1)}/5 (${contentCount} lượt)` : "Nội dung: chưa có";
  const layoutText = layoutCount ? `Trình bày: ${(layoutTotal / layoutCount).toFixed(1)}/5 (${layoutCount} lượt)` : "Trình bày: chưa có";
  return `${contentText}<br />${layoutText}`;
}

function renderAdminList() {
  const items = sortAdminItems(searchAdminItems(getItemsForAdmin()));
  const isCustomView = adminSearch.value.trim() || adminSort.value !== "default";
  const canReorder = canManageContent && filterType.value !== "all" && !isCustomView;
  if (!items.length) {
    adminList.innerHTML = `
      <article class="admin-item">
        <div></div>
        <div>
          <span>Không có dữ liệu</span>
          <h3>Không tìm thấy nội dung phù hợp</h3>
          <p>Hãy thử đổi từ khóa tìm kiếm, loại nội dung hoặc cách sắp xếp.</p>
        </div>
      </article>
    `;
    return;
  }
  adminList.innerHTML = items
    .map(
      (item) => `
        <article class="admin-item ${canReorder ? "is-draggable" : ""}" data-id="${item.id}" data-type="${item.type}" draggable="${canReorder}">
          <img src="${item.image || fallbackImage}" alt="${item.title}" />
          <div>
            <span>${typeLabels[item.type]}</span>
            <h3>${item.title || item.ref || item.meta || ""}</h3>
            <p>${summarizeText(item.description || item.quote, 130)}</p>
            <small>${item.meta || ""}</small>
            <small>${displayCreatedDate(item) ? `Ngày tạo: ${displayCreatedDate(item)}` : ""}</small>
            <small class="admin-state ${item.status === "unactived" ? "is-off" : "is-on"}">
              ${item.status === "unactived" ? "Unactived - đang ẩn" : "Actived - đang hiển thị"}
            </small>
          </div>
          ${
            canManageContent
              ? `
                <div class="admin-actions">
                  <div class="row-actions">
                    <button type="button" data-action="edit" data-type="${item.type}" data-id="${item.id}">Sửa</button>
                    <button type="button" data-action="delete" data-type="${item.type}" data-id="${item.id}">Xóa</button>
                  </div>
                  <small class="admin-rating">${ratingText(item)}</small>
                  <button class="ghost-button reset-rating-button" type="button" data-action="reset-rating" data-type="${item.type}" data-id="${item.id}">Reset đánh giá</button>
                </div>
              `
              : `<div class="admin-actions"><div class="permission-badge">Chỉ xem</div><small class="admin-rating">${ratingText(item)}</small></div>`
          }
        </article>
      `
    )
    .join("");
}

function renderFeedbackList() {
  if (!feedbackList) return;

  if (!feedbackItems.length) {
    feedbackList.innerHTML = `
      <article class="feedback-item">
        <h3>Chưa có ý kiến đóng góp</h3>
        <p>Các ý kiến từ người xem sẽ xuất hiện tại đây.</p>
      </article>
    `;
    return;
  }

  feedbackList.innerHTML = feedbackItems
    .map(
      (feedback) => {
        const feedbackUrl = safeFeedbackUrl(feedback.pageUrl);
        return `
          <article class="feedback-item">
            <div class="feedback-item-head">
              <h3>${escapeHtml(feedback.contentTitle || "Không rõ bài viết")}</h3>
              <time>${formatFeedbackTime(feedback)}</time>
            </div>
            <p>${escapeHtml(feedback.message)}</p>
            <div class="feedback-actions">
              ${feedbackUrl ? `<a href="${feedbackUrl}" target="_blank" rel="noopener noreferrer">Mở bài viết</a>` : ""}
              <button type="button" data-action="delete-feedback" data-id="${feedback.id}">Xóa</button>
            </div>
          </article>
        `;
      }
    )
    .join("");
}

function renderPrayerReviewList() {
  if (!prayerReviewList) return;

  const visibleRequests = prayerRequests.filter((item) => {
    if (item.reviewHidden) return false;
    const linkedContentId = item.contentId || `prayer-request-${item.id}`;
    const linkedContent = content?.prayers?.find((entry) => entry.id === linkedContentId);
    return !(item.status === "approved" && linkedContent?.status === "actived");
  });

  if (!visibleRequests.length) {
    prayerReviewList.innerHTML = `
      <article class="feedback-item">
        <h3>Chưa có lời cầu nguyện chờ duyệt</h3>
        <p>Các lời cầu nguyện người xem gửi sẽ xuất hiện tại đây.</p>
      </article>
    `;
    return;
  }

  prayerReviewList.innerHTML = visibleRequests
    .map(
      (item) => `
        <article class="feedback-item prayer-review-item" data-id="${item.id}">
          <div class="feedback-item-head">
            <h3>${escapeHtml(item.prayerTitle || item.displayName || "Anonymous")}</h3>
            <div class="prayer-review-meta">
              <time>${formatFeedbackTime(item)}</time>
              <small class="admin-state ${item.status === "approved" ? "is-on" : "is-off"}">
                ${item.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
              </small>
            </div>
          </div>
          <small>${escapeHtml(item.displayName || "Anonymous")}</small>
          <p>${escapeHtml(item.prayerText || "")}</p>
          <div class="feedback-actions">
            <button type="button" data-action="edit-prayer">Sửa</button>
            <button type="button" data-action="approve-prayer">Duyệt hiển thị</button>
            <button type="button" data-action="delete-prayer">Xóa</button>
          </div>
        </article>
      `
    )
    .join("");
}

function prayerRequestById(id) {
  return prayerRequests.find((item) => item.id === id);
}


function getCloudinaryConfig() {
  const config = window.KITO_CLOUDINARY_CONFIG || {};
  return {
    cloudName: String(config.cloudName || "").trim(),
    uploadPreset: String(config.uploadPreset || "").trim(),
    folder: String(config.folder || "kito").trim(),
  };
}

function applyUploadedImageUrl(url) {
  const secureUrl = String(url || "").trim();
  if (!secureUrl) return;
  currentImage = secureUrl;
  currentImagePath = "";
  itemImageUrl.value = secureUrl;
  itemImageUrl.dispatchEvent(new Event("input", { bubbles: true }));
  imagePreview.src = secureUrl;
  imagePreview.classList.add("show");
}

function setupCloudinaryUpload() {
  if (!cloudinaryUploadButton) return;

  cloudinaryUploadButton.addEventListener("click", () => {
    if (!canManageContent) {
      alert("Chỉ tài khoản admin mới có quyền upload ảnh.");
      return;
    }

    const config = getCloudinaryConfig();
    if (!config.cloudName || !config.uploadPreset) {
      contentMessage.textContent = "Chưa cấu hình Cloudinary. Hãy điền cloudName và uploadPreset trong cloudinary-config.js.";
      return;
    }

    if (!window.cloudinary?.createUploadWidget) {
      contentMessage.textContent = "Không thể tải Cloudinary Upload Widget. Vui lòng kiểm tra kết nối mạng.";
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: config.cloudName,
        uploadPreset: config.uploadPreset,
        folder: config.folder || undefined,
        sources: ["local", "url", "camera"],
        multiple: false,
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
      },
      (error, result) => {
        if (error) {
          contentMessage.textContent = error.message || "Upload Cloudinary thất bại.";
          return;
        }

        if (result?.event === "success") {
          applyUploadedImageUrl(result.info?.secure_url);
          contentMessage.textContent = "Đã upload Cloudinary và tự điền URL ảnh.";
        }
      }
    );

    widget.open();
  });
}

function openFaithCloudinaryUpload(targetInput, afterUpload, successMessage) {
  if (!targetInput) return;
  if (!canManageContent) {
    alert("Chỉ tài khoản admin mới có quyền upload ảnh.");
    return;
  }

  const config = getCloudinaryConfig();
  if (!config.cloudName || !config.uploadPreset) {
    if (faithDiscoveryMessage) {
      faithDiscoveryMessage.textContent = "Chưa cấu hình Cloudinary. Hãy điền cloudName và uploadPreset trong cloudinary-config.js.";
    }
    return;
  }

  if (!window.cloudinary?.createUploadWidget) {
    if (faithDiscoveryMessage) {
      faithDiscoveryMessage.textContent = "Không thể tải Cloudinary Upload Widget. Vui lòng kiểm tra kết nối mạng.";
    }
    return;
  }

  const widget = window.cloudinary.createUploadWidget(
    {
      cloudName: config.cloudName,
      uploadPreset: config.uploadPreset,
      folder: config.folder || undefined,
      sources: ["local", "url", "camera"],
      multiple: false,
      resourceType: "image",
      clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
    },
    (error, result) => {
      if (error) {
        if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = error.message || "Upload Cloudinary thất bại.";
        return;
      }

      if (result?.event === "success") {
        targetInput.value = result.info?.secure_url || "";
        afterUpload?.();
        if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = successMessage;
      }
    }
  );

  widget.open();
}
function setupFaithCloudinaryUpload() {
  faithPickerCloudinaryUploadButton?.addEventListener("click", () => {
    openFaithCloudinaryUpload(
      faithPickerImageUrl,
      updateFaithPickerPreview,
      "Đã upload Cloudinary và tự điền URL ảnh khung chọn chủ đề."
    );
  });
  faithBannerCloudinaryUploadButton?.addEventListener("click", () => {
    openFaithCloudinaryUpload(
      faithBannerImageUrl,
      updateFaithBannerPreview,
      "Đã upload Cloudinary và tự điền URL banner."
    );
  });

  faithCloudinaryUploadButton?.addEventListener("click", () => {
    openFaithCloudinaryUpload(
      faithInfographicUrl,
      updateFaithImagePreview,
      "Đã upload Cloudinary và tự điền URL infographic."
    );
  });
}

function prayerTextToHtml(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
}

function htmlToPlainText(value) {
  const template = document.createElement("template");
  template.innerHTML = String(value || "");
  return (template.content.textContent || "").replace(/\s+/g, " ").trim();
}

function prayerRequestPayload(item) {
  return {
    displayName: item?.displayName || "Anonymous",
    anonymous: Boolean(item?.anonymous),
    prayerTitle: item?.prayerTitle || "",
    prayerText: item?.prayerText || "",
    status: item?.status || "pending",
  };
}

function editPrayerRequest(id) {
  if (!canManageContent) return;
  const request = prayerRequestById(id);
  if (!request) return;

  const displayName = request.displayName || "Anonymous";
  editingPrayerRequestId = request.id;
  itemId.value = `prayer-request-${request.id}`;
  itemType.value = "prayers";
  itemTitle.value = request.prayerTitle || `Lời cầu nguyện của ${displayName}`;
  itemDescription.value = request.prayerTitle || "";
  itemBodyHtml.value = prayerTextToHtml(request.prayerText);
  itemMeta.value = displayName;
  itemDate.value = formatFeedbackTime(request);
  itemCreatedDate.value = currentDateTimeLocal();
  itemStatus.value = "actived";
  currentImage = fallbackImage;
  currentImagePath = "";
  itemImageUrl.value = fallbackImage;
  itemSourceUrl.value = "";

  imagePreview.src = fallbackImage;
  imagePreview.classList.add("show");
  contentMessage.textContent = "Đã đưa lời cầu nguyện vào khung chỉnh sửa. Kiểm tra rồi bấm Lưu nội dung để hiển thị.";
  activateAdminTab("content");
  document.querySelector("#contentManager").scrollIntoView({ behavior: "smooth", block: "start" });
}

function clearForm() {
  form.reset();
  itemId.value = "";
  editingPrayerRequestId = "";
  currentImage = "";
  currentImagePath = "";
  itemImageUrl.value = "";
  itemSourceUrl.value = "";
  itemCreatedDate.value = currentDateTimeLocal();
  itemStatus.value = "actived";
  imagePreview.removeAttribute("src");
  imagePreview.classList.remove("show");
  contentMessage.textContent = "";
}

function editItem(type, id) {
  if (!canManageContent) return;
  const item = content[type].find((entry) => entry.id === id);
  if (!item) return;

  itemId.value = item.id;
  itemType.value = type;
  itemTitle.value = item.title || item.ref || item.meta || "";
  itemDescription.value = item.description || item.quote || "";
  itemBodyHtml.value = item.bodyHtml || "";
  itemMeta.value = item.meta || "";
  itemDate.value = item.date || "";
  itemCreatedDate.value = toDateTimeLocal(item.createdDate || item.createdAtText || item.createdAt) || currentDateTimeLocal();
  itemStatus.value = item.status || "actived";
  currentImage = item.image || "";
  currentImagePath = item.imagePath || "";
  itemImageUrl.value = currentImage;
  itemSourceUrl.value = item.sourceUrl || "";

  if (currentImage) {
    imagePreview.src = currentImage;
    imagePreview.classList.add("show");
  }

  activateAdminTab("content");
  itemTitle.focus();
}

async function deleteItem(type, id) {
  if (!canManageContent) return;
  const item = content[type].find((entry) => entry.id === id);
  if (!item) return;
  const confirmed = confirm(`Xóa "${item.title}"?`);
  if (!confirmed) return;

  try {
    await deleteContentItem(id);
    content = await getContent();
    renderAdminList();
    clearForm();
  } catch (error) {
    alert(error.message);
  }
}

async function resetItemRating(type, id) {
  if (!canManageContent) return;
  const item = content[type].find((entry) => entry.id === id);
  if (!item) return;
  const confirmed = confirm(`Reset lượt đánh giá của "${item.title || item.ref || item.meta || id}" về 0?`);
  if (!confirmed) return;

  try {
    await resetContentRating(id);
    content = await getContent();
    renderAdminList();
    contentMessage.textContent = "Đã reset lượt đánh giá về 0.";
  } catch (error) {
    contentMessage.textContent = error.message;
    alert(error.message);
  }
}

function moveItemInType(type, draggedId, targetId, placeAfter) {
  const items = content[type] || [];
  const fromIndex = items.findIndex((item) => item.id === draggedId);
  const targetIndex = items.findIndex((item) => item.id === targetId);
  if (fromIndex < 0 || targetIndex < 0 || draggedId === targetId) return false;

  const [moved] = items.splice(fromIndex, 1);
  const adjustedTargetIndex = items.findIndex((item) => item.id === targetId);
  items.splice(adjustedTargetIndex + (placeAfter ? 1 : 0), 0, moved);
  items.forEach((item, index) => {
    item.sortOrder = index;
  });
  return true;
}

async function persistCurrentOrder(type) {
  const ids = (content[type] || []).map((item) => item.id);
  await updateContentOrder(type, ids);
}

itemImageUrl.addEventListener("input", () => {
  if (!canManageContent) return;
  const imageUrl = itemImageUrl.value.trim();

  if (!imageUrl) {
    imagePreview.removeAttribute("src");
    imagePreview.classList.remove("show");
    contentMessage.textContent = "";
    return;
  }

  imagePreview.src = imageUrl;
  imagePreview.classList.add("show");
  contentMessage.textContent = "Đã nhập URL ảnh.";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!canManageContent) {
    alert("Chỉ tài khoản admin mới có quyền thêm, sửa, xóa nội dung.");
    return;
  }
  const type = itemType.value;
  const id = itemId.value || `${type}-${Date.now()}`;
  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  contentMessage.textContent = "Đang lưu nội dung...";

  try {
    const imageUrl = itemImageUrl.value.trim() || currentImage || fallbackImage;

    await saveContentItem(type, {
      id,
      title: itemTitle.value.trim(),
      description: itemDescription.value.trim(),
      quote: type === "daily" ? itemDescription.value.trim() : "",
      ref: type === "daily" ? itemMeta.value.trim() : "",
      bodyHtml: itemBodyHtml.value.trim(),
      meta: itemMeta.value.trim(),
      date: itemDate.value,
      createdDate: itemCreatedDate.value || currentDateTimeLocal(),
      status: itemStatus.value || "actived",
      image: imageUrl,
      imagePath: "",
      sourceUrl: itemSourceUrl.value.trim(),
    });

    if (editingPrayerRequestId) {
      await savePrayerRequest(editingPrayerRequestId, {
        displayName: itemMeta.value.trim() || "Anonymous",
        anonymous: itemMeta.value.trim().toLowerCase() === "anonymous",
        prayerTitle: itemDescription.value.trim(),
        prayerText: htmlToPlainText(itemBodyHtml.value) || itemDescription.value.trim(),
        status: "approved",
        contentId: id,
      });
      prayerRequests = await getPrayerRequests();
      renderPrayerReviewList();
    }

    content = await getContent();
    renderAdminList();
    clearForm();
    contentMessage.textContent = "Đã lưu nội dung và URL hình ảnh.";
  } catch (error) {
    contentMessage.textContent = error.message;
    alert(error.message);
  } finally {
    submitButton.disabled = false;
  }
});

adminList.addEventListener("dragstart", (event) => {
  const item = event.target.closest(".admin-item");
  const isCustomView = adminSearch.value.trim() || adminSort.value !== "default";
  if (!item || !canManageContent || filterType.value === "all" || isCustomView || event.target.closest("button")) {
    event.preventDefault();
    return;
  }

  draggedItem = {
    id: item.dataset.id,
    type: item.dataset.type,
  };
  item.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedItem.id);
});

adminList.addEventListener("dragover", (event) => {
  const target = event.target.closest(".admin-item");
  if (!draggedItem || !target || target.dataset.type !== draggedItem.type || target.dataset.id === draggedItem.id) return;
  event.preventDefault();
  target.classList.add("drag-over");
});

adminList.addEventListener("dragleave", (event) => {
  const target = event.target.closest(".admin-item");
  if (target) target.classList.remove("drag-over");
});

adminList.addEventListener("drop", async (event) => {
  const target = event.target.closest(".admin-item");
  if (!draggedItem || !target || target.dataset.type !== draggedItem.type) return;
  event.preventDefault();

  const rect = target.getBoundingClientRect();
  const placeAfter = event.clientY > rect.top + rect.height / 2;
  const moved = moveItemInType(draggedItem.type, draggedItem.id, target.dataset.id, placeAfter);
  if (!moved) return;

  try {
    renderAdminList();
    contentMessage.textContent = "Đang lưu thứ tự nội dung...";
    await persistCurrentOrder(draggedItem.type);
    contentMessage.textContent = "Đã cập nhật thứ tự nội dung.";
  } catch (error) {
    contentMessage.textContent = error.message;
    alert(error.message);
    content = await getContent();
    renderAdminList();
  } finally {
    draggedItem = null;
  }
});

adminList.addEventListener("dragend", () => {
  draggedItem = null;
  adminList.querySelectorAll(".dragging, .drag-over").forEach((item) => {
    item.classList.remove("dragging", "drag-over");
  });
});

adminList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const { action, type, id } = button.dataset;
  if (action === "edit") editItem(type, id);
  if (action === "delete") deleteItem(type, id);
  if (action === "reset-rating") resetItemRating(type, id);
});

resetVisitStatsButton?.addEventListener("click", async () => {
  if (!canManageContent) return;
  const confirmed = window.confirm("Bạn có chắc muốn xóa toàn bộ lượt truy cập không?");
  if (!confirmed) return;
  resetVisitStatsButton.disabled = true;
  try {
    await resetVisitStats();
    visitStatsItems = [];
    if (visitSearch) visitSearch.value = "";
    if (visitSort) visitSort.value = "views-desc";
    renderVisitStats([]);
  } catch (error) {
    alert(error.message);
  } finally {
    resetVisitStatsButton.disabled = false;
  }
});
visitSearch?.addEventListener("input", () => {
  renderVisitStats();
});

visitSort?.addEventListener("change", () => {
  renderVisitStats();
});

exportBackupButton?.addEventListener("click", async () => {
  if (!canManageContent) {
    alert("Chỉ tài khoản admin mới có quyền xuất backup.");
    return;
  }

  exportBackupButton.disabled = true;
  if (backupMessage) backupMessage.textContent = "Đang xuất dữ liệu backup...";

  try {
    const backup = await exportFirestoreBackup();
    const total = Object.values(backup.collections || {}).reduce((sum, items) => sum + items.length, 0);
    downloadJsonFile(backup, backupFileName());
    if (backupMessage) backupMessage.textContent = `Đã xuất backup JSON gồm ${total.toLocaleString("vi-VN")} document.`;
  } catch (error) {
    if (backupMessage) backupMessage.textContent = error.message;
    alert(error.message);
  } finally {
    exportBackupButton.disabled = false;
  }
});

importBackupButton?.addEventListener("click", async () => {
  if (!canManageContent) {
    alert("Chỉ tài khoản admin mới có quyền nhập backup.");
    return;
  }

  const file = backupFileInput?.files?.[0];
  if (!file) {
    if (backupMessage) backupMessage.textContent = "Vui lòng chọn file backup JSON.";
    return;
  }

  const confirmed = confirm("Nhập backup sẽ ghi đè các document cùng ID bằng dữ liệu trong file. Bạn có muốn tiếp tục?");
  if (!confirmed) return;

  importBackupButton.disabled = true;
  if (backupMessage) backupMessage.textContent = "Đang nhập dữ liệu backup...";

  try {
    const backup = await readJsonFile(file);
    const restoredCount = await importFirestoreBackup(backup);
    content = await getContent();
    feedbackItems = await getContentFeedbacks();
    prayerRequests = await getPrayerRequests();
    visitStatsItems = await getVisitStats();
    renderAdminList();
    renderFeedbackList();
    renderPrayerReviewList();
    renderVisitStats(visitStatsItems);
    await loadFaithDiscoveryAdmin();
    if (backupFileInput) backupFileInput.value = "";
    if (backupMessage) backupMessage.textContent = `Đã nhập backup thành công: ${restoredCount.toLocaleString("vi-VN")} document.`;
  } catch (error) {
    if (backupMessage) backupMessage.textContent = error.message;
    alert(error.message);
  } finally {
    importBackupButton.disabled = false;
  }
});

faithPickerImageUrl?.addEventListener("input", updateFaithPickerPreview);
faithBannerImageUrl?.addEventListener("input", updateFaithBannerPreview);
faithInfographicUrl?.addEventListener("input", updateFaithImagePreview);

faithSetList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  const set = faithDiscoverySets.find((item) => item.id === button.dataset.id);
  fillFaithSetForm(set);
  if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = set ? `Đang chỉnh sửa: ${set.title}` : "";
});

newFaithSetButton?.addEventListener("click", () => {
  activeFaithAdminSetId = "";
  faithSetId.value = "";
  faithSetTitle.value = "";
  
  faithPickerImageUrl.value = "";
  faithBannerImageUrl.value = "";
  faithInfographicUrl.value = "";
  faithQuestionsJson.value = "";
  
  updateFaithPickerPreview();
  updateFaithBannerPreview();
  updateFaithImagePreview();
  renderFaithSetList();
  if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = "Đang tạo bộ câu hỏi mới.";
});

deleteFaithSetButton?.addEventListener("click", async () => {
  if (!canManageContent) {
    alert("Chỉ tài khoản admin mới có quyền xóa bộ câu hỏi.");
    return;
  }

  const set = selectedFaithSet();
  if (!set) {
    if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = "Chưa chọn bộ câu hỏi để xóa.";
    return;
  }

  if (!confirm(`Bạn có chắc muốn xóa bộ "${set.title}"?`)) return;

  try {
    faithDiscoverySets = faithDiscoverySets.filter((item) => item.id !== set.id);
    const nextSet = faithDiscoverySets[0] || null;
    await saveFaithDiscoverySettings({
      sets: faithDiscoverySets,
      activeSetId: nextSet?.id || "",
    });
    fillFaithSetForm(nextSet);
    if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = "Đã xóa bộ câu hỏi.";
  } catch (error) {
    if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = error.message;
    alert(error.message);
  }
});

faithQuestionsFile?.addEventListener("change", async () => {
  const file = faithQuestionsFile.files?.[0];
  if (!file) return;

  try {
    const payload = await readJsonFile(file);
    const questions = parseFaithQuestionsPayload(payload);
    faithQuestionsJson.value = stringifyFaithQuestions(questions);
    if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = `Đã đọc ${questions.length} câu hỏi từ file JSON.`;
  } catch (error) {
    if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = error.message;
    alert(error.message);
  } finally {
    faithQuestionsFile.value = "";
  }
});

formatFaithQuestionsButton?.addEventListener("click", () => {
  try {
    const questions = parseFaithQuestionsPayload(faithQuestionsJson.value);
    faithQuestionsJson.value = stringifyFaithQuestions(questions);
    if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = `Đã định dạng ${questions.length} câu hỏi.`;
  } catch (error) {
    if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = error.message;
  }
});

faithDiscoveryForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!canManageContent) {
    alert("Chỉ tài khoản admin mới có quyền lưu Khám Phá Đức Tin.");
    return;
  }

  const submitButton = faithDiscoveryForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = "Đang lưu Khám Phá Đức Tin...";

  try {
    const questions = parseFaithQuestionsPayload(faithQuestionsJson.value);
    const id = faithSetId.value.trim() || uniqueFaithSetId();
    const title = faithSetTitle.value.trim() || `Bộ ${faithDiscoverySets.length + 1}`;
    const nextSet = {
      id,
      title,
      pickerImageUrl: faithPickerImageUrl.value.trim(),
      bannerImageUrl: faithBannerImageUrl.value.trim(),
      infographicUrl: faithInfographicUrl.value.trim(),
      questions,
    };

    const existingIndex = faithDiscoverySets.findIndex((set) => set.id === id);
    if (existingIndex >= 0) {
      faithDiscoverySets[existingIndex] = nextSet;
    } else {
      faithDiscoverySets.push(nextSet);
    }

    await saveFaithDiscoverySettings({
      sets: faithDiscoverySets,
      activeSetId: id,
    });
    fillFaithSetForm(nextSet);
    if (faithDiscoveryMessage) {
      faithDiscoveryMessage.textContent = `Đã lưu bộ "${title}" gồm ${questions.length} câu hỏi.`;
    }
  } catch (error) {
    if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = error.message;
    alert(error.message);
  } finally {
    submitButton.disabled = false;
  }
});

feedbackList?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button || button.dataset.action !== "delete-feedback") return;
  if (!canManageContent) {
    alert("Chỉ tài khoản admin mới có quyền xóa ý kiến đóng góp.");
    return;
  }

  const feedbackId = button.dataset.id;
  const confirmed = confirm("Xóa ý kiến đóng góp này?");
  if (!confirmed) return;

  try {
    button.disabled = true;
    await deleteContentFeedback(feedbackId);
    feedbackItems = feedbackItems.filter((item) => item.id !== feedbackId);
    renderFeedbackList();
  } catch (error) {
    alert(error.message);
    button.disabled = false;
  }
});

prayerReviewList?.addEventListener("click", async (event) => {
  const button = event.target.closest("button");
  if (!button || !canManageContent) return;
  const card = button.closest(".prayer-review-item");
  if (!card) return;
  const id = card.dataset.id;
  const request = prayerRequestById(id);
  if (!request) return;

  try {
    button.disabled = true;
    if (button.dataset.action === "edit-prayer") {
      editPrayerRequest(id);
      return;
    }
    if (button.dataset.action === "approve-prayer") {
      await approvePrayerRequest(id, prayerRequestPayload(request));
      contentMessage.textContent = "Đã duyệt và hiển thị lời cầu nguyện.";
    }
    if (button.dataset.action === "delete-prayer") {
      const confirmed = confirm("Xóa lời cầu nguyện này?");
      if (!confirmed) return;
      const deleteResult = await deletePrayerRequest(id);
      contentMessage.textContent =
        deleteResult === "hidden"
          ? "Đã ẩn lời cầu nguyện khỏi màn hình duyệt. Nội dung đã hiển thị vẫn được giữ lại."
          : "Đã xóa lời cầu nguyện.";
    }
    prayerRequests = await getPrayerRequests();
    content = await getContent();
    renderPrayerReviewList();
    renderAdminList();
  } catch (error) {
    alert(error.message);
  } finally {
    button.disabled = false;
  }
});

document.querySelector("#clearForm").addEventListener("click", clearForm);
filterType.addEventListener("change", () => {
  renderAdminList();
  contentMessage.textContent =
    filterType.value === "all" ? "Chọn một loại nội dung cụ thể để kéo thả đổi thứ tự." : "";
});
adminSearch.addEventListener("input", () => {
  renderAdminList();
});
adminSort.addEventListener("change", () => {
  renderAdminList();
  contentMessage.textContent =
    adminSort.value === "default" ? "" : "Khi đang sắp xếp, chức năng kéo thả đổi thứ tự sẽ tạm tắt.";
});

function setEditorEnabled(enabled) {
  form.querySelectorAll("input, select, textarea, button").forEach((control) => {
    control.disabled = !enabled;
  });
  faithDiscoveryForm?.querySelectorAll("input, textarea, button").forEach((control) => {
    control.disabled = !enabled;
  });
  document.querySelectorAll(".faith-set-manager button").forEach((control) => {
    control.disabled = !enabled;
  });
}

async function setupLogin() {
  setupAdminTabs();
  setupCloudinaryUpload();
  setupFaithCloudinaryUpload();
  await renderAuthStatus(document.querySelector("#adminAuthStatus"));
  const user = await getCurrentUser();

  if (!user) {
    loginPanel.hidden = false;
    protectedPanel.hidden = true;
    return;
  }

  loginPanel.hidden = true;
  protectedPanel.hidden = false;
  canManageContent = user.role === "admin";
  setEditorEnabled(canManageContent);
  if (canManageContent && !itemCreatedDate.value) {
    itemCreatedDate.value = currentDateTimeLocal();
  }

  if (!canManageContent) {
    document.querySelector(".admin-tabs").insertAdjacentHTML(
      "afterend",
      `
        <section class="notice-panel">
          <p class="eyebrow">Chỉ xem</p>
          <h2>Tài khoản của bạn không có quyền thêm, sửa, xóa nội dung</h2>
          <p>Vui lòng đăng nhập bằng tài khoản admin để quản trị nội dung.</p>
        </section>
      `
    );
  }

  try {
    content = await getContent();
    feedbackItems = await getContentFeedbacks();
    prayerRequests = await getPrayerRequests();
    try {
      const visitStats = await getVisitStats();
      renderVisitStats(visitStats);
    } catch (analyticsError) {
      if (visitStatsList) {
        visitStatsList.innerHTML = `
          <article class="visit-item">
            <div>
              <span>Lỗi thống kê</span>
              <h3>Không thể tải lượt truy cập</h3>
              <p>${escapeHtml(analyticsError.message)}</p>
            </div>
          </article>
        `;
      }
    }
    renderAdminList();
    renderFeedbackList();
    renderPrayerReviewList();
    await loadFaithDiscoveryAdmin();
  } catch (error) {
    document.querySelector("#adminList").innerHTML = `
      <article class="admin-item">
        <div>
          <span>Lỗi Firebase</span>
          <h3>Không thể tải dữ liệu</h3>
          <p>${error.message}</p>
        </div>
      </article>
    `;
    if (feedbackList) {
      feedbackList.innerHTML = `
        <article class="feedback-item">
          <h3>Không thể tải ý kiến đóng góp</h3>
          <p>${escapeHtml(error.message)}</p>
        </article>
      `;
    }
    if (prayerReviewList) {
      prayerReviewList.innerHTML = `
        <article class="feedback-item">
          <h3>Không thể tải lời cầu nguyện</h3>
          <p>${escapeHtml(error.message)}</p>
        </article>
      `;
    }
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const session = await login(
    document.querySelector("#loginUsername").value,
    document.querySelector("#loginPassword").value
    );

    if (!session) {
      loginMessage.textContent = "User hoặc password không đúng.";
      return;
    }

    window.location.reload();
  } catch (error) {
    loginMessage.textContent = error.message;
  }
});

setupLogin();















