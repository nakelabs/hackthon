import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TALENT_CATEGORIES } from "../utils/constants";
import { getApprovedTalents, castVote, removeVote } from "../services/talentService";
import { getComments, createComment } from "../services/commentService";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const CARD_GRADIENTS = [
  "from-blue-900/40", "from-red-900/40", "from-green-900/40",
  "from-purple-900/40", "from-yellow-900/40", "from-pink-900/40",
];

function getMediaUrl(talent) {
  return talent.video_url || talent.audio_url || talent.image_url || null;
}

function getMediaType(talent) {
  return talent.media_type || (talent.video_url ? "video" : talent.audio_url ? "audio" : "image");
}

// Uploader avatar shown on each post (Instagram-style)
function PostAvatar({ post, onClick }) {
  const name    = post.username || "?";
  const initial = name.charAt(0).toUpperCase();
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 group"
    >
      <div className="w-9 h-9 rounded-full border-2 border-[#008751] overflow-hidden bg-[#111] flex items-center justify-center shrink-0 shadow-lg group-hover:border-white transition-colors">
        {post.profile_picture_url ? (
          <img
            src={post.profile_picture_url}
            alt={name}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <span className="text-xs font-black text-white">{initial}</span>
        )}
      </div>
      <span className="text-white text-sm font-semibold drop-shadow-md truncate max-w-[100px] group-hover:text-[#008751] transition-colors">
        {name}
      </span>
    </button>
  );
}

