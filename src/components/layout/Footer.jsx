import { Link } from "react-router-dom";
import { APP_NAME } from "../../utils/constants";

export default function Footer() {
  return (
    <footer className="px-4 py-8 bg-black">
      <div className="max-w-[1200px] mx-auto bg-[#111] rounded-[2.5rem] px-8 sm:px-16 pt-16 pb-10">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-white/10 pb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight max-w-lg">
            Celebrate Nigerian talent.
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center gap-2 bg-black text-white font-black text-sm px-8 py-4 border border-[#008751] hover:bg-[#0a0a0a] tracking-widest uppercase transition-all w-full sm:w-auto"
              style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}
            >
              Join Free
            </Link>
            <a 
              href="mailto:hello@nigeriacelebrates.com" 
              className="inline-flex items-center justify-center gap-2 bg-black text-white font-black text-sm px-8 py-4 border border-white/20 hover:border-white/40 hover:bg-[#0a0a0a] tracking-widest uppercase transition-all w-full sm:w-auto"
              style={{ clipPath: 'polygon(12px 0%, 100% 0%, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%, 0% 12px)' }}
            >
              Talk to the team
            </a>
          </div>
        </div>

        {/* Middle Section - 3 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-20">

          {/* Col 2: CONTACT */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-bold text-[#818cf8] tracking-[0.2em] uppercase">Contact</h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:hello@nigeriacelebrates.com" className="text-sm text-white font-bold hover:text-[#008751] transition-colors">
                hello@nigeriacelebrates.com
              </a>
              <p className="text-sm text-white/80 leading-relaxed font-bold">
                Federal Secretariat Complex,<br />
                Phase 1, Ahmadu Bello Way,<br />
                Abuja, Nigeria
              </p>
            </div>
          </div>

          {/* Col 3: EXPLORE */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-bold text-[#818cf8] tracking-[0.2em] uppercase">Explore</h4>
            <div className="flex flex-col gap-4">
              <Link to="/home" className="text-sm text-white/80 hover:text-white transition-colors">Home</Link>
              <a href="/#talent" className="text-sm text-white/80 hover:text-white transition-colors">Talent Zone</a>
              <a href="/#leaderboard" className="text-sm text-white/80 hover:text-white transition-colors">Leaderboard</a>
              <a href="/#quiz" className="text-sm text-white/80 hover:text-white transition-colors">Live Quiz</a>
            </div>
          </div>

          {/* Col 4: SOCIALS */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-bold text-[#818cf8] tracking-[0.2em] uppercase">Socials</h4>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Instagram" className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-colors">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-4">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-white/50 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
