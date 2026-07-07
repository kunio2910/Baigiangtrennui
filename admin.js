let content = getContent();
let currentImage = "";

const typeLabels = {
  saints: "Các thánh",
  churches: "Nhà thờ",
  articles: "Bài viết",
  events: "Sự kiện",
};

const form = document.querySelector("#contentForm");
const itemId = document.querySelector("#itemId");
const itemType = document.querySelector("#itemType");
const itemTitle = document.querySelector("#itemTitle");
const itemDescription = document.querySelector("#itemDescription");
const itemMeta = document.querySelector("#itemMeta");
const itemDate = document.querySelector("#itemDate");
const itemImage = document.querySelector("#itemImage");
const imagePreview = document.querySelector("#imagePreview");
const filterType = document.querySelector("#filterType");

function detailLink(type, id) {
  return `detail.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`;
}

function getItemsForAdmin() {
  const selected = filterType.value;
  const types = selected === "all" ? ["saints", "churches", "articles", "events"] : [selected];
  return types.flatMap((type) => content[type].map((item) => ({ ...item, type })));
}

function renderAdminList() {
  const items = getItemsForAdmin();
  document.querySelector("#adminList").innerHTML = items
    .map(
      (item) => `
        <article class="admin-item">
          <img src="${item.image || fallbackImage}" alt="${item.title}" />
          <div>
            <span>${typeLabels[item.type]}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <small>${item.meta || ""}</small>
          </div>
          <div class="row-actions">
            <button type="button" data-action="edit" data-type="${item.type}" data-id="${item.id}">Sửa</button>
            <button type="button" data-action="delete" data-type="${item.type}" data-id="${item.id}">Xóa</button>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelector("#previewList").innerHTML = content.articles
    .slice(0, 3)
    .map(
      (item) => `
        <article class="article-card">
          <img src="${item.image || fallbackImage}" alt="${item.title}" />
          <div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <a href="${detailLink("articles", item.id)}">Đọc thêm</a>
          </div>
        </article>
      `
    )
    .join("");
}

function clearForm() {
  form.reset();
  itemId.value = "";
  currentImage = "";
  imagePreview.removeAttribute("src");
  imagePreview.classList.remove("show");
}

function editItem(type, id) {
  const item = content[type].find((entry) => entry.id === id);
  if (!item) return;

  itemId.value = item.id;
  itemType.value = type;
  itemTitle.value = item.title;
  itemDescription.value = item.description;
  itemMeta.value = item.meta || "";
  itemDate.value = item.date || "";
  currentImage = item.image || "";

  if (currentImage) {
    imagePreview.src = currentImage;
    imagePreview.classList.add("show");
  }

  itemTitle.focus();
}

function deleteItem(type, id) {
  const item = content[type].find((entry) => entry.id === id);
  if (!item) return;
  const confirmed = confirm(`Xóa "${item.title}"?`);
  if (!confirmed) return;

  content[type] = content[type].filter((entry) => entry.id !== id);
  saveContent(content);
  renderAdminList();
  clearForm();
}

itemImage.addEventListener("change", () => {
  const file = itemImage.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    currentImage = reader.result;
    imagePreview.src = currentImage;
    imagePreview.classList.add("show");
  });
  reader.readAsDataURL(file);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const type = itemType.value;
  const id = itemId.value || `${type}-${Date.now()}`;
  const nextItem = {
    id,
    title: itemTitle.value.trim(),
    description: itemDescription.value.trim(),
    meta: itemMeta.value.trim(),
    date: itemDate.value,
    image: currentImage || fallbackImage,
  };

  const existingIndex = content[type].findIndex((item) => item.id === id);
  if (existingIndex >= 0) {
    content[type][existingIndex] = nextItem;
  } else {
    content[type].unshift(nextItem);
  }

  saveContent(content);
  renderAdminList();
  clearForm();
});

document.querySelector("#adminList").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const { action, type, id } = button.dataset;
  if (action === "edit") editItem(type, id);
  if (action === "delete") deleteItem(type, id);
});

document.querySelector("#clearForm").addEventListener("click", clearForm);
filterType.addEventListener("change", renderAdminList);

document.querySelector("#resetData").addEventListener("click", () => {
  const confirmed = confirm("Khôi phục dữ liệu mẫu và xóa các nội dung đã chỉnh sửa?");
  if (!confirmed) return;
  resetContent();
  content = getContent();
  clearForm();
  renderAdminList();
});

renderAdminList();
