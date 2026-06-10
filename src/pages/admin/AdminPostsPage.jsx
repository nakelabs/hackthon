import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-2 border-[#008751] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Submission</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap hidden md:table-cell">Author</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap hidden sm:table-cell">Category</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                <th className="text-right px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Actions</th>
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
                  <tr key={post.id} className="bg-white transition-colors group">
                    <td className="px-6 py-5 min-w-[200px]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-900 uppercase shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                          {post.title.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm mb-1 line-clamp-1">{post.title}</p>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${MEDIA_BADGE[mediaType] || MEDIA_BADGE.image}`}>
                            {mediaType}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 hidden md:table-cell whitespace-nowrap">
                      <Link to={`/profile/${post.user_id}`} target="_blank" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden shrink-0 bg-white">
                          {post.profile_picture_url ? (
                            <img src={post.profile_picture_url} alt={post.username} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-900 bg-white">
                              {(post.full_name || post.username || "?").charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 line-clamp-1">{post.full_name || post.username}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-[10px] font-bold text-gray-500">@{post.username}</p>
                            <span className="text-[10px] text-gray-300">•</span>
                            <p className="text-[10px] text-gray-400 font-medium">{new Date(post.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-5 hidden sm:table-cell whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900 capitalize">{post.category}</span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${STATUS_PILL[status] || STATUS_PILL.pending}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setPreview(post)} id={`preview-post-${post.id}`}
                          className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors border border-gray-200" title="Preview">
                          View
                        </button>
                        <button
                          onClick={() => handleAction(post.id, "approved")} id={`approve-post-${post.id}`}
                          disabled={status === "approved" || actionId === post.id}
                          className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-green-200" title="Approve">
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(post.id, "rejected")} id={`reject-post-${post.id}`}
                          disabled={status === "rejected" || actionId === post.id}
                          className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed border border-red-200" title="Reject">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            
            {/* Header */}
            <div className="p-6 md:p-8 flex items-start justify-between shrink-0">
              <div className="flex gap-4 items-start">
                <Link to={`/profile/${preview.user_id}`} target="_blank" className="w-14 h-14 rounded-full border border-gray-200 overflow-hidden shrink-0 bg-white hover:opacity-80 transition-opacity">
                  {preview.profile_picture_url ? (
                    <img src={preview.profile_picture_url} alt={preview.username} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-900 bg-white">
                      {(preview.full_name || preview.username || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{preview.title}</h2>
                    <span className="text-[10px] font-bold text-gray-600 bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-md uppercase tracking-widest">{preview.category}</span>
                  </div>
                  <Link to={`/profile/${preview.user_id}`} target="_blank" className="flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity w-fit">
                    <p className="text-sm font-bold text-gray-800">{preview.full_name || preview.username}</p>
                    <span className="text-sm text-gray-400 font-medium">@{preview.username}</span>
                  </Link>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-xl">{preview.description}</p>
                </div>
              </div>
              <button onClick={() => setPreview(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors shrink-0">
                ✕
              </button>
            </div>

            {/* Media Content */}
            <div className="px-6 md:px-8 pb-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center w-full relative group">
                {preview.image_url && <img src={preview.image_url} alt="preview" className="w-full h-auto max-h-[50vh] object-contain rounded-2xl" />}
                {preview.video_url && <video src={preview.video_url} controls className="w-full h-auto max-h-[50vh] rounded-2xl shadow-inner" />}
                {preview.audio_url && (
                  <div className="w-full p-12 bg-gray-50 flex items-center justify-center rounded-2xl border border-gray-100">
                    <audio src={preview.audio_url} controls className="w-full max-w-md" />
                  </div>
                )}
              </div>
            </div>

            {/* Footer / Actions */}
            <div className="px-6 md:px-8 py-6 bg-gray-50 border-t border-gray-100 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tools & Resources</p>
                  <div className="flex flex-wrap gap-1.5">
                    {preview.tools_used && preview.tools_used.length > 0 ? (
                      preview.tools_used.map(t => (
                        <span key={t} className="text-xs font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg">{t}</span>
                      ))
                    ) : (
                      <span className="text-xs font-semibold text-gray-400">None specified</span>
                    )}
                  </div>
               </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleAction(preview.id, "rejected")} id={`modal-reject-${preview.id}`}
                  disabled={actionId === preview.id}
                  className="flex-1 sm:flex-none px-6 py-3.5 bg-white border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-sm font-bold rounded-xl transition-all disabled:opacity-50">
                  Reject
                </button>
                <button
                  onClick={() => handleAction(preview.id, "approved")} id={`modal-approve-${preview.id}`}
                  disabled={actionId === preview.id}
                  className="flex-1 sm:flex-none px-10 py-3.5 bg-black hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 shadow-md">
                  Approve Post
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
