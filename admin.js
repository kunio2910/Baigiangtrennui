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
const faithMaskEditor = document.querySelector("#faithMaskEditor");
const faithMaskEditorImage = document.querySelector("#faithMaskEditorImage");
const faithMaskEditorLayer = document.querySelector("#faithMaskEditorLayer");
const faithMaskCount = document.querySelector("#faithMaskCount");
const generateFaithMasksButton = document.querySelector("#generateFaithMasksButton");
const clearFaithMasksButton = document.querySelector("#clearFaithMasksButton");
const faithMaskSelectedLabel = document.querySelector("#faithMaskSelectedLabel");
const faithMaskPositionInput = document.querySelector("#faithMaskPosition");
const faithMaskLengthInput = document.querySelector("#faithMaskLength");
const faithMaskWidthInput = document.querySelector("#faithMaskWidth");
const applyFaithMaskParamsButton = document.querySelector("#applyFaithMaskParams");
const faithMaskSelectionInput = document.querySelector("#faithMaskSelectionInput");
const selectFaithMaskListButton = document.querySelector("#selectFaithMaskListButton");
const faithQuestionsFile = document.querySelector("#faithQuestionsFile");
const faithQuestionsJson = document.querySelector("#faithQuestionsJson");
const formatFaithQuestionsButton = document.querySelector("#formatFaithQuestions");
const faithDiscoveryMessage = document.querySelector("#faithDiscoveryMessage");
const journeyBibleForm = document.querySelector("#journeyBibleForm");
const journeyTopicList = document.querySelector("#journeyTopicList");
const newJourneyTopicButton = document.querySelector("#newJourneyTopicButton");
const deleteJourneyTopicButton = document.querySelector("#deleteJourneyTopicButton");
const journeyTopicId = document.querySelector("#journeyTopicId");
const journeyTopicTitle = document.querySelector("#journeyTopicTitle");
const journeyTopicLabel = document.querySelector("#journeyTopicLabel");
const journeyTopicMapType = document.querySelector("#journeyTopicMapType");
const journeyMapName = document.querySelector("#journeyMapName");
const journeyTopicEnabled = document.querySelector("#journeyTopicEnabled");
const journeyTopicDescription = document.querySelector("#journeyTopicDescription");
const journeyPickerImageUrl = document.querySelector("#journeyPickerImageUrl");
const journeyPickerUploadButton = document.querySelector("#journeyPickerUploadButton");
const journeyPickerPreview = document.querySelector("#journeyPickerPreview");
const journeyMilestoneSelect = document.querySelector("#journeyMilestoneSelect");
const newJourneyMilestoneButton = document.querySelector("#newJourneyMilestoneButton");
const deleteJourneyMilestoneButton = document.querySelector("#deleteJourneyMilestoneButton");
const journeyMilestoneNumber = document.querySelector("#journeyMilestoneNumber");
const journeyMapCardImageUrl = document.querySelector("#journeyMapCardImageUrl");
const journeyMapCardUploadButton = document.querySelector("#journeyMapCardUploadButton");
const journeyMapCardPreview = document.querySelector("#journeyMapCardPreview");
const journeyMilestoneRelatedUrl = document.querySelector("#journeyMilestoneRelatedUrl");
const journeyMapImageUrl = document.querySelector("#journeyMapImageUrl");
const journeyMapUploadButton = document.querySelector("#journeyMapUploadButton");
const journeyMapPointCount = document.querySelector("#journeyMapPointCount");
const journeyMapPointSelect = document.querySelector("#journeyMapPointSelect");
const journeyMapPointX = document.querySelector("#journeyMapPointX");
const journeyMapPointY = document.querySelector("#journeyMapPointY");
const journeyMapEditor = document.querySelector("#journeyMapEditor");
const journeyMapEditorImage = document.querySelector("#journeyMapEditorImage");
const journeyMapMarkerLayer = document.querySelector("#journeyMapMarkerLayer");
const journeyMapEmptyNote = document.querySelector("#journeyMapEmptyNote");
const journeyMilestoneTitle = document.querySelector("#journeyMilestoneTitle");
const journeyMilestoneReference = document.querySelector("#journeyMilestoneReference");
const journeyMilestoneRegion = document.querySelector("#journeyMilestoneRegion");
const journeyMilestoneStory = document.querySelector("#journeyMilestoneStory");
const journeyMilestoneLesson = document.querySelector("#journeyMilestoneLesson");
const journeyBibleMessage = document.querySelector("#journeyBibleMessage");
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
let faithAdminMasks = [];
let selectedFaithMaskIndex = -1;
let selectedFaithMaskIndices = new Set();
let activeFaithMaskDrag = null;
let journeyBibleTopics = [];
let activeJourneyTopicId = "";
let currentJourneyMilestones = [];
let selectedJourneyMapPointNumber = 1;
let activeJourneyMapDragNumber = null;
const legacyFaithPickerSampleImages = ["/assets/faith-picker-maria.jpg", "assets/faith-picker-maria.jpg"];
const journeyAdminMapNumberPositions = [
  { x: 29.5, y: 18.7 },
  { x: 54.8, y: 20.9 },
  { x: 79.6, y: 23.2 },
  { x: 37.1, y: 31.4 },
  { x: 70.5, y: 35.5 },
  { x: 42.1, y: 42.6 },
  { x: 70.1, y: 45.1 },
  { x: 38.3, y: 52.7 },
  { x: 68.6, y: 55.7 },
  { x: 43.1, y: 61.7 },
  { x: 35.5, y: 66.3 },
  { x: 70.7, y: 67.2 },
  { x: 76.8, y: 75.6 },
  { x: 32.8, y: 77.0 },
  { x: 58.7, y: 83.2 },
  { x: 49.0, y: 91.0 },
];
const journeyAdminExodusMapNumberPositions = [
  { x: 22.5, y: 8.7 },
  { x: 25.5, y: 16.8 },
  { x: 19.6, y: 25.6 },
  { x: 52.0, y: 21.6 },
  { x: 76.5, y: 17.2 },
  { x: 81.7, y: 29.4 },
  { x: 82.9, y: 39.1 },
  { x: 13.3, y: 48.9 },
  { x: 34.0, y: 50.3 },
  { x: 57.7, y: 50.4 },
  { x: 48.6, y: 60.7 },
  { x: 27.8, y: 66.5 },
  { x: 19.4, y: 75.2 },
  { x: 48.8, y: 76.9 },
  { x: 73.1, y: 80.6 },
  { x: 52.3, y: 91.6 },
];
const journeyAdminCreationMapNumberPositions = [
  { x: 28.8, y: 8.3 },
  { x: 47.8, y: 17.7 },
  { x: 40.7, y: 29.4 },
  { x: 55.0, y: 41.6 },
  { x: 42.7, y: 53.0 },
  { x: 53.7, y: 64.0 },
  { x: 38.6, y: 76.8 },
];
const journeyAdminStationsMapNumberPositions = [
  { x: 22.6, y: 9.5 },
  { x: 45.5, y: 15.9 },
  { x: 60.3, y: 23.0 },
  { x: 36.1, y: 29.4 },
  { x: 58.8, y: 36.0 },
  { x: 27.0, y: 43.2 },
  { x: 57.4, y: 46.0 },
  { x: 27.6, y: 53.1 },
  { x: 66.5, y: 58.1 },
  { x: 33.1, y: 63.2 },
  { x: 58.1, y: 66.9 },
  { x: 29.5, y: 73.0 },
  { x: 65.2, y: 77.9 },
  { x: 50.4, y: 91.3 },
];
const journeyAdminMiraclesMapNumberPositions = [
  { x: 26.3, y: 6.2 },
  { x: 48.3, y: 12.4 },
  { x: 64.4, y: 21.0 },
  { x: 27.6, y: 33.4 },
  { x: 57.8, y: 35.4 },
  { x: 23.4, y: 43.7 },
  { x: 47.1, y: 46.2 },
  { x: 79.3, y: 48.6 },
  { x: 23.5, y: 58.1 },
  { x: 69.7, y: 62.1 },
  { x: 15.9, y: 70.4 },
  { x: 48.2, y: 70.7 },
  { x: 77.0, y: 75.0 },
  { x: 49.0, y: 88.0 },
];
const journeyAdminDefaultMapImages = {
  jesus: "/assets/journey-jesus-map.png",
  exodus: "/assets/journey-moses-exodus-map.png",
  creation: "/assets/journey-creation-map.png",
  stations: "/assets/journey-stations-cross-map.png",
  miracles: "/assets/journey-miracles-map.png",
  custom: "",
};
const journeyAdminMapPositionsByType = {
  jesus: journeyAdminMapNumberPositions,
  exodus: journeyAdminExodusMapNumberPositions,
  creation: journeyAdminCreationMapNumberPositions,
  stations: journeyAdminStationsMapNumberPositions,
  miracles: journeyAdminMiraclesMapNumberPositions,
};

