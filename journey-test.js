(function () {
  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  if (!isLocalhost) {
    window.location.replace("/");
    return;
  }

  const JESUS_TOPIC_ID = "hanh-trinh-theo-dau-chan-chua-giesu";
  const BAPTISM_STEP_NUMBER = 3;
  let BAPTISM_REWARD_POINTS = 50;

  let baptismChallenge = {
    title: "Ghép Dấu Chỉ Bên Sông Giođan",
    instruction: "Chọn đúng 3 dấu chỉ xuất hiện trong biến cố Chúa chịu phép rửa.",
    verse: "Đây là Con yêu dấu của Ta, Ta hài lòng về Người.",
    verseRef: "Mt 3,17",
    targets: [
      { signId: "water", label: "Nước", hint: "Dấu chỉ của phép rửa", reveal: "Nước sông Giođan" },
      { signId: "dove", label: "Thánh Thần", hint: "Ngự xuống trong hình chim bồ câu", reveal: "Chim bồ câu" },
      { signId: "voice", label: "Tiếng Chúa Cha", hint: "Lời xác nhận từ trời", reveal: "Tiếng từ trời" },
    ],
    options: [
      { id: "dove", label: "Chim bồ câu", text: "Thánh Thần ngự xuống", icon: "✦", correct: true },
      { id: "mountain", label: "Ngọn núi", text: "Không thuộc chặng này", icon: "△", correct: false },
      { id: "water", label: "Nước sông", text: "Dòng sông Giođan", icon: "≈", correct: true },
      { id: "temple", label: "Đền thờ", text: "Không thuộc chặng này", icon: "▥", correct: false },
      { id: "voice", label: "Tiếng từ trời", text: "Lời Chúa Cha phán", icon: "◌", correct: true },
    ],
  };

  const jesusMilestones = [
    {
      number: 1,
      title: "Giáng Sinh",
      reference: "Lc 2,1-20",
      region: "Bêlem",
      scene: "nativity",
      x: 7,
      y: 34,
      story: "Chúa Giêsu sinh ra tại Bêlem trong cảnh đơn sơ, mở đầu Tin Mừng cứu độ cho nhân loại.",
      lesson: "Thiên Chúa đến gần con người bằng sự khiêm nhường và yêu thương.",
    },
    {
      number: 2,
      title: "Thời niên thiếu",
      reference: "Lc 2,41-52",
      region: "Nadarét",
      scene: "temple",
      x: 22,
      y: 35,
      story: "Chúa Giêsu lớn lên trong gia đình Thánh Gia và luôn hướng lòng về nhà Cha.",
      lesson: "Đời sống gia đình và sự vâng phục cũng là con đường nên thánh.",
    },
    {
      number: 3,
      title: "Chúa chịu phép rửa",
      reference: "Mt 3,13-17",
      region: "Sông Giođan",
      scene: "baptism",
      x: 37,
      y: 28,
      story: "Tại sông Giođan, Chúa Giêsu nhận phép rửa và bắt đầu bước vào sứ vụ công khai.",
      lesson: "Người môn đệ được mời gọi sống khiêm nhường và lắng nghe tiếng Chúa Cha.",
    },
    {
      number: 4,
      title: "Chúa chịu cám dỗ",
      reference: "Mt 4,1-11",
      region: "Hoang địa",
      scene: "desert",
      x: 55,
      y: 20,
      story: "Trong hoang địa, Chúa Giêsu chiến thắng cám dỗ bằng Lời Chúa và lòng trung thành.",
      lesson: "Lời Chúa là ánh sáng giúp ta đứng vững trước thử thách.",
    },
    {
      number: 5,
      title: "Bắt đầu rao giảng",
      reference: "Mc 1,14-15",
      region: "Galilê",
      scene: "preaching",
      x: 72,
      y: 22,
      story: "Chúa Giêsu loan báo Nước Thiên Chúa đã gần đến và mời gọi mọi người sám hối.",
      lesson: "Tin Mừng bắt đầu bằng một trái tim biết quay về với Thiên Chúa.",
    },
    {
      number: 6,
      title: "Gọi các môn đệ",
      reference: "Lc 5,1-11",
      region: "Biển hồ",
      scene: "boat",
      x: 84,
      y: 36,
      story: "Chúa gọi những người đánh cá bình thường trở nên môn đệ và người loan báo Tin Mừng.",
      lesson: "Chúa có thể dùng chính đời sống thường ngày của ta cho một sứ mạng lớn hơn.",
    },
    {
      number: 7,
      title: "Phép lạ đầu tiên",
      reference: "Ga 2,1-11",
      region: "Cana",
      scene: "cana",
      x: 10,
      y: 65,
      story: "Tại tiệc cưới Cana, Chúa Giêsu biến nước thành rượu theo lời chuyển cầu của Đức Maria.",
      lesson: "Hãy đến với Chúa bằng niềm tin và học thái độ lắng nghe của Mẹ Maria.",
    },
    {
      number: 8,
      title: "Giảng trên núi",
      reference: "Mt 5-7",
      region: "Galilê",
      scene: "mount",
      x: 28,
      y: 64,
      story: "Chúa dạy các Mối Phúc và con đường sống của người môn đệ.",
      lesson: "Hạnh phúc thật đến từ trái tim hiền lành, trong sạch và biết yêu thương.",
    },
    {
      number: 9,
      title: "Các phép lạ",
      reference: "Mc 6,30-44",
      region: "Galilê",
      scene: "miracle",
      x: 43,
      y: 66,
      story: "Chúa chữa lành, nuôi dân chúng và tỏ lòng thương xót với những ai đang thiếu thốn.",
      lesson: "Điều nhỏ bé được trao vào tay Chúa có thể trở thành ân phúc cho nhiều người.",
    },
    {
      number: 10,
      title: "Các dụ ngôn",
      reference: "Lc 15,1-32",
      region: "Samaria",
      scene: "parable",
      x: 58,
      y: 65,
      story: "Chúa dùng những câu chuyện gần gũi để mặc khải lòng thương xót của Thiên Chúa.",
      lesson: "Thiên Chúa luôn tìm kiếm và vui mừng khi người lạc bước trở về.",
    },
    {
      number: 11,
      title: "Chúa vào Giêrusalem",
      reference: "Mt 21,1-11",
      region: "Giêrusalem",
      scene: "jerusalem",
      x: 72,
      y: 66,
      story: "Dân chúng đón Chúa vào thành với cành lá và lời chúc tụng, mở đầu Tuần Thánh.",
      lesson: "Đón Chúa không chỉ bằng lời tung hô, mà bằng một đời sống trung thành.",
    },
    {
      number: 12,
      title: "Bữa Tiệc Ly",
      reference: "Lc 22,7-20",
      region: "Nhà Tiệc Ly",
      scene: "supper",
      x: 78,
      y: 82,
      story: "Chúa lập Bí tích Thánh Thể và trao ban chính mình cho các môn đệ.",
      lesson: "Tình yêu của Chúa là tình yêu trao hiến đến cùng.",
    },
    {
      number: 13,
      title: "Chúa cầu nguyện",
      reference: "Lc 22,39-46",
      region: "Ghếtsêmani",
      scene: "garden",
      x: 90,
      y: 82,
      story: "Trong vườn Ghếtsêmani, Chúa cầu nguyện và phó thác trước cuộc Thương Khó.",
      lesson: "Khi lo sợ, hãy cùng Chúa thưa: xin theo ý Cha.",
    },
    {
      number: 14,
      title: "Chúa chịu đóng đinh",
      reference: "Lc 23,26-49",
      region: "Golgotha",
      scene: "cross",
      x: 95,
      y: 64,
      story: "Chúa chịu đóng đinh trên thập giá và tha thứ cho những người làm hại Người.",
      lesson: "Thập giá là nơi tình yêu và lòng tha thứ chiến thắng hận thù.",
    },
    {
      number: 15,
      title: "Chúa Phục Sinh",
      reference: "Lc 24,1-12",
      region: "Mộ trống",
      scene: "resurrection",
      x: 95,
      y: 44,
      story: "Ngôi mộ trống loan báo niềm vui Phục Sinh: Chúa đã sống lại thật.",
      lesson: "Niềm hy vọng Kitô giáo bắt đầu từ ánh sáng Phục Sinh.",
    },
    {
      number: 16,
      title: "Chúa Thăng Thiên",
      reference: "Cv 1,9-11",
      region: "Núi Ôliu",
      scene: "ascension",
      x: 94,
      y: 25,
      story: "Chúa lên trời và trao sứ mạng làm chứng cho các môn đệ.",
      lesson: "Người môn đệ tiếp tục hành trình bằng việc loan báo Tin Mừng trong đời sống.",
    },
  ];

  const journeyMapNumberPositions = [
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

  jesusMilestones.forEach((step, index) => {
    Object.assign(step, journeyMapNumberPositions[index] || { x: 50, y: 10 + index * 5 });
  });
  let topics = [
    {
      id: JESUS_TOPIC_ID,
      title: "Hành trình theo dấu chân Chúa Giêsu",
      description: "Khám phá những cột mốc chính trong cuộc đời và sứ vụ của Chúa Giêsu.",
      steps: jesusMilestones.length,
      label: "Tân Ước",
      enabled: true,
    },
    {
      id: "sang-the-giao-uoc",
      title: "Từ Sáng Thế đến Giao Ước",
      description: "Tìm hiểu công trình tạo dựng, tổ phụ Ápraham và hành trình đức tin đầu tiên.",
      steps: 12,
      label: "Cựu Ước",
    },
    {
      id: "xuat-hanh",
      title: "Hành trình Xuất Hành",
      description: "Theo chân dân Chúa đi qua Biển Đỏ, sa mạc và giao ước tại núi Sinai.",
      steps: 14,
      label: "Cựu Ước",
    },
    {
      id: "ngon-su",
      title: "Các ngôn sứ kêu gọi trở về",
      description: "Gặp gỡ các ngôn sứ và lời mời gọi hoán cải, hy vọng, trung thành với Thiên Chúa.",
      steps: 10,
      label: "Ngôn sứ",
    },
    {
      id: "du-ngon",
      title: "Những dụ ngôn của Chúa",
      description: "Học Tin Mừng qua những câu chuyện gần gũi mà Chúa Giêsu dùng để dạy dân chúng.",
      steps: 12,
      label: "Tin Mừng",
    },
    {
      id: "hoi-thanh-so-khai",
      title: "Hành trình Hội Thánh sơ khai",
      description: "Tìm hiểu các Tông Đồ, Chúa Thánh Thần và những bước đầu loan báo Tin Mừng.",
      steps: 13,
      label: "Công Vụ",
    },
  ];

  const progress = {
    faithPoints: 850,
    fragments: 3,
    totalFragments: 12,
    badges: 1,
    completed: new Set([1, 2, 3]),
    unlocked: new Set([4, 5]),
  };

  const state = {
    search: "",
    sort: "default",
    page: 1,
    pageSize: 12,
    selectedStepNumber: BAPTISM_STEP_NUMBER,
    activeView: "map",
    baptismSelectedSigns: new Set(),
    baptismMessage: "",
    baptismTone: "info",
    baptismCompleted: false,
    baptismRewarded: false,
  };

  const picker = document.querySelector(".journey-set-picker");
  const game = document.querySelector("#journeyGame");
  const gameRoot = document.querySelector("#journeyGameRoot");
  const grid = document.querySelector("#journeyTopicGrid");
  const searchInput = document.querySelector("#journeySearch");
  const sortSelect = document.querySelector("#journeySort");
  const pagination = document.querySelector("#journeyPagination");

  function escapeAttr(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function normalizeJourneyTopicFromSettings(topic, index) {
    const fallback = topics.find((item) => item.id === topic?.id) || {};
    const milestones = Array.isArray(topic?.milestones) ? topic.milestones : [];
    return {
      id: String(topic?.id || fallback.id || `journey-topic-${index + 1}`).trim(),
      title: String(topic?.title || fallback.title || `Chủ đề ${index + 1}`).trim(),
      description: String(topic?.description || fallback.description || "").trim(),
      label: String(topic?.label || fallback.label || "").trim(),
      enabled: topic?.enabled !== false,
      pickerImageUrl: String(topic?.pickerImageUrl || "").trim(),
      steps: milestones.length || fallback.steps || 0,
      milestones,
      challenges: topic?.challenges && typeof topic.challenges === "object" ? topic.challenges : {},
    };
  }

  function applyJourneyBibleSettings(settings) {
    const configuredTopics = Array.isArray(settings?.topics)
      ? settings.topics.map(normalizeJourneyTopicFromSettings).filter((topic) => topic.id)
      : [];
    if (!configuredTopics.length) return;

    const jesusTopic = configuredTopics.find((topic) => topic.id === JESUS_TOPIC_ID);
    if (jesusTopic?.milestones?.length) {
      jesusTopic.milestones.forEach((milestone) => {
        const number = Number(milestone?.number);
        if (!Number.isFinite(number)) return;
        const existing = jesusMilestones.find((step) => step.number === number);
        const nextValues = {
          title: String(milestone.title || existing?.title || `Cột mốc ${number}`).trim(),
          reference: String(milestone.reference || existing?.reference || "").trim(),
          region: String(milestone.region || existing?.region || "").trim(),
          story: String(milestone.story || existing?.story || "").trim(),
          lesson: String(milestone.lesson || existing?.lesson || "").trim(),
          scene: String(milestone.scene || existing?.scene || "").trim(),
          cardImageUrl: String(milestone.cardImageUrl || existing?.cardImageUrl || "").trim(),
        };
        const x = Number(milestone.x);
        const y = Number(milestone.y);
        if (Number.isFinite(x)) nextValues.x = x;
        if (Number.isFinite(y)) nextValues.y = y;
        if (existing) {
          Object.assign(existing, nextValues);
        } else {
          jesusMilestones.push({ number, ...nextValues });
        }
      });
      jesusMilestones.sort((a, b) => a.number - b.number);
    }

    const baptismSettings = jesusTopic?.challenges?.[String(BAPTISM_STEP_NUMBER)] || jesusTopic?.challenges?.[BAPTISM_STEP_NUMBER];
    if (baptismSettings && typeof baptismSettings === "object") {
      baptismChallenge = {
        ...baptismChallenge,
        ...baptismSettings,
        title: String(baptismSettings.title || baptismChallenge.title).trim(),
        instruction: String(baptismSettings.instruction || baptismChallenge.instruction).trim(),
        verse: String(baptismSettings.verse || baptismChallenge.verse).trim(),
        verseRef: String(baptismSettings.verseRef || baptismChallenge.verseRef).trim(),
        sceneImageUrl: String(baptismSettings.sceneImageUrl || "").trim(),
        targets: Array.isArray(baptismSettings.targets) && baptismSettings.targets.length ? baptismSettings.targets : baptismChallenge.targets,
        options: Array.isArray(baptismSettings.options) && baptismSettings.options.length ? baptismSettings.options : baptismChallenge.options,
      };
      const rewardPoints = Number(baptismSettings.rewardPoints);
      if (Number.isFinite(rewardPoints) && rewardPoints >= 0) BAPTISM_REWARD_POINTS = rewardPoints;
    }

    topics = configuredTopics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      label: topic.label,
      enabled: topic.enabled,
      pickerImageUrl: topic.pickerImageUrl,
      steps: topic.id === JESUS_TOPIC_ID ? jesusMilestones.length : topic.steps,
    }));
  }

  async function loadJourneyBibleSettings() {
    if (typeof getJourneyBibleSettings !== "function") return;
    try {
      const settings = await getJourneyBibleSettings();
      applyJourneyBibleSettings(settings);
    } catch (error) {
      console.warn("Không thể tải cấu hình Hành trình Kinh Thánh", error);
    }
  }
  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function getFilteredTopics() {
    const keyword = normalizeText(state.search);
    const filtered = topics.filter((topic) =>
      normalizeText(`${topic.title} ${topic.description} ${topic.label}`).includes(keyword)
    );

    if (state.sort === "title-asc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title, "vi"));
    } else if (state.sort === "title-desc") {
      filtered.sort((a, b) => b.title.localeCompare(a.title, "vi"));
    } else if (state.sort === "steps-desc") {
      filtered.sort((a, b) => b.steps - a.steps);
    } else if (state.sort === "steps-asc") {
      filtered.sort((a, b) => a.steps - b.steps);
    }

    return filtered;
  }

  function getStepStatus(step) {
    if (progress.completed.has(step.number)) return "completed";
    if (progress.unlocked.has(step.number)) return "available";
    if (step.number <= 12) return "upcoming";
    return "locked";
  }

  function statusText(status) {
    return {
      completed: "Đã hoàn thành",
      available: "Có thể khám phá",
      upcoming: "Sắp mở khóa",
      locked: "Chưa mở khóa",
    }[status] || "Chưa mở khóa";
  }

  function isBaptismChallengeComplete() {
    return baptismChallenge.targets.every((target) => state.baptismSelectedSigns.has(target.signId));
  }

  function completeBaptismChallenge() {
    state.baptismCompleted = true;
    state.baptismTone = "success";
    state.baptismMessage = "Bạn đã ghép đúng 3 dấu chỉ của biến cố Chúa chịu phép rửa.";
    progress.completed.add(BAPTISM_STEP_NUMBER);
    progress.unlocked.add(4);

    if (!state.baptismRewarded) {
      progress.faithPoints += BAPTISM_REWARD_POINTS;
      progress.fragments = Math.min(progress.totalFragments, progress.fragments + 1);
      state.baptismRewarded = true;
    }
  }

  function handleBaptismChoice(signId) {
    const option = baptismChallenge.options.find((item) => item.id === signId);
    if (!option || state.baptismCompleted) return;

    if (!option.correct) {
      state.baptismTone = "error";
      state.baptismMessage = `${option.label} không thuộc biến cố Chúa chịu phép rửa. Hãy chọn dấu chỉ khác.`;
      renderBaptismChallenge();
      return;
    }

    state.baptismSelectedSigns.add(signId);
    state.baptismTone = "info";
    state.baptismMessage = `${option.label} đã được đặt đúng.`;

    if (isBaptismChallengeComplete()) {
      completeBaptismChallenge();
    }

    renderBaptismChallenge();
  }
  function renderPagination(totalItems) {
    const pageCount = Math.max(1, Math.ceil(totalItems / state.pageSize));
    if (state.page > pageCount) state.page = pageCount;
    if (pageCount <= 1) {
      pagination.innerHTML = "";
      return;
    }

    pagination.innerHTML = Array.from({ length: pageCount }, (_, index) => {
      const page = index + 1;
      return `<button class="${page === state.page ? "active" : ""}" type="button" data-page="${page}">${page}</button>`;
    }).join("");
  }

  function renderTopics() {
    const filtered = getFilteredTopics();
    renderPagination(filtered.length);
    const start = (state.page - 1) * state.pageSize;
    const pageItems = filtered.slice(start, start + state.pageSize);

    grid.innerHTML = pageItems.length
      ? pageItems
          .map(
            (topic) => `
              <button class="faith-picker-item journey-topic-card ${topic.enabled ? "is-ready" : ""}" type="button" data-topic-id="${topic.id}">
                ${topic.pickerImageUrl ? `<img class="journey-topic-image" src="${escapeAttr(topic.pickerImageUrl)}" alt="" loading="lazy" />` : ""}
                <span>${topic.label}</span>
                <strong>${topic.title}</strong>
                <small>${topic.steps} cột mốc</small>
              </button>
            `
          )
          .join("")
      : `<p class="journey-empty">Không tìm thấy chủ đề phù hợp.</p>`;
  }

  function renderStepDetail(step) {
    const status = getStepStatus(step);
    const isPlayable = status === "completed" || status === "available";
    return `
      <div class="journey-guide-content" data-status="${status}">
        <span>${statusText(status)}</span>
        <strong>${step.number}. ${step.title}</strong>
        <small>${step.region} · ${step.reference}</small>
        <p>${isPlayable ? step.story : "Hoàn thành các cột mốc trước để mở khóa chặng này."}</p>
        <em>${isPlayable ? step.lesson : "Con đường sẽ sáng lên khi bạn đủ điều kiện khám phá."}</em>
        <button class="journey-start-challenge" type="button" data-step="${step.number}" ${isPlayable ? "" : "disabled"}>Bắt đầu thử thách</button>
      </div>
    `;
  }

  function renderBaptismChallenge() {
    const step = jesusMilestones.find((item) => item.number === BAPTISM_STEP_NUMBER);
    const selectedCount = baptismChallenge.targets.filter((target) => state.baptismSelectedSigns.has(target.signId)).length;
    const message = state.baptismMessage || "Hãy chọn Nước sông, Chim bồ câu và Tiếng từ trời.";

    gameRoot.innerHTML = `
      <section class="journey-challenge-screen" aria-label="Thử thách ${step.title}">
        <button class="journey-challenge-back" type="button" id="journeyBackToMap">← Quay lại bản đồ</button>

        <header class="journey-challenge-hero">
          <span>Chặng ${step.number} · ${step.reference}</span>
          <h1>${step.title}</h1>
          <p>${baptismChallenge.title}</p>
        </header>

        <div class="journey-baptism-layout">
          <section class="journey-baptism-scene ${baptismChallenge.sceneImageUrl ? "has-custom-image" : ""}" aria-label="Khung cảnh sông Giođan">
            ${baptismChallenge.sceneImageUrl
              ? `<img class="journey-baptism-custom-image" src="${escapeAttr(baptismChallenge.sceneImageUrl)}" alt="${escapeAttr(step.title)}" />`
              : `
                <div class="journey-baptism-sky"></div>
                <div class="journey-baptism-light"></div>
                <div class="journey-baptism-river"></div>
                <div class="journey-baptism-figure jesus"><span></span></div>
                <div class="journey-baptism-figure john"><span></span></div>
                <p>Sông Giođan</p>
              `}
          </section>

          <section class="journey-sign-board">
            <div class="journey-sign-head">
              <span>${selectedCount}/${baptismChallenge.targets.length}</span>
              <div>
                <strong>${baptismChallenge.instruction}</strong>
                <small>Chọn đúng để mở lời Kinh Thánh và nhận thưởng.</small>
              </div>
            </div>

            <div class="journey-sign-slots" aria-label="Ba dấu chỉ cần tìm">
              ${baptismChallenge.targets
                .map((target, index) => {
                  const isFilled = state.baptismSelectedSigns.has(target.signId);
                  return `
                    <div class="journey-sign-slot ${isFilled ? "filled" : ""}">
                      <span>${index + 1}</span>
                      <strong>${target.label}</strong>
                      <small>${isFilled ? target.reveal : target.hint}</small>
                    </div>
                  `;
                })
                .join("")}
            </div>

            <div class="journey-sign-options" aria-label="Các dấu chỉ để chọn">
              ${baptismChallenge.options
                .map((option) => {
                  const isSelected = state.baptismSelectedSigns.has(option.id);
                  return `
                    <button
                      class="journey-sign-option ${isSelected ? "selected" : ""}"
                      type="button"
                      data-sign="${option.id}"
                      ${isSelected || state.baptismCompleted ? "disabled" : ""}
                    >
                      <span>${option.icon}</span>
                      <strong>${option.label}</strong>
                      <small>${option.text}</small>
                    </button>
                  `;
                })
                .join("")}
            </div>

            <p class="journey-challenge-message ${state.baptismTone}">${message}</p>

            ${
              state.baptismCompleted
                ? `
                  <div class="journey-challenge-result">
                    <blockquote>“${baptismChallenge.verse}”<span>${baptismChallenge.verseRef}</span></blockquote>
                    <p>+${BAPTISM_REWARD_POINTS} điểm đức tin · Mở khóa 1 mảnh Kinh Thánh</p>
                    <button class="journey-return-map" type="button">Tiếp tục hành trình</button>
                  </div>
                `
                : ""
            }
          </section>
        </div>
      </section>
    `;
  }
  function renderJourneyGame() {
    const selectedStep = jesusMilestones.find((step) => step.number === state.selectedStepNumber) || jesusMilestones[3];
    const pathPoints = jesusMilestones.map((step) => `${step.x},${step.y}`).join(" ");

    gameRoot.innerHTML = `
      <div class="journey-game-layout">
        <aside class="journey-guide" id="journeyGuide" aria-live="polite">
          ${renderStepDetail(selectedStep)}
        </aside>
        <div class="journey-map-stage">

        <section class="journey-hud" aria-label="Tiến trình người chơi">
          <div><strong>★</strong><span>Điểm đức tin</span><b>${progress.faithPoints}</b></div>
          <div><strong>▰</strong><span>Mảnh Kinh Thánh</span><b>${progress.fragments}/${progress.totalFragments}</b></div>
          <div><strong>◇</strong><span>Huy hiệu</span><b>${progress.badges}</b></div>
        </section>

        <div class="journey-actions" aria-label="Tác vụ nhanh">
          <button type="button">Suy niệm</button>
          <button type="button">Phần thưởng</button>
        </div>

        <div class="journey-compass" aria-hidden="true"><span>N</span><span>E</span><span>S</span><span>W</span></div>

        <svg class="journey-road-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="${pathPoints}" />
        </svg>

        <div class="journey-milestones" aria-label="Các cột mốc hành trình">
          ${jesusMilestones
            .map((step) => {
              const status = getStepStatus(step);
              return `
                <button
                  class="journey-step-card ${status} ${step.number === selectedStep.number ? "selected" : ""}"
                  type="button"
                  data-step="${step.number}"
                  data-step-number="${step.number}"
                  style="--x:${step.x}%;--y:${step.y}%"
                  aria-label="${step.title} - ${statusText(status)}"
                >
                  <span class="journey-step-number">${step.number}</span>
                  <span class="journey-step-lock" aria-hidden="true">${status === "locked" ? "▣" : status === "completed" ? "✓" : ""}</span>
                  <span class="journey-step-visual ${step.cardImageUrl ? "has-image" : ""}" data-scene="${step.scene}" ${step.cardImageUrl ? `style="background-image:url(&quot;${escapeAttr(step.cardImageUrl)}&quot;)"` : ""}></span>
                  <strong>${step.title}</strong>
                  <small>${step.reference}</small>
                </button>
              `;
            })
            .join("")}
        </div>

        <aside class="journey-legend" aria-label="Chú thích trạng thái">
          <h2>Chú thích</h2>
          <p><span class="completed"></span>Đã hoàn thành</p>
          <p><span class="available"></span>Có thể khám phá</p>
          <p><span class="upcoming"></span>Sắp mở khóa</p>
          <p><span class="locked"></span>Chưa mở khóa</p>
        </aside>

        <blockquote class="journey-verse">
          “Hãy đi khắp thế gian, loan báo Tin Mừng cho mọi loài thọ tạo.”<br />
          <span>Mc 16,15</span>
        </blockquote>

        <button class="journey-back-to-topics" type="button" id="journeyBackToTopics">← Chọn chủ đề khác</button>
        </div>
      </div>
    `;
  }

  function showJourneyGame(topicId) {
    if (topicId !== JESUS_TOPIC_ID) {
      alert("Chủ đề này đang được chuẩn bị. Hiện tại mình bắt đầu trước với Hành trình theo dấu chân Chúa Giêsu.");
      return;
    }

    document.body.classList.remove("faith-choosing-set");
    document.body.classList.add("journey-playing");
    document.body.classList.remove("journey-challenge-mode");
    picker.hidden = true;
    game.hidden = false;
    state.activeView = "map";
    state.selectedStepNumber = BAPTISM_STEP_NUMBER;
    renderJourneyGame();
  }

  function returnToTopics() {
    document.body.classList.add("faith-choosing-set");
    document.body.classList.remove("journey-playing");
    document.body.classList.remove("journey-challenge-mode");
    game.hidden = true;
    picker.hidden = false;
    renderTopics();
  }

  function returnToMap() {
    state.activeView = "map";
    document.body.classList.remove("journey-challenge-mode");
    renderJourneyGame();
  }

  function startStepChallenge(stepNumber) {
    const step = jesusMilestones.find((item) => item.number === stepNumber);
    if (!step) return;

    if (step.number !== BAPTISM_STEP_NUMBER) {
      alert("Thử thách của chặng này đang được chuẩn bị. Hiện tại mình làm trước chặng Chúa chịu phép rửa.");
      return;
    }

    state.selectedStepNumber = step.number;
    state.activeView = "baptism";
    document.body.classList.add("journey-challenge-mode");
    renderBaptismChallenge();
  }
  searchInput.addEventListener("input", () => {
    state.search = searchInput.value;
    state.page = 1;
    renderTopics();
  });

  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    state.page = 1;
    renderTopics();
  });

  pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button) return;
    state.page = Number(button.dataset.page) || 1;
    renderTopics();
  });

  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".journey-topic-card");
    if (!button) return;
    showJourneyGame(button.dataset.topicId);
  });

  gameRoot.addEventListener("click", (event) => {
    const backButton = event.target.closest("#journeyBackToTopics");
    if (backButton) {
      returnToTopics();
      return;
    }

    const backToMapButton = event.target.closest("#journeyBackToMap, .journey-return-map");
    if (backToMapButton) {
      returnToMap();
      return;
    }

    const signButton = event.target.closest(".journey-sign-option");
    if (signButton && !signButton.disabled) {
      handleBaptismChoice(signButton.dataset.sign);
      return;
    }

    const stepButton = event.target.closest(".journey-step-card");
    if (stepButton) {
      state.selectedStepNumber = Number(stepButton.dataset.step) || 1;
      state.activeView = "map";
      renderJourneyGame();
      return;
    }

    const challengeButton = event.target.closest(".journey-start-challenge");
    if (challengeButton && !challengeButton.disabled) {
      startStepChallenge(Number(challengeButton.dataset.step) || state.selectedStepNumber);
    }
  });
  loadJourneyBibleSettings().finally(renderTopics);
})();