const SESSION_KEY = "kito-session-v1";

const defaultUsers = [];

function getAuthDb() {
  return requireFirebase().db;
}

async function seedDefaultUsersIfEmpty() {
  // Automatic account seeding is disabled. Create admin users directly in Firestore or Firebase Auth.
  return;
}

async function getUsers() {
  await seedDefaultUsersIfEmpty();
  const snapshot = await getAuthDb().collection("users").get();
  const users = [];
  snapshot.forEach((doc) => users.push({ id: doc.id, ...doc.data() }));
  return users.sort((a, b) => {
    if (a.username === "admin") return -1;
    if (b.username === "admin") return 1;
    return a.username.localeCompare(b.username);
  });
}

async function login(username, password) {
  const cleanUsername = username.trim();
  const user = (await getUsers()).find(
    (entry) => entry.username === cleanUsername && entry.password === password
  );

  if (!user) return null;

  const session = {
    id: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

async function getCurrentUser() {
  const saved = sessionStorage.getItem(SESSION_KEY);
  if (!saved) return null;

  try {
    const session = JSON.parse(saved);
    const doc = await getAuthDb().collection("users").doc(session.id).get();
    if (!doc.exists) {
      logout();
      return null;
    }

    const user = { id: doc.id, ...doc.data() };
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
    };
  } catch {
    logout();
    return null;
  }
}

async function isAdmin() {
  return (await getCurrentUser())?.role === "admin";
}

async function createUser({ username, password, role, name }) {
  const users = await getUsers();
  const cleanUsername = username.trim();

  if (!cleanUsername || !password) {
    throw new Error("Vui lòng nhập user và password.");
  }

  if (users.some((user) => user.username === cleanUsername)) {
    throw new Error("User này đã tồn tại.");
  }

  const id = `user-${Date.now()}`;
  const nextUser = {
    id,
    username: cleanUsername,
    password,
    role,
    name: name.trim() || cleanUsername,
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  await getAuthDb().collection("users").doc(id).set(nextUser);
  return nextUser;
}

async function updateUser(id, data) {
  const doc = await getAuthDb().collection("users").doc(id).get();
  if (!doc.exists) throw new Error("Không tìm thấy tài khoản.");

  const current = { id: doc.id, ...doc.data() };
  if (current.username === "admin" && data.role && data.role !== "admin") {
    throw new Error("Không thể đổi quyền admin mặc định.");
  }

  const nextData = {
    name: data.name.trim() || current.username,
    role: data.role,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  if (data.password) {
    nextData.password = data.password;
  }

  await getAuthDb().collection("users").doc(id).update(nextData);
  return { ...current, ...nextData };
}

async function deleteUser(id) {
  const doc = await getAuthDb().collection("users").doc(id).get();
  if (!doc.exists) return;
  const user = doc.data();
  if (user.username === "admin") {
    throw new Error("Không thể xóa tài khoản admin mặc định.");
  }
  await getAuthDb().collection("users").doc(id).delete();
}

async function renderAuthStatus(container) {
  const user = await getCurrentUser();
  if (!container) return;

  container.innerHTML = user
    ? `
      <span class="session-pill">${user.name} · ${user.role}</span>
      <button class="ghost-button" type="button" data-auth-action="logout">Đăng xuất</button>
    `
    : `<span class="session-pill">Chưa đăng nhập</span>`;

  const logoutButton = container.querySelector("[data-auth-action='logout']");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      logout();
      window.location.reload();
    });
  }
}


