import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";

export default function AdminLoginPage() {
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use the real OAuth2 token endpoint — username = email
      const params = new URLSearchParams();
      params.append("username", form.email);
      params.append("password", form.password);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ""}/auth/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Invalid credentials.");
      }

      const data = await res.json();
      adminLogin(data.access_token);
      navigate("/control-deck/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex bg-black">
      {/* Left side: Art */}
      <div className="hidden lg:flex w-1/2 bg-black relative border-r border-white/10 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#008751]/20 to-black z-0"></div>
        <img 
          src="/auth_art.png" 
          alt="Nigerian Art" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-lighten"
        />
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        {/* Subtle Admin watermark/branding over art */}
        <div className="absolute z-20 flex flex-col items-center opacity-30">
          <span className="w-20 h-20 bg-[#008751] flex items-center justify-center text-white font-black text-3xl mb-4 border-2 border-white/20">NC</span>
          <span className="text-xl font-bold text-white uppercase tracking-widest">Admin Control Deck</span>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative">
        <Link to="/" className="absolute top-6 left-6 text-white/50 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Home
        </Link>
        <div className="w-full max-w-sm px-5 py-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-6 bg-[#008751] flex items-center justify-center text-white font-black text-[10px]">NC</span>
            <span className="text-[10px] font-bold text-[#008751] uppercase tracking-widest">Staff Portal</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Admin Sign In</h1>
          <p className="text-sm text-white/50 mb-8">Access the Nigeria Celebrates Control Deck</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="admin-email"
              name="email"
              type="email"
              label="Admin Email"
              placeholder="admin@nigeriacelebrates.com"
              value={form.email}
              onChange={update}
              autoComplete="email"
            />

            <div className="relative">
              <Input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Admin Password"
                placeholder="••••••••"
                value={form.password}
                onChange={update}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[2.2rem] text-white/50 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded px-4 py-3 text-sm text-red-400 font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            >
              {loading && <Spinner size={16} />}
              {loading ? "Verifying…" : "Access Control Deck"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
