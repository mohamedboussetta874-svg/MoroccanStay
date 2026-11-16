import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function RootRedirect() {
  const { role, isLoggedIn } = useAuth();

  if ((role === "admin" || role === "mini_admin") && isLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  if (role === "guide" && isLoggedIn) return <Navigate to="/guide" replace />;

  return <Navigate to="/home" replace />;
}
