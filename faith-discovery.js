const letters = ["A", "B", "C", "D"];
let faithSets = [];
let activeFaithSetIndex = 0;
let activeFaithQuestions = [];
let faithCurrentIndex = 0;
let openedPieces = new Set();

function normalizeFaithQuestion(question) {
  if (!question || typeof question !== "object") return null;
  const options = Array.isArray(question.options)
    ? question.options.map((option) => String(option || "").trim()).filter(Boolean)
    : [];
  const answer = Number(question.answer);
  const topic = String(question.topic || "").trim();
  const questionText = String(question.question || "").trim();

  if (!questionText || options.length < 2 || Number.isNaN(answer) || answer < 0 || answer >= options.length) {
    return null;
  }

  return {
    topic: topic || `CÃ¢u há»i ${activeFaithQuestions.length + 1}`,
    question: questionText,
    options,
    answer,
    explanation: String(question.explanation || "").trim(),
  };
}

function normalizeFaithQuestions(questions) {
  if (!Array.isArray(questions)) return [];
  return questions.map(normalizeFaithQuestion).filter(Boolean);
}

function escapeFaithHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeFaithSet(set, index) {
  if (!set || typeof set !== "object") return null;
  const questions = normalizeFaithQuestions(set.questions);
  if (!questions.length) return null;

  return {
    id: String(set.id || `faith-set-${index + 1}`).trim(),
    title: String(set.title || `Bá»™ ${index + 1}`).trim(),
    
    pickerImageUrl: String(set.pickerImageUrl || "").trim(),
    bannerImageUrl: String(set.bannerImageUrl || "").trim(),
    infographicUrl: String(set.infographicUrl || "").trim(),
    questions,
  };
}

function settingsToFaithSets(settings) {
  const configuredSets = Array.isArray(settings?.sets)
    ? settings.sets.map(normalizeFaithSet).filter(Boolean)
    : [];

  if (configuredSets.length) return configuredSets;

  const legacyQuestions = normalizeFaithQuestions(settings?.questions);
  if (legacyQuestions.length) {
    return [
      {
        id: "legacy-faith-set",
        title: String(settings?.title || "KhÃ¡m PhÃ¡ Äá»©c Tin").trim() || "KhÃ¡m PhÃ¡ Äá»©c Tin",
        
        pickerImageUrl: String(settings?.pickerImageUrl || "").trim(),
        bannerImageUrl: String(settings?.bannerImageUrl || "").trim(),
        infographicUrl: String(settings?.infographicUrl || "").trim(),
        questions: legacyQuestions,
      },
    ];
  }

  return [];
}

async function loadFaithDiscoverySettings() {
  if (typeof getFaithDiscoverySettings !== "function") return;

  try {
    const settings = await getFaithDiscoverySettings();
    faithSets = settingsToFaithSets(settings);
    const activeIndex = faithSets.findIndex((set) => set.id === settings?.activeSetId);
    activeFaithSetIndex = activeIndex >= 0 ? activeIndex : 0;
    applyFaithSet(activeFaithSetIndex, { reset: false });
  } catch (error) {
    console.warn("KhÃ´ng thá»ƒ táº£i cáº¥u hÃ¬nh KhÃ¡m PhÃ¡ Äá»©c Tin.", error);
  }
}

function renderFaithSetSwitcher() {
  const switcher = document.getElementById("faithSetSwitcher");
  if (!switcher) return;

  if (faithSets.length <= 1) {
    switcher.innerHTML = "";
    switcher.hidden = true;
    return;
  }

  switcher.hidden = false;
  switcher.innerHTML = faithSets
    .map(
      (set, index) => `
        <button class="${index === activeFaithSetIndex ? "active" : ""}" type="button" data-index="${index}">
          ${escapeFaithHtml(set.title)}
        </button>
      `
    )
    .join("");

  switcher.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => applyFaithSet(Number(button.dataset.index)));
  });
}

