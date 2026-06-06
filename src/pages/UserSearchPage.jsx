import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../services/authService";
import { getApprovedTalents } from "../services/talentService";
import { TALENT_CATEGORIES } from "../utils/constants";

// ─── Debounce hook ───────────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
const BackIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRight = () => (
  <svg className="w-4 h-4 text-white/20 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
  </svg>
);
const PinIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);

// ─── Spinner ─────────────────────────────────────────────────────────────────
const Spinner = () => (
  <div className="flex justify-center py-12">
    <div className="w-7 h-7 border-2 border-[#008751] border-t-transparent rounded-full animate-spin" />
  </div>
);

// ─── Empty state ─────────────────────────────────────────────────────────────
function EmptyState({ query, tab }) {
  if (!query) {
    return (
      <div key="state-initial" className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
          <SearchIcon />
        </div>
        <h2 className="text-lg font-black text-white uppercase tracking-widest mb-2">
          {tab === "users" ? "Find Talents" : "Find Posts"}
        </h2>
        <p className="text-white/40 text-sm max-w-xs">
          {tab === "users"
            ? "Search by name, username or location to discover Nigerian talents."
            : "Search by title, description or category to find posts."}
        </p>
      </div>
    );
  }
  return (
    <div key="state-no-results" className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <span className="text-5xl mb-4 opacity-40">🔍</span>
      <h2 className="text-lg font-black text-white uppercase tracking-widest mb-2">
        No {tab === "users" ? "Users" : "Posts"} Found
      </h2>
      <p className="text-white/40 text-sm">Try a different keyword.</p>
    </div>
  );
}

