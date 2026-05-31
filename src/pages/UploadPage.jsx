import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TALENT_CATEGORIES } from "../utils/constants";

const STATES = ["Lagos", "Abuja", "Kano", "Rivers", "Oyo", "Enugu"];

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("music");
  const [state, setState] = useState("Lagos");
  const [caption, setCaption] = useState("");

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
              <label className="text-xs text-white/50 uppercase tracking-[0.2em] font-bold">Media (Video/Image)</label>
              <label className="w-full h-48 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center bg-[#111] hover:bg-[#1a1a1a] hover:border-[#008751] transition-colors cursor-pointer group">
                <input 
                  type="file" 
                  accept="video/*,image/*" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#008751]/20 group-hover:text-[#008751] text-white/40 transition-colors">
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

            {/* Category Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-white/50 uppercase tracking-[0.2em] font-bold">Category</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#111] border border-white/20 text-white font-bold text-base rounded-lg px-4 py-4 focus:outline-none focus:border-[#008751] transition-colors appearance-none cursor-pointer"
                >
                  {TALENT_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            {/* State Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-white/50 uppercase tracking-[0.2em] font-bold">Location (State)</label>
              <div className="relative">
                <select 
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#111] border border-white/20 text-white font-bold text-base rounded-lg px-4 py-4 focus:outline-none focus:border-[#008751] transition-colors appearance-none cursor-pointer"
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
              <label className="text-xs text-white/50 uppercase tracking-[0.2em] font-bold">Caption</label>
              <textarea 
                placeholder="Write a catchy caption... #NaijaTalent"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                className="w-full bg-[#111] border border-white/20 text-white text-base rounded-lg px-4 py-4 focus:outline-none focus:border-[#008751] transition-colors resize-none placeholder:text-white/30"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="mt-4 w-full bg-[#008751] hover:bg-[#009b5d] text-white font-black text-lg tracking-widest uppercase py-4 rounded-xl shadow-[0_0_20px_rgba(0,135,81,0.3)] hover:shadow-[0_0_30px_rgba(0,135,81,0.5)] transition-all transform hover:-translate-y-1"
            >
              Post Talent
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
