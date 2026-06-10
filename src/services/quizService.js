import api from "./api";
import { API_BASE_URL } from "../utils/constants";

const DEMO_MODE = !API_BASE_URL;

// ─── Get All Sessions ────────────────────────────────────────────────────────
// GET /quiz/sessions
export const getSessions = async () => {
  if (DEMO_MODE) return [];
  const res = await api.get("/quiz/sessions");
  return res.data;
};

// ─── Get Session Questions ───────────────────────────────────────────────────
// GET /quiz/sessions/{session_id}/questions
export const getSessionQuestions = async (sessionId) => {
  if (DEMO_MODE) return [];
  const res = await api.get(`/quiz/sessions/${sessionId}/questions`);
  return res.data;
};

// ─── Submit Answers ──────────────────────────────────────────────────────────
// POST /quiz/sessions/{session_id}/submit
export const submitAnswers = async (sessionId, answers) => {
  if (DEMO_MODE) return { total_score: 0, submitted_answers_count: answers.length };
  const res = await api.post(`/quiz/sessions/${sessionId}/submit`, { answers });
  return res.data;
};

// ─── Get Session Leaderboard ─────────────────────────────────────────────────
// GET /quiz/leaderboard/sessions/{session_id}
export const getSessionLeaderboard = async (sessionId) => {
  if (DEMO_MODE) return [];
  const res = await api.get(`/quiz/leaderboard/sessions/${sessionId}`);
  return res.data;
};
