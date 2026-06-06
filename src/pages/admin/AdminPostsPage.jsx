import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Eye, Filter, RefreshCw } from "lucide-react";
import { getAdminSubmissions, approveTalent, rejectTalent } from "../../services/adminService";

const CATEGORY_OPTIONS = ["All", "music", "tech", "comedy", "fashion", "artwork", "hair", "football", "basketball", "film", "photography", "logo"];
const STATUS_OPTIONS   = ["All", "Pending", "Approved", "Rejected"];

const MEDIA_BADGE = {
  audio: "bg-purple-50 text-purple-600",
  video: "bg-blue-50 text-blue-600",
  image: "bg-teal-50 text-teal-600",
};

const STATUS_PILL = {
  pending:  "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminPostsPage() {
  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [actionId, setActionId]   = useState(null);
  const [filterStatus,   setFilterStatus]   = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [preview, setPreview] = useState(null);

  const fetchPosts = async (status) => {
    setLoading(true);
    try {
      const statusParam = (status && status !== "All") ? status.toLowerCase() : undefined;
      const data = await getAdminSubmissions({ status: statusParam, limit: 100 });
      setPosts(data.talents || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(filterStatus); }, [filterStatus]);

  const handleAction = async (id, action) => {
    setActionId(id);
    try {
      const updated = action === "approved" ? await approveTalent(id) : await rejectTalent(id);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, is_approved: updated.is_approved } : p));
      setPreview(null);
    } catch {
      alert("Action failed. Please try again.");
    } finally {
      setActionId(null);
    }
  };

  // Map API field is_approved → local status label
  const mapStatus = (p) => p.is_approved || "pending";

  const filtered = posts.filter((p) => {
    const statusMatch   = filterStatus   === "All" || mapStatus(p) === filterStatus.toLowerCase();
    const categoryMatch = filterCategory === "All" || p.category?.toLowerCase() === filterCategory;
    return statusMatch && categoryMatch;
  });

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve submissions before they go live.
          </p>
        </div>
        <button
          onClick={() => fetchPosts(filterStatus)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filter:</span>
        </div>
        <select
          id="filter-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#008751]"
        >
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          id="filter-category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#008751]"
        >
          {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-2 border-[#008751] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Submission</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">User ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-sm text-gray-400">No posts found.</td></tr>
              )}
              {filtered.map((post) => {
                const status = mapStatus(post);
                const mediaType = post.media_type || "image";
                return (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 truncate max-w-[180px]">{post.title}</p>
                      <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded uppercase mt-0.5 ${MEDIA_BADGE[mediaType] || MEDIA_BADGE.image}`}>
                        {mediaType}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs text-gray-500 font-mono">uid:{post.user_id}</p>
                      <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md capitalize">{post.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${STATUS_PILL[status] || STATUS_PILL.pending}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setPreview(post)} id={`preview-post-${post.id}`}
                          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Preview">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAction(post.id, "approved")} id={`approve-post-${post.id}`}
                          disabled={status === "approved" || actionId === post.id}
                          className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAction(post.id, "rejected")} id={`reject-post-${post.id}`}
                          disabled={status === "rejected" || actionId === post.id}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[#008751] uppercase tracking-widest mb-1">{preview.category}</p>
                <h2 className="text-lg font-bold text-gray-900">{preview.title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{preview.description?.slice(0, 120)}{preview.description?.length > 120 ? "…" : ""}</p>
              </div>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            {/* Media preview */}
            {(preview.image_url || preview.video_url || preview.audio_url) && (
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                {preview.image_url && <img src={preview.image_url} alt="preview" className="w-full max-h-48 object-cover rounded-lg" />}
                {preview.video_url && <video src={preview.video_url} controls className="w-full max-h-48 rounded-lg" />}
                {preview.audio_url && <audio src={preview.audio_url} controls className="w-full" />}
              </div>
            )}
            <div className="p-6">
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(preview.id, "approved")} id={`modal-approve-${preview.id}`}
                  disabled={actionId === preview.id}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50">
                  ✓ Approve
                </button>
                <button
                  onClick={() => handleAction(preview.id, "rejected")} id={`modal-reject-${preview.id}`}
                  disabled={actionId === preview.id}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50">
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
