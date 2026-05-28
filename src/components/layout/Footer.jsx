import { APP_NAME } from "../../utils/constants";

export default function Footer() {
  return (
    <footer className="border-t border-white/8 py-12">
      <div className="container-main">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-10">
          <div>
            <p className="font-semibold text-white text-sm mb-1">{APP_NAME}</p>
            <p className="text-xs text-white/30 max-w-xs leading-relaxed">
              Celebrating Nigerian talent, culture, and pride — one upload, one vote, one quiz at a time.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Twitter / X" className="w-9 h-9 flex items-center justify-center border border-white/10 rounded-full text-white/40 hover:text-white hover:border-white/40 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 flex items-center justify-center border border-white/10 rounded-full text-white/40 hover:text-white hover:border-white/40 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" aria-label="TikTok" className="w-9 h-9 flex items-center justify-center border border-white/10 rounded-full text-white/40 hover:text-white hover:border-white/40 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.37-6.23V9.12a8.16 8.16 0 0 0 3.85.98V6.69z"/></svg>
            </a>
            <a href="#" aria-label="YouTube" className="w-9 h-9 flex items-center justify-center border border-white/10 rounded-full text-white/40 hover:text-white hover:border-white/40 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/#talent" className="text-xs text-white/30 hover:text-white transition-colors">Talent</a>
            <a href="/#leaderboard" className="text-xs text-white/30 hover:text-white transition-colors">Leaderboard</a>
            <a href="/#icons" className="text-xs text-white/30 hover:text-white transition-colors">Icons</a>
            <a href="/#quiz" className="text-xs text-white/30 hover:text-white transition-colors">Quiz</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
