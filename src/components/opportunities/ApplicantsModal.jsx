import { useState, useEffect } from "react";
import { useEmployerAuth } from "../../context/EmployerAuthContext";
import api from "../../services/api";

export default function ApplicantsModal({ job, onClose }) {
  const { employerToken } = useEmployerAuth();
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/${job.type}s/${job.id}/applicants`, {
          headers: {
            'Authorization': `Bearer ${employerToken}`
          }
        });
        const data = response.data;
        setApplicants(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (employerToken && job) {
      fetchApplicants();
    }
  }, [job, employerToken]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative max-h-[80vh] flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="mb-6 pr-8">
          <h2 className="text-2xl font-bold text-white mb-1">Applicants</h2>
          <p className="text-white/50 text-sm">For {job.title}</p>
        </div>

        <div className="overflow-y-auto pr-2 flex-1 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-400"></div>
            </div>
          ) : applicants.length > 0 ? (
            applicants.map(app => (
              <div key={app.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="font-bold text-white text-lg">{app.full_name}</h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                    <a href={`mailto:${app.email}`} className="text-emerald-400 hover:text-emerald-300 text-sm">{app.email}</a>
                    <span className="hidden sm:inline text-white/20">•</span>
                    <span className="text-white/40 text-xs">Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {app.resume_url && (
                  <a 
                    href={app.resume_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
                  >
                    View Resume
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-white/50">No applicants yet for this position.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
