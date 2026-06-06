import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyTalents, deleteTalent } from "../../services/talentService";
import { updateProfile } from "../../services/authService";
import Spinner from "../../components/ui/Spinner";

const GRADIENT_FOR_CAT = {
  music: "from-blue-900", artwork: "from-purple-900", comedy: "from-red-900",
  fashion: "from-pink-900", tech: "from-green-900", film: "from-yellow-900",
  photography: "from-teal-900", football: "from-orange-900",
};

export default function MyArenaPage() {
  const { user, loading, loginUser } = useAuth();
  const [activeTab, setActiveTab]   = useState("uploads");

  // ── Uploads ───────────────────────────────────────────────────────────────
  const [uploads, setUploads]         = useState([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [deletingId, setDeletingId]   = useState(null);

  // ── Edit Profile ──────────────────────────────────────────────────────────
  const [editMode, setEditMode]     = useState(false);
  const [editForm, setEditForm]     = useState({ full_name: "", location: "" });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError]   = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  // ── Load user's uploads ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    getMyTalents({ limit: 50 })
      .then(data => setUploads(data.talents || []))
      .catch(() => setUploads([]))
      .finally(() => setUploadsLoading(false));
  }, [user]);

  // ── Seed edit form from user ───────────────────────────────────────────────
  useEffect(() => {
    if (user) setEditForm({ full_name: user.full_name || "", location: user.location || "" });
  }, [user]);

  const handleDeleteUpload = async (id) => {
    if (!window.confirm("Delete this submission? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteTalent(id);
      setUploads(prev => prev.filter(u => u.id !== id));
    } catch {
      alert("Could not delete submission.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditError(""); setEditSaving(true);
    try {
      const updated = await updateProfile(editForm);
      loginUser({ access_token: localStorage.getItem("nc_auth_token"), user: updated });
      setEditSuccess(true);
      setTimeout(() => { setEditSuccess(false); setEditMode(false); }, 1500);
    } catch (err) {
      setEditError(err.response?.data?.detail || "Update failed. Try again.");
    } finally {
      setEditSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Spinner size={28} className="text-[#008751]" />
    </div>
  );

  if (!user) return (
    <section className="min-h-screen bg-black flex flex-col items-center justify-center px-5">
      <span className="text-[8rem] grayscale opacity-20 mb-4">🛑</span>
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Access Denied</h1>
      <p className="text-white/50 text-sm mb-8 text-center max-w-xs">You must enter the arena to view your profile.</p>
      <Link to="/login" className="btn-primary px-12 py-4 uppercase tracking-widest">Sign In</Link>
    </section>
  );

  const displayName  = user.full_name || user.username || "Naija Talent";
  const username     = `@${(user.username || user.full_name || "naija_star").replace(/\s+/g, "").toLowerCase()}`;
  const initial      = displayName.charAt(0).toUpperCase();
  const totalVotes   = uploads.reduce((sum, u) => sum + (u.vote_count || 0), 0);
  const topCategory  = uploads.length > 0 ? uploads[0].category : null;

  return (
    <div className="bg-black min-h-screen flex justify-center pb-20">
      <div className="w-full max-w-[450px] bg-[#050505] min-h-screen border-x border-white/5 shadow-2xl shadow-black relative">

        {/* Top Header */}
        <div className="sticky top-0 w-full px-6 py-4 z-50 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-white/10">
          <Link to="/home" className="text-white/50 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-sm font-bold text-white tracking-widest uppercase">{username}</h1>
          <div className="w-6" />
        </div>

        {/* Profile Identity */}
        <div className="px-6 pt-8 pb-6 flex flex-col items-center border-b border-white/5">
          <div className="w-24 h-24 bg-[#111] border-2 border-[#008751] flex items-center justify-center shadow-[4px_4px_0_#008751] mb-4 transform -rotate-3 hover:rotate-0 transition-transform">
            <span className="text-4xl font-black text-white">{initial}</span>
          </div>
          <h2 className="text-xl font-black text-white mb-1">{displayName}</h2>
          <div className="flex gap-2 items-center mb-4">
            {user.location && (
              <span className="px-2 py-0.5 bg-white/10 border border-white/20 text-xs font-mono text-white uppercase">{user.location}</span>
            )}
            {topCategory && (
              <span className="px-2 py-0.5 bg-[#008751]/20 border border-[#008751] text-[#008751] text-xs font-mono font-bold uppercase">{topCategory}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full max-w-[300px]">
            <button
              onClick={() => { setEditMode(true); }}
              className="flex-1 btn-primary py-2 text-xs uppercase tracking-widest shadow-[4px_4px_0_rgba(0,135,81,0.5)]"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex border-b border-white/5">
          <div className="flex-1 py-4 flex flex-col items-center justify-center border-r border-white/5 hover:bg-white/5 transition-colors">
            <span className="text-xl font-black text-white">{totalVotes.toLocaleString()}</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Total Votes</span>
          </div>
          <div className="flex-1 py-4 flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
            <span className="text-xl font-black text-[#008751]">{uploads.length}</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Submissions</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 sticky top-[60px] z-40 bg-[#050505]">
          <button
            onClick={() => setActiveTab("uploads")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "uploads" ? "text-[#008751] border-b-2 border-[#008751]" : "text-white/40 hover:text-white"}`}
          >
            Uploads ({uploads.length})
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === "quiz" ? "text-[#008751] border-b-2 border-[#008751]" : "text-white/40 hover:text-white"}`}
          >
            Quiz Stats
          </button>
        </div>

        {/* Content */}
        <div className="p-px">
          {activeTab === "uploads" && (
            uploadsLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size={24} className="text-[#008751]" />
              </div>
            ) : uploads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <span className="text-5xl mb-4 opacity-30">🎭</span>
                <p className="text-white/40 text-sm mb-4">No submissions yet. Show Nigeria your talent!</p>
                <Link to="/upload" className="btn-primary text-xs px-6 py-2 uppercase tracking-widest">Upload Now</Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-px bg-white/10">
                {uploads.map((item) => {
                  const gradient = GRADIENT_FOR_CAT[item.category] || "from-gray-800";
                  const statusColor = item.is_approved === "approved" ? "text-green-400" : item.is_approved === "rejected" ? "text-red-400" : "text-amber-400";
                  return (
                    <div key={item.id} className="aspect-[3/4] bg-[#111] relative group cursor-pointer overflow-hidden">
                      {/* Media or gradient bg */}
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} to-black/80 opacity-60 group-hover:opacity-100 transition-opacity`} />
                      )}

                      {/* Status badge */}
                      <div className={`absolute top-1 right-1 text-[8px] font-black uppercase ${statusColor} bg-black/70 px-1 py-0.5 z-10`}>
                        {item.is_approved}
                      </div>

                      {/* Title */}
                      <div className="absolute bottom-1 left-1 right-1 z-10">
                        <p className="text-[9px] font-bold text-white line-clamp-2 leading-tight">{item.title}</p>
                      </div>

                      {/* Hover delete */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all z-20">
                        <button
                          onClick={() => handleDeleteUpload(item.id)}
                          disabled={deletingId === item.id}
                          className="bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 uppercase"
                        >
                          {deletingId === item.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {activeTab === "quiz" && (
            <div className="p-6 flex flex-col items-center justify-center text-center py-20">
              <span className="text-6xl grayscale opacity-50 mb-4">🏆</span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Quiz Stats</h3>
              <p className="text-white/50 text-sm mb-6 max-w-[250px]">Quiz history will appear here once the quiz sessions are live.</p>
              <Link to="/quiz" className="btn-outline text-xs px-6 py-2">Go to Quiz →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[200]" onClick={() => setEditMode(false)}>
          <div className="bg-[#0a0a0a] border border-white/20 w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-black text-white uppercase tracking-widest mb-6">Edit Profile</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Full Name</label>
                <input type="text" value={editForm.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})}
                  className="w-full bg-transparent border border-white/20 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#008751] transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">State / Location</label>
                <select value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})}
                  className="w-full bg-[#0a0a0a] border border-white/20 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#008751] transition-colors">
                  <option value="">Select state…</option>
                  {["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara","FCT Abuja"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {editError && <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 px-3 py-2">{editError}</p>}
              {editSuccess && <p className="text-sm text-green-400 font-bold">✓ Profile updated!</p>}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={editSaving} className="btn-primary flex-1 py-3 text-sm">
                  {editSaving ? "Saving…" : "Save Changes"}
                </button>
                <button type="button" onClick={() => setEditMode(false)} className="border border-white/20 text-white/70 px-4 py-3 text-sm hover:border-white/50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
