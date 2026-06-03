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

export default function App() {
  const location = useLocation();
  
  // Hide global Navbar on these routes
  const hideNavbar = ["/login", "/register", "/home", "/my-arena", "/quiz", "/map", "/upload", "/leaderboard"].includes(location.pathname);
  
  // Hide global Footer on these routes
  const hideFooter = ["/login", "/register", "/home", "/my-arena", "/quiz", "/map", "/upload", "/leaderboard"].includes(location.pathname);
  
  // Show Mobile Bottom Nav only on the core app routes
  const showBottomNav = ["/home", "/my-arena", "/quiz", "/map", "/upload"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <CustomCursor />
      {!hideNavbar && <Navbar />}
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-arena" element={<MyArenaPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </main>

      {showBottomNav && <MobileBottomNav />}
      {!hideFooter && <Footer />}
    </div>
  );
}
