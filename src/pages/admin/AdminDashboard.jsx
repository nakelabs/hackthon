import { useState, useEffect } from "react";
import { Users, FileText, CheckCircle, Clock, ThumbsUp, Award, RefreshCw } from "lucide-react";
import { getAdminStats, getAdminSubmissions } from "../../services/adminService";

const STATUS_PILL = {
  pending:  "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [stats, setStats]         = useState(null);
  const [recent, setRecent]       = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, submissionsData] = await Promise.all([
        getAdminStats(),
        getAdminSubmissions({ limit: 5 }),
      ]);
      setStats(statsData);
      setRecent(submissionsData.talents || []);
    } catch {
      // keep whatever was there
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const STAT_CARDS = stats ? [
    {
      label: "Total Posts",
      value: stats.total_posts.toLocaleString(),
      delta: `${stats.pending_posts} pending review`,
      icon: FileText,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Pending Approval",
      value: stats.pending_posts.toLocaleString(),
      delta: "Needs review",
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Approved Posts",
      value: stats.approved_posts.toLocaleString(),
      delta: stats.total_posts > 0
        ? `${Math.round((stats.approved_posts / stats.total_posts) * 100)}% rate`
        : "—",
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Registered Users",
      value: stats.total_users.toLocaleString(),
      delta: `${stats.total_votes.toLocaleString()} total votes`,
      icon: Users,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Total Votes",
      value: stats.total_votes.toLocaleString(),
      delta: "Across all categories",
      icon: ThumbsUp,
      color: "bg-pink-50 text-pink-600",
    },
    {
      label: "Compendium Nominees",
      value: stats.total_nominees.toLocaleString(),
      delta: "Global icons",
      icon: Award,
      color: "bg-teal-50 text-teal-600",
    },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Live overview of Nigeria Celebrates platform</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#121a1d] rounded-[1.5rem] p-6 min-h-[11rem] animate-pulse border border-white/5">
              <div className="flex justify-between mb-8">
                <div className="h-5 bg-white/10 rounded w-1/3" />
                <div className="w-5 h-5 bg-white/10 rounded-full" />
              </div>
              <div className="flex items-baseline gap-3">
                <div className="h-12 bg-white/10 rounded w-1/2" />
                <div className="h-5 bg-white/5 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          {STAT_CARDS.map(({ label, value, delta, icon: Icon }) => (
            <div key={label} className="bg-[#121a1d] rounded-[1.5rem] p-6 min-h-[11rem] flex flex-col relative overflow-hidden group shadow-lg border border-white/5">
              
              {/* Decorative Graph SVG */}
              <svg className="absolute bottom-0 left-0 w-full h-[60%] text-[#6366f1] opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 100 50" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`grad-${label.replace(/\s+/g, '')}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M 0 35 C 10 40, 20 38, 35 25 C 45 15, 50 22, 60 22 C 70 22, 75 8, 85 8 C 92 8, 96 20, 100 28 L 100 50 L 0 50 Z" fill={`url(#grad-${label.replace(/\s+/g, '')})`} />
                <path d="M 0 35 C 10 40, 20 38, 35 25 C 45 15, 50 22, 60 22 C 70 22, 75 8, 85 8 C 92 8, 96 20, 100 28" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              </svg>

              <div className="flex items-start justify-between mb-6 relative z-10">
                <p className="text-sm font-medium text-gray-200 tracking-wide">{label}</p>
                <div className="text-gray-400">
                  <Icon className="w-5 h-5" strokeWidth={2} />
                </div>
              </div>
              <div className="flex items-baseline gap-2.5 relative z-10 mt-auto">
                <p className="text-4xl font-bold text-white leading-none tracking-tight">{value}</p>
                <p className="text-sm font-medium text-gray-400">{delta}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Submissions */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900">Recent Submissions</h2>
          <a href="/control-deck/posts" className="text-xs font-semibold text-[#008751] hover:underline">
            View all →
          </a>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-100 shrink-0" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-100 rounded w-2/3 mb-1" />
                  <div className="h-3 bg-gray-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recent.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No recent submissions.</p>
            )}
            {recent.map((post) => (
              <div key={post.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                  {String(post.user_id).charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{post.title}</p>
                  <p className="text-xs text-gray-400 capitalize">
                    {post.category} · {new Date(post.created_at).toLocaleString()}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${STATUS_PILL[post.is_approved] || STATUS_PILL.pending}`}>
                  {post.is_approved}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
