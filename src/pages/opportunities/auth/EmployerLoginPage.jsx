import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEmployerAuth } from "../../../context/EmployerAuthContext";
import api from "../../../services/api";

export default function EmployerLoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const { employerLogin } = useEmployerAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const params = new URLSearchParams();
      params.append("username", formData.username);
      params.append("password", formData.password);

      const response = await api.post("/auth/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      
      employerLogin(response.data.access_token);
      navigate("/employer/dashboard");
      
      
    } catch (err) {
      setError("Invalid username or password.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#050505]">
      
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center border-r border-white/5 overflow-hidden p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-[#050505] to-black opacity-80" />
        {/* Decorative Circles */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 w-full max-w-lg">
          <Link to="/">
            <img src="/new.png" alt="Logo" className="h-16 mb-12 filter brightness-200" />
          </Link>
          <h1 className="text-5xl font-black text-white leading-tight mb-6 uppercase tracking-tighter">
            Hire the <span className="text-emerald-500">Next Gen</span><br/>of Innovators.
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-md">
            Log in to manage your opportunity postings, review top-tier youth applicants, and build your future workforce.
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

        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Welcome Back</h2>
            <p className="text-white/50 text-sm">Sign in to your employer account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="text" 
                required
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-5 py-4 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-colors" 
                placeholder="hr@company.com"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors">Forgot password?</a>
              </div>
              <input 
                type="password" 
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 text-white text-sm px-5 py-4 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-colors" 
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm py-4 rounded-xl uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 mt-2"
            >
              {isSubmitting ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-white/50">
            Don't have an employer account? <Link to="/employer/register" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors ml-1">Register here</Link>
          </div>
          <div className="mt-6 text-center">
            <Link to="/opportunities" className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold">
              &larr; Back to Public Feed
            </Link>
          </div>
        </div>
      </div>
      
    </div>
  );
}
