import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AgoraRTC, { 
  AgoraRTCProvider, 
  useRTCClient, 
  useJoin,
  useRemoteUsers,
  RemoteUser
} from "agora-rtc-react";
import { useAuth } from "../context/AuthContext";
import { fetchStreamingToken } from "../services/liveService";
import Spinner from "../components/ui/Spinner";

const envAppId = import.meta.env.VITE_AGORA_APP_ID;
const APP_ID = envAppId === "f0526e8c3760498e6080c4765866ec" ? "f0526e8c376047b98e6080c4765866ec" : (envAppId || "f0526e8c376047b98e6080c4765866ec");

function ViewerRoom({ channelName, token, user, onLeave }) {
  const client = useRTCClient();
  const remoteUsers = useRemoteUsers();
  
  useJoin({
    appid: APP_ID,
    channel: channelName,
    token: token,
    uid: user?.id
  });

  // The host is a remote user who is publishing video
  // We take the first remote user in the channel (usually the host in a 1-to-many broadcast)
  const hostUser = remoteUsers[0];

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col">
      <div className="flex-1 w-full h-full relative flex items-center justify-center bg-[#050505]">
        
        {hostUser ? (
          <div className="w-full h-full relative">
            <RemoteUser user={hostUser} playVideo={true} playAudio={true} className="w-full h-full" />
          </div>
        ) : (
          <div className="text-white/50 flex flex-col items-center">
            <Spinner size={32} className="text-[#008751] mb-4" />
            <p className="text-sm tracking-widest uppercase">Waiting for Host...</p>
            <p className="text-xs text-white/30 mt-2">({remoteUsers.length} users in channel)</p>
          </div>
        )}
        
        {/* Stream Overlay UI */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
        
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
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Leave
          </button>
        </div>
        
        {/* Viewers count placeholder */}
        <div className="absolute top-16 left-5 z-10 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-xs font-bold text-white">{remoteUsers.length + 1}</span>
        </div>
      </div>
    </div>
  );
}

export default function ViewStreamPage() {
  const { channelName } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initialize client as an audience member
  const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "live", role: "audience" }));

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (!APP_ID) {
      setError("Agora App ID is missing! Add VITE_AGORA_APP_ID to your .env file.");
      setLoading(false);
      return;
    }

    const getToken = async () => {
      try {
        const res = await fetchStreamingToken(channelName);
        console.log("RAW TOKEN RESPONSE:", res);
        
        // The backend might return { token: "..." } or a raw string
        const tokenString = typeof res === "string" ? res : (res.token || res.access_token || res.streaming_token || Object.values(res).find(v => typeof v === 'string'));
        console.log("EXTRACTED TOKEN:", tokenString);
        
        if (!tokenString) {
          throw new Error("Token string could not be extracted from response: " + JSON.stringify(res));
        }
        
        setToken(tokenString);
      } catch (err) {
        console.error("Failed to fetch token:", err);
        setError("Failed to join stream. The stream may have ended or does not exist.");
      } finally {
        setLoading(false);
      }
    };

    if (channelName) {
      getToken();
    }
  }, [channelName, user, navigate]);

  const handleLeave = () => {
    navigate("/live");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Spinner size={32} className="text-[#008751] mb-4" />
        <p className="text-white/50 text-sm uppercase tracking-widest">Connecting to Stream...</p>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center max-w-md">
          <span className="text-4xl opacity-50 mb-4 block">⚠️</span>
          <p className="text-red-400 font-bold mb-4">{error || "Could not join stream"}</p>
          <button onClick={() => navigate("/live")} className="btn-outline py-2 px-6 text-sm">
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <AgoraRTCProvider client={client}>
      <ViewerRoom channelName={channelName} token={token} user={user} onLeave={handleLeave} />
    </AgoraRTCProvider>
  );
}