function setJourneyControlLabel(control, labelText) {
  const label = control?.closest("label");
  const labelSpan = label?.querySelector("span");
  if (labelSpan) labelSpan.textContent = labelText;
}


function cleanFaithPickerImageUrl(value) {
  const imageUrl = String(value || "").trim();
  return legacyFaithPickerSampleImages.includes(imageUrl) ? "" : imageUrl;
}

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

function normalizeFaithMask(mask) {
  if (!mask || typeof mask !== "object") return null;
  const x = Number(mask.x);
  const y = Number(mask.y);
  const w = Number(mask.w);
  const h = Number(mask.h);
  if ([x, y, w, h].some((value) => Number.isNaN(value))) return null;
  return {
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y)),
    w: Math.max(1, Math.min(100, w)),
    h: Math.max(1, Math.min(100, h)),
  };
}

function normalizeFaithMasks(masks) {
  return Array.isArray(masks) ? masks.map(normalizeFaithMask).filter(Boolean) : [];
}

function getFaithAdminGridSize(total) {
  if (total === 12) return { columns: 3, rows: 4 };
  if (total === 20) return { columns: 4, rows: 5 };
  const columns = Math.ceil(Math.sqrt(total || 1));
  return { columns, rows: Math.ceil((total || 1) / columns) };
}

function generateFaithDefaultMasks(total) {
  const count = Math.max(1, Number(total || 1));
  const { columns, rows } = getFaithAdminGridSize(count);
  const masks = [];
  const width = 100 / columns;
  const height = 100 / rows;
  for (let index = 0; index < count; index += 1) {
    const row = Math.floor(index / columns);
    const col = index % columns;
    masks.push({
      x: Number((col * width).toFixed(3)),
      y: Number((row * height).toFixed(3)),
      w: Number(width.toFixed(3)),
      h: Number(height.toFixed(3)),
    });
  }
  return masks;
}

function faithMaskCountValue(fallbackCount = 0) {
  const customCount = Number(faithMaskCount?.value || 0);
  const count = customCount > 0 ? customCount : fallbackCount;
  if (!count || Number.isNaN(count)) {
    throw new Error("Vui lòng nhập số hình che hoặc nhập bộ câu hỏi JSON trước khi tạo vùng che.");
  }
  if (count < 1 || count > 80) {
    throw new Error("Số hình che phải từ 1 đến 80.");
  }
  return Math.round(count);
}

function clampFaithMask(mask) {
  const next = normalizeFaithMask(mask) || { x: 0, y: 0, w: 20, h: 20 };
  next.w = Math.max(3, Math.min(100, next.w));
  next.h = Math.max(3, Math.min(100, next.h));
  next.x = Math.max(0, Math.min(100 - next.w, next.x));
  next.y = Math.max(0, Math.min(100 - next.h, next.y));
  return next;
}

function formatFaithMaskNumber(value) {
  return Number(Number(value || 0).toFixed(3)).toString();
}

function setFaithMaskParamsDisabled(disabled) {
  [faithMaskPositionInput, faithMaskLengthInput, faithMaskWidthInput, applyFaithMaskParamsButton].forEach((control) => {
    if (control) control.disabled = disabled;
  });
}

function selectedFaithMaskList() {
  return [...selectedFaithMaskIndices]
    .filter((index) => Boolean(faithAdminMasks[index]))
    .sort((a, b) => a - b);
}

function formatFaithMaskSelection(indices) {
  return indices.map((index) => index + 1).join(",");
}

function sameFaithMaskValue(indices, key) {
  if (!indices.length) return "";
  const firstValue = formatFaithMaskNumber(clampFaithMask(faithAdminMasks[indices[0]])[key]);
  return indices.every((index) => formatFaithMaskNumber(clampFaithMask(faithAdminMasks[index])[key]) === firstValue)
    ? firstValue
    : "";
}

function syncFaithMaskParamsForm() {
  const selectedIndices = selectedFaithMaskList();
  selectedFaithMaskIndices = new Set(selectedIndices);
  selectedFaithMaskIndex = selectedIndices[0] ?? -1;

  const hasMasks = faithAdminMasks.length > 0;
  if (faithMaskSelectionInput) faithMaskSelectionInput.disabled = !hasMasks;
  if (selectFaithMaskListButton) selectFaithMaskListButton.disabled = !hasMasks;

  if (!selectedIndices.length) {
    if (faithMaskSelectedLabel) faithMaskSelectedLabel.textContent = "Chọn một ô che";
    if (faithMaskSelectionInput) faithMaskSelectionInput.value = "";
    if (faithMaskPositionInput) {
      faithMaskPositionInput.value = "";
      faithMaskPositionInput.disabled = true;
    }
    if (faithMaskLengthInput) faithMaskLengthInput.value = "";
    if (faithMaskWidthInput) faithMaskWidthInput.value = "";
    setFaithMaskParamsDisabled(true);
    return;
  }

  setFaithMaskParamsDisabled(false);
  if (faithMaskSelectionInput) faithMaskSelectionInput.value = formatFaithMaskSelection(selectedIndices);

  if (selectedIndices.length > 1) {
    if (faithMaskSelectedLabel) faithMaskSelectedLabel.textContent = `Đã chọn ${selectedIndices.length} ô che`;
    if (faithMaskPositionInput) {
      faithMaskPositionInput.value = "Nhiều vị trí";
      faithMaskPositionInput.disabled = true;
    }
    if (faithMaskLengthInput) faithMaskLengthInput.value = sameFaithMaskValue(selectedIndices, "h");
    if (faithMaskWidthInput) faithMaskWidthInput.value = sameFaithMaskValue(selectedIndices, "w");
    return;
  }

  const safeMask = clampFaithMask(faithAdminMasks[selectedIndices[0]]);
  if (faithMaskSelectedLabel) faithMaskSelectedLabel.textContent = `Ô che ${selectedIndices[0] + 1}`;
  if (faithMaskPositionInput) {
    faithMaskPositionInput.disabled = false;
    faithMaskPositionInput.value = `${formatFaithMaskNumber(safeMask.x)}, ${formatFaithMaskNumber(safeMask.y)}`;
  }
  if (faithMaskLengthInput) faithMaskLengthInput.value = formatFaithMaskNumber(safeMask.h);
  if (faithMaskWidthInput) faithMaskWidthInput.value = formatFaithMaskNumber(safeMask.w);
}

function selectFaithMask(index, additive = false) {
  if (!faithAdminMasks[index]) {
    selectedFaithMaskIndices = new Set();
  } else if (additive) {
    const nextSelection = new Set(selectedFaithMaskIndices);
    if (nextSelection.has(index)) {
      nextSelection.delete(index);
    } else {
      nextSelection.add(index);
    }
    selectedFaithMaskIndices = nextSelection;
  } else {
    selectedFaithMaskIndices = new Set([index]);
  }

  const selectedIndices = selectedFaithMaskList();
  selectedFaithMaskIndex = selectedIndices[0] ?? -1;
  faithMaskEditorLayer?.querySelectorAll(".faith-mask-editor-tile").forEach((tile) => {
    tile.classList.toggle("is-active", selectedFaithMaskIndices.has(Number(tile.dataset.index)));
  });
  syncFaithMaskParamsForm();
}

function parseFaithMaskSelection(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    throw new Error("Vui lòng nhập danh sách ô cần chọn. Ví dụ: 1,2,5 hoặc 1-12.");
  }

  const selected = new Set();
  raw.split(/[,;]+/).map((part) => part.trim()).filter(Boolean).forEach((part) => {
    const range = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      let start = Number(range[1]);
      let end = Number(range[2]);
      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        throw new Error("Danh sách ô không hợp lệ.");
      }
      if (start > end) [start, end] = [end, start];
      for (let number = start; number <= end; number += 1) {
        selected.add(number - 1);
      }
      return;
    }

    const number = Number(part);
    if (!Number.isInteger(number)) {
      throw new Error("Danh sách ô không hợp lệ.");
    }
    selected.add(number - 1);
  });

  const validSelection = [...selected]
    .filter((index) => index >= 0 && index < faithAdminMasks.length)
    .sort((a, b) => a - b);

  if (!validSelection.length) {
    throw new Error("Không tìm thấy ô che phù hợp với danh sách đã nhập.");
  }

  return validSelection;
}

