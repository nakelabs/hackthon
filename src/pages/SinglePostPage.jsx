import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getTalentById, castVote, removeVote } from "../services/talentService";
import { useAuth } from "../context/AuthContext";
import { usePopup } from "../context/PopupContext";
import Spinner from "../components/ui/Spinner";

export default function SinglePostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showAlert } = usePopup();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [voteLoading, setVoteLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    getTalentById(postId)
      .then(data => {
        setPost(data);
        setVoteCount(data.vote_count || 0);
        setHasVoted(data.has_voted || false);
      })
      .catch(err => setError("Post not found."))
      .finally(() => setLoading(false));
  }, [postId]);

  const handleVote = async () => {
    if (!user) {
      showAlert("You must be logged in to vote.");
      navigate("/login");
      return;
    }
    
    setVoteLoading(true);
    try {
      if (hasVoted) {
        await removeVote(post.id);
        setVoteCount(prev => Math.max(0, prev - 1));
        setHasVoted(false);
      } else {
        await castVote(post.id);
        setVoteCount(prev => prev + 1);
        setHasVoted(true);
      }
    } catch (err) {
      showAlert(err.response?.data?.detail || "Action failed.");
    } finally {
      setVoteLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Spinner size={32} className="text-[#008751]" />
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <span className="text-6xl mb-4 opacity-40">🚫</span>
      <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Post Not Found</h1>
      <p className="text-white/50 text-sm mb-6">This submission doesn't exist or has been removed.</p>
      <button onClick={() => navigate(-1)} className="btn-primary px-8 py-3 text-sm uppercase tracking-widest">
        Go Back
      </button>
    </div>
  );

  return (
    <div className="bg-black min-h-screen pb-20 md:pb-10 pt-6 px-4 flex justify-center">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        
        {/* Top Nav */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/5 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-black text-white uppercase tracking-widest">Post Details</h1>
        </div>

        {/* Media */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative aspect-[4/5] md:aspect-square flex items-center justify-center">
          {post.video_url ? (
            <video 
              src={post.video_url} 
              controls 
              autoPlay 
              className="w-full h-full object-contain bg-black"
            />
          ) : post.image_url ? (
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-full object-contain bg-black"
            />
          ) : (
             <div className="absolute inset-0 bg-gradient-to-br from-[#008751]/20 to-black/80 flex items-center justify-center">
               <span className="text-6xl opacity-40">🎤</span>
             </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#008751] font-bold uppercase tracking-widest bg-[#008751]/10 px-2 py-1 rounded w-fit mb-2">
                {post.category || "Uncategorized"}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase">{post.title}</h2>
              <Link to={`/profile/${post.owner_id || post.user_id}`} className="text-white/50 text-sm hover:text-white transition-colors mt-1">
                by @{post.owner_username || post.owner_fullname || "user"}
              </Link>
            </div>
            
            <button 
              onClick={handleVote}
              disabled={voteLoading}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border transition-all ${
                hasVoted 
                  ? 'bg-[#008751]/20 border-[#008751] text-[#008751] shadow-[0_0_15px_rgba(0,135,81,0.3)]' 
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {voteLoading ? (
                <Spinner size={18} className={hasVoted ? 'text-[#008751]' : 'text-white/50'} />
              ) : (
                <>
                  <svg className={`w-6 h-6 mb-1 ${hasVoted ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                  <span className="text-xs font-black">{voteCount}</span>
                </>
              )}
            </button>
          </div>

          {post.description && (
            <div className="mt-2">
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{post.description}</p>
            </div>
          )}

          {post.tools_used && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-2">Tools Used</span>
              <p className="text-sm text-white/80">{post.tools_used}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
