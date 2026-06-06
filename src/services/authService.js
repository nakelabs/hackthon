import api from "./api";
import { API_BASE_URL, LS_TOKEN_KEY, LS_USER_KEY } from "../utils/constants";

const DEMO_MODE = !API_BASE_URL;

const MOCK_TOKEN = "demo_token_no_backend";

const makeMockUser = (data) => ({
  id:        "demo-001",
  full_name: data.fullName || data.full_name || "Demo User",
  email:     data.email    || "demo@nigeriacelebrates.ng",
  location:  data.location || "Lagos",
  role:      "user",
  is_demo:   true,
});

// ─── register ─────────────────────────────────────────────────────────────────
export const register = async (data) => {
  if (DEMO_MODE) {
    const user = makeMockUser(data);
    return { access_token: MOCK_TOKEN, user };
  }
  const res = await api.post("/auth/register", {
    full_name: data.fullName,
    location:  data.location,
    email:     data.email,
    password:  data.password,
  });
  // Immediately fetch real profile after registering
  const token = res.data.access_token;
  localStorage.setItem(LS_TOKEN_KEY, token);
  const user = await getMe();
  return { access_token: token, user };
};

// ─── login ────────────────────────────────────────────────────────────────────
export const login = async (data) => {
  if (DEMO_MODE) {
    const user = makeMockUser(data);
    return { access_token: MOCK_TOKEN, user };
  }
  const params = new URLSearchParams();
  params.append("username", data.email);
  params.append("password", data.password);

  const res = await api.post("/auth/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  const token = res.data.access_token;
  localStorage.setItem(LS_TOKEN_KEY, token);
  // Fetch real profile from /auth/me
  const user = await getMe();
  return { access_token: token, user };
};

// ─── getMe ────────────────────────────────────────────────────────────────────
// GET /auth/me — returns UserResponse
export const getMe = async () => {
  if (DEMO_MODE) return makeMockUser({});
  const res = await api.get("/auth/me");
  return res.data; // { id, username, full_name, email, location, role, ... }
};

// ─── updateProfile ────────────────────────────────────────────────────────────
// PATCH /auth/me — body: { full_name?, location?, username?, email?, password? }
export const updateProfile = async (data) => {
  if (DEMO_MODE) return makeMockUser(data);
  const res = await api.patch("/auth/me", data);
  return res.data;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const persistAuth = (authData) => {
  localStorage.setItem(LS_TOKEN_KEY, authData.access_token);
  localStorage.setItem(LS_USER_KEY, JSON.stringify(authData.user));
};

export const clearAuth = () => {
  localStorage.removeItem(LS_TOKEN_KEY);
  localStorage.removeItem(LS_USER_KEY);
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_USER_KEY));
  } catch {
    return null;
  }
};

export { DEMO_MODE };
