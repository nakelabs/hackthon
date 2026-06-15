import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyTalents, deleteTalent } from "../../services/talentService";
import { updateProfile, uploadProfilePicture } from "../../services/authService";
import { getUserQuizHistory } from "../../services/quizService";
import Spinner from "../../components/ui/Spinner";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "../../components/ui/SocialIcons";
import { usePopup } from "../../context/PopupContext";

const GRADIENT_FOR_CAT = {
  music: "from-blue-900", artwork: "from-purple-900", comedy: "from-red-900",
  fashion: "from-pink-900", tech: "from-green-900", film: "from-yellow-900",
  photography: "from-teal-900", football: "from-orange-900",
};

export default function MyArenaPage() {
  const { user, loading, loginUser } = useAuth();
  const { showAlert, showConfirm } = usePopup();
  const navigate = useNavigate();
  const [activeTab, setActiveTab]   = useState("uploads");

  // ── Uploads ───────────────────────────────────────────────────────────────
  const [uploads, setUploads]         = useState([]);
  const [uploadsLoading, setUploadsLoading] = useState(true);
  const [deletingId, setDeletingId]   = useState(null);

  // ── Quiz History ──────────────────────────────────────────────────────────
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizHistoryLoading, setQuizHistoryLoading] = useState(true);

  // ── Edit Profile ──────────────────────────────────────────────────────────
  const [editMode, setEditMode]     = useState(false);
  const [editForm, setEditForm]     = useState({
    full_name: "", location: "", bio: "",
    facebook: "", instagram: "", linkedin: "", x: "", youtube: ""
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError]   = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  const [uploadingPic, setUploadingPic] = useState(false);
  const fileInputRef = useRef(null);

  // ── Load user's uploads ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    getMyTalents({ limit: 50 })
      .then(data => setUploads(data.talents || []))
      .catch(() => setUploads([]))
      .finally(() => setUploadsLoading(false));

    getUserQuizHistory(user.id)
      .then(setQuizHistory)
      .catch(() => setQuizHistory([]))
      .finally(() => setQuizHistoryLoading(false));
  }, [user]);

  // ── Seed edit form from user ───────────────────────────────────────────────
  useEffect(() => {
    if (user) {
      const social = user.social_media_links || {};
      setEditForm({
        full_name: user.full_name || "",
        location: user.location || "",
        bio: user.bio || "",
        facebook: social.facebook || "",
        instagram: social.instagram || "",
        linkedin: social.linkedin || "",
        x: social.x || "",
        youtube: social.youtube || ""
      });
    }
  }, [user]);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPic(true);
    try {
      const updatedUser = await uploadProfilePicture(file);
      loginUser({ access_token: localStorage.getItem("nc_auth_token"), user: updatedUser });
    } catch (err) {
      showAlert("Failed to upload profile picture. Try again.");
    } finally {
      setUploadingPic(false);
    }
  };

  const handleDeleteUpload = async (id) => {
    const confirmed = await showConfirm("Delete this submission? This cannot be undone.");
    if (!confirmed) return;
    setDeletingId(id);
    try {
      await deleteTalent(id);
      setUploads(prev => prev.filter(u => u.id !== id));
    } catch {
      showAlert("Could not delete submission.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditError(""); setEditSaving(true);
    try {
      const { full_name, location, bio, facebook, instagram, linkedin, x, youtube } = editForm;
      const cleanUrl = (url) => (url && url.trim() !== "") ? url : null;
      
      const payload = {
        full_name, location, bio,
        social_media_links: {
          facebook: cleanUrl(facebook),
          instagram: cleanUrl(instagram),
          linkedin: cleanUrl(linkedin),
          x: cleanUrl(x),
          youtube: cleanUrl(youtube)
        }
      };
      const updated = await updateProfile(payload);
      loginUser({ access_token: localStorage.getItem("nc_auth_token"), user: updated });
      setEditSuccess(true);
      setTimeout(() => { setEditSuccess(false); setEditMode(false); }, 1500);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === "string" ? detail : (Array.isArray(detail) ? detail[0].msg : "Update failed. Try again.");
      setEditError(msg);
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
  const totalVotes   = user.total_votes ?? uploads.reduce((sum, u) => sum + (u.vote_count || 0), 0);
  const topCategory  = uploads.length > 0 ? uploads[0].category : null;

  return (
    <div className="bg-black min-h-screen flex justify-center pb-20 md:pb-0">
      <div className="w-full max-w-[450px] md:max-w-none lg:max-w-6xl xl:max-w-7xl bg-[#050505] min-h-screen border-x border-white/5 shadow-2xl shadow-black relative flex flex-col">

        {/* Top Header */}
        <div className="sticky top-0 w-full px-6 py-4 z-50 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-white/10">
          <Link to="/home" className="text-white/50 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-sm font-bold text-white tracking-widest uppercase">{username}</h1>
          <Link 
            to="/my-arena/settings"
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            title="My Account Settings"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">My Account</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </Link>
        </div>

        {/* Profile Identity */}
        <div className="px-5 pt-6 pb-6 md:px-6 md:py-12 flex flex-row items-start gap-4 md:gap-10 border-b border-white/5">
          <div 
            onClick={() => !uploadingPic && fileInputRef.current?.click()}
            className="w-20 h-20 md:w-40 md:h-40 bg-[#111] border-2 border-[#008751] rounded-full flex items-center justify-center transition-all cursor-pointer relative overflow-hidden group shadow-[0_0_30px_rgba(0,135,81,0.2)] hover:border-[#00b36b] shrink-0 mt-1 md:mt-0"
          >
            {user.profile_picture_url ? (
              <img src={user.profile_picture_url} alt="Profile" className="w-full h-full object-cover object-center" />
            ) : (
              <span className="text-3xl md:text-6xl font-black text-white">{initial}</span>
            )}
            
            {/* Hover overlay for upload */}
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest text-center">
                {uploadingPic ? "..." : "Change"}
              </span>
            </div>
            {uploadingPic && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Spinner size={16} className="text-[#008751]" />
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleProfilePictureChange} 
            accept="image/*" 
            className="hidden" 
          />
          <div className="flex flex-col items-start flex-1 w-full text-left mt-0 md:mt-4">
            <h2 className="text-xl md:text-4xl font-black text-white mb-2 md:mb-4 leading-tight flex items-center gap-2 md:gap-3 flex-wrap">
              <span>{displayName}</span>
              {user.submitted_categories && user.submitted_categories.length > 0 && (
                <>
                  <span className="text-white/30 text-lg md:text-2xl hidden sm:inline">•</span>
                  <span className="text-sm md:text-lg text-[#008751] font-bold tracking-widest uppercase mt-1">
                    {user.submitted_categories.join(", ")}
                  </span>
                </>
              )}
            </h2>
            <div className="flex flex-wrap gap-2 items-center justify-start mb-3 md:mb-4">
              {user.location && (
                <span className="px-2 py-1 md:px-3 md:py-1.5 bg-white/10 border border-white/20 text-[10px] md:text-sm font-mono text-white uppercase rounded-full shadow-lg">{user.location}</span>
              )}
              {topCategory && (
                <span className="px-2 py-1 md:px-3 md:py-1.5 bg-[#008751]/20 border border-[#008751] text-[#008751] text-[10px] md:text-sm font-mono font-bold uppercase rounded-full shadow-lg">{topCategory}</span>
              )}
            </div>
            
            {user.bio && (
              <p className="text-white/70 text-[11px] md:text-base leading-relaxed mb-4 max-w-lg text-left">
                {user.bio}
              </p>
            )}

            {user.social_media_links && Object.values(user.social_media_links).some(link => link) && (
              <div className="flex flex-wrap items-center justify-start gap-3 md:gap-4 mb-5 md:mb-6">
                {user.social_media_links.x && <a href={user.social_media_links.x} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>}
                {user.social_media_links.instagram && <a href={user.social_media_links.instagram} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#E1306C] transition-colors"><Instagram className="w-5 h-5" /></a>}
                {user.social_media_links.facebook && <a href={user.social_media_links.facebook} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#1877F2] transition-colors"><Facebook className="w-5 h-5" /></a>}
                {user.social_media_links.youtube && <a href={user.social_media_links.youtube} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#FF0000] transition-colors"><Youtube className="w-5 h-5" /></a>}
                {user.social_media_links.linkedin && <a href={user.social_media_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#0A66C2] transition-colors"><Linkedin className="w-5 h-5" /></a>}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 w-full max-w-[200px] md:max-w-[220px]">
              <button
                onClick={() => { setEditMode(true); }}
                className="flex-1 btn-primary py-2.5 md:py-4 text-[10px] md:text-sm uppercase tracking-widest shadow-[4px_4px_0_rgba(0,135,81,0.5)] md:shadow-[6px_6px_0_rgba(0,135,81,0.5)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_rgba(0,135,81,0.5)] transition-all"
              >
                Edit Profile
              </button>
            </div>

            {user.referral_code && (
              <div className="mt-4 flex flex-col items-start bg-white/5 border border-white/10 p-3 rounded shadow-md max-w-[220px]">
                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Your Referral Code</span>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs md:text-sm font-mono text-[#008751] font-black tracking-widest">{user.referral_code}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(user.referral_code)}
                    className="text-white/30 hover:text-white transition-colors"
                    title="Copy code"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex border-b border-white/5 md:flex-row flex-row">
          <div className="flex-1 py-6 md:py-8 flex flex-col items-center justify-center border-r border-white/5 hover:bg-white/5 transition-colors">
            <span className="text-2xl md:text-4xl font-black text-white">{totalVotes.toLocaleString()}</span>
            <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-bold mt-1">Total Votes</span>
          </div>
          <div className="flex-1 py-6 md:py-8 flex flex-col items-center justify-center hover:bg-white/5 transition-colors">
            <span className="text-2xl md:text-4xl font-black text-[#008751]">{uploads.length}</span>
            <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest font-bold mt-1">Submissions</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 sticky top-[60px] z-40 bg-[#050505]">
          <button
            onClick={() => setActiveTab("uploads")}
            className={`flex-1 py-4 md:py-5 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "uploads" ? "text-[#008751] border-b-2 border-[#008751] bg-[#008751]/5" : "text-white/40 hover:text-white hover:bg-white/5"}`}
          >
            Uploads ({uploads.length})
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex-1 py-4 md:py-5 text-xs md:text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "quiz" ? "text-[#008751] border-b-2 border-[#008751] bg-[#008751]/5" : "text-white/40 hover:text-white hover:bg-white/5"}`}
          >
            Quiz Stats
          </button>
        </div>

        {/* Content */}
        <div className="p-px pb-28 md:pb-8">
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
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-px bg-white/10">
                {uploads.map((item) => {
                  const gradient = GRADIENT_FOR_CAT[item.category] || "from-gray-800";
                  const statusColor = item.is_approved === "approved" ? "text-green-400" : item.is_approved === "rejected" ? "text-red-400" : "text-amber-400";
                  return (
                    <Link to={`/post/${item.id}`} key={item.id} className="aspect-[3/4] bg-[#111] relative group cursor-pointer overflow-hidden block">
                      {/* Media or gradient bg */}
                      {item.image_url || item.video_url ? (
                        item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <video src={`${item.video_url}#t=0.001`} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" muted playsInline preload="metadata" />
                        )
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} to-black/80 opacity-60 group-hover:opacity-100 transition-opacity`} />
                      )}

                      {/* Category badge */}
                      {item.category && (
                        <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 bg-[#008751]/80 backdrop-blur-sm text-white text-[7px] md:text-[9px] font-black uppercase tracking-wider rounded-sm leading-tight max-w-[60%] truncate">
                          {item.category}
                        </div>
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteUpload(item.id);
                          }}
                          disabled={deletingId === item.id}
                          className="bg-red-600/90 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 md:px-4 md:py-2 uppercase rounded hover:bg-red-500 transition-colors"
                        >
                          {deletingId === item.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )
          )}

          {activeTab === "quiz" && (
            quizHistoryLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size={24} className="text-[#008751]" />
              </div>
            ) : quizHistory.length === 0 ? (
              <div className="p-6 flex flex-col items-center justify-center text-center py-20">
                <span className="text-6xl grayscale opacity-50 mb-4">🏆</span>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Quiz Stats</h3>
                <p className="text-white/50 text-sm mb-6 max-w-[250px]">You haven't participated in any quizzes yet.</p>
                <Link to="/quiz" className="btn-outline text-xs px-6 py-2">Go to Quiz →</Link>
              </div>
            ) : (
              <div className="p-4 sm:p-6 lg:p-8 space-y-4">
                {quizHistory.map((historyItem, idx) => (
                  <div key={idx} className="flex items-center justify-between p-6 bg-[#111] border border-white/10 rounded-2xl hover:border-[#008751]/50 hover:bg-[#151515] transition-all shadow-xl group">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Quiz Session</span>
                      <h4 className="font-black text-white text-lg sm:text-xl group-hover:text-[#008751] transition-colors">{historyItem.quiz_session_name}</h4>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Score</span>
                      <span className="font-mono text-[#00b36b] font-black text-xl sm:text-2xl bg-[#008751]/20 border border-[#008751]/30 px-5 py-2 rounded-xl shrink-0 shadow-[0_0_15px_rgba(0,135,81,0.2)]">
                        {historyItem.total_score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[200]" onClick={() => setEditMode(false)}>
          <div className="bg-[#0a0a0a] border border-white/20 w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 shrink-0">
              <h2 className="text-lg font-black text-white uppercase tracking-widest">Edit Profile</h2>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form id="editProfileForm" onSubmit={handleSaveProfile} className="space-y-5">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#008751] uppercase tracking-widest border-b border-white/10 pb-2">Basic Info</h3>
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
                  <div>
                    <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Bio</label>
                    <textarea rows="3" value={editForm.bio} onChange={e => setEditForm({...editForm, bio: e.target.value})}
                      placeholder="Tell the world about yourself..."
                      className="w-full bg-transparent border border-white/20 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#008751] transition-colors resize-none" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-[#008751] uppercase tracking-widest border-b border-white/10 pb-2 mt-6">Social Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">X (Twitter) URL</label>
                      <div className="relative">
                        <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input type="url" value={editForm.x} onChange={e => setEditForm({...editForm, x: e.target.value})}
                          placeholder="https://x.com/..."
                          className="w-full bg-transparent border border-white/20 text-white text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-[#008751] transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Instagram URL</label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input type="url" value={editForm.instagram} onChange={e => setEditForm({...editForm, instagram: e.target.value})}
                          placeholder="https://instagram.com/..."
                          className="w-full bg-transparent border border-white/20 text-white text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-[#008751] transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Facebook URL</label>
                      <div className="relative">
                        <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input type="url" value={editForm.facebook} onChange={e => setEditForm({...editForm, facebook: e.target.value})}
                          placeholder="https://facebook.com/..."
                          className="w-full bg-transparent border border-white/20 text-white text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-[#008751] transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">YouTube URL</label>
                      <div className="relative">
                        <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input type="url" value={editForm.youtube} onChange={e => setEditForm({...editForm, youtube: e.target.value})}
                          placeholder="https://youtube.com/..."
                          className="w-full bg-transparent border border-white/20 text-white text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-[#008751] transition-colors" />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">LinkedIn URL</label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input type="url" value={editForm.linkedin} onChange={e => setEditForm({...editForm, linkedin: e.target.value})}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full bg-transparent border border-white/20 text-white text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-[#008751] transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
                {editError && <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 px-3 py-2">{editError}</p>}
                {editSuccess && <p className="text-sm text-green-400 font-bold">✓ Profile updated!</p>}
              </form>
            </div>
            
            <div className="p-6 border-t border-white/10 shrink-0 bg-[#050505]">
              <div className="flex gap-3">
                <button type="submit" form="editProfileForm" disabled={editSaving} className="btn-primary flex-1 py-3 text-sm">
                  {editSaving ? "Saving…" : "Save Changes"}
                </button>
                <button type="button" onClick={() => setEditMode(false)} className="border border-white/20 text-white/70 px-4 py-3 text-sm hover:border-white/50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
