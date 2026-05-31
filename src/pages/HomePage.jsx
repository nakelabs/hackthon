import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { TALENT_CATEGORIES } from "../utils/constants";

const MOCK_FEED = [
  {
    id: 1,
    username: "@NaijaStar99",
    category: "Music",
    state: "Lagos",
    caption: "Just dropped a new freestyle 🔥 What do you think?",
    votes: 12400,
    comments: 890,
    shares: 200,
    color: "from-blue-900/40",
    commentsList: [
      { id: 1, username: "afrobeats_lover", text: "This is pure fire! 🔥🔥 Drop the full track!", time: "2h", likes: 124 },
      { id: 2, username: "lagos_producer", text: "We need to work on a beat together.", time: "1h", likes: 45 }
    ]
  },
  {
    id: 2,
    username: "@DanceQueen_ABJ",
    category: "Dance",
    state: "Abuja",
    caption: "Cultural fusion piece. Representing the capital! 💃🇳🇬",
    votes: 45200,
    comments: 1200,
    shares: 4500,
    color: "from-red-900/40",
    commentsList: [
      { id: 1, username: "choreography_pro", text: "The energy is unmatched! 👏🏾", time: "4h", likes: 342 },
      { id: 2, username: "abuja_vibes", text: "Represent!! This is beautiful", time: "2h", likes: 89 },
      { id: 3, username: "dance_life", text: "Can you do a tutorial on that legwork?", time: "30m", likes: 12 }
    ]
  },
  {
    id: 3,
    username: "@TechBro_Kano",
    category: "Technology",
    state: "Kano",
    caption: "Built a drone from scratch using local materials. Areewa to the world! 🚀",
    votes: 38900,
    comments: 500,
    shares: 3100,
    color: "from-green-900/40",
    commentsList: [
      { id: 1, username: "tech_nigeria", text: "Incredible innovation! Keep it up bro.", time: "1d", likes: 500 },
      { id: 2, username: "engr_mustapha", text: "How did you manage the aerodynamics with local wood?", time: "5h", likes: 78 }
    ]
  }
];

const STATES = ["Lagos", "Abuja", "Kano", "Rivers", "Oyo", "Enugu"];

