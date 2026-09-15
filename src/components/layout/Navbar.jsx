import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { href: "/live",         label: "Live", isRoute: true },
  { href: "/opportunities",label: "Opportunities", isRoute: true },
  { href: "/#quiz",        label: "Quiz" },
  { href: "/compendium",   label: "Compendium", isRoute: true },
  { href: "/#icons",       label: "Icons" },
  { href: "/leaderboard",  label: "Leaderboard", isRoute: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); setOpen(false); };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled || open ? "bg-black/95 backdrop-blur-sm border-b border-white/8" : "bg-transparent"
        }`}
      >
        <nav className="container-main flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            id="navbar-logo"
            onClick={() => setOpen(false)}
            className="absolute left-5 sm:left-8 top-0 h-14 flex items-center z-50 group"
          >
            <span className="text-sm md:text-base font-black text-white uppercase tracking-[0.25em] group-hover:text-[#008751] transition-colors">
              NGC GLOBAL
            </span>
          </Link>

          {/* Desktop links - absolutely centered */}
          <ul className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map(({ href, label, isRoute }) => (
              <li key={href}>
                {isRoute ? (
                  <Link
                    to={href}
                    state={{ fromLanding: true }}
                    className="px-3 py-2 rounded text-sm text-white hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    href={href}
                    className="px-3 py-2 rounded text-sm text-white hover:text-white transition-colors"
                  >
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {/* Right side actions */}
          <div className="absolute right-5 sm:right-8 top-0 h-14 flex items-center z-50">
            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <Link to="/my-arena" id="nav-my-arena" className="btn-ghost text-sm py-1.5 px-3">
                    My Arena
                  </Link>
                  <button id="nav-logout" onClick={handleLogout} className="btn-outline text-sm py-1.5 px-3">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" id="nav-login" className="btn-ghost text-sm py-1.5 px-3">
                    Sign In
                  </Link>
                  <Link to="/register" id="nav-register" className="btn-primary text-sm py-1.5 px-4">
                    Join Free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              id="nav-hamburger"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="md:hidden p-2 text-white hover:text-white transition-colors"
            >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {open ? (
                <>
                  <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </>
              ) : (
                <>
                  <line x1="3" y1="6"  x2="17" y2="6"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-40 w-72 max-w-[85vw] h-screen bg-black border-l border-white/8 shadow-2xl flex flex-col p-6 pt-20 transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-2 overflow-y-auto flex-1">
          {NAV_LINKS.map(({ href, label, isRoute }) => (
            isRoute ? (
              <Link
                key={href}
                to={href}
                state={{ fromLanding: true }}
                onClick={() => setOpen(false)}
                className="py-3 px-4 text-base font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-all rounded-lg"
              >
                {label}
              </Link>
            ) : (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="py-3 px-4 text-base font-semibold text-white/80 hover:text-white hover:bg-white/5 transition-all rounded-lg"
              >
                {label}
              </a>
            )
          ))}
        </div>

        <div className="border-t border-white/8 pt-6 mt-auto flex flex-col gap-3">
          {user ? (
            <>
              <Link to="/my-arena" id="nav-mobile-arena" onClick={() => setOpen(false)}
                className="btn-outline text-sm w-full justify-center py-3 px-4 rounded-lg">
                My Arena
              </Link>
              <button id="nav-mobile-logout" onClick={handleLogout}
                className="btn-ghost text-sm w-full justify-center py-3 px-4 rounded-lg text-white/70 hover:text-white">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/register" id="nav-mobile-register" onClick={() => setOpen(false)}
                className="btn-primary text-sm w-full py-3 justify-center rounded-lg">
                Join Free
              </Link>
              <Link to="/login" id="nav-mobile-login" onClick={() => setOpen(false)}
                className="btn-outline text-sm w-full py-3 justify-center rounded-lg">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