function selectFaithMasksFromInput() {
  try {
    const indices = parseFaithMaskSelection(faithMaskSelectionInput?.value);
    selectedFaithMaskIndices = new Set(indices);
    selectedFaithMaskIndex = indices[0] ?? -1;
    renderFaithMaskEditor();
    if (faithDiscoveryMessage) {
      faithDiscoveryMessage.textContent = `Đã chọn ${indices.length} ô che từ danh sách. Nhập chiều dài/chiều rộng rồi bấm OK để áp dụng.`;
    }
  } catch (error) {
    if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = error.message;
  }
}

function parseFaithMaskPosition(value) {
  const parts = String(value || "").trim().split(/[,;\s]+/).filter(Boolean);
  if (parts.length !== 2) {
    throw new Error("Vui lòng nhập vị trí theo dạng X,Y. Ví dụ: 12, 25.");
  }
  const x = Number(parts[0]);
  const y = Number(parts[1]);
  if ([x, y].some((number) => Number.isNaN(number))) {
    throw new Error("Vị trí X,Y phải là số.");
  }
  return { x, y };
}

function applyFaithMaskParams() {
  const selectedIndices = selectedFaithMaskList();
  if (!selectedIndices.length) {
    if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = "Vui lòng chọn một hoặc nhiều ô che trước khi nhập thông số.";
    return;
  }

  try {
    const isMultiSelect = selectedIndices.length > 1;
    const heightRaw = String(faithMaskLengthInput?.value || "").trim();
    const widthRaw = String(faithMaskWidthInput?.value || "").trim();
    const height = heightRaw ? Number(heightRaw) : null;
    const width = widthRaw ? Number(widthRaw) : null;

    if (!height && !width) {
      throw new Error("Vui lòng nhập chiều dài hoặc chiều rộng cần áp dụng.");
    }
    if ([height, width].some((number) => number !== null && (Number.isNaN(number) || number <= 0))) {
      throw new Error("Chiều dài và chiều rộng phải là số lớn hơn 0.");
    }

    const position = isMultiSelect ? null : parseFaithMaskPosition(faithMaskPositionInput?.value);
    selectedIndices.forEach((index) => {
      const currentMask = clampFaithMask(faithAdminMasks[index]);
      faithAdminMasks[index] = clampFaithMask({
        x: position ? position.x : currentMask.x,
        y: position ? position.y : currentMask.y,
        w: width ?? currentMask.w,
        h: height ?? currentMask.h,
      });
    });
    renderFaithMaskEditor();
    if (faithDiscoveryMessage) {
      const countText = selectedIndices.length === 1 ? `ô che ${selectedIndices[0] + 1}` : `${selectedIndices.length} ô che`;
      faithDiscoveryMessage.textContent = `Đã cập nhật thông số ${countText}. Bấm Lưu bộ câu hỏi để lưu thay đổi.`;
    }
  } catch (error) {
    if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = error.message;
  }
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
    
    pickerImageUrl: cleanFaithPickerImageUrl(set?.pickerImageUrl),
    bannerImageUrl: String(set?.bannerImageUrl || "").trim(),
    infographicUrl: String(set?.infographicUrl || "").trim(),
    masks: normalizeFaithMasks(set?.masks),
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
        
        pickerImageUrl: cleanFaithPickerImageUrl(settings?.pickerImageUrl),
        bannerImageUrl: String(settings?.bannerImageUrl || "").trim(),
        infographicUrl: String(settings?.infographicUrl || "").trim(),
        masks: normalizeFaithMasks(settings?.masks),
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
  if (faithBannerImageUrl) faithBannerImageUrl.value = "";
  faithInfographicUrl.value = selectedSet?.infographicUrl || "";
  faithAdminMasks = normalizeFaithMasks(selectedSet?.masks);
  selectedFaithMaskIndex = faithAdminMasks.length ? 0 : -1;
    selectedFaithMaskIndices = faithAdminMasks.length ? new Set([0]) : new Set();
  if (faithMaskCount) {
    faithMaskCount.value = faithAdminMasks.length || selectedSet?.questions?.length || "";
  }
  faithQuestionsJson.value = stringifyFaithQuestions(selectedSet?.questions || []);
  
  updateFaithPickerPreview();
  updateFaithBannerPreview();
  updateFaithImagePreview();
  renderFaithMaskEditor();
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
  renderFaithMaskEditor();
}

function resizeFaithMaskByDirection(original, dx, dy, direction = "se") {
  const minSize = 3;
  let left = original.x;
  let top = original.y;
  let right = original.x + original.w;
  let bottom = original.y + original.h;
  const resizeDirection = String(direction || "se");

  if (resizeDirection.includes("e")) {
    right = Math.max(left + minSize, Math.min(100, right + dx));
  }
  if (resizeDirection.includes("s")) {
    bottom = Math.max(top + minSize, Math.min(100, bottom + dy));
  }
  if (resizeDirection.includes("w")) {
    left = Math.min(right - minSize, Math.max(0, left + dx));
  }
  if (resizeDirection.includes("n")) {
    top = Math.min(bottom - minSize, Math.max(0, top + dy));
  }

  return {
    x: left,
    y: top,
    w: right - left,
    h: bottom - top,
  };
}

function updateFaithMaskFromPointer(event) {
  if (!activeFaithMaskDrag || !faithMaskEditorLayer) return;
  event.preventDefault();
  const rect = faithMaskEditorLayer.getBoundingClientRect();
  const dx = ((event.clientX - activeFaithMaskDrag.startX) / rect.width) * 100;
  const dy = ((event.clientY - activeFaithMaskDrag.startY) / rect.height) * 100;
  const original = activeFaithMaskDrag.original;
  const next =
    activeFaithMaskDrag.mode === "resize"
      ? resizeFaithMaskByDirection(original, dx, dy, activeFaithMaskDrag.direction)
      : {
          ...original,
          x: original.x + dx,
          y: original.y + dy,
        };
  faithAdminMasks[activeFaithMaskDrag.index] = clampFaithMask(next);
  renderFaithMaskEditor();
}

function stopFaithMaskDrag() {
  activeFaithMaskDrag = null;
  window.removeEventListener("pointermove", updateFaithMaskFromPointer);
  window.removeEventListener("pointerup", stopFaithMaskDrag);
}

function startFaithMaskDrag(event, index, mode, direction = "") {
  if (!faithAdminMasks[index]) return;
  event.preventDefault();
  event.stopPropagation();
  if (mode === "move" && (event.ctrlKey || event.metaKey)) {
    selectFaithMask(index, true);
    return;
  }
  selectFaithMask(index);
  activeFaithMaskDrag = {
    index,
    mode,
    direction,
    startX: event.clientX,
    startY: event.clientY,
    original: { ...faithAdminMasks[index] },
  };
  window.addEventListener("pointermove", updateFaithMaskFromPointer);
  window.addEventListener("pointerup", stopFaithMaskDrag);
}

