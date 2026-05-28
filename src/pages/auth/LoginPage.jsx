import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { validateLoginForm } from "../../utils/validators";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import { login } from "../../services/authService";

export default function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLoginForm(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const data = await login(form);
      loginUser(data);
      navigate("/my-arena");
    } catch (err) {
      setErrors({ email: err.response?.data?.detail || "Login failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex">
      {/* Left side: Art */}
      <div className="hidden lg:flex w-1/2 bg-black relative border-r border-white/10 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#008751]/20 to-black z-0"></div>
        <img 
          src="/auth_art.png" 
          alt="Nigerian Art" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-lighten"
        />
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-sm px-5 py-16">
          <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">Welcome Back</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="login-email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update}
              error={errors.email}
              autoComplete="email"
            />

            <div className="relative">
              <Input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="••••••••"
                value={form.password}
                onChange={update}
                error={errors.password}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[2.1rem] text-xs text-white hover:text-white transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            >
              {submitting && <Spinner size={16} />}
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-white mt-8 text-center">
            No account?{" "}
            <Link to="/register" className="text-[color:#008751] hover:underline font-semibold">Join Free</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
