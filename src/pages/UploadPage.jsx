import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TALENT_CATEGORIES } from "../utils/constants";
import {
  Music, Medal, Volleyball, Laugh, Palette,
  Scissors, Shirt, Clapperboard, Camera, Laptop, Brush,
  ChevronDown
} from "lucide-react";

const CATEGORY_ICONS = {
  music: Music,
  football: Medal,
  basketball: Volleyball,
  comedy: Laugh,
  artwork: Palette,
  hair: Scissors,
  fashion: Shirt,
  film: Clapperboard,
  photography: Camera,
  tech: Laptop,
  logo: Brush,
};

const STATES = ["Lagos", "Abuja", "Kano", "Rivers", "Oyo", "Enugu"];

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("music");
  const [state, setState] = useState("Lagos");
  const [caption, setCaption] = useState("");
  const [materials, setMaterials] = useState("");
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    // Mock upload success
    alert("Upload successful! Your talent is now live.");
    navigate("/home");
  };

  return (
    <div className="bg-black min-h-screen flex justify-center relative">
      <div className="w-full max-w-[450px] bg-[#050505] relative min-h-screen border-x border-white/5 pb-24">
        
        {/* Header */}
        <div className="sticky top-0 w-full px-6 py-6 z-50 flex items-center gap-4 bg-black/80 backdrop-blur-md border-b border-white/10">
          <button onClick={() => navigate(-1)} className="text-white hover:text-white/70 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-black text-white tracking-widest uppercase">Upload Talent</h1>
        </div>

        {/* Form Content */}
        <div className="px-6 py-8">
          <form onSubmit={handleUpload} className="flex flex-col gap-6">
            
            {/* Media Upload Area */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black">
                {category === "music" ? "Media (Video/Image/Audio)" : "Media (Video/Image)"}
              </label>
              <label className="w-full h-48 border border-white/20 border-dashed flex flex-col items-center justify-center bg-transparent hover:bg-[#0a1a0f] hover:border-[#008751] hover:border-solid transition-all cursor-pointer group">
                <input 
                  type="file" 
                  accept={category === "music" ? "video/*,image/*,audio/*" : "video/*,image/*"} 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#008751] group-hover:text-black text-white/40 transition-colors" style={{ clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)" }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors">
                  {file ? file.name : "Tap to select media"}
                </span>
                {!file && <span className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">Max size 50MB</span>}
              </label>
            </div>

            {/* Category Dropdown (Custom) */}
            <div className="flex flex-col gap-2" ref={categoryRef}>
              <label className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black">Category</label>
              <div className="relative">
                <div 
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full bg-transparent border border-white/20 text-white font-bold text-sm px-4 py-3.5 hover:border-[#008751] hover:bg-[#0a1a0f] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {(() => {
                      const selectedCat = TALENT_CATEGORIES.find(c => c.id === category);
                      const Icon = CATEGORY_ICONS[selectedCat.id] || Music;
                      return (
                        <>
                          <Icon className="w-5 h-5 text-[#008751]" strokeWidth={2.5} />
                          <span>{selectedCat.label}</span>
                        </>
                      );
                    })()}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </div>
                
                {isCategoryOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-[#050505] border border-[#008751]/40 shadow-[4px_4px_0_rgba(0,135,81,0.3)] max-h-60 overflow-y-auto scrollbar-hide">
                    {TALENT_CATEGORIES.map(cat => {
                      const Icon = CATEGORY_ICONS[cat.id] || Music;
                      return (
                        <div 
                          key={cat.id}
                          onClick={() => {
                            setCategory(cat.id);
                            setIsCategoryOpen(false);
                          }}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                            category === cat.id ? "bg-[#008751]/20 border-l-2 border-[#008751]" : "hover:bg-white/5 border-l-2 border-transparent"
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${category === cat.id ? "text-[#008751]" : "text-white/50"}`} strokeWidth={2} />
                          <span className={`text-sm font-bold ${category === cat.id ? "text-white" : "text-white/80"}`}>
                            {cat.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* State Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black">Location (State)</label>
              <div className="relative">
                <select 
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-transparent border border-white/20 text-white font-bold text-sm px-4 py-3.5 focus:outline-none focus:border-[#008751] focus:bg-[#0a1a0f] hover:border-[#008751] transition-colors appearance-none cursor-pointer"
                >
                  {STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* Caption Area */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black">Caption</label>
              <textarea 
                placeholder="Write a catchy caption... #NaijaTalent"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                className="w-full bg-transparent border border-white/20 text-white text-sm px-4 py-3.5 focus:outline-none focus:border-[#008751] focus:bg-[#0a1a0f] hover:border-[#008751] transition-colors resize-none placeholder:text-white/30"
              />
            </div>

            {/* Optional Materials / Tools Field */}
            {["artwork", "logo", "hair"].includes(category) && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black">Materials / tools used (optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. Adobe Illustrator, Charcoal, Edge Control..."
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  className="w-full bg-transparent border border-white/20 text-white text-sm px-4 py-3.5 focus:outline-none focus:border-[#008751] focus:bg-[#0a1a0f] hover:border-[#008751] transition-colors placeholder:text-white/30"
                />
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              className="btn-primary w-full justify-center py-4 text-base mt-2"
            >
              Post Talent
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