export default function HomePage() {
  const [activePosts, setActivePosts] = useState(MOCK_FEED.reduce((acc, post) => ({...acc, [post.id]: false}), {}));
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStateFilter, setActiveStateFilter] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Comments State
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [newComment, setNewComment] = useState("");

  const handleVote = (id) => {
    setActivePosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtering Logic
  const filteredFeed = useMemo(() => {
    return MOCK_FEED.filter(post => {
      const matchesSearch = 
        post.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === "All" || post.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesState = activeStateFilter === "All" || post.state === activeStateFilter;

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [searchQuery, activeCategory, activeStateFilter]);

  return (
    <div className="bg-black min-h-screen flex justify-center relative overflow-hidden">
      
      {/* Centered mobile-first container */}
      <div className="w-full max-w-[450px] h-[100dvh] bg-[#050505] relative overflow-y-scroll snap-y snap-mandatory hide-scrollbar border-x border-white/5 shadow-2xl shadow-black">
        
        {/* Minimal Top Navigation */}
        <div className="absolute top-0 w-full px-6 py-6 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <h1 className="text-xl font-black text-white tracking-widest uppercase drop-shadow-md">For You</h1>
          
          <button 
            onClick={() => setIsFilterOpen(true)}
            className={`pointer-events-auto p-3 rounded-full backdrop-blur-md transition-all shadow-lg flex items-center justify-center ${
              (searchQuery || activeCategory !== "All" || activeStateFilter !== "All") 
                ? "bg-[#008751] text-white" 
                : "bg-black/40 text-white hover:bg-black/60"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Empty State */}
        {filteredFeed.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-10 px-6 text-center">
            <span className="text-6xl mb-4 grayscale opacity-50">🕵️</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">No Talent Found</h2>
            <p className="text-white/50 text-sm max-w-xs mx-auto">
              We couldn't find anyone matching your search or filter criteria. Try clearing your filters.
            </p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setActiveStateFilter("All");
              }}
              className="mt-6 text-xs font-bold px-4 py-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white uppercase tracking-widest transition-colors pointer-events-auto z-20"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* The Feed */}
        {filteredFeed.map((post) => (
          <div key={post.id} className="relative w-full h-[100dvh] snap-start snap-always flex items-center justify-center bg-[#0a0a0a] overflow-hidden group">
            
            {/* Mock Media Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${post.color} to-black flex items-center justify-center`}>
              {/* Massive subtle watermark */}
              <span className="text-[15rem] font-black opacity-5 text-white pointer-events-none select-none uppercase -rotate-12 whitespace-nowrap">
                {post.category}
              </span>
            </div>

            {/* Bottom Gradient Overlay for Text Readability */}
            <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none"></div>

            {/* Info Overlay (Bottom Left) */}
            <div className="absolute bottom-20 left-4 right-16 z-20">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base text-white tracking-tight hover:underline cursor-pointer drop-shadow-md">{post.username}</span>
                <span className="text-base text-white/80 uppercase drop-shadow-md">
                  {post.state}
                </span>
              </div>
              <p className="text-base text-white/90 mb-3 leading-snug drop-shadow-md">
                {post.caption}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="text-base text-white uppercase drop-shadow-md">#{post.category}</span>
                <span className="text-base text-white uppercase drop-shadow-md">#NAIJATALENT</span>
              </div>
            </div>

            {/* Actions Overlay (Right Edge Stacked) */}
            <div className="absolute bottom-20 right-4 z-30 flex flex-col gap-5 items-center">
              
              {/* Vote Button */}
              <button 
                onClick={() => handleVote(post.id)}
                className="flex flex-col items-center group transition-transform hover:scale-110"
              >
                <div className={`w-12 h-12 flex items-center justify-center border-2 rounded-full mb-1 transition-all duration-300 ${activePosts[post.id] ? 'bg-[#008751] border-[#008751] shadow-[0_0_15px_#008751]' : 'bg-black/40 backdrop-blur-md border-white/20 hover:border-[#008751]'}`}>
                  <span className="text-[11px] font-black tracking-wider text-white">VOTE</span>
                </div>
                <span className={`text-xs font-bold drop-shadow-md ${activePosts[post.id] ? 'text-[#008751]' : 'text-white/90'}`}>
                  {activePosts[post.id] ? (post.votes + 1).toLocaleString() : post.votes.toLocaleString()}
                </span>
              </button>

              {/* Comment Button */}
              <button 
                onClick={() => setActiveCommentPostId(post.id)}
                className="flex flex-col items-center group transition-transform hover:scale-110"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-full mb-1 hover:border-white transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                  </svg>
                </div>
                <span className="text-white/90 text-xs font-bold drop-shadow-md">{post.comments}</span>
              </button>

              {/* Share Button */}
              <button className="flex flex-col items-center group transition-transform hover:scale-110">
                <div className="w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-full mb-1 hover:border-white transition-colors">
                  <svg className="w-5 h-5 text-white translate-x-[-1px] translate-y-[1px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="m22 2-7 20-4-9-9-4Z"/>
                    <path d="M22 2 11 13"/>
                  </svg>
                </div>
                <span className="text-white/90 text-xs font-bold drop-shadow-md">{post.shares}</span>
              </button>

            </div>
          </div>
        ))}
      </div>
      
      {/* Brutalist Filter Drawer Overlay */}
      <div 
        className={`fixed inset-0 z-[100] flex justify-center items-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsFilterOpen(false)}
      >
        <div 
          className={`w-full max-w-[450px] bg-[#0a0a0a] border-t-2 border-white/10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] transition-transform duration-300 flex flex-col max-h-[90vh] ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Handle */}
          <div className="w-full flex justify-center pt-4 pb-2">
            <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
          </div>

          <div className="px-6 pb-4 flex items-center justify-between border-b border-white/5">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Search & Filter</h2>
            {/* Clear All */}
            {(searchQuery || activeCategory !== "All" || activeStateFilter !== "All") && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                  setActiveStateFilter("All");
                }}
                className="text-xs font-bold text-[#008751] uppercase tracking-widest hover:text-white transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar">
            
            {/* Search Input inside drawer */}
            <div className="mb-8 relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/40 group-focus-within:text-[#008751] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Search talent, users, or captions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-white/10 text-white text-base rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#008751] transition-all placeholder:text-white/30"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="text-xs text-white/50 uppercase tracking-[0.2em] mb-4 font-bold">Talent Category</h3>
              <div className="relative">
                <select 
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full bg-[#111] border border-white/20 text-white font-bold text-base rounded-none px-5 py-4 focus:outline-none focus:border-[#008751] transition-colors appearance-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {TALENT_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.label}>{cat.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none">
                  <svg className="w-5 h-5 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* State Filter */}
            <div className="mb-6">
              <h3 className="text-xs text-white/50 uppercase tracking-[0.2em] mb-4 font-bold">Location</h3>
              <div className="relative">
                <select 
                  value={activeStateFilter}
                  onChange={(e) => setActiveStateFilter(e.target.value)}
                  className="w-full bg-[#111] border border-white/20 text-white font-bold text-base rounded-none px-5 py-4 focus:outline-none focus:border-[#008751] transition-colors appearance-none cursor-pointer"
                >
                  <option value="All">All States</option>
                  {STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-5 pointer-events-none">
                  <svg className="w-5 h-5 text-[#008751]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

          </div>

          {/* Sticky Apply Button */}
          <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="w-full btn-primary py-4 text-base tracking-widest uppercase"
            >
              Show Results ({filteredFeed.length})
            </button>
          </div>
        </div>
      </div>

      {/* Instagram-style Comments Drawer */}
      <div 
        className={`fixed inset-0 z-[100] flex justify-center items-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${activeCommentPostId ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setActiveCommentPostId(null)}
      >
        <div 
          className={`w-full max-w-[450px] h-[70vh] bg-[#262626] rounded-t-xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] transition-transform duration-300 flex flex-col ${activeCommentPostId ? 'translate-y-0' : 'translate-y-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Handle & Header */}
          <div className="w-full flex flex-col items-center pt-3 pb-3 border-b border-white/10 sticky top-0 bg-[#262626] rounded-t-xl z-10">
            <div className="w-10 h-1 bg-white/20 rounded-full mb-3"></div>
            <h2 className="text-sm font-bold text-white">Comments</h2>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar">
            {activeCommentPostId && MOCK_FEED.find(p => p.id === activeCommentPostId)?.commentsList.map(comment => (
              <div key={comment.id} className="flex gap-3 mb-5">
                {/* Avatar placeholder */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 shrink-0"></div>
                
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-white text-xs">{comment.username}</span>
                    <span className="text-white/50 text-[10px]">{comment.time}</span>
                  </div>
                  <p className="text-white/90 text-sm leading-snug mb-1">{comment.text}</p>
                  <button className="text-white/50 text-xs font-semibold hover:text-white/80 transition-colors">Reply</button>
                </div>
                
                {/* Comment Like button */}
                <div className="flex flex-col items-center pt-2">
                  <svg className="w-3.5 h-3.5 text-white/40 mb-1 hover:text-red-500 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-[10px] text-white/40 font-semibold">{comment.likes}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-4 border-t border-white/10 bg-[#262626] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#008751] to-green-900 shrink-0 flex items-center justify-center text-xs text-white font-bold">Me</div>
            <div className="flex-1 relative flex items-center">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-transparent border border-white/20 rounded-full py-2.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-white/50 placeholder:text-white/40 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newComment.trim()) {
                    setNewComment("");
                  }
                }}
              />
              {newComment.trim() && (
                <button 
                  className="absolute right-4 text-blue-500 font-bold text-sm hover:text-blue-400 transition-colors"
                  onClick={() => setNewComment("")}
                >
                  Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar styles for webkit */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
