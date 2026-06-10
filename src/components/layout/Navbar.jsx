import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { href: "/live",         label: "Live", isRoute: true },
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
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        scrolled ? "bg-black/95 backdrop-blur-sm border-b border-white/8" : "bg-transparent"
      }`}
    >
      <nav className="container-main flex items-center justify-between h-14">
        {/* Logo */}
        <Link
          to="/"
          id="navbar-logo"
          onClick={() => setOpen(false)}
          className="text-sm font-semibold text-white tracking-tight"
        >
          Nigeria Celebrates
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label, isRoute }) => (
            <li key={href}>
              {isRoute ? (
                <Link
                  to={href}
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
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-200 border-b border-white/8 bg-black ${
          open ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="container-main py-4 flex flex-col gap-1">
          {NAV_LINKS.map(({ href, label, isRoute }) => (
            isRoute ? (
              <Link
                key={href}
                to={href}
                onClick={() => setOpen(false)}
                className="py-2.5 px-3 text-sm text-white hover:text-white transition-colors rounded"
              >
                {label}
              </Link>
            ) : (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="py-2.5 px-3 text-sm text-white hover:text-white transition-colors rounded"
              >
                {label}
              </a>
            )
          ))}
          <div className="border-t border-white/8 mt-2 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/my-arena" id="nav-mobile-arena" onClick={() => setOpen(false)}
                  className="btn-outline text-sm w-full justify-start px-3 py-2.5">
                  My Arena
                </Link>
                <button id="nav-mobile-logout" onClick={handleLogout}
                  className="btn-ghost text-sm w-full justify-start px-3 py-2.5 text-left">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/register" id="nav-mobile-register" onClick={() => setOpen(false)}
                  className="btn-primary text-sm w-full">
                  Join Free
                </Link>
                <Link to="/login" id="nav-mobile-login" onClick={() => setOpen(false)}
                  className="btn-outline text-sm w-full">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
