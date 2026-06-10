import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import {
  LayoutDashboard,
  FileCheck,
  HelpCircle,
  LogOut,
  Flag,
  Tag,
  Award,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",    href: "/control-deck/dashboard",  icon: LayoutDashboard },
  { label: "Post Approvals", href: "/control-deck/posts",    icon: FileCheck },
  { label: "User Search",  href: "/control-deck/users",      icon: Users },
  { label: "Categories",   href: "/control-deck/categories", icon: Tag },
  { label: "Quiz Builder",  href: "/control-deck/quiz",      icon: HelpCircle },
  { label: "Nominees",      href: "/control-deck/nominees",  icon: Award },
];

export default function AdminLayout({ children }) {
  const { adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/control-deck");
  };

  return (
    <div className="h-screen bg-[#1c1c24] flex p-3 font-sans overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-transparent flex flex-col shrink-0 text-white pb-4 pr-3">
        {/* Brand */}
        <div className="p-6 mb-2">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[13px] font-bold text-white leading-tight">Nigeria Celebrates</p>
              <p className="text-[10px] text-gray-400">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-1">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#4f447a] text-white shadow-lg"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="px-4 mt-auto space-y-4">
          <button
            onClick={handleLogout}
            id="admin-logout"
            className="flex items-center gap-3 px-4 py-3 w-full rounded-full text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Log out
          </button>
          
          {/* User Profile Mock */}
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-xs font-bold text-white">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Admin User</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 bg-[#f4f5f7] rounded-[2rem] overflow-hidden shadow-2xl relative flex flex-col border border-white/10">
        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