function renderFaithMaskEditor() {
  if (!faithMaskEditor || !faithMaskEditorImage || !faithMaskEditorLayer || !faithInfographicUrl) return;
  const imageUrl = faithInfographicUrl.value.trim();
  if (!imageUrl) {
    faithMaskEditor.classList.remove("show");
    faithMaskEditorImage.removeAttribute("src");
    faithMaskEditorLayer.innerHTML = "";
    selectedFaithMaskIndex = -1;
    selectedFaithMaskIndices = new Set();
    syncFaithMaskParamsForm();
    return;
  }

  faithMaskEditor.classList.add("show");
  faithMaskEditorImage.src = imageUrl;
  const validSelection = selectedFaithMaskList();
  if (!faithAdminMasks.length) {
    selectedFaithMaskIndex = -1;
    selectedFaithMaskIndices = new Set();
  } else if (!validSelection.length) {
    selectedFaithMaskIndex = 0;
    selectedFaithMaskIndices = new Set([0]);
  } else {
    selectedFaithMaskIndex = validSelection[0];
    selectedFaithMaskIndices = new Set(validSelection);
  }
  const resizeHandles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"]
    .map(
      (direction) =>
        `<i class="faith-mask-editor-handle faith-mask-editor-handle-${direction}" data-resize="${direction}" aria-hidden="true"></i>`
    )
    .join("");

  faithMaskEditorLayer.innerHTML = faithAdminMasks
    .map((mask, index) => {
      const safeMask = clampFaithMask(mask);
      return `
        <button
          class="faith-mask-editor-tile ${selectedFaithMaskIndices.has(index) ? "is-active" : ""}"
          type="button"
          data-index="${index}"
          style="left:${safeMask.x}%;top:${safeMask.y}%;width:${safeMask.w}%;height:${safeMask.h}%"
          aria-label="Vùng che ${index + 1}"
        >
          <span class="faith-mask-editor-number">${index + 1}</span>
          <span class="faith-mask-editor-meta">
            X:${formatFaithMaskNumber(safeMask.x)} Y:${formatFaithMaskNumber(safeMask.y)}<br />
            D:${formatFaithMaskNumber(safeMask.h)} R:${formatFaithMaskNumber(safeMask.w)}
          </span>
          <em class="faith-mask-editor-delete" role="button" tabindex="0" aria-label="Xóa vùng che ${index + 1}">×</em>
          ${resizeHandles}
        </button>
      `;
    })
    .join("");

  faithMaskEditorLayer.querySelectorAll(".faith-mask-editor-tile").forEach((tile) => {
    const index = Number(tile.dataset.index);
    tile.addEventListener("pointerdown", (event) => startFaithMaskDrag(event, index, "move"));
    tile.querySelectorAll("[data-resize]").forEach((handle) => {
      handle.addEventListener("pointerdown", (event) =>
        startFaithMaskDrag(event, index, "resize", handle.dataset.resize || "se")
      );
    });
    const deleteButton = tile.querySelector(".faith-mask-editor-delete");
    const deleteMask = (event) => {
      event.preventDefault();
      event.stopPropagation();
      faithAdminMasks.splice(index, 1);
      const nextSelection = [...selectedFaithMaskIndices]
        .filter((selectedIndex) => selectedIndex !== index)
        .map((selectedIndex) => (selectedIndex > index ? selectedIndex - 1 : selectedIndex))
        .filter((selectedIndex) => Boolean(faithAdminMasks[selectedIndex]));
      if (!nextSelection.length && faithAdminMasks.length) {
        nextSelection.push(Math.min(index, faithAdminMasks.length - 1));
      }
      selectedFaithMaskIndices = new Set(nextSelection);
      selectedFaithMaskIndex = nextSelection[0] ?? -1;
      renderFaithMaskEditor();
      if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = `Đã xóa vùng che ${index + 1}. Bấm Lưu bộ câu hỏi để lưu thay đổi.`;
    };
    deleteButton?.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    deleteButton?.addEventListener("click", deleteMask);
    deleteButton?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") deleteMask(event);
    });
  });
  syncFaithMaskParamsForm();
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

function defaultJourneyAdminTopic() {
  return {
    id: "",
    title: "",
    label: "",
    description: "",
    enabled: true,
    mapType: "jesus",
    mapName: "",
    mapImageUrl: "",
    mapPositionsEdited: false,
    pickerImageUrl: "",
    milestones: [],
    challenges: {},
  };
}

function uniqueJourneyTopicId() {
  return `journey-topic-${Date.now()}`;
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function parseJourneyJson(value, fallback, label) {
  const rawValue = String(value || "").trim();
  if (!rawValue) return cloneJson(fallback);
  try {
    return JSON.parse(rawValue);
  } catch (error) {
    throw new Error(`${label} không đúng định dạng JSON: ${error.message}`);
  }
}

function normalizeAdminJourneyMilestone(milestone, index = 0) {
  const number = Number(milestone?.number || index + 1);
  if (!Number.isFinite(number) || number <= 0) return null;
  const normalized = {
    number,
    title: String(milestone?.title || `Cột mốc ${number}`).trim(),
    reference: String(milestone?.reference || "").trim(),
    region: String(milestone?.region || "").trim(),
    scene: String(milestone?.scene || "").trim(),
    story: String(milestone?.story || "").trim(),
    lesson: String(milestone?.lesson || "").trim(),
    cardImageUrl: String(milestone?.cardImageUrl || "").trim(),
    relatedArticleUrl: String(milestone?.relatedArticleUrl || milestone?.relatedUrl || "").trim(),
  };

  const x = Number(milestone?.x);
  const y = Number(milestone?.y);
  if (Number.isFinite(x)) normalized.x = x;
  if (Number.isFinite(y)) normalized.y = y;
  return normalized;
}

function normalizeAdminJourneyChallenge(challenge = {}) {
  const rewardPoints = Number(challenge.rewardPoints);
  const normalized = {
    title: String(challenge.title || "").trim(),
    instruction: String(challenge.instruction || "").trim(),
    verse: String(challenge.verse || "").trim(),
    verseRef: String(challenge.verseRef || "").trim(),
    sceneImageUrl: String(challenge.sceneImageUrl || "").trim(),
    targets: Array.isArray(challenge.targets) ? challenge.targets : [],
    options: Array.isArray(challenge.options) ? challenge.options : [],
  };
  if (Number.isFinite(rewardPoints) && rewardPoints >= 0) normalized.rewardPoints = rewardPoints;
  return normalized;
}

function normalizeAdminJourneyTopic(topic, index = 0) {
  const fallback = defaultJourneyAdminTopic();
  const rawTopic = topic || fallback;
  const mapType = detectAdminJourneyMapType(rawTopic);
  const preferSavedMapPositions = rawTopic.mapPositionsEdited === true || mapType === "custom";
  const rawMilestones = Array.isArray(rawTopic.milestones)
    ? rawTopic.milestones.map(normalizeAdminJourneyMilestone).filter(Boolean).sort((a, b) => a.number - b.number)
    : [];
  const milestones = applyJourneyDefaultMapPositions(rawMilestones, mapType, preferSavedMapPositions);
  const rawChallenges = rawTopic.challenges && typeof rawTopic.challenges === "object" ? rawTopic.challenges : {};
  const challenges = Object.fromEntries(
    Object.entries(rawChallenges)
      .filter(([key]) => Number.isFinite(Number(key)))
      .map(([key, value]) => [String(Number(key)), normalizeAdminJourneyChallenge(value)])
  );

  return {
    id: String(rawTopic.id || uniqueJourneyTopicId()).trim(),
    title: String(rawTopic.title || `Chủ đề ${index + 1}`).trim(),
    label: String(rawTopic.label || "").trim(),
    description: String(rawTopic.description || "").trim(),
    enabled: rawTopic.enabled !== false,
    mapType,
    mapName: String(rawTopic.mapName || "").trim(),
    mapImageUrl: String(rawTopic.mapImageUrl || defaultJourneyAdminMapImageForType(mapType) || "").trim(),
    mapPositionsEdited: rawTopic.mapPositionsEdited === true,
    pickerImageUrl: String(rawTopic.pickerImageUrl || "").trim(),
    milestones,
    challenges,
  };
}

function settingsToAdminJourneyTopics(settings) {
  const topics = Array.isArray(settings?.topics) ? settings.topics : [];
  if (topics.length) return topics.map(normalizeAdminJourneyTopic);
  return [];
}

function selectedJourneyTopic() {
  return journeyBibleTopics.find((topic) => topic.id === activeJourneyTopicId) || null;
}

function parseJourneyMilestonesFromForm() {
  return currentJourneyMilestones.map(normalizeAdminJourneyMilestone).filter(Boolean).sort((a, b) => a.number - b.number);
}

function getExistingChallengesForActiveTopic() {
  const topic = journeyBibleTopics.find((item) => item.id === activeJourneyTopicId);
  return topic && topic.challenges && typeof topic.challenges === "object" ? topic.challenges : {};
}

function stringifyJourneyData(value) {
  return JSON.stringify(value || {}, null, 2);
}

function normalizeJourneyAdminText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[-_]+/g, " ")
    .toLowerCase();
}

function detectAdminJourneyMapType(topic = {}) {
  const explicitText = normalizeJourneyAdminText(topic.mapType || topic.mapKey || topic.mapId || "");
  const idText = normalizeJourneyAdminText(topic.id || "");
  const imageText = normalizeJourneyAdminText(topic.mapImageUrl || "");
  const titleText = normalizeJourneyAdminText(topic.title || "");
  const haystacks = [explicitText, idText, imageText, titleText];
  const match = (...patterns) => haystacks.some((text) => patterns.some((pattern) => text.includes(pattern)));

  if (explicitText === "custom" || explicitText.includes("tuy chinh")) return "custom";
  if (match("exodus", "xuat hanh", "mo se", "mose", "moses")) return "exodus";
  if (match("creation", "chua tao dung troi dat", "tao dung", "sang the")) return "creation";
  if (match("stations", "14 chang dang thanh gia", "14 chan dang thanh gia", "dang thanh gia", "cross")) return "stations";
  if (match("miracles", "chua lam phep la", "cac phep la", "phep la")) return "miracles";
  return "jesus";
}

