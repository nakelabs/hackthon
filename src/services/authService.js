import api from "./api";
import { API_BASE_URL, LS_TOKEN_KEY, LS_USER_KEY } from "../utils/constants";

// ─── Demo mode — active when no backend URL is configured ─────────────────────
const DEMO_MODE = !API_BASE_URL;

const MOCK_TOKEN = "demo_token_no_backend";

const makeMockUser = (data) => ({
  id:        "demo-001",
  full_name: data.fullName || data.full_name || "Demo User",
  email:     data.email    || "demo@nigeriacelebrates.ng",
  phone:     data.phone    || null,
  is_demo:   true,
});

// ─── register ─────────────────────────────────────────────────────────────────
export const register = async (data) => {
  if (DEMO_MODE) {
    const user = makeMockUser(data);
    return { access_token: MOCK_TOKEN, user };
  }
  const res = await api.post("/auth/register", {
    full_name:     data.fullName,
    email:         data.email,
    phone:         data.phone    || null,
    password:      data.password,
    referral_code: data.referralCode || null,
  });
  return res.data;
};

// ─── login ────────────────────────────────────────────────────────────────────
export const login = async (data) => {
  if (DEMO_MODE) {
    const user = makeMockUser(data);
    return { access_token: MOCK_TOKEN, user };
  }
  const res = await api.post("/auth/login", {
    email:    data.email,
    password: data.password,
  });
  return res.data;
};

// ─── getMe ────────────────────────────────────────────────────────────────────
export const getMe = async () => {
  if (DEMO_MODE) {
    return getStoredUser();
  }
  const res = await api.get("/auth/me");
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
