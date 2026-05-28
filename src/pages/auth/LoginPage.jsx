import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { validateLoginForm } from "../../utils/validators";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import { login, persistAuth, DEMO_MODE } from "../../services/authService";

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
    <section className="min-h-screen flex items-center justify-center pt-14">
      <div className="w-full max-w-sm px-5 py-16">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-sm text-white/40 mb-10">
          {DEMO_MODE ? "Demo mode — enter any email & password." : "Sign in to your account."}
        </p>

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
              className="absolute right-3 top-[2.1rem] text-xs text-white/30 hover:text-white transition-colors"
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

        <p className="text-sm text-white/30 mt-8 text-center">
          No account?{" "}
          <Link to="/register" className="text-white hover:underline">Join Free</Link>
        </p>
      </div>
    </section>
  );
}
