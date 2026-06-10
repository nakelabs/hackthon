import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const navItems = [
    {
      name: "Feed",
      path: "/home",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: "Quiz",
      path: "/quiz",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      name: "Upload",
      path: "/upload",
      isUpload: true,
      icon: (
        <div className="w-12 h-8 bg-white text-black flex items-center justify-center rounded-md font-bold text-xl hover:bg-[#008751] hover:text-white transition-colors">
          +
        </div>
      )
    },
    {
      name: "Ranks",
      path: "/leaderboard",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    },
    {
      name: "Profile",
      path: "/my-arena",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="fixed bottom-0 w-full z-50 flex justify-center bg-transparent pointer-events-none">
      <div className="w-full max-w-[450px] md:max-w-full md:px-10 lg:px-20 bg-black border-t border-white/10 px-2 py-3 flex justify-between items-center pointer-events-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path && !item.isUpload;
          
          if (item.isUpload) {
            return (
              <button 
                key="upload-btn"
                onClick={() => setShowCreateMenu(true)}
                className="flex flex-col items-center justify-center w-[20%] transition-transform hover:scale-110"
              >
                <div className="mb-1">{item.icon}</div>
              </button>
            );
          }

          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex flex-col items-center justify-center w-[20%] transition-colors ${
                isActive ? "text-white" : "text-white/40 hover:text-white"
              }`}
            >
              <div className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold tracking-widest uppercase ${isActive ? 'text-white' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Creation Menu Overlay */}
      {showCreateMenu && (
        <div className="fixed inset-0 z-[100] flex justify-center items-end bg-black/80 backdrop-blur-sm pointer-events-auto" onClick={() => setShowCreateMenu(false)}>
          <div 
            className="w-full max-w-[450px] bg-[#0a0a0a] border-t border-white/10 rounded-t-3xl shadow-[0_-10px_50px_rgba(0,135,81,0.2)] p-6 pb-12 animate-in slide-in-from-bottom duration-300 flex flex-col gap-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-black text-white uppercase tracking-widest text-center mb-4">Create</h2>
            
            <button 
              onClick={() => { setShowCreateMenu(false); navigate("/go-live"); }}
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-red-900/50 to-black border border-red-500/30 hover:border-red-500/60 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-white uppercase tracking-widest mb-1">Go Live</h3>
                  <p className="text-xs text-white/50">Start a real-time broadcast</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-white/30 group-hover:text-white/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button 
              onClick={() => { setShowCreateMenu(false); navigate("/upload"); }}
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-[#008751]/20 to-black border border-[#008751]/30 hover:border-[#008751]/60 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#008751]/20 flex items-center justify-center text-[#008751] group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-base font-bold text-white uppercase tracking-widest mb-1">Upload Talent</h3>
                  <p className="text-xs text-white/50">Share a video or image post</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-white/30 group-hover:text-white/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