function setFaithHeroBanner(imageUrl) {
  const hero = document.querySelector(".faith-hero-panel");
  if (!hero) return;

  const bannerUrl = String(imageUrl || "").trim();
  if (!bannerUrl) {
    hero.classList.remove("has-banner-image");
    hero.style.removeProperty("--faith-banner-image");
    return;
  }

  const safeUrl = bannerUrl.replace(/"/g, "%22");
  hero.style.setProperty("--faith-banner-image", `url("${safeUrl}")`);
  hero.classList.add("has-banner-image");
}

function renderSetPicker() {
  const grid = document.getElementById("faithSetPickerGrid");
  if (!grid) return;

  if (!faithSets.length) {
    grid.innerHTML = `<p class="admin-empty-note">Chưa có bộ câu hỏi để chọn.</p>`;
    return;
  }

  grid.innerHTML = faithSets
    .map((set, index) => `
      <button class="faith-picker-item" type="button" data-index="${index}">
        <span>${set.questions.length} câu hỏi</span>
        <strong>${escapeFaithHtml(set.title || `Bộ ${index + 1}`)}</strong>
      </button>
    `)
    .join("");

  grid.querySelectorAll("button[data-index]").forEach((button) => {
    const set = faithSets[Number(button.dataset.index)];
    const pickerImageUrl = set?.pickerImageUrl || (set?.questions.length === 12 ? "/assets/faith-picker-maria.jpg" : "");

    if (pickerImageUrl) {
      const image = document.createElement("img");
      image.className = "faith-picker-item-image";
      image.src = pickerImageUrl;
      image.alt = "";
      image.decoding = "async";
      image.loading = "eager";
      button.classList.add("has-image");
      button.prepend(image);
      button.querySelector("span")?.remove();
      button.querySelector("strong")?.remove();
      button.setAttribute("aria-label", set?.title || "Bộ câu hỏi");
    }

    button.addEventListener("click", () => startFaithSet(Number(button.dataset.index)));
  });
}

function showSetPicker() {
  const picker = document.getElementById("faithSetPicker");
  const game = document.querySelector(".faith-game");
  document.body.classList.add("faith-choosing-set");
  if (picker) picker.hidden = false;
  if (game) game.hidden = true;
  setFaithHeroBanner("");
  renderSetPicker();
}

function startFaithSet(index) {
  applyFaithSet(index, { reset: false });
  faithCurrentIndex = 0;
  openedPieces = new Set();
  document.querySelectorAll(".faith-mask-tile").forEach((tile) => tile.classList.remove("is-open"));
  buildFaithMasks();
  updateFaithProgress();
  const picker = document.getElementById("faithSetPicker");
  const game = document.querySelector(".faith-game");
  document.body.classList.remove("faith-choosing-set");
  if (picker) picker.hidden = true;
  if (game) game.hidden = false;
  renderFaithQuestion();
}
function applyFaithSet(index, options = {}) {
  const selectedSet = faithSets[index] || faithSets[0];
  if (!selectedSet) {
    renderEmptyFaithState();
    return;
  }

  activeFaithSetIndex = faithSets[index] ? index : 0;
  activeFaithQuestions = selectedSet.questions;
  const title = document.getElementById("faithPageTitle");
  const subtitle = document.getElementById("faithPageSubtitle");
  if (title) title.textContent = "Khám Phá Đức Tin";
  if (subtitle) subtitle.textContent = "Tráº£ lá»i Ä‘Ãºng tá»«ng cÃ¢u há»i Ä‘á»ƒ má»Ÿ cÃ¡c máº£nh hÃ¬nh trong infographic Ä‘Ã£ Ä‘Æ°á»£c chuáº©n bá»‹.";
  setFaithHeroBanner(selectedSet.bannerImageUrl);
  const image = document.getElementById("faithInfographicImage");
  if (image) {
    if (selectedSet.infographicUrl) {
      image.src = selectedSet.infographicUrl;
      image.hidden = false;
    } else {
      image.removeAttribute("src");
      image.hidden = true;
    }
  }
  if (options.reset !== false) {
    buildFaithMasks();
    restartFaithGame();
  }
  renderFaithSetSwitcher();
}

function renderEmptyFaithState() {
  activeFaithQuestions = [];
  const step = document.getElementById("faithStep");
  const topic = document.getElementById("faithTopic");
  const badge = document.getElementById("faithQuestionBadge");
  const question = document.getElementById("faithQuestion");
  const options = document.getElementById("faithOptions");
  const feedback = document.getElementById("faithFeedback");
  const progressText = document.getElementById("faithProgressText");
  const progressBar = document.getElementById("faithProgressBar");
  const score = document.getElementById("faithScore");
  const title = document.getElementById("faithPageTitle");
  const subtitle = document.getElementById("faithPageSubtitle");
  const maskGrid = document.getElementById("faithMaskGrid");
  const image = document.getElementById("faithInfographicImage");
  const nextButton = document.getElementById("faithNextButton");
  const restartButton = document.getElementById("faithRestartButton");

  if (step) step.textContent = "ChÆ°a cÃ³ bá»™";
  if (topic) topic.textContent = "Cáº§n cáº¥u hÃ¬nh";
  if (badge) badge.textContent = "ChÆ°a cÃ³ cÃ¢u há»i";
  if (question) question.textContent = "ChÆ°a cÃ³ bá»™ cÃ¢u há»i KhÃ¡m PhÃ¡ Äá»©c Tin. Vui lÃ²ng thÃªm trong trang quáº£n lÃ½.";
  if (options) options.innerHTML = "";
  if (feedback) {
    feedback.textContent = "";
    feedback.className = "faith-feedback";
  }
  if (progressText) progressText.textContent = "ÄÃ£ má»Ÿ 0/0 máº£nh";
  if (progressBar) progressBar.style.width = "0%";
  if (score) score.textContent = "0";
  if (title) title.textContent = "KhÃ¡m PhÃ¡ Äá»©c Tin";
  if (subtitle) subtitle.textContent = "Vui lÃ²ng thÃªm bá»™ cÃ¢u há»i vÃ  infographic trong trang quáº£n lÃ½.";
  setFaithHeroBanner("");
  if (maskGrid) maskGrid.innerHTML = "";
  if (image) {
    image.removeAttribute("src");
    image.hidden = true;
  }
  if (nextButton) nextButton.disabled = true;
  if (restartButton) restartButton.hidden = true;
  renderFaithSetSwitcher();
}

function buildFaithMasks() {
  const maskGrid = document.getElementById("faithMaskGrid");
  if (!maskGrid) return;
  if (!activeFaithQuestions.length) {
    maskGrid.innerHTML = "";
    return;
  }

  const total = activeFaithQuestions.length || 1;
  const columns = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / columns);

  maskGrid.innerHTML = activeFaithQuestions
    .map((_, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      const isLastRow = row === rows - 1;
      const remainingInLastRow = total - row * columns;
      const cellsInRow = isLastRow ? remainingInLastRow : columns;
      const width = 100 / cellsInRow;
      const height = 100 / rows;
      const left = col * width;
      const top = row * height;

      return `
        <span
          class="faith-mask-tile"
          data-index="${index}"
          style="left:${left}%;top:${top}%;width:${width}%;height:${height}%"
        >
          <span class="faith-lock-icon" aria-hidden="true"></span>
        </span>
      `;
    })
    .join("");
}