function journeyAdminMapPositionsForType(mapType) {
  return journeyAdminMapPositionsByType[mapType] || [];
}

function journeyGeneratedPositionForNumber(number) {
  const numericNumber = Math.max(1, Number(number) || 1);
  const column = (numericNumber - 1) % 4;
  const row = Math.floor((numericNumber - 1) / 4);
  return {
    x: Math.min(90, 18 + column * 21),
    y: Math.min(92, 12 + row * 12),
  };
}

function journeyDefaultPositionForMapType(number, mapType) {
  const numericNumber = Math.max(1, Number(number) || 1);
  const positions = journeyAdminMapPositionsForType(mapType);
  return positions[numericNumber - 1] || journeyGeneratedPositionForNumber(numericNumber);
}

function defaultJourneyAdminMapImageForType(mapType) {
  return journeyAdminDefaultMapImages[mapType] || "";
}

function updateJourneyMapTypeCustomLabel(mapName = "") {
  const customOption = journeyTopicMapType?.querySelector('option[value="custom"]');
  if (!customOption) return;
  customOption.textContent = String(mapName || "").trim() || "Bản đồ tùy chỉnh";
}

function selectedJourneyAdminMapType() {
  const activeTopic = selectedJourneyTopic() || {};
  return detectAdminJourneyMapType({
    ...activeTopic,
    id: journeyTopicId?.value || activeTopic.id || activeJourneyTopicId || "",
    title: journeyTopicTitle?.value || activeTopic.title || "",
    mapType: journeyTopicMapType?.value || activeTopic.mapType || "",
    mapImageUrl: journeyMapImageUrl?.value || activeTopic.mapImageUrl || "",
  });
}

function applyJourneyDefaultMapPositions(milestones, mapType, preferSavedPositions = false) {
  return (Array.isArray(milestones) ? milestones : [])
    .map((milestone, index) => {
      const number = Number(milestone?.number || index + 1);
      const defaultPosition = journeyDefaultPositionForMapType(number, mapType);
      const savedX = Number(milestone?.x);
      const savedY = Number(milestone?.y);
      return normalizeAdminJourneyMilestone({
        ...milestone,
        number,
        x: preferSavedPositions && Number.isFinite(savedX) ? savedX : defaultPosition.x,
        y: preferSavedPositions && Number.isFinite(savedY) ? savedY : defaultPosition.y,
      }, index);
    })
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);
}
function renderJourneyTopicList() {
  if (!journeyTopicList) return;
  if (!journeyBibleTopics.length) {
    journeyTopicList.innerHTML = `<p class="admin-empty-note">Chưa có chủ đề nào. Bấm Tạo chủ đề mới để bắt đầu.</p>`;
    return;
  }

  journeyTopicList.innerHTML = journeyBibleTopics
    .map(
      (topic) => `
        <button class="${topic.id === activeJourneyTopicId ? "active" : ""}" type="button" data-id="${escapeHtml(topic.id)}">
          <strong>${escapeHtml(topic.title)}</strong>
          <small>${topic.milestones.length} cột mốc</small>
        </button>
      `
    )
    .join("");
}

function updateJourneyImagePreview(input, preview) {
  if (!input || !preview) return;
  const imageUrl = input.value.trim();
  if (imageUrl) {
    preview.src = imageUrl;
    preview.classList.add("show");
  } else {
    preview.removeAttribute("src");
    preview.classList.remove("show");
  }
}

function updateJourneyPickerPreview() {
  updateJourneyImagePreview(journeyPickerImageUrl, journeyPickerPreview);
}

function updateJourneyMapCardPreview() {
  updateJourneyImagePreview(journeyMapCardImageUrl, journeyMapCardPreview);
}

function formatJourneyMapPercent(value) {
  const number = Number(value);
  return Number.isFinite(number) ? String(Math.round(number * 10) / 10) : "";
}

function clampJourneyMapPercent(value, fallback = 50) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(100, Math.max(0, Math.round(number * 10) / 10));
}

function journeyMilestoneMaxNumber(milestones) {
  return (Array.isArray(milestones) ? milestones : []).reduce((max, milestone, index) => {
    const number = Number(milestone?.number || index + 1);
    return Number.isFinite(number) ? Math.max(max, number) : max;
  }, 0);
}

function syncJourneyMapPointCountField() {
  if (!journeyMapPointCount) return;
  const milestones = parseJourneyMilestonesFromForm();
  const count = journeyMilestoneMaxNumber(milestones) || milestones.length;
  journeyMapPointCount.value = count ? String(count) : "";
}

function renderJourneyMapPointSelect(selectedNumber = selectedJourneyMapPointNumber) {
  if (!journeyMapPointSelect) return;
  const milestones = parseJourneyMilestonesFromForm();
  if (!milestones.length) {
    journeyMapPointSelect.innerHTML = `<option value="">Chưa có vòng tròn</option>`;
    return;
  }
  journeyMapPointSelect.innerHTML = milestones
    .map((milestone) => `<option value="${milestone.number}">${milestone.number}. ${escapeHtml(milestone.title || `Cột mốc ${milestone.number}`)}</option>`)
    .join("");
  if (selectedNumber) journeyMapPointSelect.value = String(selectedNumber);
}

function syncJourneyMapPointInputs(number = selectedJourneyMapPointNumber) {
  const milestones = parseJourneyMilestonesFromForm();
  const selected = milestones.find((milestone) => milestone.number === Number(number)) || milestones[0] || null;
  if (selected) selectedJourneyMapPointNumber = Number(selected.number);
  if (journeyMapPointX) journeyMapPointX.value = selected ? formatJourneyMapPercent(selected.x) : "";
  if (journeyMapPointY) journeyMapPointY.value = selected ? formatJourneyMapPercent(selected.y) : "";
  if (journeyMapPointSelect && selected) journeyMapPointSelect.value = String(selected.number);
}

function renderJourneyMapEditor() {
  if (!journeyMapEditor) return;
  const mapType = selectedJourneyAdminMapType();
  const imageUrl = String(journeyMapImageUrl?.value || defaultJourneyAdminMapImageForType(mapType) || "").trim();
  const hasImage = Boolean(imageUrl);
  journeyMapEditor.classList.toggle("is-empty", !hasImage);
  if (journeyMapEditorImage) {
    if (hasImage) {
      journeyMapEditorImage.src = imageUrl;
      journeyMapEditorImage.hidden = false;
    } else {
      journeyMapEditorImage.removeAttribute("src");
      journeyMapEditorImage.hidden = true;
    }
  }
  if (journeyMapEmptyNote) journeyMapEmptyNote.hidden = hasImage;
  const milestones = parseJourneyMilestonesFromForm();
  if (journeyMapMarkerLayer) {
    journeyMapMarkerLayer.innerHTML = hasImage
      ? milestones.map((milestone) => {
          const selected = Number(milestone.number) === Number(selectedJourneyMapPointNumber);
          return `<button class="journey-map-marker${selected ? " active" : ""}" type="button" data-number="${milestone.number}" style="left: ${formatJourneyMapPercent(milestone.x)}%; top: ${formatJourneyMapPercent(milestone.y)}%;" aria-label="Vòng tròn ${milestone.number}">${milestone.number}</button>`;
        }).join("")
      : "";
  }
  syncJourneyMapPointCountField();
  renderJourneyMapPointSelect(selectedJourneyMapPointNumber);
  syncJourneyMapPointInputs(selectedJourneyMapPointNumber);
}

function applyJourneyMapPointCountFromField(options = {}) {
  const silent = Boolean(options.silent);
  const count = Number(journeyMapPointCount?.value);
  if (!Number.isFinite(count) || count <= 0) return;
  const targetCount = Math.max(1, Math.min(99, Math.round(count)));
  const mapType = selectedJourneyAdminMapType();
  const milestones = parseJourneyMilestonesFromForm();
  const byNumber = new Map(milestones.map((milestone) => [Number(milestone.number), milestone]));
  const nextMilestones = [];
  for (let number = 1; number <= targetCount; number += 1) {
    const existing = byNumber.get(number) || {};
    const defaultPosition = journeyDefaultPositionForMapType(number, mapType);
    nextMilestones.push(normalizeAdminJourneyMilestone({
      ...existing,
      number,
      title: existing.title || `Cột mốc ${number}`,
      x: Number.isFinite(Number(existing.x)) ? Number(existing.x) : defaultPosition.x,
      y: Number.isFinite(Number(existing.y)) ? Number(existing.y) : defaultPosition.y,
    }));
  }
  currentJourneyMilestones = nextMilestones.filter(Boolean);
  selectedJourneyMapPointNumber = Math.min(selectedJourneyMapPointNumber || 1, targetCount);
  renderJourneyMilestoneSelect(selectedJourneyMapPointNumber);
  fillJourneyMilestoneForm(selectedJourneyMapPointNumber);
  renderJourneyMapEditor();
  if (!silent && journeyBibleMessage) journeyBibleMessage.textContent = `Đã tạo ${targetCount} vòng tròn cột mốc. Kéo trên bản đồ hoặc nhập X/Y rồi bấm Lưu Hành trình Kinh Thánh.`;
}

