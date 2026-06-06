import { createContext, useContext, useState, useEffect } from "react";

const ADMIN_TOKEN_KEY = "nc_admin_token";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [adminToken, setAdminToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (stored) setAdminToken(stored);
    setLoading(false);
  }, []);

  const adminLogin = (token) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    setAdminToken(token);
  };

  const adminLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminToken(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminToken, loading, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
};
