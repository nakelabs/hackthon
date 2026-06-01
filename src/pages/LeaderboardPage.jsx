import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TALENT_CATEGORIES } from "../utils/constants";
import {
  Music, Medal, Volleyball, Laugh, Palette,
  Scissors, Shirt, Clapperboard, Camera, Laptop, Brush,
  ChevronLeft, Star
} from "lucide-react";

// ─── Icon map — one Lucide icon per category id ────────────────────────────────
const CATEGORY_ICONS = {
  music: Music,
  football: Medal,
  basketball: Volleyball,
  comedy: Laugh,
  artwork: Palette,
  hair: Scissors,
  fashion: Shirt,
  film: Clapperboard,
  photography: Camera,
  tech: Laptop,
  logo: Brush,
};

// ─── Mock Leaderboard Data Per Category ───────────────────────────────────────
const MOCK_LEADERBOARD = {
  music: [
    { rank: 1, name: "Wale Adebayo", state: "Lagos", votes: "24.1K" },
    { rank: 2, name: "Precious I.", state: "Rivers", votes: "18.8K" },
    { rank: 3, name: "Chinedu E.", state: "Enugu", votes: "16.2K" },
    { rank: 4, name: "Seun K.", state: "Oyo", votes: "12.5K" },
    { rank: 5, name: "Amaka O.", state: "Anambra", votes: "10.1K" },
    { rank: 6, name: "Tayo B.", state: "Ogun", votes: "9.4K" },
    { rank: 7, name: "Farida M.", state: "Kano", votes: "8.7K" },
    { rank: 8, name: "Victor N.", state: "Delta", votes: "7.3K" },
  ],
  football: [
    { rank: 1, name: "David E.", state: "Rivers", votes: "21.3K" },
    { rank: 2, name: "Bisi A.", state: "Oyo", votes: "17.6K" },
    { rank: 3, name: "Joy N.", state: "Enugu", votes: "14.9K" },
    { rank: 4, name: "Lawal K.", state: "Kwara", votes: "11.0K" },
    { rank: 5, name: "Emeka O.", state: "Imo", votes: "9.8K" },
  ],
  comedy: [
    { rank: 1, name: "Tunde O.", state: "Lagos", votes: "22.4K" },
    { rank: 2, name: "Bayo A.", state: "Oyo", votes: "15.1K" },
    { rank: 3, name: "Ngozi O.", state: "Enugu", votes: "11.7K" },
    { rank: 4, name: "Musa D.", state: "Kano", votes: "9.2K" },
  ],
  fashion: [
    { rank: 1, name: "John Doe", state: "Abuja", votes: "19.5K" },
    { rank: 2, name: "Aisha B.", state: "Kano", votes: "16.3K" },
    { rank: 3, name: "Chioma A.", state: "Lagos", votes: "13.1K" },
    { rank: 4, name: "Funke O.", state: "Ogun", votes: "8.9K" },
  ],
  artwork: [
    { rank: 1, name: "Fatima S.", state: "Abuja", votes: "20.2K" },
    { rank: 2, name: "Segun O.", state: "Oyo", votes: "14.7K" },
    { rank: 3, name: "Uche M.", state: "Imo", votes: "10.5K" },
  ],
  tech: [
    { rank: 1, name: "Chioma C.", state: "Lagos", votes: "25.0K" },
    { rank: 2, name: "Bisi A.", state: "Oyo", votes: "18.4K" },
    { rank: 3, name: "Abubakar M.", state: "Abuja", votes: "16.8K" },
    { rank: 4, name: "Mustapha I.", state: "Kano", votes: "12.3K" },
    { rank: 5, name: "Ada O.", state: "Anambra", votes: "9.7K" },
  ],
  film: [
    { rank: 1, name: "Kemi A.", state: "Lagos", votes: "18.9K" },
    { rank: 2, name: "Emeka C.", state: "Imo", votes: "13.5K" },
    { rank: 3, name: "Sola D.", state: "Oyo", votes: "10.2K" },
  ],
  hair: [
    { rank: 1, name: "Mama Ngozi", state: "Rivers", votes: "16.7K" },
    { rank: 2, name: "Hadiza U.", state: "Kano", votes: "12.1K" },
    { rank: 3, name: "Bola K.", state: "Ogun", votes: "8.5K" },
  ],
  basketball: [
    { rank: 1, name: "Chukwuemeka I.", state: "Anambra", votes: "22.0K" },
    { rank: 2, name: "Yusuf A.", state: "Kano", votes: "17.3K" },
    { rank: 3, name: "Obinna N.", state: "Imo", votes: "14.8K" },
  ],
  photography: [
    { rank: 1, name: "Adaeze M.", state: "Anambra", votes: "14.5K" },
    { rank: 2, name: "Ibrahim S.", state: "Kano", votes: "10.8K" },
    { rank: 3, name: "Lola F.", state: "Lagos", votes: "8.3K" },
  ],
  logo: [
    { rank: 1, name: "Emeka Obi", state: "Lagos", votes: "21.6K" },
    { rank: 2, name: "Fatima A.", state: "Abuja", votes: "15.9K" },
    { rank: 3, name: "Tunde L.", state: "Oyo", votes: "12.4K" },
  ],
};

