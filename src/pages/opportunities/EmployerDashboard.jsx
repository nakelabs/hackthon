import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useEmployerAuth } from "../../context/EmployerAuthContext";
import ApplicantsModal from "../../components/opportunities/ApplicantsModal";

export default function EmployerDashboard() {
  const { employerToken, loading, employerLogout } = useEmployerAuth();
  const [postings, setPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);

  useEffect(() => {
    const fetchPostings = async () => {
      setIsLoading(true);
      try {
        // Real API calls with authentication
        const headers = { 'Authorization': `Bearer ${employerToken}` };
        const endpoints = ['/api/jobs', '/api/internships', '/api/grants'];
        
        const responses = await Promise.all(endpoints.map(ep => api.get(ep, { headers })));
        
        const dataArrays = responses.map((res, i) => {
          const data = res.data;
          let type = 'job';
          if (endpoints[i].includes('internships')) type = 'internship';
          if (endpoints[i].includes('grants')) type = 'grant';
          return data.map(item => ({ ...item, type }));
        });
        
        const combined = dataArrays.flat().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPostings(combined);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    
    if (employerToken) fetchPostings();
  }, [employerToken]);

  const handleDelete = async (postId, postType) => {
    if (!window.confirm("Are you sure you want to delete this opportunity? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/${postType}s/${postId}`, {
        headers: { 'Authorization': `Bearer ${employerToken}` }
      });

      // Remove the deleted post from state
      setPostings(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete posting. Please try again.");
    }
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
    <div className="container-main py-24 min-h-screen">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 animate-fade-in">
        <div>
          <p className="text-[#008751] text-xs font-bold uppercase tracking-[0.2em] mb-3">Employer Portal</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">Employer Dashboard</h1>
          <p className="text-white/50 text-lg max-w-xl">Manage your active opportunities and review top-tier applicants.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={employerLogout} className="bg-transparent border border-white/20 hover:border-white/50 hover:bg-white/5 text-white font-bold py-3 px-6 rounded-full transition-all text-sm uppercase tracking-widest">
            Sign Out
          </button>
          <Link 
            to="/employer/post" 
            className="bg-[#008751] hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(0,135,81,0.2)] hover:shadow-[0_0_30px_rgba(0,135,81,0.4)] hover:-translate-y-1 text-sm uppercase tracking-widest flex items-center gap-2"
          >
            <span>+</span> Post Opportunity
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-white uppercase tracking-widest text-white/50">Your Active Postings</h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#008751] border-t-transparent"></div>
        </div>
      ) : postings.length > 0 ? (
        <div className="space-y-4">
          {postings.map((post, idx) => (
            <div 
              key={post.id} 
              className="bg-[#050505] border border-white/10 hover:border-[#008751]/40 p-6 md:p-8 rounded-[2rem] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] group animate-slide-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              
              {/* Info section */}
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h3>
                  {post.is_approved_status === 'PENDING' && (
                    <span className="bg-yellow-500/10 text-yellow-500 text-[10px] uppercase px-3 py-1.5 rounded-full font-bold border border-yellow-500/20 tracking-widest">
                      Pending
                    </span>
                  )}
                  {post.is_approved_status === 'REJECTED' && (
                    <span className="bg-red-500/10 text-red-500 text-[10px] uppercase px-3 py-1.5 rounded-full font-bold border border-red-500/20 tracking-widest">
                      Rejected
                    </span>
                  )}
                  {post.is_approved_status === 'CONFIRMED' && (
                    <span className="bg-[#008751]/20 text-emerald-400 text-[10px] uppercase px-3 py-1.5 rounded-full font-bold border border-[#008751]/30 tracking-widest">
                      Approved
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/40 font-medium">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Posted {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <span className="hidden sm:block w-1 h-1 bg-white/20 rounded-full"></span>
                  <span className="flex items-center gap-1.5 text-emerald-400/80 bg-emerald-500/5 px-2 py-0.5 rounded-md">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    {post.applicantsCount || 0} Applicants
                  </span>
                  <span className="hidden sm:block w-1 h-1 bg-white/20 rounded-full"></span>
                  <span className="uppercase tracking-widest text-[10px] font-bold text-white/50 border border-white/10 px-2 py-0.5 rounded-md">{post.type}</span>
                </div>
              </div>

              {/* Actions section */}
              <div className="flex items-center gap-3 w-full lg:w-auto mt-2 lg:mt-0">
                <button 
                  onClick={() => setSelectedJobForApplicants(post)}
                  className="flex-1 lg:flex-none bg-[#008751]/10 hover:bg-[#008751]/20 text-[#008751] hover:text-emerald-300 text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-xl transition-all border border-[#008751]/20 hover:border-[#008751]/50 text-center flex items-center justify-center gap-2"
                >
                  Applicants
                </button>
                <Link 
                  to={`/employer/edit/${post.type}/${post.id}`}
                  className="bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-xl transition-all border border-white/10 hover:border-white/30 text-center"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(post.id, post.type)}
                  className="bg-red-500/5 hover:bg-red-500/10 text-red-500 hover:text-red-400 text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-xl transition-all border border-red-500/20 hover:border-red-500/50 text-center"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-[#050505] border border-white/5 rounded-[2.5rem] animate-fade-in">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-white mb-2">No postings yet</h3>
          <p className="text-white/40 mb-8">You haven't posted any opportunities yet.</p>
          <Link to="/employer/post" className="bg-[#008751] text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-600 transition-colors shadow-[0_0_15px_rgba(0,135,81,0.3)]">
            Create your first post
          </Link>
        </div>
      )}

      {selectedJobForApplicants && (
        <ApplicantsModal 
          job={selectedJobForApplicants} 
          onClose={() => setSelectedJobForApplicants(null)} 
        />
      )}
    </div>
  );
}
