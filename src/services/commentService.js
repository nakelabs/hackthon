import api from "./api";
import { API_BASE_URL } from "../utils/constants";

const DEMO_MODE = !API_BASE_URL;

// ─── Get comments for a submission ────────────────────────────────────────────
// GET /comments/submission/{submission_id}?skip=0&limit=20
export const getComments = async (submissionId, { skip = 0, limit = 20 } = {}) => {
  if (DEMO_MODE) return { comments: [], total: 0, skip, limit };
  const res = await api.get(`/comments/submission/${submissionId}`, { params: { skip, limit } });
  return res.data; // { comments, total, skip, limit }
};

// ─── Create comment ───────────────────────────────────────────────────────────
// POST /comments  body: { submission_id, content }
export const createComment = async (submissionId, content) => {
  if (DEMO_MODE) return { id: Date.now(), submission_id: submissionId, content, user_name: "Demo" };
  const res = await api.post("/comments", { submission_id: submissionId, content });
  return res.data; // CommentResponse
};

// ─── Delete comment ───────────────────────────────────────────────────────────
// DELETE /comments/{comment_id}
export const deleteComment = async (commentId) => {
  if (DEMO_MODE) return;
  await api.delete(`/comments/${commentId}`);
};
