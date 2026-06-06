import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoryLeaderboard } from "../services/talentService";
import api from "../services/api";
import {
  Music, Medal, Volleyball, Laugh, Palette,
  Scissors, Shirt, Clapperboard, Camera, Laptop, Brush,
  ChevronLeft, Star, Trophy
} from "lucide-react";

// Match API category names to icons
const ICON_MAP = {
  "music":                Music,
  "football freestyle":   Medal,
  "basketball freestyle": Volleyball,
  "comedy skits":         Laugh,
  "handmade artwork":     Palette,
  "artwork":              Palette,
  "hair artistry":        Scissors,
  "fashion":              Shirt,
  "fashion showcase":     Shirt,
  "short film":           Clapperboard,
  "photography":          Camera,
  "tech innovation":      Laptop,
  "logo design":          Brush,
};

const getIcon = (name = "") => ICON_MAP[name.toLowerCase()] || Trophy;

const MEDALS = [
  { bg: "bg-[#008751]", border: "border-[#008751]", text: "text-[#008751]", shadow: "shadow-[4px_4px_0_rgba(0,135,81,0.4)]" },
  { bg: "bg-[#C0C0C0]/10", border: "border-[#C0C0C0]/40", text: "text-[#C0C0C0]", shadow: "" },
  { bg: "bg-[#CD7F32]/10", border: "border-[#CD7F32]/40", text: "text-[#CD7F32]", shadow: "" },
];

// Virtual "all" tab
const ALL_TAB = { id: "all", name: "All Categories" };

export default function LeaderboardPage() {
  const navigate = useNavigate();

  // ── Category tabs from API ─────────────────────────────────────────────────
  const [apiCategories, setApiCategories] = useState([]);

  useEffect(() => {
    api.get("/talents/categories/approved")
      .then(res => setApiCategories(res.data || []))
      .catch(() => {
        // fallback names matching DB exactly
        setApiCategories([
          "Music", "Football Freestyle", "Basketball Freestyle",
          "Comedy Skits", "Handmade Artwork", "Hair Artistry",
          "Fashion", "Short Film", "Photography", "Tech Innovation", "Logo Design",
        ].map((name, i) => ({ id: i + 1, name, status: "approved" })));
      });
  }, []);

  const tabs = [ALL_TAB, ...apiCategories];

  // ── Active selection — stored as the exact API name (or "all") ─────────────
  const [activeCategory, setActiveCategory] = useState("all");
  const [rankings, setRankings]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);

  const fetchLeaderboard = useCallback(async (catName) => {
    setLoading(true);
    setError(null);
    try {
      // catName is "all" → omit param → global leaderboard
      // catName is "Basketball Freestyle" → pass as ?category=Basketball+Freestyle
      const cat = catName === "all" ? undefined : catName;
      const data = await getCategoryLeaderboard(cat, { limit: 50 });
      setRankings(data.entries || []);
    } catch {
      setError("Could not load leaderboard.");
      setRankings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeaderboard(activeCategory); }, [activeCategory, fetchLeaderboard]);

  const activeTab = tabs.find(t => t.name === activeCategory) || ALL_TAB;
  const ActiveIcon = activeCategory === "all" ? Trophy : getIcon(activeCategory);

  return (
    <div className="bg-black min-h-screen pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center border border-white/20 text-white hover:border-white/50 transition-colors flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.25em] font-bold leading-none mb-0.5">Nigeria Celebrates</p>
          <h1 className="text-base font-black text-white tracking-widest uppercase leading-none">Leaderboard</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Category Tabs — scrollable, uses API names */}
        <div className="overflow-x-auto pb-3 mb-10 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {tabs.map((cat) => {
              const isActive = activeCategory === cat.name || (cat.id === "all" && activeCategory === "all");
              const Icon = cat.id === "all" ? Trophy : getIcon(cat.name);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id === "all" ? "all" : cat.name)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-200 border ${isActive
                    ? "bg-white text-black border-white shadow-[4px_4px_0_rgba(0,135,81,0.6)]"
                    : "bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                  style={{ clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)" }}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Category Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="w-14 h-14 flex items-center justify-center bg-[#0a1a0f] border border-[#008751]/40 text-[#008751]">
            <ActiveIcon className="w-6 h-6" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[9px] text-[#008751] uppercase tracking-[0.2em] font-black mb-0.5">Category Rankings</p>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              {activeCategory === "all" ? "All Categories" : activeCategory}
            </h2>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-2.5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3.5 bg-white/5 animate-pulse">
                <div className="w-9 h-9 bg-white/10 rounded" />
                <div className="w-9 h-9 bg-white/10 rounded" />
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/3" />
                </div>
                <div className="w-16 h-5 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-white/40 text-sm">{error}</p>
          </div>
        )}

        {/* Rankings List */}
        {!loading && !error && (
          <div className="flex flex-col gap-2.5">
            {rankings.length === 0 && (
              <div className="text-center py-20 text-white/20">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-black uppercase tracking-widest text-sm">No data yet for this category</p>
              </div>
            )}
            {rankings.map((entry, idx) => {
              const rank = idx + 1;
              const medal = MEDALS[rank - 1] ?? null;
              const isTop = rank <= 3;
              const displayName = entry.title || `Submission #${entry.submission_id}`;
              return (
                <div
                  key={entry.submission_id}
                  className={`flex items-center gap-4 px-4 py-3.5 border transition-all duration-200 hover:-translate-y-0.5 ${rank === 1
                    ? `bg-[#0a1a0f] border-[#008751] ${medal.shadow}`
                    : isTop
                      ? `bg-[#0a0a0a] ${medal?.border ?? "border-white/15"}`
                      : "bg-transparent border-white/8 hover:border-white/20 hover:bg-[#0a0a0a]"
                  }`}
                >
                  {/* Rank Badge */}
                  <div className="w-9 flex-shrink-0 flex items-center justify-center">
                    {isTop ? (
                      <div className={`w-7 h-7 flex items-center justify-center border font-black text-xs ${medal.bg} ${medal.border} ${medal.text}`}>
                        {rank}
                      </div>
                    ) : (
                      <span className="font-mono text-xs text-white/25 font-bold">#{rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center font-black text-sm border ${rank === 1
                    ? "bg-[#008751] border-[#008751] text-white"
                    : "bg-[#111] border-white/10 text-white/50"}`}>
                    {displayName.charAt(0).toUpperCase()}
                  </div>

                  {/* Name + Category */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-black text-sm uppercase tracking-wide truncate ${isTop ? "text-white" : "text-white/70"}`}>
                      {displayName}
                    </p>
                    <p className="text-[10px] text-white/35 uppercase tracking-widest font-bold">
                      {entry.category || `ID #${entry.submission_id}`}
                    </p>
                  </div>

                  {/* Votes */}
                  <div className="text-right flex-shrink-0">
                    <p className={`font-black text-base tabular-nums ${rank === 1 ? "text-[#008751]" : isTop ? "text-white/80" : "text-white/50"}`}>
                      {(entry.vote_count || 0).toLocaleString()}
                    </p>
                    <p className="text-[9px] text-white/25 uppercase tracking-widest">votes</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-[10px] text-white/20 uppercase tracking-widest mt-12 font-bold">
          Live data · Vote on the feed to help your favourites climb
        </p>
      </div>
    </div>
  );
}
