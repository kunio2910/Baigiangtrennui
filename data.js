const fallbackImage = "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80";
const CONTENT_TYPES = ["saints", "churches", "articles", "events"];

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
  if (!force && !sample.empty) return;

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
    daily: structuredClone(defaultContent.daily),
    saints: [],
    churches: [],
    articles: [],
    events: [],
  };

  snapshot.forEach((doc) => {
    const item = { id: doc.id, ...doc.data() };
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

  return content;
}

async function saveContentItem(type, item) {
  const { db } = requireFirebase();
  const id = item.id || `${type}-${Date.now()}`;
  const ref = db.collection("contents").doc(id);
  const exists = (await ref.get()).exists;
  const payload = {
    ...item,
    id,
    type,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  if (!exists) {
    payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  }

  await ref.set(payload, { merge: true });
  return id;
}

async function deleteContentItem(id) {
  const { db } = requireFirebase();
  await db.collection("contents").doc(id).delete();
}

async function resetContent() {
  await seedDefaultContentIfEmpty(true);
}

function formatDateParts(value) {
  if (!value) return { day: "--", month: "THÁNG --" };
  const date = new Date(`${value}T00:00:00`);
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: `THÁNG ${String(date.getMonth() + 1).padStart(2, "0")}`,
  };
}
