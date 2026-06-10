import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

export default function HomePage() {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  // ── Feed state ────────────────────────────────────────────────────────────
  const [feed, setFeed]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState(null);
  const [skip, setSkip]               = useState(0);
  const [hasMore, setHasMore]         = useState(true);
  const LIMIT = 20;

  // ── Filter / Search state ─────────────────────────────────────────────────
  const [searchQuery, setSearchQuery]       = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen]     = useState(false);

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
        ? TALENT_CATEGORIES.find(c => c.label === activeCategory)?.id
        : undefined;
      const data = await getApprovedTalents({ category: catParam, skip: currentSkip, limit: LIMIT });
      const newItems = data.talents || [];

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
    } catch {
      // silently fail
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

  // ── Client-side search filter ─────────────────────────────────────────────
  const filteredFeed = useMemo(() => {
    if (!searchQuery) return feed;
    const q = searchQuery.toLowerCase();
    return feed.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  }, [feed, searchQuery]);

  return (
    <div className="bg-black min-h-screen flex justify-center relative overflow-hidden">
      <div className="w-full max-w-[450px] h-[100dvh] bg-[#050505] relative overflow-y-scroll snap-y snap-mandatory hide-scrollbar border-x border-white/5 shadow-2xl shadow-black">

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
                (searchQuery || activeCategory !== "All")
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
        {!loading && !error && filteredFeed.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-10 px-6 text-center">
            <span className="text-6xl mb-4 grayscale opacity-50">🕵️</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">No Talent Found</h2>
            <p className="text-white/50 text-sm max-w-xs mx-auto">Try a different category or check back soon.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-6 text-xs font-bold px-4 py-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white uppercase tracking-widest transition-colors pointer-events-auto z-20"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ── The Feed ── */}
        {filteredFeed.map((post, idx) => {
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
                <video src={`${mediaUrl}#t=0.001`} preload="metadata" className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline />
              ) : mediaUrl && mediaType === "image" ? (
                <img src={mediaUrl} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} to-black flex items-center justify-center`}>
                  <span className="text-[15rem] font-black opacity-5 text-white pointer-events-none select-none uppercase -rotate-12">
                    {post.category}
                  </span>
                </div>
              )}
              {mediaUrl && mediaType === "audio" && (
                <audio src={mediaUrl} autoPlay loop className="hidden" />
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
        {!loading && hasMore && filteredFeed.length > 0 && (
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
            {(searchQuery || activeCategory !== "All") && (
              <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="text-xs font-bold text-[#008751] uppercase tracking-widest">
                Clear All
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar">
            <div className="mb-8 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text" placeholder="Search posts…"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-white/10 text-white text-base rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-[#008751] transition-all placeholder:text-white/30"
              />
            </div>
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