// ─── User card ───────────────────────────────────────────────────────────────
function UserCard({ u, onClick }) {
  const name    = u.full_name || u.username || "Naija Talent";
  const handle  = `@${(u.username || u.full_name || "").replace(/\s+/g, "").toLowerCase()}`;
  const initial = name.charAt(0).toUpperCase();
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors text-left"
    >
      <div className="w-12 h-12 rounded-full bg-[#111] border border-[#008751]/40 overflow-hidden flex items-center justify-center shrink-0">
        {u.profile_picture_url ? (
          <img src={u.profile_picture_url} alt={name} className="w-full h-full object-cover object-center" />
        ) : (
          <span className="text-lg font-black text-white">{initial}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm truncate">{name}</p>
        <p className="text-white/50 text-xs truncate">{handle}</p>
        {u.location && (
          <p className="text-white/30 text-[11px] flex items-center gap-1 mt-0.5">
            <PinIcon /> {u.location}
          </p>
        )}
      </div>
      <ChevronRight />
    </button>
  );
}

// ─── Post card ────────────────────────────────────────────────────────────────
function PostCard({ post, onClick }) {
  const media = post.image_url || post.video_url || null;
  const name  = post.username || "Unknown";
  const initial = name.charAt(0).toUpperCase();
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors text-left"
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-xl bg-[#111] border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
        {media ? (
          post.image_url
            ? <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
            : <div className="flex items-center justify-center w-full h-full bg-[#1a1a1a]">
                <svg className="w-6 h-6 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
        ) : (
          <span className="text-2xl font-black text-white/10 uppercase">{post.category?.charAt(0)}</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm truncate">{post.title}</p>
        {post.description && (
          <p className="text-white/40 text-xs truncate mt-0.5">{post.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          {/* uploader avatar */}
          <div className="w-4 h-4 rounded-full bg-[#008751]/30 border border-[#008751]/40 overflow-hidden flex items-center justify-center">
            {post.profile_picture_url
              ? <img src={post.profile_picture_url} alt={name} className="w-full h-full object-cover" />
              : <span className="text-[7px] font-black text-white">{initial}</span>}
          </div>
          <span className="text-white/40 text-[11px] truncate">{name}</span>
          <span className="text-white/20 text-[11px]">·</span>
          <span className="text-[#008751] text-[11px] font-semibold uppercase tracking-wide">{post.category}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-white/50 text-[11px] font-bold">{(post.vote_count ?? 0).toLocaleString()} votes</span>
        <span className="text-white/30 text-[11px]">{(post.comment_count ?? 0)} 💬</span>
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SearchPage() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [query, setQuery]         = useState("");
  const [activeTab, setActiveTab] = useState("users"); // "users" | "posts"

  // Users state
  const [users, setUsers]             = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersSearched, setUsersSearched] = useState(false);

  // Posts state
  const [posts, setPosts]             = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsSearched, setPostsSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 420);

  // ── Search users ────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (q) => {
    if (!q.trim()) { setUsers([]); setUsersSearched(false); return; }
    setUsersLoading(true);
    try {
      const data = await searchUsers(q);
      setUsers(data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setUsersLoading(false);
      setUsersSearched(true);
    }
  }, []);

  // ── Search posts (client-side filter over approved feed) ────────────────────
  const fetchPosts = useCallback(async (q) => {
    if (!q.trim()) { setPosts([]); setPostsSearched(false); return; }
    setPostsLoading(true);
    try {
      const data = await getApprovedTalents({ limit: 100 });
      const all  = data.talents || [];
      const ql   = q.toLowerCase();
      const filtered = all.filter(p =>
        p.title?.toLowerCase().includes(ql) ||
        p.description?.toLowerCase().includes(ql) ||
        p.category?.toLowerCase().includes(ql) ||
        p.username?.toLowerCase().includes(ql)
      );
      setPosts(filtered);
    } catch {
      setPosts([]);
    } finally {
      setPostsLoading(false);
      setPostsSearched(true);
    }
  }, []);

  useEffect(() => {
    fetchUsers(debouncedQuery);
    fetchPosts(debouncedQuery);
  }, [debouncedQuery, fetchUsers, fetchPosts]);

  // Auto-focus on mount — delayed to avoid Grammarly/extension injection
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  const clearSearch = () => {
    setQuery("");
    setUsers([]);
    setPosts([]);
    setUsersSearched(false);
    setPostsSearched(false);
    inputRef.current?.focus();
  };

  const isLoading = activeTab === "users" ? usersLoading : postsLoading;
  const searched  = activeTab === "users" ? usersSearched : postsSearched;
  const results   = activeTab === "users" ? users : posts;

  const TABS = [
    { id: "users", label: "Users",  count: users.length },
    { id: "posts", label: "Posts",  count: posts.length },
  ];

  return (
    <div className="bg-black min-h-screen flex justify-center">
      <div className="w-full max-w-[450px] bg-[#050505] min-h-screen border-x border-white/5 shadow-2xl shadow-black flex flex-col">

        {/* ── Header ── */}
        <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
          {/* Search bar row */}
          <div className="w-full px-4 py-3 flex items-center gap-3">
            <button
              id="search-back-btn"
              onClick={() => navigate(-1)}
              className="text-white/60 hover:text-white transition-colors shrink-0 p-1"
            >
              <BackIcon />
            </button>

            <div className="flex-1 relative flex items-center">
              <span className="absolute left-3 text-white/40 pointer-events-none">
                <SearchIcon />
              </span>
              <input
                ref={inputRef}
                id="unified-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users, posts, categories…"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                data-gramm="false"
                data-gramm_editor="false"
                data-enable-grammarly="false"
                className="w-full bg-[#111] border border-white/10 rounded-full pl-9 pr-10 py-2.5 text-sm text-white focus:outline-none focus:border-[#008751] transition-all placeholder:text-white/30"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 text-white/40 hover:text-white transition-colors"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex px-4 pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`search-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 py-3 text-sm font-bold tracking-wide transition-colors ${
                  activeTab === tab.id ? "text-white" : "text-white/40 hover:text-white/60"
                }`}
              >
                {tab.label}
                {searched && tab.count > 0 && (
                  <span className={`ml-1.5 text-[11px] font-black px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? "bg-[#008751] text-white" : "bg-white/10 text-white/50"
                  }`}>
                    {tab.count}
                  </span>
                )}
                {/* active underline */}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-[#008751] transition-all duration-300 ${
                  activeTab === tab.id ? "w-10" : "w-0"
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Results ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Loading */}
          {isLoading ? <Spinner /> : null}

          {/* Empty / no-query state */}
          {!isLoading && !searched ? (
            <EmptyState query={query} tab={activeTab} />
          ) : null}

          {/* No results */}
          {!isLoading && searched && results.length === 0 ? (
            <EmptyState query={query} tab={activeTab} />
          ) : null}

          {/* ── Users list ── */}
          {activeTab === "users" && !isLoading && users.length > 0 ? (
            <div key="users-list">
              <p className="px-5 pt-5 pb-2 text-[11px] text-white/30 uppercase tracking-[0.2em] font-bold">
                {users.length} user{users.length !== 1 ? "s" : ""} found
              </p>
              <div className="divide-y divide-white/5">
                {users.map((u, i) => (
                  <UserCard
                    key={`${u.id}-${i}`}
                    u={u}
                    onClick={() => navigate(`/profile/${u.id}`)}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {/* ── Posts list ── */}
          {activeTab === "posts" && !isLoading && posts.length > 0 ? (
            <div key="posts-list">
              <p className="px-5 pt-5 pb-2 text-[11px] text-white/30 uppercase tracking-[0.2em] font-bold">
                {posts.length} post{posts.length !== 1 ? "s" : ""} found
              </p>
              <div className="divide-y divide-white/5">
                {posts.map((post, i) => (
                  <PostCard
                    key={`${post.id}-${i}`}
                    post={post}
                    onClick={() => navigate(`/profile/${post.user_id}`)}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
