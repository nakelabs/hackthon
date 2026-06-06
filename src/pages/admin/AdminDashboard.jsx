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
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
              <div className="w-9 h-9 bg-gray-100 rounded-lg mb-4" />
              <div className="h-7 bg-gray-100 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-50 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          {STAT_CARDS.map(({ label, value, delta, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{label}</p>
              <p className="text-xs text-[#008751] font-medium mt-2">{delta}</p>
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
