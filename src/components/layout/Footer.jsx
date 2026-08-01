import { Link } from "react-router-dom";
import { APP_NAME } from "../../utils/constants";

export default function Footer() {
  return (
    <>
      <div className="w-full overflow-hidden flex items-end justify-center select-none pointer-events-none bg-black pt-8">
        <img 
          src="https://assets.jijistatic.net/static/svg/footer/footer-nigeria-new.svg" 
          alt="Nigeria Skyline" 
          className="w-full h-auto object-cover object-bottom"
          style={{ maxHeight: '120px', filter: 'invert(34%) sepia(85%) saturate(2972%) hue-rotate(134deg) brightness(96%) contrast(101%)' }}
        />
      </div>
      <footer className="px-4 pb-8 bg-black">
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
              href="mailto:contact@nigeriacelebrates.com"
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
              <p className="text-sm text-white/80 leading-relaxed font-bold">
                AUST INSPIRE INNOVATION HUB,<br />
                AFRICAN UNIVERSITY OF SCIENCE AND TECHNOLOGY.
              </p>
              <div className="text-xs text-white/60 leading-relaxed">
                <span className="font-bold text-white block uppercase tracking-wider text-[10px] text-[#818cf8] mb-1">Enquiries &amp; Sponsorships</span>
                Call: 09058416810<br />
                WhatsApp (only): 08186097119<br />
                Email: contact@nigeriacelebrates.com
              </div>
            </div>
          </div>

          {/* Col 3: EXPLORE */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-bold text-[#818cf8] tracking-[0.2em] uppercase">Explore</h4>
            <div className="flex flex-col gap-4">
              <Link to="/home" className="text-sm text-white/80 hover:text-white transition-colors">Home</Link>
              <Link to="/leaderboard" state={{ fromLanding: true }} className="text-sm text-white/80 hover:text-white transition-colors">Leaderboard</Link>
              <a href="/#quiz" className="text-sm text-white/80 hover:text-white transition-colors">Live Quiz</a>
            </div>
          </div>

          {/* Col 4: SOCIALS */}
          <div className="flex flex-col gap-6">
            <h4 className="text-[10px] font-bold text-[#818cf8] tracking-[0.2em] uppercase">Socials</h4>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/nigeria_celebrate/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 flex items-center justify-center border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-4">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} nigeria celebrate's. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-white/50 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
    </>
  );
}
