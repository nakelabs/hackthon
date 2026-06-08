import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Spinner from "../../components/ui/Spinner";
import { forgotPassword } from "../../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send reset link. Please try again.");
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
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-lighten grayscale"
        />
      </div>

      {/* Right side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-sm px-5 py-16">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Forgot Password</h1>
          <p className="text-sm text-white/50 mb-8">
            Enter your email address to receive a password reset link.
          </p>

          {success ? (
            <div className="bg-[#008751]/10 border border-[#008751] rounded-lg p-5 text-center">
              <span className="text-3xl mb-2 block">📩</span>
              <h2 className="text-[#00b36b] font-bold text-lg mb-2">Check your email</h2>
              <p className="text-white/70 text-sm">
                If an account exists for {email}, a password reset link has been sent.
              </p>
              <Link to="/login" className="btn-primary w-full mt-6 flex justify-center py-3">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                id="reset-email"
                name="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                autoComplete="email"
              />

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
              >
                {submitting && <Spinner size={16} />}
                {submitting ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          {!success && (
            <p className="text-sm text-white mt-8 text-center">
              Remembered it?{" "}
              <Link to="/login" className="text-[color:#008751] hover:underline font-semibold">Sign In</Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
