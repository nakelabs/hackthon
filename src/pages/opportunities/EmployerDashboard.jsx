import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
        
        const responses = await Promise.all(endpoints.map(ep => fetch(ep, { headers })));
        
        const dataArrays = await Promise.all(responses.map(async (res, i) => {
          if (!res.ok) return []; // Or throw, depending on strictness
          const data = await res.json();
          let type = 'job';
          if (endpoints[i].includes('internships')) type = 'internship';
          if (endpoints[i].includes('grants')) type = 'grant';
          return data.map(item => ({ ...item, type }));
        }));
        
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
      const response = await fetch(`/api/${postType}s/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${employerToken}` }
      });

      if (!response.ok) throw new Error("Failed to delete posting");

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Employer Dashboard</h1>
          <p className="text-white/60">Manage your internship and opportunity postings.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={employerLogout} className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg whitespace-nowrap">
            Sign Out
          </button>
          <Link 
            to="/employer/post" 
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 whitespace-nowrap"
          >
            + Post New Opportunity
          </Link>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/[0.02]">
          <h2 className="text-xl font-bold text-white">Your Active Postings</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-400"></div>
          </div>
        ) : postings.length > 0 ? (
          <div className="divide-y divide-white/10">
            {postings.map(post => (
              <div key={post.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/[0.02] transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{post.title}</h3>
                  <p className="text-sm text-white/50">Posted on {post.postedDate} • {post.applicantsCount} Applicants</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedJobForApplicants(post)}
                    className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    View Applicants
                  </button>
                  <Link 
                    to={`/employer/edit/${post.type}/${post.id}`}
                    className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(post.id, post.type)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-12 h-12 mx-auto text-white/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-bold text-white mb-2">No postings yet</h3>
            <p className="text-white/50 mb-6">You haven't posted any opportunities.</p>
            <Link to="/employer/post" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
              Create your first post &rarr;
            </Link>
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
