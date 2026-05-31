import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/ui/Spinner";

const DUMMY_UPLOADS = [
  { id: 1, views: "12.4K", category: "Music", img: "from-blue-900" },
  { id: 2, views: "8.1K", category: "Music", img: "from-purple-900" },
  { id: 3, views: "45.2K", category: "Dance", img: "from-red-900" },
  { id: 4, views: "3.2K", category: "Comedy", img: "from-green-900" },
  { id: 5, views: "1.1K", category: "Vlog", img: "from-yellow-900" },
  { id: 6, views: "890", category: "Tech", img: "from-gray-700" },
];

export default function MyArenaPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("uploads"); // "uploads" | "quiz"

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner size={28} className="text-[#008751]" />
      </div>
    );
  }

  if (!user) {
    return (
      <section className="min-h-screen bg-black flex flex-col items-center justify-center px-5">
        <span className="text-[8rem] grayscale opacity-20 mb-4">🛑</span>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Access Denied</h1>
        <p className="text-white/50 text-sm mb-8 text-center max-w-xs">You must enter the arena to view your profile.</p>
        <Link to="/login" className="btn-primary px-12 py-4 uppercase tracking-widest">Sign In</Link>
      </section>
    );
  }

  // Derive display names
  const username = user.full_name ? `@${user.full_name.replace(/\s+/g, '').toLowerCase()}` : "@naija_star";
  const initial = user.full_name ? user.full_name.charAt(0).toUpperCase() : "N";

  return (
    <div className="bg-black min-h-screen flex justify-center pb-20">
      {/* Centered mobile-first container */}
      <div className="w-full max-w-[450px] bg-[#050505] min-h-screen border-x border-white/5 shadow-2xl shadow-black relative">
        
        {/* Top Header (Navigation) */}
        <div className="sticky top-0 w-full px-6 py-4 z-50 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-white/10">
          <Link to="/home" className="text-white/50 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-sm font-bold text-white tracking-widest uppercase">{username}</h1>
          <button className="text-white/50 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

        {/* Profile Identity Section */}
        <div className="px-6 pt-8 pb-6 flex flex-col items-center border-b border-white/5">
          {/* Brutalist Avatar */}
          <div className="w-24 h-24 bg-[#111] border-2 border-[#008751] flex items-center justify-center shadow-[4px_4px_0_#008751] mb-4 transform -rotate-3 hover:rotate-0 transition-transform">
            <span className="text-4xl font-black text-white">{initial}</span>
          </div>

          <h2 className="text-xl font-black text-white mb-1">{user.full_name || "Naija Talent"}</h2>
          
          <div className="flex gap-2 items-center mb-4">
            <span className="px-2 py-0.5 bg-white/10 border border-white/20 text-xs font-mono text-white uppercase">LAGOS</span>
            <span className="text-white/30 text-xs">•</span>
            <span className="px-2 py-0.5 bg-[#008751]/20 border border-[#008751] text-[#008751] text-xs font-mono font-bold uppercase">MUSIC</span>
          </div>

          <p className="text-white/70 text-sm text-center max-w-xs mb-6">
            Building the sound of tomorrow. Independent artist. 🚀🔥
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full max-w-[300px]">
            <button className="flex-1 btn-primary py-2 text-xs uppercase tracking-widest shadow-[4px_4px_0_rgba(0,135,81,0.5)]">
              Edit Profile
            </button>
            <button className="p-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            </button>
          </div>
        </div>

        {/* Clout Stats */}
        <div className="flex border-b border-white/5">
          <div className="flex-1 py-4 flex flex-col items-center justify-center border-r border-white/5 hover:bg-white/5 transition-colors">
            <span className="text-xl font-black text-white">74.5K</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Total Votes</span>
          </div>
          <div className="flex-1 py-4 flex flex-col items-center justify-center border-r border-white/5 hover:bg-white/5 transition-colors">
            <span className="text-xl font-black text-[#008751]">#12</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">State Rank</span>
          </div>
          <div className="flex-1 py-4 flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
            <span className="text-xl font-black text-white">3,200</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Quiz PTS</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 sticky top-[60px] z-40 bg-[#050505]">
          <button 
            onClick={() => setActiveTab("uploads")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "uploads" ? "text-[#008751] border-b-2 border-[#008751]" : "text-white/40 hover:text-white"}`}
          >
            Uploads (6)
          </button>
          <button 
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "quiz" ? "text-[#008751] border-b-2 border-[#008751]" : "text-white/40 hover:text-white"}`}
          >
            Quiz Stats
          </button>
        </div>

        {/* Content Area */}
        <div className="p-px">
          {activeTab === "uploads" && (
            <div className="grid grid-cols-3 gap-px bg-white/10">
              {DUMMY_UPLOADS.map((item) => (
                <div key={item.id} className="aspect-[3/4] bg-[#111] relative group cursor-pointer overflow-hidden">
                  {/* Thumbnail Gradient Placeholder */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.img} to-black/80 opacity-60 group-hover:opacity-100 transition-opacity`}></div>
                  
                  {/* Views Counter */}
                  <div className="absolute bottom-1 left-1 flex items-center gap-1 z-10">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[10px] font-bold text-white">{item.views}</span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#008751]/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <div className="w-10 h-10 bg-[#008751] flex items-center justify-center shadow-[4px_4px_0_black] transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "quiz" && (
            <div className="p-6 flex flex-col items-center justify-center text-center py-20">
              <span className="text-6xl grayscale opacity-50 mb-4">🏆</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Quiz Champion</h3>
              <p className="text-white/50 text-sm mb-6 max-w-[250px]">You've participated in 12 live quizzes. Your highest placement was #3.</p>
              <Link to="/quiz" className="btn-outline text-xs px-6 py-2">Join Next Quiz</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
