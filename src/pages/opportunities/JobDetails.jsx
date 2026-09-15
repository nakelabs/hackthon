import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApplicationModal from "../../components/opportunities/ApplicationModal";

export default function JobDetails() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/${type}s/${id}`);
        if (!response.ok) throw new Error("Failed to fetch details");
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
        setJob(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-white mb-4">Opportunity Not Found</h2>
        <p className="text-white/50 mb-8">This position may have been closed or removed. (Or API data is missing)</p>
        <button onClick={() => navigate("/opportunities")} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors">
          Back to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="container-main py-24 min-h-screen">
      <button onClick={() => navigate("/opportunities")} className="text-white/50 hover:text-white mb-8 flex items-center gap-2 transition-colors">
        &larr; Back to all opportunities
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-black text-white mb-2">{job.title}</h1>
          <p className="text-xl text-white/70 mb-8">
            {job.company_name} • {job.remote_only ? "Remote" : "On-site"}
          </p>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Description</h2>
            <div className="text-white/80 whitespace-pre-line leading-relaxed">
              {job.description}
            </div>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              {type === "grant" ? "Eligibility Criteria" : "Requirements"}
            </h2>
            <div className="text-white/80 whitespace-pre-line leading-relaxed">
              {job.requirements || job.eligibility_criteria}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
            <h3 className="text-lg font-bold text-white mb-4">Job Overview</h3>
            <ul className="space-y-4 mb-8">
              <li>
                <span className="block text-white/50 text-sm">
                  {type === "grant" ? "Organization" : "Company"}
                </span>
                <span className="text-white font-medium">
                  {job.company_name || job.organization_name || "Unknown"}
                </span>
              </li>
              <li>
                <span className="block text-white/50 text-sm">Category</span>
                <span className="text-white font-medium capitalize">{job.category}</span>
              </li>
              <li>
                <span className="block text-white/50 text-sm">Location</span>
                <span className="text-white font-medium">{job.remote_only ? "Fully Remote" : "On-site"}</span>
              </li>
              {(job.stipend || job.amount) && (
                <li>
                  <span className="block text-white/50 text-sm">
                    {type === "grant" ? "Grant Amount" : "Stipend / Salary"}
                  </span>
                  <span className="text-white font-medium">{job.stipend || job.amount}</span>
                </li>
              )}
              {job.duration && (
                <li>
                  <span className="block text-white/50 text-sm">Duration</span>
                  <span className="text-white font-medium">{job.duration}</span>
                </li>
              )}
              <li>
                <span className="block text-white/50 text-sm">Application Deadline</span>
                <span className="text-white font-medium">
                  {job.deadline ? new Date(job.deadline).toLocaleDateString() : "Not specified"}
                </span>
              </li>
            </ul>

            <button 
              onClick={() => setShowApplyModal(true)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplicationModal 
          job={job} 
          onClose={() => setShowApplyModal(false)} 
          onSubmit={async (formData) => {
            const response = await fetch(`/api/${type}s/${job.id}/apply`, {
              method: 'POST',
              // NOTE: Do NOT set Content-Type header manually when sending FormData,
              // the browser automatically sets it to multipart/form-data with the correct boundary
              body: formData
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Failed to submit application: ${errorText}`);
            }
            
            const data = await response.json();
            console.log("Application submitted:", data);
          }}
        />
      )}
    </div>
  );
}
