import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useEmployerAuth } from "../../context/EmployerAuthContext";
import api from "../../services/api";

export default function PostJob() {
  const { employerToken, loading } = useEmployerAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oppType, setOppType] = useState("job");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const type = formData.get("type");
    
    // Construct the correct endpoint based on type selection
    const endpoint = `/api/${type}s`;

    let payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      deadline: new Date(formData.get("deadline")).toISOString(),
    };

    if (type === "grant") {
      payload = {
        ...payload,
        eligibility_criteria: formData.get("eligibility_criteria"),
        organization_name: formData.get("organization_name"),
        amount: formData.get("amount"),
      };
    } else if (type === "internship") {
      payload = {
        ...payload,
        requirements: formData.get("requirements"),
        duration: formData.get("duration"),
        stipend: formData.get("stipend") || undefined,
        remote_only: formData.get("remote_only") === "true",
      };
    } else { // job
      payload = {
        ...payload,
        requirements: formData.get("requirements"),
        stipend: formData.get("stipend") || undefined,
        remote_only: formData.get("remote_only") === "true",
      };
    }

    try {
      await api.post(endpoint, payload);
      
      // Successfully posted
      navigate('/employer/dashboard');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
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
            You must be authenticated as an employer to post opportunities. Please sign in to continue.
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
      <Link to="/employer/dashboard" className="text-white/50 hover:text-white mb-8 inline-block transition-colors">
        &larr; Back to Dashboard
      </Link>
      
      <div className="max-w-3xl">
        <h1 className="text-4xl font-black text-white mb-2">Post an Opportunity</h1>
        <p className="text-white/60 mb-8">Fill out the details below to publish a new internship or opportunity.</p>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Opportunity Type</label>
              <select 
                name="type" 
                value={oppType}
                onChange={(e) => setOppType(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option className="bg-[#1a1a1a] text-white" value="job">Job</option>
                <option className="bg-[#1a1a1a] text-white" value="internship">Internship</option>
                <option className="bg-[#1a1a1a] text-white" value="grant">Grant</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Opportunity Title</label>
              <input 
                type="text" 
                name="title" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-emerald-500/50" 
                placeholder="e.g. Senior Frontend Engineer" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
              <select 
                name="category" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" 
              >
                <option className="bg-[#1a1a1a] text-white" value="">Select a category</option>
                <option className="bg-[#1a1a1a] text-white" value="engineering">Engineering</option>
                <option className="bg-[#1a1a1a] text-white" value="design">Design</option>
                <option className="bg-[#1a1a1a] text-white" value="marketing">Marketing</option>
                <option className="bg-[#1a1a1a] text-white" value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Application Deadline</label>
              <input 
                type="date" 
                name="deadline" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" 
              />
            </div>
          </div>

          {(oppType === "job" || oppType === "internship") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Stipend / Salary (Optional)</label>
                <input 
                  type="text" 
                  name="stipend" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-emerald-500/50" 
                  placeholder="e.g. N150,000/month" 
                />
              </div>
              
              {oppType === "internship" && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Duration</label>
                  <input 
                    type="text" 
                    name="duration"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-emerald-500/50" 
                    placeholder="e.g. 6 months" 
                  />
                </div>
              )}
            </div>
          )}

          {oppType === "grant" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Organization Name</label>
                <input 
                  type="text" 
                  name="organization_name" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-emerald-500/50" 
                  placeholder="e.g. Global Tech Foundation" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Grant Amount</label>
                <input 
                  type="text" 
                  name="amount" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-emerald-500/50" 
                  placeholder="e.g. N1,000,000" 
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
            <textarea 
              name="description" 
              required
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-emerald-500/50" 
              placeholder="Describe the opportunity..." 
            />
          </div>

          {(oppType === "job" || oppType === "internship") && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Requirements</label>
              <textarea 
                name="requirements" 
                required
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-emerald-500/50" 
                placeholder="List the required skills and qualifications..." 
              />
            </div>
          )}

          {oppType === "grant" && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Eligibility Criteria</label>
              <textarea 
                name="eligibility_criteria" 
                required
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-emerald-500/50" 
                placeholder="Who is eligible for this grant?..." 
              />
            </div>
          )}

          {(oppType === "job" || oppType === "internship") && (
            <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
              <input 
                type="checkbox" 
                name="remote_only"
                value="true"
                className="w-5 h-5 rounded border-white/20 bg-black/50 checked:bg-emerald-500 checked:border-emerald-500" 
              />
              <div>
                <div className="font-semibold text-white">Fully remote position</div>
                <div className="text-white/50 text-sm">Candidates can work from anywhere</div>
              </div>
            </label>
          )}

          <div className="pt-4 mt-2 border-t border-white/10">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3.5 px-8 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Publish Opportunity"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
