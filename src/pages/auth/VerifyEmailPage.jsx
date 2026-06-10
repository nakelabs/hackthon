import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";
import { verifyEmail } from "../../services/authService";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [errorMsg, setErrorMsg] = useState("");
  const calledRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("No verification token found in the URL.");
      return;
    }

    if (calledRef.current) return;
    calledRef.current = true;

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus("success");
      } catch (err) {
        const errorData = err.response?.data;
        const detail = errorData?.detail || errorData?.message;
        
        // If the backend says the user is already verified, just show success!
        if (typeof detail === "string" && (detail.toLowerCase().includes("already") || detail.toLowerCase().includes("verified"))) {
          setStatus("success");
          return;
        }

        setStatus("error");
        
        if (detail) {
          setErrorMsg(typeof detail === "string" ? detail : JSON.stringify(detail));
        } else {
          setErrorMsg(err.message || "Invalid or expired verification link.");
        }
      }
    };

    verify();
  }, [token]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-[#050505] border border-white/10 shadow-2xl p-8 rounded-xl text-center">
        {status === "verifying" && (
          <div className="flex flex-col items-center">
            <Spinner size={32} className="text-[#008751] mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Verifying Email...</h1>
            <p className="text-sm text-white/50">Please wait while we securely confirm your account.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-4">✅</span>
            <h1 className="text-2xl font-bold text-[#00b36b] mb-2 tracking-tight">Email Verified!</h1>
            <p className="text-sm text-white/70 mb-8">
              Your account is now active. You can log in and start showcasing your talent to Nigeria.
            </p>
            <Link to="/login" className="btn-primary w-full py-3 text-sm">
              Continue to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-4 grayscale opacity-40">⚠️</span>
            <h1 className="text-2xl font-bold text-red-400 mb-2 tracking-tight">Verification Failed</h1>
            <p className="text-sm text-white/50 mb-8">
              {errorMsg}
            </p>
            <div className="w-full flex gap-3">
              <Link to="/register" className="btn-outline flex-1 py-3 text-sm">Sign Up Again</Link>
              <Link to="/login" className="btn-primary flex-1 py-3 text-sm">Go to Login</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