// ── Feed Media Components ───────────────────────────────────────────────────
function FeedVideo({ src, isActive, isMuted, toggleMute }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMuteAnim, setShowMuteAnim] = useState(false);
  const prevMuted = useRef(isMuted);
  
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (prevMuted.current !== isMuted && isActive) {
      setShowMuteAnim(true);
      const timer = setTimeout(() => setShowMuteAnim(false), 800);
      prevMuted.current = isMuted;
      return () => clearTimeout(timer);
    }
  }, [isMuted, isActive]);

  const handleTogglePlay = (e) => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <video 
        ref={videoRef}
        src={`${src}#t=0.001`} 
        preload="metadata" 
        className="absolute inset-0 w-full h-full object-cover cursor-pointer" 
        muted={isMuted} 
        loop 
        playsInline 
        onClick={handleTogglePlay}
        onDoubleClick={toggleMute}
      />
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-6 text-white transition-opacity">
            <svg className="w-16 h-16 pl-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      )}
      {/* Temporary Mute Animation */}
      {showMuteAnim && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="bg-black/60 backdrop-blur-md rounded-full p-8 text-white animate-fade-in shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {isMuted ? (
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
            ) : (
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function FeedAudio({ src, isActive, gradient, category }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isActive) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop className="hidden" />
      <div 
        className={`absolute inset-0 bg-gradient-to-br ${gradient} to-black flex flex-col items-center justify-center cursor-pointer`}
        onClick={handleTogglePlay}
      >
        {/* Animated vinyl record */}
        <div className={`w-48 h-48 rounded-full border-4 border-white/10 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-transform duration-1000 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} style={{ background: 'radial-gradient(circle, #333 10%, #111 90%)' }}>
          <div className="w-16 h-16 bg-black rounded-full border-2 border-white/20"></div>
        </div>
        
        <span className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-lg mb-6">
          {category}
        </span>
        
        {!isPlaying && (
          <div className="bg-black/50 backdrop-blur-sm rounded-full p-5 text-white transition-opacity absolute">
            <svg className="w-12 h-12 pl-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        )}
      </div>
    </>
  );
}

export default function HomePage() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const containerRef = useRef(null);

  // ── Feed state ────────────────────────────────────────────────────────────
  const [feed, setFeed]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState(null);
  const [skip, setSkip]               = useState(0);
  const [hasMore, setHasMore]         = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const LIMIT = 20;

  // ── Filter / Search state ─────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen]     = useState(false);
  const [isMuted, setIsMuted]               = useState(true);

  // ── Vote state ────────────────────────────────────────────────────────────
  // voteCounts tracks real-time vote count per post; hasVotedMap tracks voted state
  const [voteCounts, setVoteCounts]     = useState({});   // { [postId]: number }
  const [hasVotedMap, setHasVotedMap]   = useState({});   // { [postId]: bool }
  const [votingId, setVotingId]         = useState(null);

  // ── Comment state ─────────────────────────────────────────────────────────
  const [activePostId, setActivePostId]       = useState(null);
  const [activePostCommentCount, setActivePostCommentCount] = useState(0);
  const [comments, setComments]               = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment]           = useState("");
  const [postingComment, setPostingComment]   = useState(false);

  // ── Load feed ─────────────────────────────────────────────────────────────
  const loadFeed = useCallback(async (reset = false) => {
    const currentSkip = reset ? 0 : skip;
    if (reset) { setLoading(true); setFeed([]); }
    else setLoadingMore(true);

    try {
      const catParam = activeCategory !== "All"
        ? TALENT_CATEGORIES.find(c => c.label === activeCategory)?.dbName
        : undefined;
      const data = await getApprovedTalents({ category: catParam, skip: currentSkip, limit: LIMIT });
      let newItems = data.talents || [];

      if (reset && location.state?.initialPost) {
        newItems = newItems.filter(p => p.id !== location.state.initialPost.id);
        newItems = [location.state.initialPost, ...newItems];
      }

      // Seed vote state from API response
      const newVoteCounts  = {};
      const newHasVotedMap = {};
      newItems.forEach(item => {
        newVoteCounts[item.id]  = item.vote_count  ?? 0;
        newHasVotedMap[item.id] = item.has_voted   ?? false;
      });

      setVoteCounts(prev  => ({ ...prev,  ...newVoteCounts  }));
      setHasVotedMap(prev => ({ ...prev,  ...newHasVotedMap }));
      setFeed(prev  => reset ? newItems : [...prev, ...newItems]);
      setSkip(currentSkip + newItems.length);
      setHasMore(newItems.length === LIMIT);
      setError(null);
    } catch {
      setError("Could not load the talent feed. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeCategory, skip]);

  useEffect(() => { loadFeed(true); }, [activeCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Vote ──────────────────────────────────────────────────────────────────
  const handleVote = async (postId) => {
    if (!user) { alert("Please sign in to vote."); return; }
    if (votingId === postId) return;
    setVotingId(postId);

    const alreadyVoted = hasVotedMap[postId];
    try {
      if (alreadyVoted) {
        await removeVote(postId);
        setHasVotedMap(prev => ({ ...prev, [postId]: false }));
        setVoteCounts(prev  => ({ ...prev, [postId]: Math.max(0, (prev[postId] || 0) - 1) }));
      } else {
        await castVote(postId);
        setHasVotedMap(prev => ({ ...prev, [postId]: true }));
        setVoteCounts(prev  => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
      }
    } catch (err) {
      const msg = err.response?.data?.detail;
      if (msg) alert(msg);
    } finally {
      setVotingId(null);
    }
  };

  // ── Comments ──────────────────────────────────────────────────────────────
  const openComments = async (post) => {
    setActivePostId(post.id);
    setActivePostCommentCount(post.comment_count ?? 0);
    setCommentsLoading(true);
    try {
      const data = await getComments(post.id);
      setComments(data.comments || []);
    } catch {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!user) { alert("Please sign in to comment."); return; }
    if (!newComment.trim() || !activePostId || postingComment) return;
    setPostingComment(true);
    try {
      const c = await createComment(activePostId, newComment.trim());
      setComments(prev => [...prev, c]);
      setNewComment("");
      // bump comment count in feed
      setFeed(prev => prev.map(p =>
        p.id === activePostId ? { ...p, comment_count: (p.comment_count || 0) + 1 } : p
      ));
      setActivePostCommentCount(prev => prev + 1);
    } catch {
      // ignore
    } finally {
      setPostingComment(false);
    }
  };

  // ── Scroll Tracking & Keyboard Navigation ───────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let timeout;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const idx = Math.round(el.scrollTop / window.innerHeight);
        setActiveIndex(idx);
      }, 50); // slight debounce for performance
    };
    el.addEventListener("scroll", handleScroll);

    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA") return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        el.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        el.scrollBy({ top: -window.innerHeight, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="bg-black min-h-screen flex justify-center relative overflow-hidden">
      <div ref={containerRef} className="w-full max-w-[450px] h-[100dvh] bg-[#050505] relative overflow-y-scroll snap-y snap-mandatory hide-scrollbar border-x border-white/5 shadow-2xl shadow-black">

        {/* Top Nav */}
        <div className="absolute top-0 w-full px-5 py-5 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <h1 className="text-xl font-black text-white tracking-widest uppercase drop-shadow-md">For You</h1>
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* User search icon */}
            <button
              onClick={() => navigate("/search")}
              className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all shadow-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            {/* Filter icon */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`p-3 rounded-full backdrop-blur-md transition-all shadow-lg flex items-center justify-center ${
                (activeCategory !== "All")
                  ? "bg-[#008751] text-white"
                  : "bg-black/40 text-white hover:bg-black/60"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#050505] z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#008751] border-t-transparent rounded-full animate-spin" />
              <p className="text-white/40 text-xs uppercase tracking-widest">Loading talent…</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-10 px-6 text-center">
            <span className="text-5xl mb-4">⚠️</span>
            <p className="text-white/70 text-sm mb-4">{error}</p>
            <button onClick={() => loadFeed(true)} className="text-xs font-bold px-4 py-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white uppercase tracking-widest transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && feed.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-10 px-6 text-center">
            <span className="text-6xl mb-4 grayscale opacity-50">🕵️</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">No Talent Found</h2>
            <p className="text-white/50 text-sm max-w-xs mx-auto">Try a different category or check back soon.</p>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-6 text-xs font-bold px-4 py-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white uppercase tracking-widest transition-colors pointer-events-auto z-20"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ── The Feed ── */}
        {feed.map((post, idx) => {
          const alreadyVoted = hasVotedMap[post.id] ?? false;
          const voteCount    = voteCounts[post.id]  ?? post.vote_count ?? 0;
          const commentCount = post.comment_count   ?? 0;
          const mediaUrl     = getMediaUrl(post);
          const mediaType    = getMediaType(post);
          const gradient     = CARD_GRADIENTS[idx % CARD_GRADIENTS.length];

          return (
            <div key={post.id} className="relative w-full h-[100dvh] snap-start snap-always flex items-center justify-center bg-[#0a0a0a] overflow-hidden group">

              {/* Media */}
              {mediaUrl && mediaType === "video" ? (
                <FeedVideo 
                  src={mediaUrl} 
                  isActive={idx === activeIndex} 
                  isMuted={isMuted} 
                  toggleMute={() => setIsMuted(!isMuted)} 
                />
              ) : mediaUrl && mediaType === "audio" ? (
                <FeedAudio src={mediaUrl} isActive={idx === activeIndex} gradient={gradient} category={post.category} />
              ) : mediaUrl && mediaType === "image" ? (
                <img src={mediaUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} to-black flex items-center justify-center`}>
                  <span className="text-[15rem] font-black opacity-5 text-white pointer-events-none select-none uppercase -rotate-12">
                    {post.category}
                  </span>
                </div>
              )}

              {/* Dark overlay */}
              <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

              {/* ── Bottom info row ── */}
              <div className="absolute bottom-20 left-4 right-16 z-20">
                {/* Uploader avatar — Instagram style */}
                <div className="mb-3">
                  <PostAvatar
                    post={post}
                    onClick={() => {
                      if (post.user_id) navigate(`/profile/${post.user_id}`);
                    }}
                  />
                </div>
                <p className="text-base text-white font-semibold mb-1 drop-shadow-md">{post.title}</p>
                <p className="text-sm text-white/80 mb-2 leading-snug drop-shadow-md line-clamp-2">{post.description}</p>
                <span className="text-sm text-white/70 uppercase drop-shadow-md">#{post.category}</span>
              </div>

              {/* ── Action bar (right side) ── */}
              <div className="absolute bottom-20 right-4 z-30 flex flex-col gap-5 items-center">

                {/* Vote button */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleVote(post.id)}
                    disabled={votingId === post.id}
                    className={`relative w-12 h-12 flex items-center justify-center border-2 rounded-full mb-1 transition-all duration-300 ${
                      alreadyVoted
                        ? "bg-[#008751]/30 border-[#008751] shadow-[0_0_15px_rgba(0,135,81,0.5)] opacity-60 cursor-default"
                        : "bg-black/40 backdrop-blur-md border-white/20 hover:border-[#008751] hover:scale-110"
                    }`}
                  >
                    {alreadyVoted && (
                      <div className="absolute inset-0 rounded-full backdrop-blur-[2px]" />
                    )}
                    <span className={`text-[10px] font-black tracking-wider relative z-10 ${alreadyVoted ? "text-[#008751]" : "text-white"}`}>
                      {votingId === post.id ? "…" : alreadyVoted ? "✓" : "VOTE"}
                    </span>
                  </button>
                  <span className={`text-xs font-bold drop-shadow-md ${alreadyVoted ? "text-[#008751]" : "text-white/90"}`}>
                    {voteCount.toLocaleString()}
                  </span>
                </div>

                {/* Comment button */}
                <button
                  onClick={() => openComments(post)}
                  className="flex flex-col items-center transition-transform hover:scale-110"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-full mb-1 hover:border-white transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    </svg>
                  </div>
                  <span className="text-white/90 text-xs font-bold drop-shadow-md">
                    {commentCount.toLocaleString()}
                  </span>
                </button>

                {/* Share button */}
                <button
                  onClick={() => navigator.share?.({ title: post.title, text: post.description })}
                  className="flex flex-col items-center transition-transform hover:scale-110"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border-2 border-white/20 rounded-full mb-1 hover:border-white transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          );
        })}

        {/* Load more sentinel */}
        {!loading && hasMore && feed.length > 0 && (
          <div className="w-full h-[100dvh] snap-start snap-always flex items-center justify-center bg-[#050505]">
            <button
              onClick={() => loadFeed(false)}
              disabled={loadingMore}
              className="text-xs font-bold px-6 py-3 border border-white/20 bg-white/5 hover:bg-white/10 text-white uppercase tracking-widest transition-colors"
            >
              {loadingMore ? "Loading…" : "Load More →"}
            </button>
          </div>
        )}
      </div>

      {/* ── Filter Drawer ── */}
      <div
        className={`fixed inset-0 z-[100] flex justify-center items-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsFilterOpen(false)}
      >
        <div
          className={`w-full max-w-[450px] bg-[#0a0a0a] border-t-2 border-white/10 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] transition-transform duration-300 flex flex-col max-h-[90vh] ${isFilterOpen ? "translate-y-0" : "translate-y-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex justify-center pt-4 pb-2">
            <div className="w-12 h-1.5 bg-white/20 rounded-full" />
          </div>
          <div className="px-6 pb-4 flex items-center justify-between border-b border-white/5">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Filter</h2>
            {activeCategory !== "All" && (
              <button onClick={() => setActiveCategory("All")} className="text-xs font-bold text-[#008751] uppercase tracking-widest">
                Clear All
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar">
            <div className="mb-6">
              <h3 className="text-xs text-white/50 uppercase tracking-[0.2em] mb-4 font-bold">Talent Category</h3>
              <select
                value={activeCategory}
                onChange={(e) => { setActiveCategory(e.target.value); setSkip(0); }}
                className="w-full bg-[#111] border border-white/20 text-white font-bold text-base rounded-none px-5 py-4 focus:outline-none focus:border-[#008751] transition-colors appearance-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {TALENT_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.label}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-6 border-t border-white/5 bg-[#0a0a0a]">
            <button onClick={() => setIsFilterOpen(false)} className="w-full btn-primary py-4 text-base tracking-widest uppercase">
              Show Results
            </button>
          </div>
        </div>
      </div>

      {/* ── Comments Drawer ── */}
      <div
        className={`fixed inset-0 z-[100] flex justify-center items-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${activePostId ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setActivePostId(null)}
      >
        <div
          className={`w-full max-w-[450px] h-[70vh] bg-[#262626] rounded-t-xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] transition-transform duration-300 flex flex-col ${activePostId ? "translate-y-0" : "translate-y-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-col items-center pt-3 pb-3 border-b border-white/10 sticky top-0 bg-[#262626] rounded-t-xl z-10">
            <div className="w-10 h-1 bg-white/20 rounded-full mb-3" />
            <h2 className="text-sm font-bold text-white">
              Comments {activePostCommentCount > 0 && <span className="text-white/50 font-normal">({activePostCommentCount.toLocaleString()})</span>}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar">
            {commentsLoading && (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-[#008751] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!commentsLoading && comments.length === 0 && (
              <p className="text-center text-white/40 text-sm py-8">No comments yet. Be first! 💬</p>
            )}
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#008751] to-green-900 shrink-0 flex items-center justify-center text-xs text-white font-bold">
                  {comment.user_name?.charAt(0) || "?"}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-white text-xs">{comment.user_name}</span>
                    <span className="text-white/50 text-[10px]">{new Date(comment.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-white/90 text-sm leading-snug">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/10 bg-[#262626] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#008751] to-green-900 shrink-0 flex items-center justify-center text-xs text-white font-bold overflow-hidden">
              {user?.profile_picture_url ? (
                <img src={user.profile_picture_url} alt="" className="w-full h-full object-cover" />
              ) : (
                user?.full_name?.charAt(0) || "Me"
              )}
            </div>
            <div className="flex-1 relative flex items-center">
              <input
                type="text" placeholder="Add a comment…"
                value={newComment} onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handlePostComment(); }}
                className="w-full bg-transparent border border-white/20 rounded-full py-2.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-white/50 placeholder:text-white/40 transition-colors"
              />
              {newComment.trim() && (
                <button
                  onClick={handlePostComment}
                  disabled={postingComment}
                  className="absolute right-4 text-blue-400 font-bold text-sm hover:text-blue-300 transition-colors"
                >
                  {postingComment ? "…" : "Post"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}} />
    </div>
  );
}