function updateJourneyMapPointPosition(number, x, y) {
  const numericNumber = Number(number);
  if (!Number.isFinite(numericNumber) || numericNumber <= 0) return;
  const milestones = parseJourneyMilestonesFromForm();
  const existing = milestones.find((milestone) => milestone.number === numericNumber) || { number: numericNumber, title: `Cột mốc ${numericNumber}` };
  const fallback = journeyDefaultPositionForMapType(numericNumber, selectedJourneyAdminMapType());
  const nextX = clampJourneyMapPercent(x, fallback.x);
  const nextY = clampJourneyMapPercent(y, fallback.y);
  const nextMilestone = normalizeAdminJourneyMilestone({
    ...existing,
    number: numericNumber,
    x: nextX,
    y: nextY,
  });
  currentJourneyMilestones = milestones
    .filter((milestone) => milestone.number !== numericNumber)
    .concat(nextMilestone)
    .sort((a, b) => a.number - b.number);
  selectedJourneyMapPointNumber = numericNumber;
  if (journeyMapPointX) journeyMapPointX.value = formatJourneyMapPercent(nextX);
  if (journeyMapPointY) journeyMapPointY.value = formatJourneyMapPercent(nextY);
  if (journeyMapPointSelect) journeyMapPointSelect.value = String(numericNumber);
  const marker = journeyMapMarkerLayer?.querySelector(`[data-number="${numericNumber}"]`);
  if (marker) {
    marker.style.left = `${formatJourneyMapPercent(nextX)}%`;
    marker.style.top = `${formatJourneyMapPercent(nextY)}%`;
  }
}

function journeyMapPointFromEvent(event) {
  if (!journeyMapEditor) return null;
  const rect = journeyMapEditor.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return {
    x: clampJourneyMapPercent(((event.clientX - rect.left) / rect.width) * 100),
    y: clampJourneyMapPercent(((event.clientY - rect.top) / rect.height) * 100),
  };
}

function renderJourneyMilestoneSelect(selectedNumber) {
  if (!journeyMilestoneSelect) return;
  const milestones = parseJourneyMilestonesFromForm();
  if (!milestones.length) {
    journeyMilestoneSelect.innerHTML = `
      <option value="">Chưa có cột mốc</option>
      <option value="__new__">+ Tạo cột mốc mới</option>
    `;
    return;
  }

  journeyMilestoneSelect.innerHTML = milestones
    .map((milestone) => `<option value="${milestone.number}">${escapeHtml(milestone.title)}</option>`)
    .concat(`<option value="__new__">+ Tạo cột mốc mới</option>`)
    .join("");
  if (selectedNumber) journeyMilestoneSelect.value = String(selectedNumber);
}

function journeyDefaultPositionForNumber(number) {
  return journeyDefaultPositionForMapType(number, selectedJourneyAdminMapType());
}

function fillJourneyMilestoneForm(number) {
  if (!journeyBibleForm) return;
  const milestones = parseJourneyMilestonesFromForm();
  const milestone = milestones.find((item) => item.number === Number(number)) || milestones[0] || null;
  journeyMilestoneNumber.value = milestone?.number || "";
  journeyMilestoneTitle.value = milestone?.title || "";
  journeyMilestoneReference.value = milestone?.reference || "";
  journeyMilestoneRegion.value = milestone?.region || "";
  journeyMilestoneStory.value = milestone?.story || "";
  journeyMilestoneLesson.value = milestone?.lesson || "";
  journeyMapCardImageUrl.value = milestone?.cardImageUrl || "";
  if (journeyMilestoneRelatedUrl) journeyMilestoneRelatedUrl.value = milestone?.relatedArticleUrl || "";
  selectedJourneyMapPointNumber = Number(milestone?.number || selectedJourneyMapPointNumber || 1);
  updateJourneyMapCardPreview();
  renderJourneyMapEditor();
}

function fillJourneyTopicForm(topic) {
  if (!journeyBibleForm) return;
  const selectedTopic = topic || defaultJourneyAdminTopic();
  const normalizedTopic = normalizeAdminJourneyTopic(selectedTopic);
  activeJourneyTopicId = normalizedTopic.id;
  journeyTopicId.value = normalizedTopic.id;
  journeyTopicTitle.value = normalizedTopic.title;
  journeyTopicLabel.value = normalizedTopic.label;
  if (journeyMapName) journeyMapName.value = normalizedTopic.mapName || "";
  updateJourneyMapTypeCustomLabel(normalizedTopic.mapName);
  if (journeyTopicMapType) journeyTopicMapType.value = normalizedTopic.mapType || "jesus";
  journeyTopicEnabled.value = normalizedTopic.enabled ? "true" : "false";
  journeyTopicDescription.value = normalizedTopic.description;
  journeyPickerImageUrl.value = normalizedTopic.pickerImageUrl;
  if (journeyMapImageUrl) journeyMapImageUrl.value = normalizedTopic.mapImageUrl || defaultJourneyAdminMapImageForType(normalizedTopic.mapType);
  currentJourneyMilestones = normalizedTopic.milestones;
  selectedJourneyMapPointNumber = normalizedTopic.milestones[0]?.number || 1;
  updateJourneyPickerPreview();
  syncJourneyMapPointCountField();
  renderJourneyMilestoneSelect(normalizedTopic.milestones[0]?.number);
  fillJourneyMilestoneForm(normalizedTopic.milestones[0]?.number);
  renderJourneyMapEditor();
  renderJourneyTopicList();
}

async function loadJourneyBibleAdmin() {
  if (!journeyBibleForm) return;
  try {
    const settings = typeof getJourneyBibleSettings === "function" ? await getJourneyBibleSettings() : null;
    journeyBibleTopics = settingsToAdminJourneyTopics(settings);
    const activeTopic = journeyBibleTopics.find((topic) => topic.id === settings?.activeTopicId) || journeyBibleTopics[0] || defaultJourneyAdminTopic();
    fillJourneyTopicForm(activeTopic);
    if (journeyBibleMessage) {
      journeyBibleMessage.textContent = journeyBibleTopics.length
        ? `Đã tải ${journeyBibleTopics.length} chủ đề Hành trình Kinh Thánh.`
        : "Chưa có chủ đề Hành trình Kinh Thánh. Hãy tạo chủ đề và cột mốc mới để bắt đầu.";
    }
  } catch (error) {
    if (journeyBibleMessage) journeyBibleMessage.textContent = error.message;
  }
}

function updateJourneyMilestoneFromFields(options = {}) {
  const silent = Boolean(options.silent);
  try {
    const milestones = parseJourneyMilestonesFromForm();
    const number = Number(journeyMilestoneNumber?.value || journeyMilestoneSelect?.value);
    if (!Number.isFinite(number) || number <= 0) throw new Error("Vui lòng nhập số cột mốc hợp lệ.");
    const existing = milestones.find((item) => item.number === number) || {};
    const defaultPosition = journeyDefaultPositionForNumber(number);
    const inputX = Number(selectedJourneyMapPointNumber === number ? journeyMapPointX?.value : NaN);
    const inputY = Number(selectedJourneyMapPointNumber === number ? journeyMapPointY?.value : NaN);
    const existingX = Number(existing.x);
    const existingY = Number(existing.y);
    const nextMilestone = normalizeAdminJourneyMilestone({
      ...existing,
      number,
      title: journeyMilestoneTitle.value.trim() || existing.title || `Cột mốc ${number}`,
      reference: journeyMilestoneReference.value.trim(),
      region: journeyMilestoneRegion.value.trim(),
      story: journeyMilestoneStory.value.trim(),
      lesson: journeyMilestoneLesson.value.trim(),
      cardImageUrl: journeyMapCardImageUrl.value.trim(),
      relatedArticleUrl: journeyMilestoneRelatedUrl?.value.trim() || "",
      x: Number.isFinite(inputX) ? clampJourneyMapPercent(inputX, defaultPosition.x) : Number.isFinite(existingX) ? existingX : defaultPosition.x,
      y: Number.isFinite(inputY) ? clampJourneyMapPercent(inputY, defaultPosition.y) : Number.isFinite(existingY) ? existingY : defaultPosition.y,
    });
    const nextMilestones = milestones.filter((item) => item.number !== number).concat(nextMilestone).sort((a, b) => a.number - b.number);
    currentJourneyMilestones = nextMilestones;
    selectedJourneyMapPointNumber = number;
    renderJourneyMilestoneSelect(number);
    if (journeyMilestoneSelect) journeyMilestoneSelect.value = String(number);
    renderJourneyMapEditor();
    if (!silent && journeyBibleMessage) journeyBibleMessage.textContent = `Đã cập nhật cột mốc ${number}. Bấm Lưu Hành trình Kinh Thánh để lưu Firestore.`;
  } catch (error) {
    if (!silent && journeyBibleMessage) journeyBibleMessage.textContent = error.message;
  }
}

