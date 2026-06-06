import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

/**
 * Protects admin routes.
 * If no admin token is present, redirects to /404 (not to the login page)
 * so that bad actors don't even know the admin login page exists.
 */
export default function AdminGuard({ children }) {
  const { adminToken, loading } = useAdminAuth();

  if (loading) return null; // wait for localStorage check

  if (!adminToken) {
    return <Navigate to="/404" replace />;
  }

  return children;
}
