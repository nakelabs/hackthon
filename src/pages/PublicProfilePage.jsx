import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserById } from "../services/authService";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "../components/ui/SocialIcons";

export default function PublicProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    getUserById(userId).then(profileData => {
      if (!profileData) {
        setError("User not found.");
      } else {
        setProfile(profileData);
        setUploads(profileData.posts?.items || []);
      }
    }).catch(() => setError("User not found."))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#008751] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
      <span className="text-6xl mb-4 opacity-40">👤</span>
      <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">User Not Found</h1>
      <p className="text-white/50 text-sm mb-6">This profile doesn't exist or has been removed.</p>
      <button onClick={() => navigate(-1)} className="btn-primary px-8 py-3 text-sm uppercase tracking-widest">
        Go Back
      </button>
    </div>
  );

  const displayName = profile.full_name || profile.username || "Naija Talent";
  const username    = `@${(profile.username || profile.full_name || "naija_star").replace(/\s+/g, "").toLowerCase()}`;
  const initial     = displayName.charAt(0).toUpperCase();
  const totalVotes  = profile.vote_count ?? uploads.reduce((sum, u) => sum + (u.vote_count || 0), 0);
  const totalPosts  = profile.posts?.total ?? uploads.length;

  return (
    <div className="bg-black min-h-screen flex justify-center">
      <div className="w-full max-w-[450px] bg-[#050505] min-h-screen border-x border-white/5 shadow-2xl shadow-black">

        {/* Header */}
        <div className="sticky top-0 w-full px-5 py-4 z-50 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-white/10">
          <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white transition-colors p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-sm font-bold text-white tracking-widest uppercase">{username}</h1>
          <div className="w-8" />
        </div>

        {/* Cover gradient */}
        <div className="h-32 bg-gradient-to-br from-[#008751]/30 via-black to-black relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,135,81,0.2),transparent_70%)]" />
        </div>

        {/* Avatar + Info */}
        <div className="px-6 pb-6 relative -mt-14 border-b border-white/5">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full border-4 border-[#050505] overflow-hidden bg-[#111] flex items-center justify-center mb-4 ring-2 ring-[#008751]/50">
            {profile.profile_picture_url ? (
              <img src={profile.profile_picture_url} alt={displayName} className="w-full h-full object-cover object-center" />
            ) : (
              <span className="text-3xl font-black text-white">{initial}</span>
            )}
          </div>

          <h2 className="text-xl font-black text-white mb-0.5">{displayName}</h2>
          <p className="text-white/50 text-sm mb-3">{username}</p>

          <div className="flex gap-2 flex-wrap mb-4">
            {profile.location && (
              <span className="px-3 py-1 bg-white/8 border border-white/10 text-[11px] font-mono text-white/70 uppercase rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {profile.location}
              </span>
            )}
            <span className="px-3 py-1 bg-[#008751]/15 border border-[#008751]/30 text-[11px] font-mono text-[#008751] uppercase rounded-full">
              {profile.role || "Talent"}
            </span>
          </div>

          {profile.bio && (
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              {profile.bio}
            </p>
          )}

          {profile.social_media_links && Object.values(profile.social_media_links).some(link => link) && (
            <div className="flex items-center gap-4 mb-6">
              {profile.social_media_links.x && <a href={profile.social_media_links.x} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>}
              {profile.social_media_links.instagram && <a href={profile.social_media_links.instagram} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#E1306C] transition-colors"><Instagram className="w-5 h-5" /></a>}
              {profile.social_media_links.facebook && <a href={profile.social_media_links.facebook} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#1877F2] transition-colors"><Facebook className="w-5 h-5" /></a>}
              {profile.social_media_links.youtube && <a href={profile.social_media_links.youtube} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#FF0000] transition-colors"><Youtube className="w-5 h-5" /></a>}
              {profile.social_media_links.linkedin && <a href={profile.social_media_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#0A66C2] transition-colors"><Linkedin className="w-5 h-5" /></a>}
            </div>
          )}

          {/* Stats */}
          <div className="flex gap-0 border border-white/8 rounded-xl overflow-hidden">
            <div className="flex-1 py-3 flex flex-col items-center justify-center border-r border-white/8 bg-white/3 hover:bg-white/6 transition-colors">
              <span className="text-lg font-black text-white">{totalPosts}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Posts</span>
            </div>
            <div className="flex-1 py-3 flex flex-col items-center justify-center bg-white/3 hover:bg-white/6 transition-colors">
              <span className="text-lg font-black text-[#008751]">{totalVotes.toLocaleString()}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Votes</span>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="p-px">
          {uploads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <span className="text-5xl mb-4 opacity-30">🎭</span>
              <p className="text-white/40 text-sm">No public submissions yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-px bg-white/5">
              {uploads.map((item) => (
                <Link
                  key={item.id}
                  to="/home"
                  className="aspect-[3/4] bg-[#111] relative group overflow-hidden block"
                >
                  {item.image_url || item.video_url ? (
                    <img
                      src={item.image_url || item.video_url}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#008751]/20 to-black/80 flex items-center justify-center">
                      <span className="text-3xl opacity-40">🎤</span>
                    </div>
                  )}

                  {/* Vote badge */}
                  {item.vote_count > 0 && (
                    <div className="absolute bottom-1 left-1 flex items-center gap-0.5 bg-black/70 px-1.5 py-0.5 rounded">
                      <svg className="w-2.5 h-2.5 text-[#008751]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      <span className="text-[9px] font-bold text-white">{item.vote_count}</span>
                    </div>
                  )}

                  {/* Category */}
                  <div className="absolute top-1 right-1 bg-black/70 px-1 py-0.5 rounded">
                    <span className="text-[8px] font-bold text-[#008751] uppercase">{item.category}</span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white text-[9px] font-bold text-center px-1 line-clamp-2">{item.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
