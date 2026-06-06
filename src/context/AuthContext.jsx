import { createContext, useContext, useState, useEffect } from "react";
import {
  getStoredUser, persistAuth, clearAuth, getMe,
} from "../services/authService";
import { LS_TOKEN_KEY } from "../utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore from storage, then re-hydrate from /auth/me if we have a token
  useEffect(() => {
    const bootstrap = async () => {
      const stored = getStoredUser();
      if (stored) setUser(stored); // show something immediately

      const token = localStorage.getItem(LS_TOKEN_KEY);
      if (token) {
        try {
          const fresh = await getMe();
          setUser(fresh);
          localStorage.setItem("nc_user", JSON.stringify(fresh));
        } catch {
          // token expired or invalid — clear out
          clearAuth();
          setUser(null);
        }
      }
      setLoading(false);
    };
    bootstrap();
  }, []);

  const loginUser = (authData) => {
    persistAuth(authData);
    setUser(authData.user);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
