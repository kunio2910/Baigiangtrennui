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
    topic: topic || `Câu hỏi ${activeFaithQuestions.length + 1}`,
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
    title: String(set.title || `Bộ ${index + 1}`).trim(),
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
        title: String(settings?.title || "Khám Phá Đức Tin").trim() || "Khám Phá Đức Tin",
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
    console.warn("Không thể tải cấu hình Khám Phá Đức Tin.", error);
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
  if (title) title.textContent = selectedSet.title || "Khám Phá Đức Tin";
  if (subtitle) subtitle.textContent = "Trả lời đúng từng câu hỏi để mở các mảnh hình trong infographic đã được chuẩn bị.";
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

  if (step) step.textContent = "Chưa có bộ";
  if (topic) topic.textContent = "Cần cấu hình";
  if (badge) badge.textContent = "Chưa có câu hỏi";
  if (question) question.textContent = "Chưa có bộ câu hỏi Khám Phá Đức Tin. Vui lòng thêm trong trang quản lý.";
  if (options) options.innerHTML = "";
  if (feedback) {
    feedback.textContent = "";
    feedback.className = "faith-feedback";
  }
  if (progressText) progressText.textContent = "Đã mở 0/0 mảnh";
  if (progressBar) progressBar.style.width = "0%";
  if (score) score.textContent = "0";
  if (title) title.textContent = "Khám Phá Đức Tin";
  if (subtitle) subtitle.textContent = "Vui lòng thêm bộ câu hỏi và infographic trong trang quản lý.";
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
          <span>${index + 1}</span>
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
    progressText.textContent = `Đã mở ${opened}/${activeFaithQuestions.length} mảnh`;
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

  if (step) step.textContent = `Câu ${faithCurrentIndex + 1}/${activeFaithQuestions.length}`;
  if (badge) badge.textContent = `Câu hỏi ${faithCurrentIndex + 1}/${activeFaithQuestions.length}`;
  if (topic) topic.textContent = item.topic;
  if (question) question.textContent = item.question;
  if (feedback) {
    feedback.textContent = "";
    feedback.className = "faith-feedback";
  }
  if (nextButton) nextButton.disabled = true;
  if (restartButton) restartButton.hidden = true;

  options.innerHTML = item.options
    .map((option, index) => `
      <button class="faith-option" type="button" data-index="${index}">
        <span>${letters[index]}</span>
        ${option}
      </button>
    `)
    .join("");

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
      feedback.textContent = "Chưa đúng, bạn thử lại nhé.";
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

  if (feedback) {
    feedback.textContent = `Đúng rồi! ${item.explanation}`;
    feedback.className = "faith-feedback is-correct";
  }

  if (faithCurrentIndex >= activeFaithQuestions.length - 1) {
    if (nextButton) nextButton.disabled = true;
    if (restartButton) restartButton.hidden = false;
    if (feedback) {
      feedback.textContent = "Bạn đã mở toàn bộ infographic. Hãy tin và theo Chúa!";
    }
    return;
  }

  if (nextButton) nextButton.disabled = false;
}

function showFaithHint() {
  const item = activeFaithQuestions[faithCurrentIndex];
  const feedback = document.getElementById("faithFeedback");
  if (!item || !feedback) return;
  feedback.textContent = `Gợi ý: hãy đọc kỹ chủ đề "${item.topic}" và các đáp án đang hiển thị.`;
  feedback.className = "faith-feedback";
}

function goToNextFaithQuestion() {
  if (faithCurrentIndex < activeFaithQuestions.length - 1) {
    faithCurrentIndex += 1;
    renderFaithQuestion();
  }
}

function restartFaithGame() {
  faithCurrentIndex = 0;
  openedPieces = new Set();
  document.querySelectorAll(".faith-mask-tile").forEach((tile) => tile.classList.remove("is-open"));
  updateFaithProgress();
  renderFaithQuestion();
}

document.addEventListener("DOMContentLoaded", async () => {
  if (typeof rememberCurrentPage === "function") {
    rememberCurrentPage("Khám Phá Đức Tin");
  }
  if (typeof setupBackLink === "function") {
    setupBackLink("/", "Trang chủ", { useStored: false });
  }

  await loadFaithDiscoverySettings();
  if (!faithSets.length) {
    renderEmptyFaithState();
    document.dispatchEvent(new CustomEvent("kito:content-rendered"));
    return;
  }
  buildFaithMasks();
  updateFaithProgress();
  renderFaithQuestion();

  document.getElementById("faithHintButton")?.addEventListener("click", showFaithHint);
  document.getElementById("faithNextButton")?.addEventListener("click", goToNextFaithQuestion);
  document.getElementById("faithRestartButton")?.addEventListener("click", restartFaithGame);
  document.dispatchEvent(new CustomEvent("kito:content-rendered"));
});
