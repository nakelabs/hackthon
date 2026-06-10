import { adminApi } from "./api";
import { API_BASE_URL } from "../utils/constants";

const DEMO_MODE = !API_BASE_URL;

// ─── Platform stats ───────────────────────────────────────────────────────────
// GET /admin/stats  →  AdminStatsResponse
export const getAdminStats = async () => {
  if (DEMO_MODE) return {
    total_posts: 0, pending_posts: 0, approved_posts: 0,
    rejected_posts: 0, total_users: 0, total_votes: 0, total_nominees: 0,
  };
  const res = await adminApi.get("/admin/stats");
  return res.data;
};

// ─── All submissions (filterable by status) ──────────────────────────────────
// GET /admin/submissions?status=pending|approved|rejected&skip=0&limit=100
export const getAdminSubmissions = async ({ status, skip = 0, limit = 100 } = {}) => {
  if (DEMO_MODE) return { talents: [], total: 0, skip, limit };
  const params = { skip, limit };
  if (status) params.status = status;
  const res = await adminApi.get("/admin/submissions", { params });
  return res.data; // TalentSubmissionListResponse
};

// ─── Search users ─────────────────────────────────────────────────────────────
// GET /admin/users/search?q={query}&skip=0&limit=20
export const adminSearchUsers = async (q, skip = 0, limit = 20) => {
  if (DEMO_MODE) return { users: [], total: 0, skip, limit };
  const res = await adminApi.get("/admin/users/search", { params: { q, skip, limit } });
  return res.data;
};

// ─── Approve talent submission ────────────────────────────────────────────────
// PATCH /admin/{submission_id}/approve
export const approveTalent = async (submissionId) => {
  if (DEMO_MODE) return { id: submissionId, is_approved: "approved" };
  const res = await adminApi.patch(`/admin/${submissionId}/approve`);
  return res.data;
};

// ─── Reject talent submission ─────────────────────────────────────────────────
// PATCH /admin/{submission_id}/reject
export const rejectTalent = async (submissionId) => {
  if (DEMO_MODE) return { id: submissionId, is_approved: "rejected" };
  const res = await adminApi.patch(`/admin/${submissionId}/reject`);
  return res.data;
};

// ─── Nominate a global icon (admin only) ──────────────────────────────────────
// POST /admin/nominate  body: FormData { name, bio, photo }
export const nominateIcon = async (formData) => {
  if (DEMO_MODE) return { id: Date.now(), name: formData.get('name'), bio: formData.get('bio'), photo_url: "", vote_count: 0 };
  const res = await adminApi.post("/admin/nominate", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
};

// ─── Toggle nominee featured status ──────────────────────────────────────────
// PATCH /admin/nominees/{nominee_id}/feature
export const toggleNomineeFeatured = async (nomineeId) => {
  if (DEMO_MODE) return { id: nomineeId };
  const res = await adminApi.patch(`/admin/nominees/${nomineeId}/feature`);
  return res.data;
};

// ─── Get all submitted categories ────────────────────────────────────────────
// GET /admin/categories
export const getAdminCategories = async () => {
  if (DEMO_MODE) return [];
  const res = await adminApi.get("/admin/categories");
  return res.data; // CategoryResponse[]
};

// ─── Approve category ────────────────────────────────────────────────────────
// PATCH /admin/categories/{category_id}/approve
export const approveCategory = async (categoryId) => {
  if (DEMO_MODE) return { id: categoryId, status: "approved" };
  const res = await adminApi.patch(`/admin/categories/${categoryId}/approve`);
  return res.data;
};

// ─── Reject category ─────────────────────────────────────────────────────────
// PATCH /admin/categories/{category_id}/reject
export const rejectCategory = async (categoryId) => {
  if (DEMO_MODE) return { id: categoryId, status: "rejected" };
  const res = await adminApi.patch(`/admin/categories/${categoryId}/reject`);
  return res.data;
};

// ─── Create Quiz Session ─────────────────────────────────────────────────────
// POST /quiz/sessions  body: { title, open_time, close_time }
export const createQuizSession = async (sessionData) => {
  if (DEMO_MODE) return { id: Date.now(), ...sessionData, status: "pending" };
  const res = await adminApi.post("/quiz/sessions", sessionData);
  return res.data;
};

// ─── Add Quiz Question ───────────────────────────────────────────────────────
// POST /quiz/sessions/{session_id}/questions
export const addQuizQuestion = async (sessionId, questionData) => {
  if (DEMO_MODE) return { id: Date.now(), ...questionData, quiz_session_id: sessionId };
  const res = await adminApi.post(`/quiz/sessions/${sessionId}/questions`, questionData);
  return res.data;
};

// ─── Generate AI Questions ───────────────────────────────────────────────────
// POST /quiz/ai/generate-questions
export const generateAIQuestions = async (payload) => {
  if (DEMO_MODE) return [];
  const res = await adminApi.post("/quiz/ai/generate-questions", payload);
  return res.data;
};
