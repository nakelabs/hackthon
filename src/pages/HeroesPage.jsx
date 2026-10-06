import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getNominees } from "../services/compendiumService";
import { Award } from "lucide-react";

const CATEGORIES = [
  "All",
  "Nigeria in diaspora",
  "Nigerians in Nigeria",
  "Nigerian companies",
  "The 36 state Governors"
];

export default function HeroesPage() {
  const [achievers, setAchievers] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [achieversRes, nomineesData] = await Promise.all([
          api.get("/api/achievers").catch(() => ({ data: [] })),
          getNominees({ limit: 50 }).catch(() => ({ nominees: [] }))
        ]);
        
        const arr = Array.isArray(achieversRes.data) ? achieversRes.data : (achieversRes.data?.data || achieversRes.data?.achievers || []);
        setAchievers(arr);
        setNominees(nomineesData.nominees || []);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAchievers = activeFilter === "All" 
    ? achievers 
    : achievers.filter(a => a.category === activeFilter);

  // Sort: featured first
  const sortedNominees = [...nominees].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return a.name.localeCompare(b.name);
  });
  const topNominees = sortedNominees.slice(0, 3);
  const otherNominees = sortedNominees.slice(3);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
      
      {/* Header Section */}
      <div className="container-main text-center mb-16">
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
          Hall of Fame
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Our <span className="text-emerald-400">Heroes</span> & <span className="text-[#008751]">Compendium</span>
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
          Celebrating the remarkable individuals, organizations, and community-nominated icons shaping the future of Nigeria both at home and across the globe.
        </p>
      </div>

      {/* Filters */}
      <div className="container-main mb-12">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeFilter === category
                  ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container-main">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {filteredAchievers.length === 0 ? (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🌟</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">No heroes found</h3>
                <p className="text-white/50">Check back later or try a different category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 items-stretch">
                {filteredAchievers.map((hero, index) => {
                  const isCompany = hero.category === "Nigerian companies";

                  return (
                    <Link 
                      to={`/heroes/${hero.id}`}
                      key={hero.id} 
                      className="group relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-[#111] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] flex flex-col h-full block"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Image Section */}
                      <div className={`aspect-square relative overflow-hidden transition-all duration-500 ${isCompany ? 'bg-white' : 'bg-[#1a1a1a]'}`}>
                        {hero.image_url ? (
                          <img 
                            src={hero.image_url} 
                            alt={hero.name} 
                            className={`w-full h-full transition-transform duration-700 group-hover:scale-105 ${
                              isCompany ? "object-contain p-8" : "object-cover object-center"
                            }`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black/50">
                            <span className="text-6xl opacity-20">🌟</span>
                          </div>
                        )}
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-6 left-6">
                          <span className="bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                            {hero.category}
                          </span>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="p-8 flex flex-col flex-1 relative z-10 -mt-20 bg-gradient-to-b from-transparent via-[#0a0a0a] to-[#0a0a0a]">
                        <div className="mt-8">
                          <h3 className="text-2xl md:text-3xl font-black text-white mb-4 group-hover:text-emerald-400 transition-colors drop-shadow-lg">
                            {hero.name}
                          </h3>
                          <div className="text-sm md:text-base text-white/60 leading-relaxed overflow-hidden">
                            <p className="line-clamp-3">
                              {hero.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-6 border-t border-white/10 flex justify-end">
                          <span className="text-emerald-400 text-xs md:text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                            View Profile
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Compendium Section */}
            {nominees.length > 0 && (
              <div className="mt-32 border-t border-white/10 pt-20">
                <div className="text-center mb-16">
                  <p className="text-xs text-white uppercase tracking-[0.2em] mb-3">Nigeria @65 <span className="text-[#008751]">Compendium</span></p>
                  <h2 className="text-4xl md:text-5xl font-black mb-6">Nominated <span className="text-[#008751]">Global Icons</span></h2>
                  <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
                    These are the talented individuals nominated by the community — each one a global icon in their own right.
                  </p>
                </div>

                {topNominees.length > 0 && (
                  <div className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                      <Award className="text-[#008751] w-6 h-6" />
                      <h3 className="text-2xl font-bold text-white uppercase tracking-tight">
                        {topNominees.some(n => n.is_featured) ? "Featured Icons" : "Top Nominees"}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {topNominees.map((nominee, idx) => (
                        <div key={nominee.id} className="relative overflow-hidden group border border-[#008751]/30 hover:border-[#008751] rounded-2xl bg-[#0a0a0a] transition-all duration-300">
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
                              <h4 className="text-xl font-bold text-white">{nominee.name}</h4>
                            </div>
                          </div>
                          <div className="p-5 flex flex-col justify-between flex-1">
                            <p className="text-sm text-white/70 line-clamp-3 mb-2">{nominee.bio}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {otherNominees.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-8">More Nominees</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {otherNominees.map(nominee => (
                        <div key={nominee.id} className="p-4 flex flex-col h-full bg-[#0a0a0a] border border-white/5 rounded-2xl hover:bg-[#111] transition-colors">
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
                              <h4 className="text-sm font-bold text-white leading-tight mb-1">{nominee.name}</h4>
                              {nominee.is_featured && (
                                <p className="text-[10px] font-mono text-[#008751] uppercase">Featured</p>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-white/60 flex-1 line-clamp-4">{nominee.bio}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
