import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  LayoutDashboard,
  FileCheck,
  HelpCircle,
  LogOut,
  Flag,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",    href: "/control-deck/dashboard",  icon: LayoutDashboard },
  { label: "Post Approvals", href: "/control-deck/posts",    icon: FileCheck },
  { label: "Quiz Builder",  href: "/control-deck/quiz",      icon: HelpCircle },
];

export default function AdminLayout({ children }) {
  const { adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/control-deck");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 bg-[#008751] flex items-center justify-center text-white font-black text-xs shrink-0">
              NC
            </span>
            <div>
              <p className="text-xs font-bold text-gray-900 leading-tight">Nigeria Celebrates</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#008751]/10 text-[#008751]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            id="admin-logout"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
