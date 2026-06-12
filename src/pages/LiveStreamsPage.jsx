import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getLiveStreams } from "../services/liveService";
import Spinner from "../components/ui/Spinner";

export default function LiveStreamsPage() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const fromLanding = location.state?.fromLanding === true;

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const data = await getLiveStreams();
        setStreams(data);
      } catch (err) {
        console.error("Failed to fetch livestreams:", err);
        setError("Failed to load active streams. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchStreams();
    
    // Optionally poll every 30 seconds
    const interval = setInterval(fetchStreams, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black pt-20 pb-20 md:pb-10">
      <div className="container-main relative">
        
        {fromLanding && (
          <button
            onClick={() => navigate(-1)}
            className="absolute -top-10 left-4 md:left-0 z-50 flex items-center gap-2 text-white/50 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </button>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 mt-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2 flex items-center gap-3">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              Live Now
            </h1>
            <p className="text-white/50 text-sm max-w-xl">
              Discover and join real-time broadcasts from talented creators across Nigeria.
            </p>
          </div>
          
          <button 
            onClick={() => navigate("/go-live")}
            className="btn-primary py-2 px-6 text-sm tracking-widest"
          >
            Start a Broadcast
          </button>
        </div>

        {/* State rendering */}
        {loading && streams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size={32} className="text-[#008751] mb-4" />
            <p className="text-white/50 text-sm">Loading active streams...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : streams.length === 0 ? (
          <div className="bg-[#050505] border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center">
            <span className="text-5xl opacity-40 mb-4">📴</span>
            <h3 className="text-xl font-bold text-white mb-2">No active streams</h3>
            <p className="text-white/50 text-sm mb-6 max-w-sm">
              It looks like nobody is broadcasting right now. Be the first to start a live session!
            </p>
            <button 
              onClick={() => navigate("/go-live")}
              className="btn-outline py-2 px-6 text-sm"
            >
              Go Live
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {streams.map((stream) => (
              <Link 
                key={stream.id} 
                to={`/live/${encodeURIComponent(stream.channel_name)}`}
                className="group bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-[#008751]/50 transition-all hover:shadow-[0_0_20px_rgba(0,135,81,0.15)] flex flex-col"
              >
                {/* Thumbnail / Header Area */}
                <div className="aspect-video bg-[#111] relative overflow-hidden flex items-center justify-center border-b border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  
                  {/* Live Badge */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/10">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-white uppercase tracking-wider">Live</span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 z-20 bg-[#008751]/80 backdrop-blur-md px-2 py-1 rounded-sm text-[10px] font-bold text-white uppercase tracking-wider">
                    {stream.category?.name || "Other"}
                  </div>

                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#008751] flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Default fallback graphic since we don't have stream thumbnails */}
                  <span className="text-5xl opacity-20 z-0">📡</span>
                </div>

                {/* Content Details */}
                <div className="p-4 flex gap-3 flex-1">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden flex-shrink-0 border border-white/20">
                    {stream.host?.profile_picture_url ? (
                      <img src={stream.host.profile_picture_url} alt={stream.host.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50 text-sm font-bold uppercase">
                        {stream.host?.username?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate mb-1 group-hover:text-[#00b36b] transition-colors" title={stream.channel_name}>
                      {stream.channel_name}
                    </h3>
                    <p className="text-white/70 text-xs truncate mb-2" title={stream.description}>
                      {stream.description || "Live broadcast"}
                    </p>
                    <p className="text-white/40 text-[10px] truncate">
                      Hosted by <span className="font-semibold text-white/60">@{stream.host?.username || "unknown"}</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
