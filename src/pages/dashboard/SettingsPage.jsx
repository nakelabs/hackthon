import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyReferrals, changePassword } from "../../services/authService";
import { getUserVotedPosts } from "../../services/talentService";
import Spinner from "../../components/ui/Spinner";

export default function SettingsPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("referrals"); // 'referrals' | 'voted'

  const [referralsData, setReferralsData] = useState(null);
  const [loadingReferrals, setLoadingReferrals] = useState(true);

  const [votedPosts, setVotedPosts] = useState([]);
  const [loadingVoted, setLoadingVoted] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    
    if (!newPassword || (user?.signup_method !== "GOOGLE" && !currentPassword)) {
      setPasswordError("Please fill in all required fields.");
      return;
    }
    
    setPasswordLoading(true);
    try {
      const data = { new_password: newPassword };
      if (user?.signup_method !== "GOOGLE") {
        data.current_password = currentPassword;
      }
      await changePassword(data);
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.detail || "Could not update password. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    // Fetch Referrals
    getMyReferrals()
      .then(data => setReferralsData(data))
      .catch(() => setReferralsData({ referrals: [], total_referred: 0, total_referred_with_approved_submissions: 0 }))
      .finally(() => setLoadingReferrals(false));

    // Fetch Voted Posts
    getUserVotedPosts(user.id)
      .then(data => setVotedPosts(data || []))
      .catch(() => setVotedPosts([]))
      .finally(() => setLoadingVoted(false));

  }, [user]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Spinner size={28} className="text-[#008751]" />
    </div>
  );

  if (!user) return (
    <section className="min-h-screen bg-black flex flex-col items-center justify-center px-5">
      <span className="text-[8rem] grayscale opacity-20 mb-4">🛑</span>
      <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Access Denied</h1>
      <p className="text-white/50 text-sm mb-8 text-center max-w-xs">You must enter the arena to view settings.</p>
      <Link to="/login" className="btn-primary px-12 py-4 uppercase tracking-widest">Sign In</Link>
    </section>
  );

  return (
    <div className="bg-black h-screen flex justify-center pb-20 md:pb-0">
      <div className="w-full max-w-[450px] md:max-w-none lg:max-w-5xl bg-[#050505] h-full border-x border-white/5 shadow-2xl shadow-black relative flex flex-col">
        
        {/* Mobile Header */}
        <div className="sticky top-0 w-full px-6 py-4 z-50 flex items-center gap-4 bg-black/80 backdrop-blur-md border-b border-white/10 md:hidden">
          <Link to="/my-arena" className="text-white/50 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-sm font-bold text-white tracking-widest uppercase">My Account</h1>
        </div>

        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          
          {/* Desktop Sidebar */}
          <div className="w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-white/10 p-4 md:p-6 shrink-0 overflow-y-auto hidden md:flex md:flex-col bg-[#0a0a0a]">
            <div className="flex items-center gap-3 mb-8">
               <Link to="/my-arena" className="p-2 bg-black/40 rounded-full text-white/50 hover:text-white transition-colors hover:bg-black/80">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
               </Link>
               <h1 className="text-lg font-black text-white uppercase tracking-widest">Account</h1>
            </div>
            
            <nav className="flex flex-col gap-2 flex-1">
              <button 
                onClick={() => setActiveTab("referrals")}
                className={`text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'referrals' ? 'bg-[#008751] text-white shadow-[0_0_15px_rgba(0,135,81,0.3)]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
              >
                My Referrals
              </button>
              <button 
                onClick={() => setActiveTab("voted")}
                className={`text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'voted' ? 'bg-[#008751] text-white shadow-[0_0_15px_rgba(0,135,81,0.3)]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
              >
                Voted Posts
              </button>
              <button 
                onClick={() => setActiveTab("security")}
                className={`text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'security' ? 'bg-[#008751] text-white shadow-[0_0_15px_rgba(0,135,81,0.3)]' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
              >
                Security
              </button>
            </nav>

            <div className="mt-8 pt-6 border-t border-red-500/20">
              <button 
                onClick={() => { logout(); navigate("/login"); }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold text-red-500 uppercase tracking-widest hover:bg-red-500/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden flex overflow-x-auto border-b border-white/10 hide-scrollbar shrink-0 bg-[#0a0a0a]">
            <button 
              onClick={() => setActiveTab("referrals")}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap px-4 border-b-2 transition-colors ${activeTab === 'referrals' ? 'border-[#008751] text-[#008751]' : 'border-transparent text-white/50'}`}
            >
              My Referrals
            </button>
            <button 
              onClick={() => setActiveTab("voted")}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap px-4 border-b-2 transition-colors ${activeTab === 'voted' ? 'border-[#008751] text-[#008751]' : 'border-transparent text-white/50'}`}
            >
              Voted Posts
            </button>
            <button 
              onClick={() => setActiveTab("security")}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap px-4 border-b-2 transition-colors ${activeTab === 'security' ? 'border-[#008751] text-[#008751]' : 'border-transparent text-white/50'}`}
            >
              Security
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 md:p-10 overflow-y-auto">
            
            {activeTab === "referrals" && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4 hidden md:block">My Referrals</h2>

                {user.referral_code && (
                  <div className="bg-[#111] border border-[#008751]/30 shadow-[0_0_15px_rgba(0,135,81,0.1)] p-5 rounded-xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#008751]"></div>
                    <h3 className="text-xs font-bold text-[#00b36b] uppercase tracking-widest mb-2">Your Invite Link</h3>
                    <p className="text-sm text-white/60 mb-4">Share this link with your friends. They will be automatically referred by you when they sign up!</p>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={`${window.location.origin}/register?ref=${user.referral_code}`}
                        className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white font-mono focus:outline-none truncate selection:bg-[#008751]/30"
                      />
                      <button 
                        onClick={(e) => {
                          navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user.referral_code}`);
                          e.currentTarget.innerText = "Copied!";
                          setTimeout(() => { if (e.target) e.target.innerText = "Copy Link"; }, 2000);
                        }}
                        className="bg-[#008751] hover:bg-[#00b36b] text-white px-5 py-3 rounded-lg font-bold uppercase tracking-wider text-sm transition-colors shrink-0"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                )}
                
                {loadingReferrals ? (
                  <div className="flex justify-center py-12">
                    <Spinner size={32} className="text-[#008751]" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-lg">
                        <span className="text-4xl font-black text-white mb-2">{referralsData?.total_referred || 0}</span>
                        <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Total Referred</span>
                      </div>
                      <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-[#008751]/20 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-[0_4px_20px_rgba(0,135,81,0.05)]">
                        <span className="text-4xl font-black text-[#008751] mb-2">{referralsData?.total_referred_with_approved_submissions || 0}</span>
                        <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">With Approved Submissions</span>
                      </div>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-xl">
                      <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Referred Users</h3>
                      {referralsData?.referrals && referralsData.referrals.length > 0 ? (
                        <div className="space-y-3">
                          {referralsData.referrals.map((refUser, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-[#111] p-4 rounded-lg border border-white/5 hover:border-[#008751]/30 transition-colors">
                              <span className="font-bold text-white text-sm">{refUser.full_name}</span>
                              <span className="text-xs font-mono text-[#008751] bg-[#008751]/10 px-3 py-1.5 rounded-full">@{refUser.username}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <span className="text-4xl mb-3 opacity-50 grayscale">🤝</span>
                          <p className="text-white/30 text-sm">No referrals yet. Share your link to get started!</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "voted" && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4 hidden md:block">Voted Posts</h2>
                
                {loadingVoted ? (
                  <div className="flex justify-center py-12">
                    <Spinner size={32} className="text-[#008751]" />
                  </div>
                ) : votedPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {votedPosts.map((post, idx) => (
                      <div key={idx} className="bg-[#111] border border-white/5 hover:border-[#008751]/50 p-5 rounded-xl transition-colors group cursor-default">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-2 py-1 rounded">
                            {post.category}
                          </span>
                          <span className="text-[#008751] text-xs font-black">✓ Voted</span>
                        </div>
                        <h3 className="text-white font-bold text-base mb-1 group-hover:text-[#008751] transition-colors line-clamp-1">{post.post_name}</h3>
                        <p className="text-white/50 text-xs">By <span className="text-white/80 font-semibold">{post.owner_fullname}</span></p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center border border-white/5 rounded-xl bg-[#0a0a0a]">
                    <span className="text-5xl mb-4 opacity-50 grayscale">🗳️</span>
                    <h3 className="text-white font-black text-lg uppercase tracking-widest mb-2">No Votes Yet</h3>
                    <p className="text-white/50 text-sm mb-6 max-w-xs mx-auto">Explore the feed to support and vote for amazing Nigerian talents.</p>
                    <Link to="/home" className="btn-primary px-6 py-3 text-xs uppercase tracking-widest">Explore Feed</Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "security" && (
              <div className="animate-fade-in">
                <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4 hidden md:block">Update Password</h2>
                
                <div className="bg-[#111] border border-white/5 p-6 rounded-xl max-w-md">
                  {passwordSuccess && (
                    <div className="mb-6 p-4 bg-[#008751]/20 border border-[#008751]/50 rounded-lg text-[#008751] text-sm font-bold">
                      Password updated successfully!
                    </div>
                  )}
                  {passwordError && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-500 text-sm font-bold">
                      {passwordError}
                    </div>
                  )}
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    {user?.signup_method !== "GOOGLE" && (
                      <div>
                        <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#008751] transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#008751] transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full btn-primary py-3 flex items-center justify-center mt-6 uppercase tracking-widest"
                    >
                      {passwordLoading ? <Spinner size={20} className="text-white" /> : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Mobile Sign Out */}
            <div className="mt-12 pt-6 border-t border-white/10 md:hidden">
              <button 
                onClick={() => { logout(); navigate("/login"); }}
                className="w-full bg-red-600/10 hover:bg-red-600/20 border border-red-600/50 text-red-500 font-bold uppercase tracking-widest py-4 px-8 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>

          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}} />
    </div>
  );
}
