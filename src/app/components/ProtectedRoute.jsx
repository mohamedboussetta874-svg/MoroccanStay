import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ Component }) {
  const { isAdmin, isMiniAdmin } = useAuth();
  if (!isAdmin && !isMiniAdmin) return <Navigate to="/login" replace />;
  return <Component />;
}
