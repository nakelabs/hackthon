import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import CustomCursor from "./components/ui/CustomCursor";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import MyArenaPage from "./pages/dashboard/MyArenaPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import QuizPage from "./pages/QuizPage";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import UploadPage from "./pages/UploadPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import CompendiumPage from "./pages/CompendiumPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import UserSearchPage from "./pages/UserSearchPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import GoLivePage from "./pages/GoLivePage";
import LiveStreamsPage from "./pages/LiveStreamsPage";
import ViewStreamPage from "./pages/ViewStreamPage";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import ScrollToTop from "./components/ui/ScrollToTop";

// ── Admin ──────────────────────────────────────────────────────────────────────
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminGuard from "./pages/admin/AdminGuard";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPostsPage from "./pages/admin/AdminPostsPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminQuizPage from "./pages/admin/AdminQuizPage";
import AdminQuizSessionsPage from "./pages/admin/AdminQuizSessionsPage";
import AdminNomineesPage from "./pages/admin/AdminNomineesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

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
  const hideNavbar    = isAdminRoute || ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/home", "/my-arena", "/my-arena/settings", "/quiz", "/map", "/upload", "/go-live", "/leaderboard", "/search"].includes(location.pathname) || location.pathname.startsWith("/profile/") || location.pathname.startsWith("/live/");
  const hideFooter    = isAdminRoute || ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/home", "/my-arena", "/my-arena/settings", "/quiz", "/map", "/upload", "/go-live", "/leaderboard", "/search", "/live"].includes(location.pathname) || location.pathname.startsWith("/profile/") || location.pathname.startsWith("/live/");
  const showBottomNav = !isAdminRoute && ["/home", "/my-arena", "/quiz", "/map", "/upload", "/go-live", "/leaderboard"].includes(location.pathname);

  return (
    <AdminAuthProvider>
      <div className="flex flex-col min-h-screen">
        {/* Custom cursor only on non-admin routes */}
        {!isAdminRoute && <CustomCursor />}
        {!hideNavbar && <Navbar />}
        
        <main className="flex-1">
          <ErrorBoundary>
            <ScrollToTop />
            <Routes>
            {/* ── Public routes ──────────────────────────────────────────── */}
            <Route path="/"            element={<LandingPage />} />
            <Route path="/login"       element={<LoginPage />} />
            <Route path="/register"    element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password"  element={<ResetPasswordPage />} />
            <Route path="/my-arena"    element={<MyArenaPage />} />
            <Route path="/my-arena/settings" element={<SettingsPage />} />
            <Route path="/quiz"        element={<QuizPage />} />
            <Route path="/home"        element={<HomePage />} />
            <Route path="/map"         element={<MapPage />} />
            <Route path="/upload"      element={<UploadPage />} />
            <Route path="/go-live"     element={<GoLivePage />} />
            <Route path="/live"        element={<LiveStreamsPage />} />
            <Route path="/live/:channelName" element={<ViewStreamPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/compendium"  element={<CompendiumPage />} />
            <Route path="/search"      element={<UserSearchPage />} />
            <Route path="/profile/:userId" element={<PublicProfilePage />} />
            <Route path="/privacy"     element={<PrivacyPolicyPage />} />
            <Route path="/terms"       element={<TermsOfServicePage />} />

            {/* ── Admin routes (obfuscated URL) ──────────────────────────── */}
            {/* Login page — accessible without a token */}
            <Route path="/control-deck"           element={<AdminLoginPage />} />
            {/* Protected pages — redirect to /404 if no admin token */}
            <Route path="/control-deck/dashboard" element={<ProtectedAdminPage><AdminDashboard /></ProtectedAdminPage>} />
            <Route path="/control-deck/posts"     element={<ProtectedAdminPage><AdminPostsPage /></ProtectedAdminPage>} />
            <Route path="/control-deck/users"     element={<ProtectedAdminPage><AdminUsersPage /></ProtectedAdminPage>} />
            <Route path="/control-deck/categories" element={<ProtectedAdminPage><AdminCategoriesPage /></ProtectedAdminPage>} />
            <Route path="/control-deck/quiz/builder" element={<ProtectedAdminPage><AdminQuizPage /></ProtectedAdminPage>} />
            <Route path="/control-deck/quiz/sessions" element={<ProtectedAdminPage><AdminQuizSessionsPage /></ProtectedAdminPage>} />
            <Route path="/control-deck/nominees"  element={<ProtectedAdminPage><AdminNomineesPage /></ProtectedAdminPage>} />

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
          </ErrorBoundary>
        </main>

        {showBottomNav && <MobileBottomNav />}
        {!hideFooter && <Footer />}
      </div>
    </AdminAuthProvider>
  );
}