function updateFaithProgress() {
  const progressText = document.getElementById("faithProgressText");
  const progressBar = document.getElementById("faithProgressBar");
  const score = document.getElementById("faithScore");
  const opened = openedPieces.size;
  const total = activeFaithQuestions.length || 1;
  const percent = (opened / total) * 100;

  if (progressText) {
    progressText.textContent = `ÄÃ£ má»Ÿ ${opened}/${activeFaithQuestions.length} máº£nh`;
  }
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
  }
  if (score) {
    score.textContent = String(opened);
  }
}

function renderFaithQuestion() {
  const item = activeFaithQuestions[faithCurrentIndex];
  const step = document.getElementById("faithStep");
  const topic = document.getElementById("faithTopic");
  const badge = document.getElementById("faithQuestionBadge");
  const question = document.getElementById("faithQuestion");
  const options = document.getElementById("faithOptions");
  const feedback = document.getElementById("faithFeedback");
  const nextButton = document.getElementById("faithNextButton");
  const restartButton = document.getElementById("faithRestartButton");

  if (!item || !options) {
    renderEmptyFaithState();
    return;
  }

  if (step) step.textContent = `CÃ¢u ${faithCurrentIndex + 1}/${activeFaithQuestions.length}`;
  if (badge) badge.textContent = `CÃ¢u há»i ${faithCurrentIndex + 1}/${activeFaithQuestions.length}`;
  if (topic) topic.textContent = item.topic;
  if (question) question.textContent = item.question;
  if (feedback) {
    feedback.textContent = "";
    feedback.className = "faith-feedback";
  }
  if (nextButton) nextButton.disabled = true;
  if (restartButton) restartButton.hidden = true;

  const isAnswered = openedPieces.has(faithCurrentIndex);
  options.innerHTML = item.options
    .map((option, index) => `
      <button class="faith-option ${isAnswered && index === item.answer ? "is-correct" : ""}" type="button" data-index="${index}" ${isAnswered ? "disabled" : ""}>
        <span>${letters[index]}</span>
        ${escapeFaithHtml(option)}
      </button>
    `)
    .join("");

  if (isAnswered && feedback) {
    feedback.textContent = "Câu này đã hoàn thành. Bạn có thể chọn câu khác để tiếp tục.";
    feedback.className = "faith-feedback is-correct";
  }

  options.querySelectorAll(".faith-option").forEach((button) => {
    button.addEventListener("click", () => chooseFaithAnswer(Number(button.dataset.index)));
  });
}

