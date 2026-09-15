import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useEmployerAuth } from "../../context/EmployerAuthContext";
import api from "../../services/api";

export default function EditJob() {
  const { type, id } = useParams();
  const { employerToken, loading } = useEmployerAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingJob, setIsLoadingJob] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    category: "",
    deadline: "",
    stipend: "",
    remote_only: false
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // The api instance handles authorization headers automatically if we are using nc_admin_token or normal token
        // Wait, employer token is separate? We might need to pass it explicitly if api.js doesn't attach employerToken.
        // Let's pass it just in case.
        const response = await api.get(`/${type}s/${id}`, {
          headers: { 'Authorization': `Bearer ${employerToken}` }
        });
        const data = response.data;
        
        // Format date for input field
        const dateObj = new Date(data.deadline);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        
        let baseData = {
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          deadline: `${yyyy}-${mm}-${dd}`,
        };

        if (type === "grant") {
          baseData = {
            ...baseData,
            eligibility_criteria: data.eligibility_criteria || "",
            organization_name: data.organization_name || "",
            amount: data.amount || "",
          };
        } else if (type === "internship") {
          baseData = {
            ...baseData,
            requirements: data.requirements || "",
            duration: data.duration || "",
            stipend: data.stipend || "",
            remote_only: data.remote_only || false,
          };
        } else {
          baseData = {
            ...baseData,
            requirements: data.requirements || "",
            stipend: data.stipend || "",
            remote_only: data.remote_only || false,
          };
        }
        
        setFormData(baseData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingJob(false);
      }
    };

    if (employerToken && !loading) {
       fetchJob();
    }
  }, [id, type, employerToken, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const deadlineISO = new Date(formData.deadline).toISOString();

    let payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      deadline: deadlineISO,
      is_active: true
    };

    if (type === "grant") {
      payload = {
        ...payload,
        eligibility_criteria: formData.eligibility_criteria,
        organization_name: formData.organization_name,
        amount: formData.amount,
      };
    } else if (type === "internship") {
      payload = {
        ...payload,
        requirements: formData.requirements,
        duration: formData.duration,
        stipend: formData.stipend || undefined,
        remote_only: formData.remote_only,
      };
    } else {
      payload = {
        ...payload,
        requirements: formData.requirements,
        stipend: formData.stipend || undefined,
        remote_only: formData.remote_only,
      };
    }

    try {
      await api.put(`/${type}s/${id}`, payload, {
        headers: {
          'Authorization': `Bearer ${employerToken}`
        }
      });
      
      // Successfully updated
      navigate('/employer/dashboard');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading || isLoadingJob) {
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
            You must be authenticated as an employer to update opportunities. Please sign in to continue.
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
        <h1 className="text-4xl font-black text-white mb-2">Edit Opportunity</h1>
        <p className="text-white/60 mb-8">Update the details of your job posting.</p>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Opportunity Title</label>
              <input 
                type="text" 
                name="title" 
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
              <select 
                name="category" 
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" 
              >
                <option className="bg-[#1a1a1a] text-white" value="">Select a category</option>
                <option className="bg-[#1a1a1a] text-white" value="engineering">Engineering</option>
                <option className="bg-[#1a1a1a] text-white" value="design">Design</option>
                <option className="bg-[#1a1a1a] text-white" value="marketing">Marketing</option>
                <option className="bg-[#1a1a1a] text-white" value="other">Other</option>
              </select>
            </div>
          </div>

          {(type === "job" || type === "internship") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Stipend / Salary (Optional)</label>
                <input 
                  type="text" 
                  name="stipend" 
                  value={formData.stipend}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" 
                />
              </div>
              
              {type === "internship" && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Duration</label>
                  <input 
                    type="text" 
                    name="duration"
                    required
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" 
                  />
                </div>
              )}
            </div>
          )}

          {type === "grant" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Organization Name</label>
                <input 
                  type="text" 
                  name="organization_name" 
                  required
                  value={formData.organization_name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Grant Amount</label>
                <input 
                  type="text" 
                  name="amount" 
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" 
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Application Deadline</label>
            <input 
              type="date" 
              name="deadline" 
              required
              value={formData.deadline}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
            <textarea 
              name="description" 
              required
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 resize-y" 
            ></textarea>
          </div>

          {(type === "job" || type === "internship") && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Requirements</label>
              <textarea 
                name="requirements" 
                required
                value={formData.requirements || ""}
                onChange={handleChange}
                rows="4"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 resize-y" 
                placeholder="List the skills, experience, or educational background required..." 
              ></textarea>
            </div>
          )}

          {type === "grant" && (
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Eligibility Criteria</label>
              <textarea 
                name="eligibility_criteria" 
                required
                value={formData.eligibility_criteria || ""}
                onChange={handleChange}
                rows="4"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 resize-y" 
                placeholder="Who is eligible for this grant?..." 
              ></textarea>
            </div>
          )}

          {(type === "job" || type === "internship") && (
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                name="remote_only" 
                id="remote_only" 
                checked={formData.remote_only || false}
                onChange={handleChange}
                className="w-5 h-5 rounded border-white/10 bg-white/5 accent-emerald-500" 
              />
              <label htmlFor="remote_only" className="text-sm font-medium text-white/70">
                This is a fully remote position
              </label>
            </div>
          )}

          <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3.5 px-8 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
