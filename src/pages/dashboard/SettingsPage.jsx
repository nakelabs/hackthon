import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyReferrals } from "../../services/authService";
import Spinner from "../../components/ui/Spinner";

export default function SettingsPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  
  const [referralsData, setReferralsData] = useState(null);
  const [loadingReferrals, setLoadingReferrals] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyReferrals()
      .then(data => setReferralsData(data))
      .catch(() => setReferralsData({ referrals: [], total_referred: 0, total_referred_with_approved_submissions: 0 }))
      .finally(() => setLoadingReferrals(false));
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
    <div className="bg-black min-h-screen flex justify-center pb-20 md:pb-0">
      <div className="w-full max-w-[450px] md:max-w-none lg:max-w-4xl bg-[#050505] min-h-screen border-x border-white/5 shadow-2xl shadow-black relative flex flex-col">
        
        {/* Top Header */}
        <div className="sticky top-0 w-full px-6 py-4 z-50 flex items-center gap-4 bg-black/80 backdrop-blur-md border-b border-white/10">
          <Link to="/my-arena" className="text-white/50 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <h1 className="text-sm font-bold text-white tracking-widest uppercase">Settings</h1>
        </div>

        <div className="p-6 md:p-10 flex-1 overflow-y-auto">
          
          <div className="mb-12">
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">My Referrals</h2>
            
            {loadingReferrals ? (
              <div className="flex justify-center py-8">
                <Spinner size={24} className="text-[#008751]" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#111] border border-white/5 p-6 rounded flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black text-white mb-2">{referralsData?.total_referred || 0}</span>
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Total Referred</span>
                  </div>
                  <div className="bg-[#111] border border-white/5 p-6 rounded flex flex-col items-center justify-center text-center">
                    <span className="text-4xl font-black text-[#008751] mb-2">{referralsData?.total_referred_with_approved_submissions || 0}</span>
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">With Approved Submissions</span>
                  </div>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded">
                  <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-4">Referred Users</h3>
                  {referralsData?.referrals && referralsData.referrals.length > 0 ? (
                    <div className="space-y-3">
                      {referralsData.referrals.map((refUser, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-[#111] p-3 border border-white/5">
                          <span className="font-bold text-white text-sm">{refUser.full_name}</span>
                          <span className="text-xs font-mono text-[#008751] bg-[#008751]/10 px-2 py-1">@{refUser.username}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/30 text-sm text-center py-4">No referrals yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-red-500/20">
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6">Account</h2>
            <button 
              onClick={() => { logout(); navigate("/login"); }}
              className="w-full md:w-auto bg-red-600/10 hover:bg-red-600/20 border border-red-600/50 text-red-500 font-bold uppercase tracking-widest py-4 px-8 rounded transition-colors"
            >
              Sign Out
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