// Medal colours for top 3
const MEDALS = [
  { bg: "bg-[#008751]", border: "border-[#008751]", text: "text-[#008751]", shadow: "shadow-[4px_4px_0_rgba(0,135,81,0.4)]", icon: <Star className="w-3.5 h-3.5 fill-current" /> },
  { bg: "bg-[#C0C0C0]/10", border: "border-[#C0C0C0]/40", text: "text-[#C0C0C0]", shadow: "", icon: null },
  { bg: "bg-[#CD7F32]/10", border: "border-[#CD7F32]/40", text: "text-[#CD7F32]", shadow: "", icon: null },
];

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("music");

  const activeCat = TALENT_CATEGORIES.find((c) => c.id === activeCategory);
  const rankings = MOCK_LEADERBOARD[activeCategory] || [];
  const ActiveIcon = CATEGORY_ICONS[activeCategory] || Music;

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

        {/* Category Tabs — Horizontal Scroll */}
        <div className="overflow-x-auto pb-3 mb-10 -mx-4 px-4 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {TALENT_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Music;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-200 border ${isActive
                    ? "bg-white text-black border-white shadow-[4px_4px_0_rgba(0,135,81,0.6)]"
                    : "bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                  style={{ clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)" }}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Category Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className={`w-14 h-14 flex items-center justify-center bg-[#0a1a0f] border border-[#008751]/40 text-[#008751]`}>
            <ActiveIcon className="w-6 h-6" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[9px] text-[#008751] uppercase tracking-[0.2em] font-black mb-0.5">Category Rankings</p>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{activeCat?.label}</h2>
          </div>
        </div>

        {/* Rankings List */}
        <div className="flex flex-col gap-2.5">
          {rankings.map((entry) => {
            const medal = MEDALS[entry.rank - 1] ?? null;
            const isTop = entry.rank <= 3;

            return (
              <div
                key={entry.rank}
                className={`flex items-center gap-4 px-4 py-3.5 border transition-all duration-200 hover:-translate-y-0.5 ${entry.rank === 1
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
                      {entry.rank}
                    </div>
                  ) : (
                    <span className="font-mono text-xs text-white/25 font-bold">#{entry.rank}</span>
                  )}
                </div>

                {/* Avatar with initial */}
                <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center font-black text-sm border ${entry.rank === 1 ? "bg-[#008751] border-[#008751] text-white" : "bg-[#111] border-white/10 text-white/50"
                  }`}>
                  {entry.name.charAt(0)}
                </div>

                {/* Name & State */}
                <div className="flex-1 min-w-0">
                  <p className={`font-black text-sm uppercase tracking-wide truncate ${isTop ? "text-white" : "text-white/70"}`}>
                    {entry.name}
                  </p>
                  <p className="text-[10px] text-white/35 uppercase tracking-widest font-bold">{entry.state}</p>
                </div>

                {/* Votes */}
                <div className="text-right flex-shrink-0">
                  <p className={`font-black text-base tabular-nums ${entry.rank === 1 ? "text-[#008751]" : isTop ? "text-white/80" : "text-white/50"}`}>
                    {entry.votes}
                  </p>
                  <p className="text-[9px] text-white/25 uppercase tracking-widest">votes</p>
                </div>
              </div>
            );
          })}

          {rankings.length === 0 && (
            <div className="text-center py-20 text-white/20">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="font-black uppercase tracking-widest text-sm">No data yet for this category</p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-white/20 uppercase tracking-widest mt-12 font-bold">
          Rankings update every 24 hours · Vote on the feed
        </p>
      </div>
    </div>
  );
}
