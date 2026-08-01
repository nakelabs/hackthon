import api from "./api";
import { API_BASE_URL } from "../utils/constants";

const DEMO_MODE = !API_BASE_URL;

// ─── Get approved talent feed ──────────────────────────────────────────────────
// GET /talents/approved?category=&skip=0&limit=20
export const getApprovedTalents = async ({ category, skip = 0, limit = 20 } = {}) => {
  if (DEMO_MODE) return { talents: [], total: 0, skip, limit };
  const params = { skip, limit };
  if (category) params.category = category;
  const res = await api.get("/talents/approved", { params });
  return res.data; // { talents, total, skip, limit }
};

// ─── Get current user's own submissions ───────────────────────────────────────
// GET /talents/my?status=&skip=0&limit=20
export const getMyTalents = async ({ status, skip = 0, limit = 20 } = {}) => {
  if (DEMO_MODE) return { talents: [], total: 0, skip, limit };
  const params = { skip, limit };
  if (status) params.status = status;
  const res = await api.get("/talents/my", { params });
  return res.data; // { talents, total, skip, limit }
};

// ─── Get a single talent by ID ────────────────────────────────────────────────
// GET /talents/{submission_id}
export const getTalentById = async (submissionId) => {
  if (DEMO_MODE) return {
    id: submissionId,
    title: "Demo Submission",
    description: "This is a demo submission.",
    category: "Comedy",
    vote_count: 42,
    owner_fullname: "Demo User",
    owner_username: "demouser",
    image_url: "https://via.placeholder.com/600x800?text=Demo+Post"
  };
  const res = await api.get(`/talents/${submissionId}`);
  return res.data; // TalentSubmissionResponse
};

// ─── Delete own talent ─────────────────────────────────────────────────────────
// DELETE /talents/{submission_id}
export const deleteTalent = async (submissionId) => {
  if (DEMO_MODE) {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
  await api.delete(`/talents/${submissionId}`);
};

// ─── Submit a talent (multipart) ───────────────────────────────────────────────
// POST /talents/submit
// Body: multipart/form-data with title, description, category, tools_used + audio_file | video_file | image_file
export const submitTalent = async ({ title, description, category, tools_used, file, fileType }) => {
  if (DEMO_MODE) return { id: 999, title, category, is_approved: "pending" };

  const formData = new FormData();

  // Text fields — now sent as form body fields, not query params
  formData.append("title", title);
  formData.append("description", description);
  formData.append("category", category);
  if (tools_used) formData.append("tools_used", tools_used);

  // File field
  if (fileType === "audio") formData.append("audio_file", file);
  else if (fileType === "video") formData.append("video_file", file);
  else formData.append("image_file", file);

  const res = await api.post(`/talents/submit`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // TalentSubmissionResponse
};

// ─── Cast a vote ───────────────────────────────────────────────────────────────
// POST /votes/cast  body: { submission_id }
export const castVote = async (submissionId) => {
  if (DEMO_MODE) return { submission_id: submissionId };
  const res = await api.post("/votes/cast", { submission_id: submissionId });
  return res.data; // VoteResponse
};

// ─── Remove a vote ─────────────────────────────────────────────────────────────
// DELETE /votes/cast/{submission_id}
export const removeVote = async (submissionId) => {
  await api.delete(`/votes/cast/${submissionId}`);
};

// ─── Get User Voted Posts ──────────────────────────────────────────────────────
// GET /votes/user/{user_id}/voted-posts
export const getUserVotedPosts = async (userId) => {
  if (DEMO_MODE) return [];
  const res = await api.get(`/votes/user/${userId}/voted-posts`);
  return res.data;
};

// ─── Leaderboard (category or global) ─────────────────────────────────────────
// GET /votes/leaderboard?category=&location=&skip=0&limit=50
export const getCategoryLeaderboard = async (category, { location, skip = 0, limit = 50 } = {}) => {
  if (DEMO_MODE) return { category: category || null, entries: [], total: 0, skip, limit };
  const params = { skip, limit };
  if (category) params.category = category;
  if (location) params.location = location;
  const res = await api.get("/votes/leaderboard", { params });
  return res.data; // LeaderboardResponse { category, entries, total, skip, limit }
};

// ─── State leaderboard ─────────────────────────────────────────────────────────
// GET /votes/leaderboard/by-state?by_voter_location=false
export const getStateLeaderboard = async ({ byVoterLocation = false } = {}) => {
  if (DEMO_MODE) return { entries: [] };
  const res = await api.get("/votes/leaderboard/by-state", {
    params: { by_voter_location: byVoterLocation },
  });
  return res.data; // StateLeaderboardResponse { entries: [{ state, vote_count }] }
};

// ─── Submit a custom category ──────────────────────────────────────────────────
// POST /talents/categories/submit
export const submitCategory = async (name) => {
  if (DEMO_MODE) return { id: 0, name, status: "pending" };
  const res = await api.post("/talents/categories/submit", { name });
  return res.data;
};
