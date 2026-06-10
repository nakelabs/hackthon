import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AgoraRTC, { 
  AgoraRTCProvider, 
  useRTCClient, 
  useLocalMicrophoneTrack, 
  useLocalCameraTrack, 
  useJoin, 
  usePublish, 
  LocalVideoTrack 
} from "agora-rtc-react";
import { useAuth } from "../context/AuthContext";
import { startLivestream, endStreamSession } from "../services/liveService";

// Agora App ID from env variables. If missing, we'll prompt the user.
const APP_ID = import.meta.env.VITE_AGORA_APP_ID || "";

function BroadcastRoom({ channelName, token, onLeave }) {
  const client = useRTCClient();
  const { localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { localCameraTrack } = useLocalCameraTrack();
  
  // Join the channel
  useJoin({
    appid: APP_ID,
    channel: channelName,
    token: token,
    uid: null // Let Agora assign a UID
  });

  // Publish local tracks (mic and camera) only when they are ready
  const tracks = [localMicrophoneTrack, localCameraTrack].filter(Boolean);
  usePublish(tracks);

  // Clean up tracks when unmounting to turn off the camera light
  useEffect(() => {
    return () => {
      if (localCameraTrack) {
        localCameraTrack.stop();
        localCameraTrack.close();
      }
      if (localMicrophoneTrack) {
        localMicrophoneTrack.stop();
        localMicrophoneTrack.close();
      }
    };
  }, [localCameraTrack, localMicrophoneTrack]);

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col">
      {/* Local Video Render */}
      <div className="flex-1 w-full h-full relative">
        <LocalVideoTrack track={localCameraTrack} play={true} className="w-full h-full object-cover" />
        
        {/* Stream Overlay UI */}
        
        <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-10 pointer-events-auto">
          <div className="flex items-center gap-3">
            <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-sm uppercase tracking-widest animate-pulse">
              LIVE
            </span>
            <span className="text-white font-bold text-sm drop-shadow-md">
              {channelName}
            </span>
          </div>
          <button 
            onClick={onLeave}
            className="bg-black/50 backdrop-blur-md text-white/80 hover:text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
          >
            End Stream
          </button>
        </div>
        
        {/* Mock Comments / Reactions Area */}
        <div className="absolute bottom-6 left-5 right-5 z-10">
          <p className="text-white/50 text-xs italic mb-2">Streaming live to your audience...</p>
        </div>
      </div>
    </div>
  );
}

export default function GoLivePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [isLive, setIsLive] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "live", role: "host" }));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleStartStream = async (e) => {
    e.preventDefault();
    setError("");

    if (!APP_ID) {
      setError("Agora App ID is missing! Add VITE_AGORA_APP_ID to your .env file.");
      return;
    }

    if (!channelName.trim()) {
      setError("Please enter a stream name.");
      return;
    }

    setLoading(true);
    try {
      // 1. Start broadcast and get token from backend
      const res = await startLivestream({
        channel_name: channelName.trim(),
        description: description.trim() || "Live broadcast",
        category_id: categoryId,
      });
      
      // 2. Start broadcast
      setToken(res.token);
      setIsLive(true);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch streaming token. Make sure your backend endpoint is correct.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    try {
      await endStreamSession(channelName.trim());
    } catch (err) {
      console.error("Failed to end streaming session:", err);
    }
    setIsLive(false);
    setToken(null);
    setChannelName("");
    setDescription("");
  };

  if (isLive && token) {
    return (
      <AgoraRTCProvider client={client}>
        <BroadcastRoom channelName={channelName.trim()} token={token} onLeave={handleLeave} />
      </AgoraRTCProvider>
    );
  }

  return (
    <div className="min-h-screen bg-black flex justify-center">
      <div className="w-full max-w-[450px] min-h-screen bg-[#050505] border-x border-white/5 shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="px-5 py-5 flex items-center gap-4 border-b border-white/10 sticky top-0 bg-black/80 backdrop-blur-md z-50">
          <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-sm font-bold text-white tracking-widest uppercase">Go Live</h1>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col items-center px-6 py-10 text-center pb-24">
          <div className="w-full max-w-sm flex flex-col items-center">
            <span className="text-6xl mb-6 opacity-80">📡</span>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Start a Broadcast</h2>
            <p className="text-white/50 text-sm mb-8 max-w-xs">
              Connect with your audience in real-time. What are we streaming today?
            </p>

            <form onSubmit={handleStartStream} className="w-full space-y-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter stream name (e.g. My Awesome Show)"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  className="w-full bg-transparent border border-white/20 text-white text-base px-5 py-4 focus:outline-none focus:border-[#008751] transition-colors text-center"
                />
                <input
                  type="text"
                  placeholder="Brief description of your stream"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-transparent border border-white/20 text-white text-base px-5 py-4 focus:outline-none focus:border-[#008751] transition-colors text-center"
                />
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(parseInt(e.target.value))}
                  className="w-full bg-[#050505] border border-white/20 text-white/70 text-base px-5 py-4 focus:outline-none focus:border-[#008751] transition-colors text-center appearance-none"
                >
                  <option value={1}>Music / Songs</option>
                  <option value={2}>Comedy Skits</option>
                  <option value={3}>Tech Innovation</option>
                  <option value={4}>Artwork</option>
                  <option value={5}>Fashion Showcase</option>
                  <option value={6}>Other</option>
                </select>
              </div>

              {error && (
                <div className="text-xs font-bold text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3 rounded text-left">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-sm tracking-widest uppercase"
              >
                {loading ? "Connecting..." : "Go Live Now"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
