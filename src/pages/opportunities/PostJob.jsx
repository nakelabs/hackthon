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
      alert("Your opportunity has been submitted and is pending admin approval.");
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
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-12 animate-slide-up">
          <Link to="/employer/dashboard" className="inline-flex items-center gap-2 text-white/40 hover:text-[#008751] mb-8 font-bold uppercase tracking-widest text-xs transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Post an <span className="text-[#008751]">Opportunity</span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl">
            Fill out the details below to publish a new role, internship, or grant to our network of top-tier talent.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#050505] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex flex-col gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Opportunity Type</label>
              <div className="relative">
                <select 
                  name="type" 
                  value={oppType}
                  onChange={(e) => setOppType(e.target.value)}
                  required
                  className="appearance-none w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50 cursor-pointer font-medium transition-all"
                >
                  <option className="bg-[#111] text-white" value="job">Job / Full-Time</option>
                  <option className="bg-[#111] text-white" value="internship">Internship</option>
                  <option className="bg-[#111] text-white" value="grant">Grant / Funding</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Opportunity Title</label>
              <input 
                type="text" 
                name="title" 
                required
                className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50 placeholder:text-white/20 font-medium transition-all" 
                placeholder="e.g. Senior Frontend Engineer" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Category</label>
              <div className="relative">
                <select 
                  name="category" 
                  required
                  className="appearance-none w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50 cursor-pointer font-medium transition-all" 
                >
                  <option className="bg-[#111] text-white" value="">Select a category</option>
                  <option className="bg-[#111] text-white" value="engineering">Engineering</option>
                  <option className="bg-[#111] text-white" value="design">Design</option>
                  <option className="bg-[#111] text-white" value="marketing">Marketing</option>
                  <option className="bg-[#111] text-white" value="other">Other</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Application Deadline</label>
              <input 
                type="date" 
                name="deadline" 
                required
                className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50 font-medium transition-all [color-scheme:dark]" 
              />
            </div>
          </div>

          {(oppType === "job" || oppType === "internship") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Stipend / Salary (Optional)</label>
                <input 
                  type="text" 
                  name="stipend" 
                  className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50 placeholder:text-white/20 font-medium transition-all" 
                  placeholder="e.g. N150,000/month" 
                />
              </div>
              
              {oppType === "internship" && (
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Duration</label>
                  <input 
                    type="text" 
                    name="duration"
                    required
                    className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50 placeholder:text-white/20 font-medium transition-all" 
                    placeholder="e.g. 6 months" 
                  />
                </div>
              )}
            </div>
          )}

          {oppType === "grant" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Organization Name</label>
                <input 
                  type="text" 
                  name="organization_name" 
                  required
                  className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50 placeholder:text-white/20 font-medium transition-all" 
                  placeholder="e.g. Global Tech Foundation" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Grant Amount</label>
                <input 
                  type="text" 
                  name="amount" 
                  required
                  className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50 placeholder:text-white/20 font-medium transition-all" 
                  placeholder="e.g. N1,000,000" 
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Description</label>
            <textarea 
              name="description" 
              required
              rows={5}
              className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50 placeholder:text-white/20 font-medium transition-all resize-y" 
              placeholder="Describe the opportunity, responsibilities, and impact..." 
            />
          </div>

          {(oppType === "job" || oppType === "internship") && (
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Requirements</label>
              <textarea 
                name="requirements" 
                required
                rows={5}
                className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50 placeholder:text-white/20 font-medium transition-all resize-y" 
                placeholder="List the required skills, experience, and qualifications..." 
              />
            </div>
          )}

          {oppType === "grant" && (
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Eligibility Criteria</label>
              <textarea 
                name="eligibility_criteria" 
                required
                rows={5}
                className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-[#008751]/50 focus:ring-1 focus:ring-[#008751]/50 placeholder:text-white/20 font-medium transition-all resize-y" 
                placeholder="Who is eligible for this grant? What are the conditions?..." 
              />
            </div>
          )}

          {(oppType === "job" || oppType === "internship") && (
            <label className="group flex items-center gap-4 p-5 bg-[#111] border border-white/10 rounded-2xl cursor-pointer hover:border-[#008751]/50 transition-all">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  name="remote_only"
                  value="true"
                  className="appearance-none w-6 h-6 rounded-md border-2 border-white/20 bg-transparent checked:bg-[#008751] checked:border-[#008751] transition-colors cursor-pointer" 
                />
                <svg className="absolute w-4 h-4 text-white pointer-events-none opacity-0 checked-icon transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                <style>{`.appearance-none:checked + .checked-icon { opacity: 1; }`}</style>
              </div>
              <div>
                <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">Fully remote position</div>
                <div className="text-white/40 text-sm font-medium mt-0.5">Candidates can work from anywhere</div>
              </div>
            </label>
          )}

          <div className="pt-6 mt-4 border-t border-white/5">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#008751] hover:bg-emerald-600 text-white font-bold py-4 px-10 rounded-full transition-all shadow-[0_0_20px_rgba(0,135,81,0.2)] hover:shadow-[0_0_30px_rgba(0,135,81,0.4)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none uppercase tracking-widest text-sm"
            >
              {isSubmitting ? "Publishing..." : "Publish Opportunity"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
