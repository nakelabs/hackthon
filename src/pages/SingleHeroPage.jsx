import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function SingleHeroPage() {
  const { id } = useParams();
  const [hero, setHero] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHero = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/api/achievers/${id}`);
        setHero(data);
      } catch (err) {
        console.error("Failed to fetch hero", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHero();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex justify-center py-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!hero) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center pt-24 pb-20">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🌟</span>
        </div>
        <h1 className="text-3xl font-bold mb-6">Hero Not Found</h1>
        <Link to="/heroes" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-3 px-8 rounded-xl transition-colors">
          Return to Heroes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20">
      <div className="container-main max-w-4xl mx-auto">
        <Link 
          to="/heroes" 
          className="inline-flex items-center text-white/50 hover:text-white font-bold mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Heroes
        </Link>
        
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
          {/* Image Header */}
          <div className="w-full h-64 md:h-[28rem] relative bg-black">
            {hero.image_url ? (
              <img 
                src={hero.image_url} 
                alt={hero.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-7xl opacity-20">🌟</span>
              </div>
            )}
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12">
              <span className="inline-block bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">
                {hero.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                {hero.name}
              </h1>
            </div>
          </div>
          
          {/* Content Body */}
          <div className="p-8 md:p-12">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-medium">
                {hero.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