function startNewJourneyMilestone(useTypedNumber = true) {
  try {
    const milestones = parseJourneyMilestonesFromForm();
    const typedNumber = Number(journeyMilestoneNumber?.value);
    const nextNumber = useTypedNumber && Number.isFinite(typedNumber) && typedNumber > 0
      ? typedNumber
      : milestones.reduce((max, milestone) => Math.max(max, Number(milestone.number) || 0), 0) + 1;
    const existing = milestones.find((milestone) => milestone.number === nextNumber);
    if (existing) {
      renderJourneyMilestoneSelect(nextNumber);
      fillJourneyMilestoneForm(nextNumber);
      if (journeyBibleMessage) journeyBibleMessage.textContent = `Cột mốc ${nextNumber} đã có. Hệ thống đã mở cột mốc này để bạn chỉnh sửa.`;
      return;
    }
    const defaultPosition = journeyDefaultPositionForNumber(nextNumber);
    const nextMilestone = normalizeAdminJourneyMilestone({
      number: nextNumber,
      title: `Cột mốc ${nextNumber}`,
      reference: "",
      region: "",
      story: "",
      lesson: "",
      x: defaultPosition.x,
      y: defaultPosition.y,
    });
    currentJourneyMilestones = milestones.concat(nextMilestone).sort((a, b) => a.number - b.number);
    selectedJourneyMapPointNumber = nextNumber;
    syncJourneyMapPointCountField();
    renderJourneyMilestoneSelect(nextNumber);
    journeyMilestoneNumber.value = String(nextNumber);
    journeyMilestoneTitle.value = "";
    journeyMilestoneReference.value = "";
    journeyMilestoneRegion.value = "";
    journeyMilestoneStory.value = "";
    journeyMilestoneLesson.value = "";
    journeyMapCardImageUrl.value = "";
    if (journeyMilestoneRelatedUrl) journeyMilestoneRelatedUrl.value = "";
    updateJourneyMapCardPreview();
    renderJourneyMapEditor();
    journeyMilestoneTitle.focus();
    if (journeyBibleMessage) journeyBibleMessage.textContent = `Đang tạo cột mốc ${nextNumber}. Nhập nội dung rồi bấm Lưu Hành trình Kinh Thánh.`;
  } catch (error) {
    if (journeyBibleMessage) journeyBibleMessage.textContent = error.message;
  }
}

function deleteJourneyMilestoneFromFields() {
  try {
    const milestones = parseJourneyMilestonesFromForm();
    const number = Number(journeyMilestoneNumber?.value || journeyMilestoneSelect?.value);
    if (!Number.isFinite(number) || number <= 0) throw new Error("Vui lòng chọn cột mốc cần xóa.");
    const existing = milestones.find((item) => item.number === number);
    if (!existing) throw new Error(`Không tìm thấy cột mốc ${number} trong ô dữ liệu.`);
    if (!confirm(`Xóa cột mốc ${number}. ${existing.title || ""}?`)) return;

    const nextMilestones = milestones.filter((item) => item.number !== number);
    currentJourneyMilestones = nextMilestones;
    const nextSelectedNumber = nextMilestones[0]?.number || "";
    selectedJourneyMapPointNumber = nextSelectedNumber || 1;
    syncJourneyMapPointCountField();
    renderJourneyMilestoneSelect(nextSelectedNumber);
    fillJourneyMilestoneForm(nextSelectedNumber);
    renderJourneyMapEditor();
    if (journeyBibleMessage) journeyBibleMessage.textContent = `Đã xóa cột mốc ${number}. Bấm Lưu Hành trình Kinh Thánh để lưu Firestore.`;
  } catch (error) {
    if (journeyBibleMessage) journeyBibleMessage.textContent = error.message;
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

function openJourneyCloudinaryUpload(targetInput, afterUpload, successMessage) {
  if (!targetInput) return;
  if (!canManageContent) {
    alert("Chỉ tài khoản admin mới có quyền upload ảnh.");
    return;
  }

  const config = getCloudinaryConfig();
  if (!config.cloudName || !config.uploadPreset) {
    if (journeyBibleMessage) {
      journeyBibleMessage.textContent = "Chưa cấu hình Cloudinary. Hãy điền cloudName và uploadPreset trong cloudinary-config.js.";
    }
    return;
  }

  if (!window.cloudinary?.createUploadWidget) {
    if (journeyBibleMessage) {
      journeyBibleMessage.textContent = "Không thể tải Cloudinary Upload Widget. Vui lòng kiểm tra kết nối mạng.";
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
        if (journeyBibleMessage) journeyBibleMessage.textContent = error.message || "Upload Cloudinary thất bại.";
        return;
      }

      if (result?.event === "success") {
        targetInput.value = result.info?.secure_url || "";
        afterUpload?.();
        if (journeyBibleMessage) journeyBibleMessage.textContent = successMessage;
      }
    }
  );

  widget.open();
}

function setupJourneyCloudinaryUpload() {
  journeyPickerUploadButton?.addEventListener("click", () => {
    openJourneyCloudinaryUpload(
      journeyPickerImageUrl,
      updateJourneyPickerPreview,
      "Đã upload Cloudinary và tự điền ảnh khung chọn chủ đề."
    );
  });

  journeyMapCardUploadButton?.addEventListener("click", () => {
    openJourneyCloudinaryUpload(
      journeyMapCardImageUrl,
      updateJourneyMapCardPreview,
      "Đã upload Cloudinary và tự điền ảnh panel cột mốc. Bấm Lưu Hành trình Kinh Thánh để áp dụng."
    );
  });

  journeyMapUploadButton?.addEventListener("click", () => {
    openJourneyCloudinaryUpload(
      journeyMapImageUrl,
      renderJourneyMapEditor,
      "Đã upload Cloudinary và tự điền ảnh bản đồ. Kéo vòng tròn rồi bấm Lưu Hành trình Kinh Thánh để áp dụng."
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
    await loadJourneyBibleAdmin();
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
applyFaithMaskParamsButton?.addEventListener("click", applyFaithMaskParams);
selectFaithMaskListButton?.addEventListener("click", selectFaithMasksFromInput);
faithMaskSelectionInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    selectFaithMasksFromInput();
  }
});
faithMaskPositionInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") applyFaithMaskParams();
});
faithMaskLengthInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") applyFaithMaskParams();
});
faithMaskWidthInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") applyFaithMaskParams();
});

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
  if (faithBannerImageUrl) faithBannerImageUrl.value = "";
  faithInfographicUrl.value = "";
  faithAdminMasks = [];
  selectedFaithMaskIndex = -1;
  selectedFaithMaskIndices = new Set();
  if (faithMaskCount) faithMaskCount.value = "";
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
    if (faithMaskCount && !faithMaskCount.value) faithMaskCount.value = String(questions.length);
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

generateFaithMasksButton?.addEventListener("click", () => {
  try {
    let questionCount = 0;
    try {
      questionCount = parseFaithQuestionsPayload(faithQuestionsJson.value).length;
    } catch (error) {
      if (!faithMaskCount?.value) throw error;
    }
    const maskCount = faithMaskCountValue(questionCount);
    if (faithMaskCount) faithMaskCount.value = String(maskCount);
    faithAdminMasks = generateFaithDefaultMasks(maskCount);
    selectedFaithMaskIndex = faithAdminMasks.length ? 0 : -1;
    selectedFaithMaskIndices = faithAdminMasks.length ? new Set([0]) : new Set();
    renderFaithMaskEditor();
    if (faithDiscoveryMessage) {
      faithDiscoveryMessage.textContent = `Đã tạo ${faithAdminMasks.length} vùng che tự động. Hãy kéo chỉnh cho khớp ảnh.`;
    }
  } catch (error) {
    if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = error.message;
  }
});

