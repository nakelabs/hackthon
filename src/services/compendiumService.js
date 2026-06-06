import api from "./api";
import { API_BASE_URL } from "../utils/constants";

const DEMO_MODE = !API_BASE_URL;

// ─── Get nominees ──────────────────────────────────────────────────────────────
// GET /compendium/nominees?skip=0&limit=50&featured_only=false
export const getNominees = async ({ skip = 0, limit = 50, featured_only = false } = {}) => {
  if (DEMO_MODE) return { nominees: [], total: 0, skip, limit };
  const res = await api.get("/compendium/nominees", { params: { skip, limit, featured_only } });
  return res.data; // { nominees, total, skip, limit }
};

// ─── Vote for nominee ─────────────────────────────────────────────────────────
// POST /compendium/nominees/{nominee_id}/vote  (auth required)
export const voteForNominee = async (nomineeId) => {
  if (DEMO_MODE) return { id: nomineeId };
  const res = await api.post(`/compendium/nominees/${nomineeId}/vote`);
  return res.data; // GlobalIconNomineeResponse
};
