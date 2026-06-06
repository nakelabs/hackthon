import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLoginPage() {
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-8 h-8 bg-[#008751] flex items-center justify-center text-white font-black text-sm">NC</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Staff Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign in to Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Nigeria Celebrates Control Deck</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email" name="email" type="email" autoComplete="email" required
              value={form.email} onChange={update}
              placeholder="admin@nigeriacelebrates.com"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password" name="password" type="password" autoComplete="current-password" required
              value={form.password} onChange={update}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008751] focus:border-transparent transition"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={loading} id="admin-login-submit"
            className="w-full bg-[#008751] hover:bg-[#006b40] text-white font-bold py-3 rounded-lg text-sm transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Verifying…" : "Access Control Deck"}
          </button>
        </form>
      </div>
    </div>
  );
}
