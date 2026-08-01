import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitTalent, submitCategory } from "../services/talentService";
import api from "../services/api";
import {
  Music, Medal, Volleyball, Laugh, Palette,
  Scissors, Shirt, Clapperboard, Camera, Laptop, Flame, Shield,
  ChevronDown, CheckCircle, AlertCircle
} from "lucide-react";

// Icon map: match against category names coming from the API
const ICON_MAP = {
  "music":                Music,
  "football freestyle":   Medal,
  "basketball freestyle": Volleyball,
  "comedy skits":         Laugh,
  "handmade artwork":     Palette,
  "artwork":              Palette,
  "hair artistry":        Scissors,
  "fashion":              Shirt,
  "fashion showcase":     Shirt,
  "short film":           Clapperboard,
  "photography":          Camera,
  "tech innovation":      Laptop,
  "dance":                Flame,
  "security":             Shield,
};

const getIcon = (name = "") => ICON_MAP[name.toLowerCase()] || Music;

// Categories whose uploads benefit from a "tools used" field
const TOOLS_CATEGORIES = ["handmade artwork", "artwork", "hair artistry"];

// Detect file type from MIME
function detectFileType(file) {
  if (!file) return null;
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "image";
}

export default function UploadPage() {
  const navigate = useNavigate();

  // ── Live categories from API ────────────────────────────────────────────────
  const [categories, setCategories]     = useState([]);
  const [catsLoading, setCatsLoading]   = useState(true);

  useEffect(() => {
    api.get("/talents/categories/approved")
      .then(res => {
        const cats = res.data || [];
        setCategories(cats);
        // Default to the first category name
        if (cats.length > 0) setCategory(cats[0].name);
      })
      .catch(() => {
        // Fallback list (mirrors what's in the DB) so the form still works offline
        const fallback = [
          "Music", "Football Freestyle", "Basketball Freestyle",
          "Comedy Skits", "Handmade Artwork", "Hair Artistry",
          "Fashion", "Short Film", "Photography", "Tech Innovation", "Dance", "Security",
        ].map((name, i) => ({ id: i + 1, name, status: "approved" }));
        setCategories(fallback);
        setCategory(fallback[0].name);
      })
      .finally(() => setCatsLoading(false));
  }, []);

  // ── Form state ─────────────────────────────────────────────────────────────
  const [file, setFile]               = useState(null);
  const [fileType, setFileType]       = useState(null);
  // category holds the EXACT NAME string the API expects
  const [category, setCategory]       = useState("");
  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [toolsUsed, setToolsUsed]     = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [apiError, setApiError]     = useState(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    
    const type = detectFileType(f);
    if (type === "video") {
      setApiError(null);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 60) {
          setApiError(`Video duration is ${Math.round(video.duration)} seconds. Videos must be 60 seconds or shorter.`);
          setFile(null);
          setFileType(null);
          if (e.target) e.target.value = "";
        } else {
          setFile(f);
          setFileType(type);
          setApiError(null);
        }
      };
      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        // Fallback: accept the file if loading metadata fails
        setFile(f);
        setFileType(type);
      };
      video.src = URL.createObjectURL(f);
    } else {
      setFile(f);
      setFileType(type);
      setApiError(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!file)             { setApiError("Please select a file to upload."); return; }
    if (!title.trim())     { setApiError("Please add a title for your submission."); return; }
    if (!description.trim()) { setApiError("Please add a description."); return; }
    let finalCategory = category;
    if (category === "Other") {
      if (!customCategory.trim()) { setApiError("Please enter a custom category name."); return; }
      finalCategory = customCategory.trim();
    }
    if (!finalCategory) { setApiError("Please select a category."); return; }

    setSubmitting(true);
    try {
      if (category === "Other") {
        await submitCategory(finalCategory);
      }

      await submitTalent({
        title:       title.trim(),
        description: description.trim(),
        category:    finalCategory,           // ← exact name string from API, e.g. "Basketball Freestyle"
        tools_used:  toolsUsed.trim() || undefined,
        file,
        fileType,
      });
      setSuccess(true);
      setTimeout(() => navigate("/home"), 2500);
    } catch (err) {
      const msg = err.response?.data?.detail || "Upload failed. Please try again.";
      setApiError(Array.isArray(msg) ? msg.map(m => m.msg).join(", ") : msg);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedIcon = getIcon(category);
  const showTools = TOOLS_CATEGORIES.includes(category.toLowerCase());

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

        {/* Success state */}
        {success && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#050505] px-8 text-center">
            <CheckCircle className="w-16 h-16 text-[#008751] mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">Submission Received!</h2>
            <p className="text-white/60 text-sm">Your talent is under review. You'll see it live after admin approval.</p>
          </div>
        )}

        {/* Form */}
        <div className="px-6 py-8">
          <form onSubmit={handleUpload} className="flex flex-col gap-6">

            {/* Media Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black">
                Media File {fileType && <span className="text-[#008751] ml-1">({fileType} selected)</span>}
              </label>
              <label className="w-full h-48 border border-white/20 border-dashed flex flex-col items-center justify-center bg-transparent hover:bg-[#0a1a0f] hover:border-[#008751] hover:border-solid transition-all cursor-pointer group">
                <input
                  type="file"
                  accept="video/*,image/*,audio/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="w-12 h-12 bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#008751] group-hover:text-black text-white/40 transition-colors" style={{ clipPath: "polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px)" }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors text-center px-4 line-clamp-1">
                  {file ? file.name : "Tap to select media"}
                </span>
                {!file && <span className="text-[10px] text-white/40 mt-1 uppercase tracking-widest text-center px-4">Video (max 60s), Image or Audio · Max 50MB</span>}
              </label>
              {fileType === "video" && (
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 p-3 mt-1 rounded-sm">
                  <span className="text-sm">⚠️</span>
                  <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                    Disclaimer: Videos should not exceed 60 seconds in duration.
                  </p>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black">Title</label>
              <input
                type="text"
                placeholder="Give your submission a great title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border border-white/20 text-white text-sm px-4 py-3.5 focus:outline-none focus:border-[#008751] focus:bg-[#0a1a0f] hover:border-[#008751] transition-colors placeholder:text-white/30"
              />
            </div>

            {/* Category Dropdown */}
            <div className="flex flex-col gap-2" ref={categoryRef}>
              <label className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black">Category</label>
              <div className="relative">
                <div
                  onClick={() => !catsLoading && setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full bg-transparent border border-white/20 text-white font-bold text-sm px-4 py-3.5 hover:border-[#008751] hover:bg-[#0a1a0f] transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {catsLoading ? (
                      <span className="text-white/40 text-sm">Loading categories…</span>
                    ) : (
                      <>
                        {(() => { const Icon = selectedIcon; return <Icon className="w-5 h-5 text-[#008751]" strokeWidth={2.5} />; })()}
                        <span>{category || "Select a category"}</span>
                      </>
                    )}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                </div>

                {isCategoryOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-[#050505] border border-[#008751]/40 shadow-[4px_4px_0_rgba(0,135,81,0.3)] max-h-60 overflow-y-auto">
                    {[...categories, { id: 'other', name: 'Other' }].map(cat => {
                      const Icon = getIcon(cat.name);
                      const isSelected = category === cat.name;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => { setCategory(cat.name); setIsCategoryOpen(false); }}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isSelected ? "bg-[#008751]/20 border-l-2 border-[#008751]" : "hover:bg-white/5 border-l-2 border-transparent"}`}
                        >
                          <Icon className={`w-5 h-5 ${isSelected ? "text-[#008751]" : "text-white/50"}`} strokeWidth={2} />
                          <span className={`text-sm font-bold ${isSelected ? "text-white" : "text-white/80"}`}>{cat.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Custom Category Input (conditional) */}
            {category === "Other" && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black">Custom Category Name</label>
                <input
                  type="text"
                  placeholder="Enter your category name..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-transparent border border-white/20 text-white text-sm px-4 py-3.5 focus:outline-none focus:border-[#008751] focus:bg-[#0a1a0f] hover:border-[#008751] transition-colors placeholder:text-white/30"
                />
              </div>
            )}

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black">Description</label>
              <textarea
                placeholder="Describe your talent… #NaijaTalent"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-transparent border border-white/20 text-white text-sm px-4 py-3.5 focus:outline-none focus:border-[#008751] focus:bg-[#0a1a0f] hover:border-[#008751] transition-colors resize-none placeholder:text-white/30"
              />
            </div>

            {/* Tools / Materials (conditional) */}
            {showTools && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-black">Materials / Tools used (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Adobe Illustrator, Charcoal, Edge Control…"
                  value={toolsUsed}
                  onChange={(e) => setToolsUsed(e.target.value)}
                  className="w-full bg-transparent border border-white/20 text-white text-sm px-4 py-3.5 focus:outline-none focus:border-[#008751] focus:bg-[#0a1a0f] hover:border-[#008751] transition-colors placeholder:text-white/30"
                />
              </div>
            )}

            {/* Error */}
            {apiError && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 p-3">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{apiError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || catsLoading}
              className="btn-primary w-full justify-center py-4 text-base mt-2 disabled:opacity-50"
            >
              {submitting ? "Uploading…" : "Post Talent"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
