import { createContext, useContext, useState, useEffect } from "react";

const EMPLOYER_TOKEN_KEY = "nc_employer_token";

const EmployerAuthContext = createContext(null);

export function EmployerAuthProvider({ children }) {
  const [employerToken, setEmployerToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(EMPLOYER_TOKEN_KEY);
    if (stored) setEmployerToken(stored);
    setLoading(false);
  }, []);

  const employerLogin = (token) => {
    localStorage.setItem(EMPLOYER_TOKEN_KEY, token);
    setEmployerToken(token);
  };

  const employerLogout = () => {
    localStorage.removeItem(EMPLOYER_TOKEN_KEY);
    setEmployerToken(null);
  };

  return (
    <EmployerAuthContext.Provider value={{ employerToken, loading, employerLogin, employerLogout }}>
      {children}
    </EmployerAuthContext.Provider>
  );
}

export const useEmployerAuth = () => {
  const ctx = useContext(EmployerAuthContext);
  if (!ctx) throw new Error("useEmployerAuth must be used within EmployerAuthProvider");
  return ctx;
};
