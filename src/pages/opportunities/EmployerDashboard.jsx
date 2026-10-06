import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useEmployerAuth } from "../../context/EmployerAuthContext";
import { useToast } from "../../context/ToastContext";
import ApplicantsModal from "../../components/opportunities/ApplicantsModal";
import EmployerProfileTab from "../../components/opportunities/EmployerProfileTab";

export default function EmployerDashboard() {
  const { employerToken, loading, employerLogout } = useEmployerAuth();
  const { showToast, showConfirm } = useToast();
  const [postings, setPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [dashboardData, setDashboardData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [applicationFlow, setApplicationFlow] = useState({ data: [], maxCount: 40, pathD: "M0,100 L100,100 Z" });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${employerToken}` };
        
        // Fetch dashboard stats and all opportunities in parallel
        const [dashRes, oppsRes, jobsAppsRes, internshipsAppsRes, grantsAppsRes] = await Promise.all([
          api.get('/api/employer/dashboard', { headers }),
          api.get('/api/employer/opportunities', { headers }),
          api.get('/api/employer/jobs/applicants', { headers }).catch(() => ({ data: [] })),
          api.get('/api/employer/internships/applicants', { headers }).catch(() => ({ data: [] })),
          api.get('/api/employer/grants/applicants', { headers }).catch(() => ({ data: [] }))
        ]);

        setDashboardData(dashRes.data);

        // Process opportunities
        const jobs = (oppsRes.data.jobs || []).map(item => ({ ...item, type: 'job' }));
        const internships = (oppsRes.data.internships || []).map(item => ({ ...item, type: 'internship' }));
        const grants = (oppsRes.data.grants || []).map(item => ({ ...item, type: 'grant' }));

        const combined = [...jobs, ...internships, ...grants].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPostings(combined);

        // Process application flow
        const allApps = [
          ...(Array.isArray(jobsAppsRes.data) ? jobsAppsRes.data : []),
          ...(Array.isArray(internshipsAppsRes.data) ? internshipsAppsRes.data : []),
          ...(Array.isArray(grantsAppsRes.data) ? grantsAppsRes.data : [])
        ];

        const last7Days = Array.from({length: 7}).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          d.setHours(0,0,0,0);
          return d;
        });

        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const flowData = last7Days.map(date => {
          const label = dayLabels[date.getDay()];
          const count = allApps.filter(app => {
            if (!app.created_at) return false;
            const appDate = new Date(app.created_at);
            return appDate.getDate() === date.getDate() && 
                   appDate.getMonth() === date.getMonth() && 
                   appDate.getFullYear() === date.getFullYear();
          }).length;
          return { label, count };
        });

        const upperY = Math.ceil(Math.max(...flowData.map(d => d.count), 10) / 10) * 10;
        const theMax = Math.max(upperY, 40);
        
        let pathD = `M0,100 `;
        const dx = 100 / (flowData.length - 1);
        flowData.forEach((pt, i) => {
          const x = i * dx;
          const y = 100 - (pt.count / theMax) * 90; // scale to 90% height max
          pathD += `L${x.toFixed(1)},${y.toFixed(1)} `;
        });
        pathD += `L100,100 Z`;

        setApplicationFlow({ data: flowData, maxCount: theMax, pathD });

      } catch (err) {
        console.error(err);
        showToast("Failed to load dashboard data.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (employerToken) fetchData();
  }, [employerToken, refreshKey]);

  const handleDelete = (postId, postType) => {
    showConfirm("Are you sure you want to delete this opportunity? This action cannot be undone.", async () => {
      try {
        await api.delete(`/api/${postType}s/${postId}`, {
          headers: { 'Authorization': `Bearer ${employerToken}` }
        });

        // Remove the deleted post from state
        setPostings(prev => prev.filter(post => post.id !== postId));
        showToast("Posting deleted successfully.");
      } catch (err) {
        console.error("Error deleting post:", err);
        showToast("Failed to delete posting. Please try again.", "error");
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (!employerToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-5 relative overflow-hidden">
        <div className="relative z-10 max-w-md w-full text-center">
          <div className="inline-block bg-white/5 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-6">
            Restricted Access
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-3">
            Employer Portal
          </h1>
          <p className="text-white/40 text-sm leading-relaxed mb-8">
            You must be authenticated as an employer to manage postings. Please sign in to continue.
          </p>
          <Link 
            to="/employer/login" 
            className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
          >
            Sign In to Account
          </Link>
          <div className="mt-6">
            <Link to="/opportunities" className="text-white/30 hover:text-white text-xs transition-colors">
              Return to Public Feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1c1c1e] text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#2c2c2e] border-b md:border-b-0 md:border-r border-white/5 flex flex-col p-6 shrink-0">
        <div className="mb-10 flex items-center justify-between md:block">
          <Link to="/" className="text-xl font-bold tracking-widest text-[#008751]">NGC GLOBAL</Link>
          <div className="md:hidden flex gap-2">
            <button onClick={() => setActiveTab('dashboard')} className={`text-xs px-3 py-1.5 rounded ${activeTab === 'dashboard' ? 'bg-[#008751] text-white' : 'bg-white/5 text-gray-400'}`}>Dash</button>
            <button onClick={() => setActiveTab('postings')} className={`text-xs px-3 py-1.5 rounded ${activeTab === 'postings' ? 'bg-[#008751] text-white' : 'bg-white/5 text-gray-400'}`}>Jobs</button>
            <button onClick={() => setActiveTab('profile')} className={`text-xs px-3 py-1.5 rounded ${activeTab === 'profile' ? 'bg-[#008751] text-white' : 'bg-white/5 text-gray-400'}`}>Profile</button>
          </div>
        </div>

        <nav className="hidden md:flex flex-col gap-2 flex-1">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-[#008751]/10 text-[#008751]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('postings')} 
            className={`text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'postings' ? 'bg-[#008751]/10 text-[#008751]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Job Postings
          </button>
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'profile' ? 'bg-[#008751]/10 text-[#008751]' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Profile & Settings
          </button>
        </nav>

        <div className="hidden md:block mt-auto pt-6 border-t border-white/5">
          <button onClick={employerLogout} className="text-left w-full px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors font-medium flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 md:p-10 md:h-screen md:overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold mb-1">Welcome back, {dashboardData?.profile?.company_name || "Employer"}</h1>
            <p className="text-gray-400 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link to="/employer/post" className="bg-[#008751] hover:bg-[#006039] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-center flex-1 sm:flex-none">
              + Post Opportunity
            </Link>
            <button onClick={employerLogout} className="md:hidden bg-[#2c2c2e] hover:bg-[#3c3c3e] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-white/5">
              Sign Out
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          /* Dashboard Tab */
          <div className="flex flex-col gap-6 max-w-5xl">
            <div>
              <h2 className="text-sm font-medium mb-4 text-gray-300">Employer Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#2c2c2e] p-5 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-xs mb-2">Total Postings</p>
                  <p className="text-3xl font-semibold">{dashboardData?.stats?.total_opportunities || postings.length}</p>
                  <p className="text-[10px] text-gray-500 mt-2">Current total</p>
                </div>
                <div className="bg-[#2c2c2e] p-5 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-xs mb-2">Total Applicants</p>
                  <p className="text-3xl font-semibold">{dashboardData?.stats?.total_applications || postings.reduce((sum, p) => sum + (p.applicants_count || 0), 0)}</p>
                  <p className="text-[10px] text-gray-500 mt-2">Current total</p>
                </div>
                <div className="bg-[#2c2c2e] p-5 rounded-xl border border-white/5">
                  <p className="text-gray-400 text-xs mb-2">Pending Approvals</p>
                  <p className="text-3xl font-semibold">{dashboardData?.stats?.pending_approval_postings || postings.filter(p => p.is_approved_status === 'PENDING').length}</p>
                  <p className="text-[10px] text-gray-500 mt-2">Current total</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2c2c2e] p-6 rounded-xl border border-white/5 min-h-[350px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-medium text-gray-300">Application Flow</h2>
                <span className="text-xs text-[#5c9dff] flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#5c9dff]"></div> Applicants</span>
              </div>
              <div className="flex-1 border-b border-l border-white/5 flex items-end justify-between px-2 sm:px-6 pb-4 pt-10 relative overflow-hidden min-h-[250px]">
                {/* Functional Chart */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d={applicationFlow.pathD} fill="rgba(92, 157, 255, 0.05)" stroke="rgba(92, 157, 255, 0.8)" strokeWidth="1" />
                </svg>
                
                {/* Y-axis labels */}
                <div className="absolute left-1 sm:left-2 bottom-4 top-10 flex flex-col justify-between text-[10px] text-gray-600">
                  <span>{applicationFlow.maxCount}</span>
                  <span>{Math.round(applicationFlow.maxCount * 0.75)}</span>
                  <span>{Math.round(applicationFlow.maxCount * 0.5)}</span>
                  <span>{Math.round(applicationFlow.maxCount * 0.25)}</span>
                  <span>0</span>
                </div>
                
                {/* X-axis labels */}
                {applicationFlow.data.length > 0 ? applicationFlow.data.map((d, i) => (
                  <span key={i} className={`text-[10px] text-gray-500 z-10 ${i === 0 ? 'ml-6' : ''}`}>{d.label}</span>
                )) : (
                  <>
                    <span className="text-[10px] text-gray-500 z-10 ml-6">Mon</span>
                    <span className="text-[10px] text-gray-500 z-10">Tue</span>
                    <span className="text-[10px] text-gray-500 z-10">Wed</span>
                    <span className="text-[10px] text-gray-500 z-10">Thu</span>
                    <span className="text-[10px] text-gray-500 z-10">Fri</span>
                    <span className="text-[10px] text-gray-500 z-10">Sat</span>
                    <span className="text-[10px] text-gray-500 z-10">Sun</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'profile' ? (
          /* Profile Tab */
          <EmployerProfileTab 
            profile={dashboardData?.profile} 
            employerToken={employerToken} 
            onProfileUpdate={() => setRefreshKey(k => k + 1)} 
          />
        ) : (
          /* Job Postings Tab */
          <div className="max-w-5xl">
            <div className="bg-[#2c2c2e] rounded-xl border border-white/5 p-6 min-h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-white">All Job Postings</h2>
                <span className="bg-[#008751] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Live</span>
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#008751] border-t-transparent"></div>
                  </div>
                ) : postings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                    {postings.map(post => (
                      <div key={`${post.type}-${post.id}`} className="bg-transparent hover:bg-white/[0.02] p-6 rounded-2xl border border-white/10 hover:border-[#008751]/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 flex flex-col group relative overflow-hidden">
                        
                        {/* Status Glow effect on hover */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#008751]/10 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="flex justify-between items-start mb-3 gap-4 relative z-10">
                          <h3 className="font-semibold text-lg text-white line-clamp-2 leading-snug group-hover:text-[#008751] transition-colors">{post.title}</h3>
                          <div className="shrink-0 mt-1">
                            {post.is_approved_status === 'PENDING' && <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-full font-bold border border-yellow-500/20 uppercase tracking-widest">Pending</span>}
                            {post.is_approved_status === 'REJECTED' && <span className="text-[10px] bg-red-500/10 text-red-400 px-3 py-1.5 rounded-full font-bold border border-red-500/20 uppercase tracking-widest">Rejected</span>}
                            {post.is_approved_status === 'CONFIRMED' && <span className="text-[10px] bg-[#008751]/20 text-emerald-400 px-3 py-1.5 rounded-full font-bold border border-[#008751]/30 uppercase tracking-widest">Active</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-6 font-medium relative z-10">
                          <span className="bg-white/5 px-2.5 py-1 rounded-md uppercase tracking-wider">{post.type}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                          <span className="flex items-center gap-1.5 text-gray-300">
                            <svg className="w-4 h-4 text-[#008751]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            {post.applicants_count || 0} Applicants
                          </span>
                        </div>
                        
                        <div className="flex gap-2.5 mt-auto relative z-10">
                          <button onClick={() => setSelectedJobForApplicants(post)} className="flex-[2] bg-white/10 hover:bg-[#008751] text-white py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 shadow-sm flex items-center justify-center gap-2">
                            View Applicants
                          </button>
                          <Link to={`/employer/edit/${post.type}/${post.id}`} className="flex-1 bg-white/5 hover:bg-white/15 border border-white/5 hover:border-white/10 py-2.5 rounded-xl text-xs font-semibold text-center transition-all duration-300 text-gray-300 hover:text-white flex items-center justify-center">
                            Edit
                          </Link>
                          <button onClick={() => handleDelete(post.id, post.type)} className="w-10 flex items-center justify-center bg-transparent hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-gray-500 hover:text-red-400 rounded-xl transition-all duration-300" title="Delete">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-[#1c1c1e] rounded-xl border border-white/5">
                    <p className="text-gray-500 mb-4">No postings found.</p>
                    <Link to="/employer/post" className="text-[#008751] hover:text-emerald-400 font-medium text-sm transition-colors">
                      Create your first post →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {selectedJobForApplicants && (
        <ApplicantsModal 
          job={selectedJobForApplicants} 
          onClose={() => setSelectedJobForApplicants(null)} 
        />
      )}
    </div>
  );
}
