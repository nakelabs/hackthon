import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../../components/ui/Spinner";

function StatItem({ value, label }) {
  return (
    <div className="border border-white/8 p-5">
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-white/40">{label}</p>
    </div>
  );
}

export default function MyArenaPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={28} className="text-white/40" />
      </div>
    );
  }

  if (!user) {
    return (
      <section className="min-h-screen flex items-center justify-center pt-14">
        <div className="text-center px-5">
          <h1 className="text-xl font-bold text-white mb-3">Sign in required</h1>
          <p className="text-sm text-white/40 mb-6">You need to be logged in to access My Arena.</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-14">
      <div className="container-main py-16">
        <div className="mb-12">
          <p className="text-xs text-white/25 uppercase tracking-[0.2em] mb-3">My Arena</p>
          <h1 className="text-2xl font-bold text-white mb-2">
            Welcome, {user.full_name || "Champion"}
          </h1>
          <p className="text-sm text-white/40">{user.email}</p>
          {user.is_demo && (
            <p className="text-xs text-white/20 mt-2 border border-white/8 inline-block px-3 py-1 rounded-sm">
              Demo Mode — no backend connected
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/8 mb-12">
          <StatItem value="0" label="Uploads" />
          <StatItem value="0" label="Total Votes" />
          <StatItem value="0" label="Quiz Score" />
          <StatItem value="—" label="State Rank" />
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4">Quick Actions</h2>
          <Link to="/register?category=music" className="flex items-center justify-between p-4 border border-white/8 hover:border-white/20 transition-colors group">
            <span className="text-sm text-white">Upload Talent</span>
            <span className="text-white/30 group-hover:text-white transition-colors">→</span>
          </Link>
          <a href="/#leaderboard" className="flex items-center justify-between p-4 border border-white/8 hover:border-white/20 transition-colors group">
            <span className="text-sm text-white">View Leaderboard</span>
            <span className="text-white/30 group-hover:text-white transition-colors">→</span>
          </a>
          <a href="/#icons" className="flex items-center justify-between p-4 border border-white/8 hover:border-white/20 transition-colors group">
            <span className="text-sm text-white">Explore Icons</span>
            <span className="text-white/30 group-hover:text-white transition-colors">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
