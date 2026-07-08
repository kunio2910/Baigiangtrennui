const fallbackImage = "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80";
const CONTENT_TYPES = ["saints", "churches", "articles", "events", "daily", "banners"];

const defaultContent = {
  daily: [
    {
      quote: "Hãy đến cùng Thầy, hỡi những ai khó nhọc và gánh nặng nề, Thầy sẽ cho nghỉ ngơi bồi dưỡng.",
      ref: "Mt 11,28",
    },
    {
      quote: "Anh em hãy yêu thương nhau như Thầy đã yêu thương anh em.",
      ref: "Ga 15,12",
    },
    {
      quote: "Phúc thay ai xây dựng hòa bình, vì họ sẽ được gọi là con Thiên Chúa.",
      ref: "Mt 5,9",
    },
  ],
  saints: [
    {
      id: "saint-1",
      type: "saints",
      title: "Thánh Giuse",
      description: "Người công chính, đấng bảo trợ Giáo Hội hoàn vũ.",
      meta: "Gương mẫu thầm lặng",
      image: "https://images.unsplash.com/photo-1594808830893-c41d8f5ff5d2?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "saint-2",
      type: "saints",
      title: "Thánh Maria",
      description: "Mẹ Thiên Chúa, mẫu gương của đức tin và vâng phục.",
      meta: "Mẹ của niềm hy vọng",
      image: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "saint-3",
      type: "saints",
      title: "Thánh Phanxicô Assisi",
      description: "Sống khó nghèo, yêu thiên nhiên và muôn loài.",
      meta: "Niềm vui Tin Mừng",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "saint-4",
      type: "saints",
      title: "Thánh Têrêsa Hài Đồng Giêsu",
      description: "Con đường nhỏ: tin tưởng và yêu mến Chúa mỗi ngày.",
      meta: "Bổn mạng truyền giáo",
      image: "https://images.unsplash.com/photo-1548625361-58a9b86aa83b?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "saint-5",
      type: "saints",
      title: "Thánh Phaolô",
      description: "Tông đồ dân ngoại, rao giảng Tin Mừng khắp nơi.",
      meta: "Nhà truyền giáo tiên khởi",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=80",
    },
  ],
  churches: [
    {
      id: "church-1",
      type: "churches",
      title: "Nhà thờ Đức Bà Sài Gòn",
      description: "Biểu tượng đức tin giữa trung tâm thành phố.",
      meta: "TP Hồ Chí Minh",
      image: "https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "church-2",
      type: "churches",
      title: "Nhà thờ Lớn Hà Nội",
      description: "Không gian cầu nguyện cổ kính và trang nghiêm.",
      meta: "Hà Nội",
      image: "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: "church-3",
      type: "churches",
      title: "Nhà thờ Phú Nhai",
      description: "Một trong những đền thánh lớn tại miền Bắc.",
      meta: "Nam Định",
      image: "https://images.unsplash.com/photo-1514896856000-91cb6de818e0?auto=format&fit=crop&w=900&q=80",
    },
  ],
  articles: [
    {
      id: "article-1",
      type: "articles",
      title: "Sức mạnh của lời cầu nguyện",
      description: "Cầu nguyện là hơi thở của linh hồn. Khi chúng ta đến với Chúa trong cầu nguyện, Ngài ban bình an.",
      meta: "Suy niệm",
      image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "article-2",
      type: "articles",
      title: "Ý nghĩa của Thập Giá",
      description: "Thập Giá không phải là dấu chấm hết, nhưng là khởi đầu của ơn cứu độ và niềm hy vọng cho nhân loại.",
      meta: "Giáo lý",
      image: "https://images.unsplash.com/photo-1528357136257-0c25517acfea?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "article-3",
      type: "articles",
      title: "Chúa đã sống lại!",
      description: "Niềm vui Phục Sinh nhắc nhở chúng ta rằng sự chết đã bị đánh bại và sự sống đời đời đã được ban cho.",
      meta: "Tin Mừng",
      image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  events: [
    {
      id: "event-1",
      type: "events",
      title: "Thánh Lễ Chúa Nhật",
      description: "Cùng cộng đoàn tham dự Thánh Lễ và lắng nghe Lời Chúa.",
      meta: "08:00 - Nhà thờ Đức Bà Sài Gòn",
      date: "2026-08-25",
      image: fallbackImage,
    },
    {
      id: "event-2",
      type: "events",
      title: "Giờ Chầu Thánh Thể",
      description: "Thinh lặng bên Chúa Giêsu Thánh Thể.",
      meta: "19:30 - Nhà thờ Lớn Hà Nội",
      date: "2026-08-31",
      image: fallbackImage,
    },
    {
      id: "event-3",
      type: "events",
      title: "Khóa Tĩnh Tâm",
      description: "Một ngày trở về với Chúa qua cầu nguyện và chia sẻ.",
      meta: "08:00 - Trung tâm Mục vụ",
      date: "2026-09-05",
      image: fallbackImage,
    },
  ],
};

defaultContent.daily = defaultContent.daily.map((item, index) => ({
  id: item.id || `daily-${index + 1}`,
  type: "daily",
  title: item.title || item.ref || `Loi Chua ${index + 1}`,
  description: item.description || item.quote || "",
  meta: item.meta || item.ref || "",
  image:
    item.image ||
    [
      "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528357136257-0c25517acfea?auto=format&fit=crop&w=1200&q=80",
    ][index % 3],
  ...item,
}));

defaultContent.banners = [
  {
    id: "banner-main",
    type: "banners",
    title: "Duc Kito la anh sang the gian",
    description:
      "Thay la anh sang the gian: ai theo Thay, se khong di trong bong toi, nhung se duoc anh sang dem lai su song. (Ga 8,12)",
    meta: "Banner chinh",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80",
  },
];

const saintBiographyDefaults = {
  "thanh-giuse": {
    meta: "Đấng công chính",
    description: "Thánh Giuse là bạn trăm năm của Đức Maria, cha nuôi của Chúa Giêsu và là mẫu gương âm thầm của đời sống gia đình.",
    bodyHtml: `
      <h2>Tiểu sử</h2>
      <p>Thánh Giuse là người công chính thuộc dòng dõi vua Đavít. Tin Mừng mô tả ngài là bạn trăm năm của Đức Maria và là người được Thiên Chúa trao phó trách nhiệm chăm sóc Chúa Giêsu trong gia đình Nazareth.</p>
      <p>Khi biết Đức Maria mang thai bởi quyền năng Chúa Thánh Thần, thánh Giuse đã lắng nghe lời sứ thần trong mộng và đón nhận Mẹ Maria về nhà. Ngài hiện diện trong những biến cố đầu đời của Chúa Giêsu: hành trình về Bêlem, cuộc trốn sang Ai Cập, rồi trở về Nazareth để sống đời lao động khiêm tốn.</p>
      <h3>Nhân đức nổi bật</h3>
      <p>Thánh Giuse nêu gương về sự vâng phục, thinh lặng, trách nhiệm và lòng tín thác. Ngài không để lại lời nói nào trong Kinh Thánh, nhưng đời sống của ngài là một chứng tá mạnh mẽ về đức tin được diễn tả bằng hành động.</p>
      <h3>Ý nghĩa thiêng liêng</h3>
      <p>Giáo Hội tôn kính thánh Giuse như bổn mạng của Hội Thánh hoàn vũ, của các gia đình, người lao động và những ai muốn sống đời công chính trong âm thầm.</p>
    `,
  },
  "thanh-maria": {
    meta: "Mẹ Thiên Chúa",
    description: "Đức Maria là Mẹ Chúa Giêsu, mẫu gương của đức tin, sự vâng phục và lòng tín thác trọn vẹn vào Thiên Chúa.",
    bodyHtml: `
      <h2>Tiểu sử</h2>
      <p>Đức Maria là người nữ Do Thái tại Nazareth, được Thiên Chúa tuyển chọn để làm Mẹ Đấng Cứu Thế. Trong biến cố Truyền Tin, Mẹ đã thưa lời xin vâng, đón nhận ý định của Thiên Chúa với lòng khiêm nhường và tín thác.</p>
      <p>Mẹ Maria đồng hành với Chúa Giêsu từ mầu nhiệm Nhập Thể, sinh hạ Người tại Bêlem, chăm sóc Người trong đời sống ẩn dật tại Nazareth, cho đến khi đứng dưới chân thập giá. Sau Phục Sinh, Mẹ hiện diện với các môn đệ trong cầu nguyện.</p>
      <h3>Nhân đức nổi bật</h3>
      <p>Mẹ là mẫu gương của đức tin lắng nghe, lòng khiêm nhường, sự vâng phục và tình mẫu tử. Mẹ ghi nhớ và suy niệm mọi biến cố trong lòng, để luôn tìm kiếm thánh ý Thiên Chúa.</p>
      <h3>Ý nghĩa thiêng liêng</h3>
      <p>Người Kitô hữu tôn kính Đức Maria như Mẹ Thiên Chúa và người Mẹ dẫn đưa con cái đến với Chúa Giêsu. Nơi Mẹ, Hội Thánh nhận ra hình ảnh của người môn đệ hoàn hảo.</p>
    `,
  },
  "thanh-phanxico-assisi": {
    meta: "Sống nghèo khó và yêu thiên nhiên",
    description: "Thánh Phanxicô Assisi là người sáng lập Dòng Anh Em Hèn Mọn, nổi bật với tinh thần nghèo khó, hòa bình và yêu mến công trình tạo dựng.",
    bodyHtml: `
      <h2>Tiểu sử</h2>
      <p>Thánh Phanxicô Assisi sinh khoảng năm 1181 tại Assisi, nước Ý, trong một gia đình thương gia khá giả. Sau thời trẻ nhiều mơ mộng và biến cố bệnh tật, ngài dần nhận ra tiếng gọi của Thiên Chúa nơi người nghèo, người phong cùi và trong cầu nguyện.</p>
      <p>Trước thánh giá tại nhà nguyện San Damiano, ngài nghe lời mời gọi hãy sửa lại Hội Thánh. Từ đó, Phanxicô từ bỏ của cải, chọn đời sống nghèo khó, rao giảng Tin Mừng bằng sự đơn sơ và thành lập Dòng Anh Em Hèn Mọn.</p>
      <h3>Nhân đức nổi bật</h3>
      <p>Ngài sống tinh thần nghèo khó triệt để, yêu mến hòa bình, khiêm hạ và gần gũi mọi thụ tạo. Tình yêu dành cho thiên nhiên của ngài xuất phát từ niềm tin rằng mọi loài đều phản chiếu vẻ đẹp của Đấng Tạo Hóa.</p>
      <h3>Ý nghĩa thiêng liêng</h3>
      <p>Thánh Phanxicô nhắc người Kitô hữu sống đơn sơ, phục vụ người nghèo và xây dựng hòa bình. Ngài cũng là bổn mạng của môi sinh và những ai dấn thân chăm sóc công trình tạo dựng.</p>
    `,
  },
  "thanh-teresa-hai-dong-giesu": {
    meta: "Con đường nhỏ",
    description: "Thánh Têrêsa Hài Đồng Giêsu là nữ tu Cát Minh, tiến sĩ Hội Thánh, nổi tiếng với linh đạo con đường nhỏ của tình yêu và tín thác.",
    bodyHtml: `
      <h2>Tiểu sử</h2>
      <p>Thánh Têrêsa Hài Đồng Giêsu, tên khai sinh là Marie-Françoise-Thérèse Martin, sinh năm 1873 tại Alençon, Pháp. Từ nhỏ, Têrêsa đã có lòng yêu mến Chúa sâu xa và khao khát dâng mình trong đời sống tu trì.</p>
      <p>Năm 15 tuổi, sau nhiều khó khăn, ngài được vào đan viện Cát Minh Lisieux. Trong đời sống âm thầm của đan viện, Têrêsa khám phá con đường nên thánh qua những việc nhỏ bé được làm với tình yêu lớn lao.</p>
      <h3>Nhân đức nổi bật</h3>
      <p>Linh đạo của thánh Têrêsa được gọi là con đường nhỏ: sống khiêm nhường, tin tưởng như trẻ thơ, yêu mến Chúa trong từng bổn phận nhỏ hằng ngày và phó thác cả những yếu đuối cho lòng thương xót của Thiên Chúa.</p>
      <h3>Ý nghĩa thiêng liêng</h3>
      <p>Dù sống đời kín ẩn và qua đời khi còn rất trẻ, Têrêsa trở thành bổn mạng các xứ truyền giáo. Ngài cho thấy sự thánh thiện không hệ tại những việc phi thường, nhưng ở tình yêu trung thành trong điều bé nhỏ.</p>
    `,
  },
  "thanh-phaolo": {
    meta: "Tông đồ dân ngoại",
    description: "Thánh Phaolô là vị tông đồ lớn của Hội Thánh sơ khai, người rao giảng Tin Mừng cho muôn dân sau biến cố hoán cải trên đường Đamas.",
    bodyHtml: `
      <h2>Tiểu sử</h2>
      <p>Thánh Phaolô, trước kia là Saolô thành Tarsô, là người Do Thái nhiệt thành với Lề Luật. Ban đầu, ông tham gia bách hại các môn đệ Chúa Giêsu. Trên đường đi Đamas, Saolô gặp Đức Kitô Phục Sinh và được biến đổi tận căn.</p>
      <p>Sau khi chịu phép rửa, Phaolô trở thành nhà truyền giáo lớn của Hội Thánh. Ngài thực hiện nhiều hành trình rao giảng, thành lập các cộng đoàn Kitô hữu và viết nhiều thư tín quan trọng trong Tân Ước.</p>
      <h3>Nhân đức nổi bật</h3>
      <p>Thánh Phaolô nổi bật với lòng nhiệt thành truyền giáo, tình yêu dành cho Đức Kitô và khả năng giải thích đức tin cho các dân ngoại. Ngài chịu nhiều gian nan nhưng luôn xác tín rằng không gì có thể tách người tín hữu khỏi tình yêu của Thiên Chúa.</p>
      <h3>Ý nghĩa thiêng liêng</h3>
      <p>Cuộc đời thánh Phaolô là chứng tá về sức mạnh của ơn hoán cải. Từ một người bách hại, ngài trở thành khí cụ loan báo Tin Mừng cho muôn dân.</p>
    `,
  },
  "thanh-phero": {
    meta: "Đá tảng của Hội Thánh",
    description: "Thánh Phêrô là một trong Mười Hai Tông Đồ, người được Chúa Giêsu trao sứ mạng củng cố anh em và chăm sóc đoàn chiên.",
    bodyHtml: `
      <h2>Tiểu sử</h2>
      <p>Thánh Phêrô, tên ban đầu là Simon, là một ngư phủ miền Galilê. Chúa Giêsu gọi ông đi theo Người và đặt tên là Phêrô, nghĩa là đá tảng. Ông thuộc nhóm môn đệ thân tín, chứng kiến nhiều biến cố quan trọng trong sứ vụ của Chúa.</p>
      <p>Dù từng yếu đuối và chối Thầy trong cuộc Thương Khó, Phêrô đã được Chúa Phục Sinh tha thứ và trao sứ mạng chăn dắt đoàn chiên. Sau lễ Ngũ Tuần, ngài mạnh dạn rao giảng Đức Kitô và trở thành một trong những trụ cột của Hội Thánh sơ khai.</p>
      <h3>Nhân đức nổi bật</h3>
      <p>Thánh Phêrô cho thấy hành trình đức tin của người môn đệ: có nhiệt thành, có yếu đuối, có nước mắt sám hối và có ơn biến đổi. Sự khiêm nhường sau vấp ngã giúp ngài trở nên chứng nhân mạnh mẽ của lòng thương xót.</p>
      <h3>Ý nghĩa thiêng liêng</h3>
      <p>Ngài được truyền thống Kitô giáo tôn kính như vị lãnh đạo đầu tiên của Hội Thánh tại Rôma. Cuộc đời Phêrô nhắc người tín hữu biết đứng dậy sau yếu đuối và để Chúa dùng mình trong sứ mạng phục vụ.</p>
    `,
  },
};

function normalizeSaintKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function enrichSaintBiography(item) {
  const key = normalizeSaintKey(item.title || item.id);
  const fallback = saintBiographyDefaults[key];
  if (!fallback) return item;

  return {
    ...item,
    meta: item.meta || fallback.meta,
    description:
      !item.description || item.description.length < 80 ? fallback.description : item.description,
    bodyHtml: item.bodyHtml || fallback.bodyHtml,
  };
}

defaultContent.saints = defaultContent.saints.map(enrichSaintBiography);

function isFirebaseConfigured() {
  return Boolean(
    window.KITO_FIREBASE_CONFIG &&
      window.KITO_FIREBASE_CONFIG.apiKey &&
      !window.KITO_FIREBASE_CONFIG.apiKey.includes("DAN_")
  );
}

function requireFirebase() {
  if (!isFirebaseConfigured()) {
    throw new Error("Bạn chưa cấu hình Firebase. Hãy dán firebaseConfig vào file firebase-config.js.");
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(window.KITO_FIREBASE_CONFIG);
  }

  return {
    db: firebase.firestore(),
    storage: firebase.storage(),
  };
}

async function seedDefaultContentIfEmpty(force = false) {
  const { db } = requireFirebase();
  const sample = await db.collection("contents").limit(1).get();
  if (!force && !sample.empty) {
    const current = await db.collection("contents").get();
    const existingTypes = new Set();
    current.forEach((doc) => {
      const item = doc.data();
      if (item.type) existingTypes.add(item.type);
    });

    const missingTypes = ["daily", "banners"].filter((type) => !existingTypes.has(type));
    if (!missingTypes.length) return;

    const missingBatch = db.batch();
    missingTypes.forEach((type) => {
      defaultContent[type].forEach((item, index) => {
        const ref = db.collection("contents").doc(item.id);
        missingBatch.set(ref, {
          ...item,
          status: item.status || "actived",
          sortOrder: index,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
    });
    await missingBatch.commit();
    return;
  }

  if (force) {
    const current = await db.collection("contents").get();
    const deleteBatch = db.batch();
    current.forEach((doc) => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
  }

  const batch = db.batch();
  CONTENT_TYPES.forEach((type) => {
    defaultContent[type].forEach((item, index) => {
      const ref = db.collection("contents").doc(item.id);
      batch.set(ref, {
        ...item,
        status: item.status || "actived",
        sortOrder: index,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    });
  });
  await batch.commit();
}

async function getContent() {
  await seedDefaultContentIfEmpty();
  const { db } = requireFirebase();
  const snapshot = await db.collection("contents").get();
  const content = {
    daily: [],
    banners: [],
    saints: [],
    churches: [],
    articles: [],
    events: [],
  };

  snapshot.forEach((doc) => {
    const rawItem = { id: doc.id, ...doc.data() };
    const item = rawItem.type === "saints" ? enrichSaintBiography(rawItem) : rawItem;
    if (CONTENT_TYPES.includes(item.type)) {
      content[item.type].push(item);
    }
  });

  CONTENT_TYPES.forEach((type) => {
    content[type].sort((a, b) => {
      const orderA = Number.isFinite(a.sortOrder) ? a.sortOrder : 9999;
      const orderB = Number.isFinite(b.sortOrder) ? b.sortOrder : 9999;
      return orderA - orderB || String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });
  });

  if (!content.daily.length) content.daily = structuredClone(defaultContent.daily);
  if (!content.banners.length) content.banners = structuredClone(defaultContent.banners);

  return content;
}

async function saveContentItem(type, item) {
  const { db } = requireFirebase();
  const id = item.id || `${type}-${Date.now()}`;
  const ref = db.collection("contents").doc(id);
  const exists = (await ref.get()).exists;
  const preparedItem = type === "saints" ? enrichSaintBiography({ ...item, id, type }) : item;
  const payload = {
    ...preparedItem,
    id,
    type,
    status: preparedItem.status || "actived",
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  if (!exists) {
    payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  }

  await ref.set(payload, { merge: true });
  return id;
}

async function fillSaintBiographies() {
  const { db } = requireFirebase();
  const snapshot = await db.collection("contents").where("type", "==", "saints").get();
  const batch = db.batch();
  let updatedCount = 0;

  snapshot.forEach((doc) => {
    const current = { id: doc.id, ...doc.data() };
    const enriched = enrichSaintBiography(current);
    const patch = {};

    if (!current.meta && enriched.meta) patch.meta = enriched.meta;
    if ((!current.description || current.description.length < 80) && enriched.description) {
      patch.description = enriched.description;
    }
    if (!current.bodyHtml && enriched.bodyHtml) patch.bodyHtml = enriched.bodyHtml;
    if (!current.status) patch.status = "actived";

    if (Object.keys(patch).length) {
      patch.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      batch.set(doc.ref, patch, { merge: true });
      updatedCount += 1;
    }
  });

  if (updatedCount) await batch.commit();
  return updatedCount;
}

async function updateContentOrder(type, orderedIds) {
  const { db } = requireFirebase();
  const batch = db.batch();

  orderedIds.forEach((id, index) => {
    batch.set(
      db.collection("contents").doc(id),
      {
        sortOrder: index,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  await batch.commit();
}

async function deleteContentItem(id) {
  const { db } = requireFirebase();
  await db.collection("contents").doc(id).delete();
}

async function submitContentRating(id, ratings) {
  const contentRating = Math.max(1, Math.min(5, Number(ratings?.content || 0)));
  const layoutRating = Math.max(1, Math.min(5, Number(ratings?.layout || 0)));
  if (!contentRating || !layoutRating) throw new Error("Vui lòng chọn đủ đánh giá nội dung và trình bày.");

  const { db } = requireFirebase();
  await db.collection("contents").doc(id).set(
    {
      contentRatingCount: firebase.firestore.FieldValue.increment(1),
      contentRatingTotal: firebase.firestore.FieldValue.increment(contentRating),
      layoutRatingCount: firebase.firestore.FieldValue.increment(1),
      layoutRatingTotal: firebase.firestore.FieldValue.increment(layoutRating),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

async function submitContentFeedback(item, message) {
  const feedbackMessage = String(message || "").trim();
  if (!feedbackMessage) throw new Error("Vui lòng nhập ý kiến đóng góp.");

  const { db } = requireFirebase();
  await db.collection("feedbacks").add({
    contentId: item.id,
    contentType: item.type || "",
    contentTitle: item.title || "",
    message: feedbackMessage,
    pageUrl: window.location.href,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    createdAtText: new Date().toISOString(),
  });
}

async function getContentFeedbacks(limit = 100) {
  const { db } = requireFirebase();
  const snapshot = await db
    .collection("feedbacks")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  const feedbacks = [];
  snapshot.forEach((doc) => {
    feedbacks.push({ id: doc.id, ...doc.data() });
  });
  return feedbacks;
}

async function deleteContentFeedback(id) {
  const { db } = requireFirebase();
  await db.collection("feedbacks").doc(id).delete();
}

async function resetContentRating(id) {
  const { db } = requireFirebase();
  await db.collection("contents").doc(id).set(
    {
      ratingCount: 0,
      ratingTotal: 0,
      contentRatingCount: 0,
      contentRatingTotal: 0,
      layoutRatingCount: 0,
      layoutRatingTotal: 0,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
}

async function resetContent() {
  await seedDefaultContentIfEmpty(true);
}

function formatDateParts(value) {
  const rawValue = String(value || "").trim();
  if (!rawValue) return { day: "--", month: "THÁNG --", display: "" };

  if (!/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    return {
      day: "",
      month: rawValue,
      display: rawValue,
      isText: true,
    };
  }

  const date = new Date(`${rawValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return {
      day: "",
      month: rawValue,
      display: rawValue,
      isText: true,
    };
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = `THÁNG ${String(date.getMonth() + 1).padStart(2, "0")}`;
  return {
    day,
    month,
    display: `${day} ${month}`,
    isText: false,
  };
}

const navigationPageTitles = {
  saints: "Các thánh tiêu biểu",
  churches: "Giới thiệu nhà thờ",
  articles: "Bài viết & suy niệm",
  events: "Sự kiện sắp tới",
};

function cleanNavigationTitle(title) {
  const value = String(title || "")
    .replace(/\s+-\s+Truyền Giáo Kitô\s*$/i, "")
    .trim();

  if (!value || value === "Truyền Giáo Kitô") return "Trang chủ";
  return value;
}

function getNavigationTitleFromUrl(url) {
  try {
    const parsed = new URL(url, window.location.href);
    const path = parsed.pathname.toLowerCase();

    if (path.endsWith("/") || path.endsWith("/index.html")) return "Trang chủ";
    if (path.endsWith("/admin.html")) return "trang quản lý";
    if (path.endsWith("/accounts.html")) return "trang tài khoản";
    if (path.endsWith("/category.html")) {
      return navigationPageTitles[parsed.searchParams.get("type")] || "trang danh mục";
    }
  } catch (error) {
    return "";
  }

  return "";
}

function getStoredNavigationPage() {
  try {
    const current = JSON.parse(sessionStorage.getItem("kitoCurrentPage") || "null");
    if (!current?.url) return null;
    const currentUrl = new URL(window.location.href);
    const storedUrl = new URL(current.url, window.location.href);
    if (currentUrl.href === storedUrl.href) return null;
    return current;
  } catch (error) {
    return null;
  }
}

function setupBackLink(fallbackUrl = "index.html", fallbackTitle = "Trang chủ", options = {}) {
  const link = document.querySelector(".back-link");
  if (!link) return;

  const storedPage = options.useStored === false ? null : getStoredNavigationPage();
  let sameOriginReferrer = false;
  if (document.referrer) {
    try {
      sameOriginReferrer = new URL(document.referrer).origin === window.location.origin;
    } catch (error) {
      sameOriginReferrer = false;
    }
  }
  const referrerTitle = sameOriginReferrer ? getNavigationTitleFromUrl(document.referrer) : "";
  const referrerPage = sameOriginReferrer && referrerTitle
    ? {
        url: document.referrer,
        title: referrerTitle,
      }
    : null;
  const target = referrerPage || storedPage || {
    url: sameOriginReferrer ? document.referrer : fallbackUrl,
    title: referrerTitle || fallbackTitle,
  };

  link.href = target.url || fallbackUrl;
  link.textContent = `← Quay lại ${cleanNavigationTitle(target.title)}`;
  link.addEventListener("click", (event) => {
    if (options.useHistory !== false && target.url && window.history.length > 1) {
      event.preventDefault();
      window.history.back();
    }
  });
}

function rememberCurrentPage(title = document.title) {
  try {
    sessionStorage.setItem(
      "kitoCurrentPage",
      JSON.stringify({
        title: cleanNavigationTitle(title),
        url: window.location.href,
      })
    );
  } catch (error) {
    // Session history is a small enhancement; navigation still works without it.
  }
}
