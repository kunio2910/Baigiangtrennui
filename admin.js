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
const adminTabButtons = document.querySelectorAll("[data-admin-tab]");
const adminTabPanels = document.querySelectorAll("[data-admin-panel]");
const loginPanel = document.querySelector("#loginPanel");
const protectedPanel = document.querySelector("#adminProtected");
const loginForm = document.querySelector("#loginForm");
const loginMessage = document.querySelector("#loginMessage");
const contentMessage = document.querySelector("#contentMessage");
let draggedItem = null;

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
    if (backupFileInput) backupFileInput.value = "";
    if (backupMessage) backupMessage.textContent = `Đã nhập backup thành công: ${restoredCount.toLocaleString("vi-VN")} document.`;
  } catch (error) {
    if (backupMessage) backupMessage.textContent = error.message;
    alert(error.message);
  } finally {
    importBackupButton.disabled = false;
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
}

async function setupLogin() {
  setupAdminTabs();
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
    document.querySelector(".admin-intro").insertAdjacentHTML(
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




