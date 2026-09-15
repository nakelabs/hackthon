import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api";

export default function EmployerRegisterPage() {
  const [formData, setFormData] = useState({ 
    companyName: "", email: "", password: "", confirmPassword: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }
    
    try {
      await api.post("/auth/register", {
        full_name: formData.companyName, // Backend seems to map full_name generically
        company_name: formData.companyName,
        email: formData.email,
        password: formData.password
      });
      
      navigate("/employer/login");
      
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to register. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#050505]">
      
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center border-r border-white/5 overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/40 via-[#050505] to-black opacity-80" />
        {/* Decorative Circles */}
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-10 w-64 h-64 bg-emerald-700/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 w-full max-w-lg">
          <Link to="/">
            <img src="/new.png" alt="Logo" className="h-16 mb-12 filter brightness-200" />
          </Link>
          <h1 className="text-5xl font-black text-white leading-tight mb-6 uppercase tracking-tighter">
            Find the <span className="text-emerald-500">Perfect Fit</span><br/>for Your Company.
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-md">
            Join thousands of organizations connecting with Nigeria's brightest young talent. Post opportunities and grow your team today.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        
        {/* Mobile Header (only visible on small screens) */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/">
            <img src="/new.png" alt="Logo" className="h-10 filter brightness-200" />
          </Link>
        </div>

        <div className="w-full max-w-md pt-12 lg:pt-0">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Create Account</h2>
            <p className="text-white/50 text-sm">Register your company to start hiring.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Company / Organization Name</label>
              <input 
                type="text" 
                required
                value={formData.companyName}
                onChange={e => setFormData({...formData, companyName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-5 py-3.5 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-colors" 
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Work Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-5 py-3.5 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-colors" 
                placeholder="hr@company.com"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Password</label>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-5 py-3.5 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-colors" 
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1.5">Confirm Password</label>
                <input 
                  type="password" 
                  required
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-5 py-3.5 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-colors" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm py-4 rounded-xl uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 mt-4"
            >
              {isSubmitting ? "Setting Up..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-white/50">
            Already registered? <Link to="/employer/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors ml-1">Sign in here</Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}
