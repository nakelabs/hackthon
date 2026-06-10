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
    username:  data.username,
    location:  data.location,
    email:     data.email,
    password:  data.password,
    referral_code: data.referralCode,
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

// ─── loginWithGoogle ──────────────────────────────────────────────────────────
// POST /auth/google — body: { id_token }
export const loginWithGoogle = async (idToken) => {
  if (DEMO_MODE) {
    const token = "demo-google-jwt-token";
    localStorage.setItem(LS_TOKEN_KEY, token);
    const user = await getMe();
    return { access_token: token, user };
  }

  const res = await api.post("/auth/google", { id_token: idToken });
  const token = res.data.access_token;
  localStorage.setItem(LS_TOKEN_KEY, token);
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

// ─── getMyReferrals ────────────────────────────────────────────────────────────
// GET /auth/me/referrals
export const getMyReferrals = async () => {
  if (DEMO_MODE) return {
    referrals: [],
    total_referred: 0,
    total_referred_with_approved_submissions: 0
  };
  const res = await api.get("/auth/me/referrals");
  return res.data;
};

// ─── updateProfile ────────────────────────────────────────────────────────────
// PATCH /auth/me — body: { full_name?, location?, username?, email?, password? }
export const updateProfile = async (data) => {
  if (DEMO_MODE) return makeMockUser(data);
  const res = await api.patch("/auth/me", data);
  return res.data;
};

// ─── uploadProfilePicture ─────────────────────────────────────────────────────
// POST /auth/me/profile-picture — body: multipart/form-data
export const uploadProfilePicture = async (file) => {
  if (DEMO_MODE) return makeMockUser({});
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/auth/me/profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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

// ─── getUserById ──────────────────────────────────────────────────────────────
// GET /auth/users/{user_id}
export const getUserById = async (userId) => {
  if (DEMO_MODE) return makeMockUser({ id: userId });
  const res = await api.get(`/auth/users/${userId}`);
  return res.data;
};

// ─── searchUsers ──────────────────────────────────────────────────────────────
// GET /search/users?q=&skip=0&limit=20
export const searchUsers = async (query, { skip = 0, limit = 20 } = {}) => {
  if (DEMO_MODE) return { users: [], total: 0 };
  const res = await api.get("/search/users", { params: { q: query, skip, limit } });
  return res.data; // { users: [...], total }
};

// ─── forgotPassword ───────────────────────────────────────────────────────────
// POST /auth/forgot-password — body: { email }
export const forgotPassword = async (email) => {
  if (DEMO_MODE) return "Password reset email sent (Demo Mode)";
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

// ─── resetPassword ────────────────────────────────────────────────────────────
// POST /auth/reset-password — body: { token, new_password }
export const resetPassword = async (token, newPassword) => {
  if (DEMO_MODE) return "Password reset successfully (Demo Mode)";
  const res = await api.post("/auth/reset-password", { token, new_password: newPassword });
  return res.data;
};

// ─── verifyEmail ──────────────────────────────────────────────────────────────
// GET /auth/verify-email?token={token}
export const verifyEmail = async (token) => {
  if (DEMO_MODE) return "Email verified successfully (Demo Mode)";
  const res = await api.get("/auth/verify-email", { params: { token } });
  return res.data;
};

// ─── resendVerification ───────────────────────────────────────────────────────
// POST /auth/resend-verification — body: { email }
export const resendVerification = async (email) => {
  if (DEMO_MODE) return "Verification email resent (Demo Mode)";
  const res = await api.post("/auth/resend-verification", { email });
  return res.data;
};

export { DEMO_MODE };

