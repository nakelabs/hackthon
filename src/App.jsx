import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import CustomCursor from "./components/ui/CustomCursor";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import MyArenaPage from "./pages/dashboard/MyArenaPage";
import QuizPage from "./pages/QuizPage";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import UploadPage from "./pages/UploadPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import CompendiumPage from "./pages/CompendiumPage";

// ── Admin ──────────────────────────────────────────────────────────────────────
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminGuard from "./pages/admin/AdminGuard";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPostsPage from "./pages/admin/AdminPostsPage";
import AdminQuizPage from "./pages/admin/AdminQuizPage";

// Thin wrapper: wraps a page in the shared admin sidebar layout + guard
function ProtectedAdminPage({ children }) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}

export default function App() {
  const location = useLocation();
  
  const isAdminRoute = location.pathname.startsWith("/control-deck");

  // Hide global Navbar / Footer / BottomNav on admin and other app routes
  const hideNavbar    = isAdminRoute || ["/login", "/register", "/home", "/my-arena", "/quiz", "/map", "/upload", "/leaderboard"].includes(location.pathname);
  const hideFooter    = isAdminRoute || ["/login", "/register", "/home", "/my-arena", "/quiz", "/map", "/upload", "/leaderboard"].includes(location.pathname);
  const showBottomNav = !isAdminRoute && ["/home", "/my-arena", "/quiz", "/map", "/upload"].includes(location.pathname);

  return (
    <AdminAuthProvider>
      <div className="flex flex-col min-h-screen">
        {/* Custom cursor only on non-admin routes */}
        {!isAdminRoute && <CustomCursor />}
        {!hideNavbar && <Navbar />}
        
        <main className="flex-1">
          <Routes>
            {/* ── Public routes ──────────────────────────────────────────── */}
            <Route path="/"            element={<LandingPage />} />
            <Route path="/login"       element={<LoginPage />} />
            <Route path="/register"    element={<RegisterPage />} />
            <Route path="/my-arena"    element={<MyArenaPage />} />
            <Route path="/quiz"        element={<QuizPage />} />
            <Route path="/home"        element={<HomePage />} />
            <Route path="/map"         element={<MapPage />} />
            <Route path="/upload"      element={<UploadPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/compendium"  element={<CompendiumPage />} />

            {/* ── Admin routes (obfuscated URL) ──────────────────────────── */}
            {/* Login page — accessible without a token */}
            <Route path="/control-deck"           element={<AdminLoginPage />} />
            {/* Protected pages — redirect to /404 if no admin token */}
            <Route path="/control-deck/dashboard" element={<ProtectedAdminPage><AdminDashboard /></ProtectedAdminPage>} />
            <Route path="/control-deck/posts"     element={<ProtectedAdminPage><AdminPostsPage /></ProtectedAdminPage>} />
            <Route path="/control-deck/quiz"      element={<ProtectedAdminPage><AdminQuizPage /></ProtectedAdminPage>} />

            {/* 404 catch-all */}
            <Route path="*" element={
              <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                  <p className="text-8xl font-black text-white/10 mb-4">404</p>
                  <p className="text-white/40 text-sm">Page not found.</p>
                </div>
              </div>
            } />
          </Routes>
        </main>

        {showBottomNav && <MobileBottomNav />}
        {!hideFooter && <Footer />}
      </div>
    </AdminAuthProvider>
  );
}