clearFaithMasksButton?.addEventListener("click", () => {
  faithAdminMasks = [];
  selectedFaithMaskIndex = -1;
  selectedFaithMaskIndices = new Set();
  renderFaithMaskEditor();
  if (faithDiscoveryMessage) faithDiscoveryMessage.textContent = "Đã xóa toàn bộ vùng che của bộ hiện tại.";
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
      bannerImageUrl: "",
      infographicUrl: faithInfographicUrl.value.trim(),
      masks: normalizeFaithMasks(faithAdminMasks),
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

journeyPickerImageUrl?.addEventListener("input", updateJourneyPickerPreview);

journeyTopicList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  const topic = journeyBibleTopics.find((item) => item.id === button.dataset.id);
  fillJourneyTopicForm(topic);
  if (journeyBibleMessage) journeyBibleMessage.textContent = topic ? `Đang chỉnh sửa: ${topic.title}` : "";
});

newJourneyTopicButton?.addEventListener("click", () => {
  const topic = normalizeAdminJourneyTopic({ ...defaultJourneyAdminTopic(), id: uniqueJourneyTopicId(), title: "" });
  activeJourneyTopicId = "";
  fillJourneyTopicForm(topic);
  journeyTopicId.value = "";
  journeyTopicTitle.focus();
  if (journeyBibleMessage) journeyBibleMessage.textContent = "Đang tạo chủ đề Hành trình Kinh Thánh mới.";
});

newJourneyMilestoneButton?.addEventListener("click", () => {
  startNewJourneyMilestone(true);
});

journeyMilestoneSelect?.addEventListener("change", () => {
  if (journeyMilestoneSelect.value === "__new__") {
    startNewJourneyMilestone(false);
    return;
  }
  fillJourneyMilestoneForm(Number(journeyMilestoneSelect.value));
});

[
  journeyMilestoneTitle,
  journeyMilestoneReference,
  journeyMilestoneRegion,
  journeyMilestoneStory,
  journeyMilestoneLesson,
  journeyMapCardImageUrl,
  journeyMilestoneRelatedUrl,
].forEach((control) => {
  control?.addEventListener("input", () => updateJourneyMilestoneFromFields({ silent: true }));
});

journeyMapImageUrl?.addEventListener("input", renderJourneyMapEditor);
journeyMapPointCount?.addEventListener("change", () => applyJourneyMapPointCountFromField());
journeyMapPointSelect?.addEventListener("change", () => {
  selectedJourneyMapPointNumber = Number(journeyMapPointSelect.value) || 1;
  fillJourneyMilestoneForm(selectedJourneyMapPointNumber);
});
[journeyMapPointX, journeyMapPointY].forEach((control) => {
  control?.addEventListener("input", () => {
    updateJourneyMapPointPosition(selectedJourneyMapPointNumber, journeyMapPointX?.value, journeyMapPointY?.value);
  });
});
journeyTopicMapType?.addEventListener("change", () => {
  const mapType = selectedJourneyAdminMapType();
  updateJourneyMapTypeCustomLabel(journeyMapName?.value || selectedJourneyTopic()?.mapName || "");
  if (journeyMapImageUrl) journeyMapImageUrl.value = defaultJourneyAdminMapImageForType(mapType);
  currentJourneyMilestones = applyJourneyDefaultMapPositions(parseJourneyMilestonesFromForm(), mapType, false);
  syncJourneyMapPointCountField();
  renderJourneyMilestoneSelect(selectedJourneyMapPointNumber);
  fillJourneyMilestoneForm(selectedJourneyMapPointNumber);
  renderJourneyMapEditor();
  if (journeyBibleMessage) journeyBibleMessage.textContent = "Đã nạp ảnh và tọa độ mặc định theo loại bản đồ. Bấm Lưu Hành trình Kinh Thánh để áp dụng.";
});
journeyMapName?.addEventListener("input", () => {
  updateJourneyMapTypeCustomLabel(journeyMapName.value);
});
journeyMapMarkerLayer?.addEventListener("pointerdown", (event) => {
  const marker = event.target.closest(".journey-map-marker");
  if (!marker) return;
  event.preventDefault();
  selectedJourneyMapPointNumber = Number(marker.dataset.number) || 1;
  activeJourneyMapDragNumber = selectedJourneyMapPointNumber;
  fillJourneyMilestoneForm(selectedJourneyMapPointNumber);
});
journeyMapEditor?.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".journey-map-marker")) return;
  const point = journeyMapPointFromEvent(event);
  if (!point) return;
  updateJourneyMapPointPosition(selectedJourneyMapPointNumber, point.x, point.y);
});
document.addEventListener("pointermove", (event) => {
  if (!activeJourneyMapDragNumber) return;
  const point = journeyMapPointFromEvent(event);
  if (!point) return;
  updateJourneyMapPointPosition(activeJourneyMapDragNumber, point.x, point.y);
});
document.addEventListener("pointerup", () => {
  activeJourneyMapDragNumber = null;
});
deleteJourneyMilestoneButton?.addEventListener("click", deleteJourneyMilestoneFromFields);

journeyBibleForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!canManageContent) {
    alert("Chỉ tài khoản admin mới có quyền lưu Hành trình Kinh Thánh.");
    return;
  }

  const submitButton = journeyBibleForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  if (journeyBibleMessage) journeyBibleMessage.textContent = "Đang lưu Hành trình Kinh Thánh...";

  try {
    updateJourneyMilestoneFromFields({ silent: true });
    applyJourneyMapPointCountFromField({ silent: true });
    const milestones = parseJourneyMilestonesFromForm();
    const challenges = getExistingChallengesForActiveTopic();
    const title = journeyTopicTitle.value.trim() || `Chủ đề ${journeyBibleTopics.length + 1}`;
    const id = journeyTopicId.value.trim() || (typeof slugifyText === "function" ? slugifyText(title) : uniqueJourneyTopicId()) || uniqueJourneyTopicId();
    const nextTopic = normalizeAdminJourneyTopic({
      id,
      title,
      label: journeyTopicLabel.value.trim(),
      mapType: journeyTopicMapType?.value || "jesus",
      mapName: journeyMapName?.value.trim() || "",
      mapImageUrl: journeyMapImageUrl?.value.trim() || defaultJourneyAdminMapImageForType(journeyTopicMapType?.value || "jesus"),
      mapPositionsEdited: true,
      enabled: journeyTopicEnabled.value !== "false",
      description: journeyTopicDescription.value.trim(),
      pickerImageUrl: journeyPickerImageUrl.value.trim(),
      milestones,
      challenges,
    });

    const existingIndex = journeyBibleTopics.findIndex((topic) => topic.id === id);
    if (existingIndex >= 0) {
      journeyBibleTopics[existingIndex] = nextTopic;
    } else {
      journeyBibleTopics.push(nextTopic);
    }

    await saveJourneyBibleSettings({
      topics: journeyBibleTopics,
      activeTopicId: id,
    });
    fillJourneyTopicForm(nextTopic);
    if (journeyBibleMessage) {
      journeyBibleMessage.textContent = `Đã lưu chủ đề "${title}" gồm ${milestones.length} cột mốc.`;
    }
  } catch (error) {
    if (journeyBibleMessage) journeyBibleMessage.textContent = error.message;
    alert(error.message);
  } finally {
    submitButton.disabled = false;
  }
});

deleteJourneyTopicButton?.addEventListener("click", async () => {
  if (!canManageContent) {
    alert("Chỉ tài khoản admin mới có quyền xóa Hành trình Kinh Thánh.");
    return;
  }
  const topic = selectedJourneyTopic();
  if (!topic) {
    if (journeyBibleMessage) journeyBibleMessage.textContent = "Chưa chọn chủ đề để xóa.";
    return;
  }
  if (!confirm(`Bạn có chắc muốn xóa chủ đề "${topic.title}"?`)) return;

  try {
    journeyBibleTopics = journeyBibleTopics.filter((item) => item.id !== topic.id);
    const nextTopic = journeyBibleTopics[0] || defaultJourneyAdminTopic();
    await saveJourneyBibleSettings({
      topics: journeyBibleTopics,
      activeTopicId: journeyBibleTopics[0]?.id || "",
    });
    fillJourneyTopicForm(nextTopic);
    if (journeyBibleMessage) journeyBibleMessage.textContent = "Đã xóa chủ đề Hành trình Kinh Thánh.";
  } catch (error) {
    if (journeyBibleMessage) journeyBibleMessage.textContent = error.message;
    alert(error.message);
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
  journeyBibleForm?.querySelectorAll("input, select, textarea, button").forEach((control) => {
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
  setupJourneyCloudinaryUpload();
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
    await loadJourneyBibleAdmin();
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