function chooseFaithAnswer(selectedIndex) {
  const item = activeFaithQuestions[faithCurrentIndex];
  const options = document.querySelectorAll(".faith-option");
  const feedback = document.getElementById("faithFeedback");
  const nextButton = document.getElementById("faithNextButton");
  const restartButton = document.getElementById("faithRestartButton");

  if (!item) return;

  if (selectedIndex !== item.answer) {
    const selectedButton = options[selectedIndex];
    if (selectedButton) {
      selectedButton.classList.add("is-wrong");
      selectedButton.disabled = true;
    }
    if (feedback) {
      feedback.textContent = "ChÆ°a Ä‘Ãºng, báº¡n thá»­ láº¡i nhÃ©.";
      feedback.className = "faith-feedback is-wrong";
    }
    return;
  }

  options.forEach((button, index) => {
    button.disabled = true;
    button.classList.toggle("is-correct", index === item.answer);
  });

  openedPieces.add(faithCurrentIndex);
  const maskTile = document.querySelector(`.faith-mask-tile[data-index="${faithCurrentIndex}"]`);
  if (maskTile) maskTile.classList.add("is-open");

  updateFaithProgress();
  renderSetPicker();

  if (feedback) {
    feedback.textContent = `ÄÃºng rá»“i! ${item.explanation}`;
    feedback.className = "faith-feedback is-correct";
  }

  if (openedPieces.size >= activeFaithQuestions.length) {
    if (nextButton) nextButton.disabled = true;
    if (restartButton) restartButton.hidden = false;
    if (feedback) {
      feedback.textContent = "Báº¡n Ä‘Ã£ má»Ÿ toÃ n bá»™ infographic. HÃ£y tin vÃ  theo ChÃºa!";
    }
    return;
  }

  if (nextButton) nextButton.disabled = false;
}

function goToNextFaithQuestion() {
  if (faithCurrentIndex < activeFaithQuestions.length - 1) {
    faithCurrentIndex += 1;
    renderFaithQuestion();
  }
}


function returnToFaithSetPicker() {
  faithCurrentIndex = 0;
  openedPieces = new Set();
  document.querySelectorAll(".faith-mask-tile").forEach((tile) => tile.classList.remove("is-open"));
  updateFaithProgress();
  showSetPicker();
}
function restartFaithGame() {
  faithCurrentIndex = 0;
  openedPieces = new Set();
  document.querySelectorAll(".faith-mask-tile").forEach((tile) => tile.classList.remove("is-open"));
  updateFaithProgress();
  showSetPicker();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (typeof rememberCurrentPage === "function") {
    rememberCurrentPage("KhÃ¡m PhÃ¡ Äá»©c Tin");
  }
  if (typeof setupBackLink === "function") {
    setupBackLink("/", "Trang chá»§", { useStored: false });
  }

  await loadFaithDiscoverySettings();
  if (!faithSets.length) {
    renderEmptyFaithState();
    document.dispatchEvent(new CustomEvent("kito:content-rendered"));
    return;
  }
  buildFaithMasks();
  updateFaithProgress();
  showSetPicker();
  document.getElementById("faithNextButton")?.addEventListener("click", goToNextFaithQuestion);
  document.getElementById("faithRestartButton")?.addEventListener("click", restartFaithGame);
  document.getElementById("faithBackToSetsButton")?.addEventListener("click", returnToFaithSetPicker);
  document.dispatchEvent(new CustomEvent("kito:content-rendered"));
});














