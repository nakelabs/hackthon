import { useState, useEffect } from "react";
import { Award, ThumbsUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getNominees, voteForNominee } from "../services/compendiumService";

export default function CompendiumPage() {
  const { user } = useAuth();

  const [nominees, setNominees]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [votingId, setVotingId]   = useState(null);
  const [votedIds, setVotedIds]   = useState(new Set());

  useEffect(() => {
    const fetchNominees = async () => {
      try {
        const data = await getNominees({ limit: 50 });
        setNominees(data.nominees || []);
      } catch {
        setError("Could not load nominees. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNominees();
  }, []);

  const handleVote = async (id) => {
    if (!user) { alert("Please sign in to vote for a nominee."); return; }
    if (votedIds.has(id) || votingId === id) return;
    setVotingId(id);
    try {
      const updated = await voteForNominee(id);
      setNominees(prev => prev.map(n => n.id === id ? { ...n, vote_count: updated.vote_count } : n));
      setVotedIds(prev => new Set([...prev, id]));
    } catch {
      alert("Could not cast vote. You may have already voted for this nominee.");
    } finally {
      setVotingId(null);
    }
  };

  // Sort: featured first, then by vote_count descending
  const sorted = [...nominees].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return (b.vote_count || 0) - (a.vote_count || 0);
  });

  const topNominees   = sorted.slice(0, 3);
  const otherNominees = sorted.slice(3);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#008751] border-t-transparent rounded-full animate-spin" />
        <p className="text-white/40 text-xs uppercase tracking-widest">Loading nominees…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 text-center">
      <div>
        <p className="text-5xl mb-4">⚠️</p>
        <p className="text-white/70 text-sm">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black pt-20 pb-20">
      <div className="container-main">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-xs text-white uppercase tracking-[0.2em] mb-3">Nigeria @65 <span className="text-[#008751]">Compendium</span></p>
          <h1 className="heading text-4xl md:text-6xl mb-6">Global <span className="text-[#008751]">Icons</span></h1>
          <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
            As Nigeria approaches its 65th Independence anniversary, we are compiling the ultimate compendium of individuals who have shaped our nation. Vote for your heroes to ensure they secure their place in history.
          </p>
          {!user && (
            <p className="text-white/40 text-xs mt-4">
              <a href="/login" className="text-[#008751] hover:underline">Sign in</a> to vote for your favourite icons.
            </p>
          )}
        </div>

        {nominees.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30 text-sm">No nominees yet. Check back soon — the compendium is being curated.</p>
          </div>
        ) : (
          <>
            {/* Top 3 Spotlight */}
            {topNominees.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center gap-3 mb-8">
                  <Award className="text-[#008751] w-6 h-6" />
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
                    {topNominees.some(n => n.is_featured) ? "Featured Icons" : "Top Nominees"}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {topNominees.map((nominee, idx) => (
                    <div key={nominee.id} className="card relative overflow-hidden group border-[#008751]/30 hover:border-[#008751] transition-all duration-300">
                      {idx === 0 && (
                        <div className="absolute top-0 right-0 bg-[#008751] text-black font-black text-xs px-3 py-1 rounded-bl-lg z-10">
                          #{idx + 1}
                        </div>
                      )}
                      {nominee.is_featured && (
                        <div className="absolute top-0 left-0 bg-[#008751]/80 text-white text-[10px] font-bold px-2 py-0.5 z-10 uppercase tracking-widest">
                          Featured
                        </div>
                      )}
                      <div className="aspect-square w-full overflow-hidden relative bg-[#111]">
                        {nominee.photo_url ? (
                          <img
                            src={nominee.photo_url}
                            alt={nominee.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-6xl font-black text-white/10">
                            {nominee.name.charAt(0)}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white">{nominee.name}</h3>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col justify-between h-36">
                        <p className="text-sm text-white/70 line-clamp-3">{nominee.bio}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-xs font-bold text-white/50">
                            {(nominee.vote_count || 0).toLocaleString()} Votes
                          </span>
                          <button
                            onClick={() => handleVote(nominee.id)}
                            disabled={votedIds.has(nominee.id) || votingId === nominee.id}
                            className={`text-xs font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors ${
                              votedIds.has(nominee.id)
                                ? "bg-white/10 text-white/40 cursor-not-allowed"
                                : "bg-[#008751] text-white hover:bg-[#00a562]"
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            {votingId === nominee.id ? "…" : votedIds.has(nominee.id) ? "Voted" : "Vote"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other nominees */}
            {otherNominees.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-8">More Nominees</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {otherNominees.map(nominee => (
                    <div key={nominee.id} className="card-hover p-4 flex flex-col h-full bg-[#0a0a0a]">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-white/10 bg-[#111]">
                          {nominee.photo_url ? (
                            <img
                              src={nominee.photo_url}
                              alt={nominee.name}
                              className="w-full h-full object-cover grayscale"
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg font-black text-white/20">
                              {nominee.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white leading-tight mb-1">{nominee.name}</h3>
                          {nominee.is_featured && (
                            <p className="text-[10px] font-mono text-[#008751] uppercase">Featured</p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-white/60 mb-6 flex-1 line-clamp-4">{nominee.bio}</p>
                      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                        <span className="text-xs font-bold text-white/40">
                          {(nominee.vote_count || 0).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleVote(nominee.id)}
                          disabled={votedIds.has(nominee.id) || votingId === nominee.id}
                          className={`text-[10px] font-bold px-3 py-1.5 uppercase tracking-wide transition-colors ${
                            votedIds.has(nominee.id)
                              ? "text-[#008751]"
                              : "text-white hover:text-[#008751]"
                          }`}
                        >
                          {votingId === nominee.id ? "…" : votedIds.has(nominee.id) ? "Voted ✓" : "Vote →"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
