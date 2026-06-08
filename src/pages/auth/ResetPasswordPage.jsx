import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import { resetPassword } from "../../services/authService";

function PasswordField({ id, name, label, value, onChange, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        label={label}
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        error={error}
        autoComplete="new-password"
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-[2.2rem] text-white/50 hover:text-white transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        )}
      </button>
    </div>
  );
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.password || form.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (!token) {
      setErrors({ form: "Invalid or missing reset token." });
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(token, form.password);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setErrors({ form: err.response?.data?.detail || "Failed to reset password. The link might be expired." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <span className="text-6xl grayscale opacity-30 block mb-4">🔗</span>
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Reset Link</h1>
          <p className="text-white/50 text-sm mb-6">The link is missing the secure token.</p>
          <Link to="/forgot-password" className="btn-primary px-6 py-3 text-sm">Request New Link</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex">
      {/* Left side: Art */}
      <div className="hidden lg:flex w-1/2 bg-black relative border-r border-white/10 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#008751]/20 to-black z-0"></div>
        <img 
          src="/auth_art.png" 
          alt="Nigerian Art" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-lighten grayscale"
        />
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-sm px-5 py-16">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create New Password</h1>
          <p className="text-sm text-white/50 mb-8">
            Please enter your new strong password below.
          </p>

          {success ? (
            <div className="bg-[#008751]/10 border border-[#008751] rounded-lg p-5 text-center">
              <span className="text-3xl mb-2 block">✅</span>
              <h2 className="text-[#00b36b] font-bold text-lg mb-2">Password Reset Successful!</h2>
              <p className="text-white/70 text-sm mb-6">
                Redirecting you to the login page...
              </p>
              <Link to="/login" className="btn-outline px-6 py-2 text-sm">
                Go Now
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {errors.form && <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 px-3 py-2 rounded">{errors.form}</p>}
              
              <PasswordField id="new-password" name="password" label="New Password"
                value={form.password} onChange={update} error={errors.password} />

              <PasswordField id="confirm-password" name="confirmPassword" label="Confirm Password"
                value={form.confirmPassword} onChange={update} error={errors.confirmPassword} />

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
              >
                {submitting && <Spinner size={16} />}
                {submitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
