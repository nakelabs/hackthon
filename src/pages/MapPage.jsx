import { StateLeaderboard } from "./LandingPage";

export default function MapPage() {
  return (
    <div className="bg-[#050505] min-h-screen flex flex-col justify-center pb-20 pt-8">
      {/* Title Header for Map Page */}
      <div className="text-center mb-8 px-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-md">
          Explore <span className="text-[#008751]">Nigeria</span>
        </h1>
        <p className="text-white/50 text-xs tracking-widest mt-2 uppercase">
          Tap a state to view top talent
        </p>
      </div>

      {/* Reusing the StateLeaderboard component which contains the Map */}
      <StateLeaderboard />
    </div>
  );
}
