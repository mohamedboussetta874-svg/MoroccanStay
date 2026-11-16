import { createContext, useState, useCallback, useEffect } from "react";
import { apiRequest, withApiFallback } from "../services/api-client";

export const AuthContext = createContext(undefined);

const ADMIN_EMAIL    = "admin@moroccanstay.com";
const ADMIN_PASSWORD = "admin123";
const USERS_KEY      = "ms_users";
const SESSION_KEY    = "ms_session";

const getUsers    = () => JSON.parse(localStorage.getItem(USERS_KEY)   || "[]");
const saveUsers   = (u) => localStorage.setItem(USERS_KEY,   JSON.stringify(u));
const getSession  = () => JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
const saveSession = (s) => s
  ? localStorage.setItem(SESSION_KEY, JSON.stringify(s))
  : localStorage.removeItem(SESSION_KEY);

export function AuthProvider({ children }) {
  const [role,    setRoleState] = useState("customer"); /* default: visitor can browse */
  const [session, setSession]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(null);

  /* Restore session on mount */
  useEffect(() => {
    const s = getSession();
    if (s) {
      setSession(s);
      setRoleState(s.role || "customer");
    }
    /* if no session → role stays "customer" so visitor can browse home */
  }, []);

  /* Admin login */
  const loginAdmin = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      const s = await withApiFallback(
        () => apiRequest("/auth/login", { method:"POST", body: JSON.stringify({ email, password, role:"admin" }) }),
        async () => {
          await new Promise(r => setTimeout(r, 400));
          if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            return { id:"admin", name:"Admin", email, role:"admin" };
          }
          throw new Error("Invalid credentials");
        }
      );
      saveSession(s); setSession(s); setRoleState("admin"); return s;
    } catch (e) {
      setError(e?.message || "Invalid credentials");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  /* Guide login */
  const loginGuide = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      const s = await withApiFallback(
        () => apiRequest("/auth/login", { method:"POST", body: JSON.stringify({ email, password, role:"guide" }) }),
        async () => {
          await new Promise(r => setTimeout(r, 400));
          const user = getUsers().find(u => u.email === email && u.password === password && u.role === "guide");
          if (!user) throw new Error("Invalid credentials");
          return { id:user.id, name:user.name, email:user.email, role:"guide" };
        }
      );
      saveSession(s); setSession(s); setRoleState("guide"); return s;
    } catch (e) {
      setError(e?.message || "Invalid email or password");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  /* Customer register */
  const register = useCallback(async (name, email, password, accountRole = "customer") => {
    setLoading(true); setError(null);
    const selectedRole = accountRole === "mini_admin" ? "mini_admin" : "customer";
    try {
      const s = await withApiFallback(
        () => apiRequest("/auth/register", { method:"POST", body: JSON.stringify({ name, email, password, role:selectedRole }) }),
        async () => {
          await new Promise(r => setTimeout(r, 400));
          const users = getUsers();
          if (users.find(u => u.email === email)) throw new Error("Email already registered");
          const nu = { id:`u_${Date.now()}`, name, email, password, role:selectedRole };
          saveUsers([...users, nu]);
          return { id:nu.id, name, email, role:selectedRole };
        }
      );
      saveSession(s); setSession(s); setRoleState(s.role || selectedRole); return s;
    } catch (e) {
      setError(e?.message || "Email already registered");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginMiniAdmin = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      const s = await withApiFallback(
        () => apiRequest("/auth/login", { method:"POST", body: JSON.stringify({ email, password, role:"mini_admin" }) }),
        async () => {
          await new Promise(r => setTimeout(r, 400));
          const user = getUsers().find(u => u.email === email && u.password === password && u.role === "mini_admin");
          if (!user) throw new Error("Invalid credentials");
          return { id:user.id, name:user.name, email:user.email, role:"mini_admin" };
        }
      );
      saveSession(s); setSession(s); setRoleState("mini_admin"); return s;
    } catch (e) {
      setError(e?.message || "Invalid email or password");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  /* Customer login */
  const loginCustomer = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      const s = await withApiFallback(
        () => apiRequest("/auth/login", { method:"POST", body: JSON.stringify({ email, password, role:"customer" }) }),
        async () => {
          await new Promise(r => setTimeout(r, 400));
          const user = getUsers().find(u => u.email === email && u.password === password && (u.role === "customer" || !u.role));
          if (!user) throw new Error("Invalid credentials");
          return { id:user.id, name:user.name, email:user.email, role:"customer" };
        }
      );
      saveSession(s); setSession(s); setRoleState("customer"); return s;
    } catch (e) {
      setError(e?.message || "Invalid email or password");
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  /* Logout → visitor mode (can still browse) */
  const logout = useCallback(() => {
    saveSession(null);
    setSession(null);
    setRoleState("customer"); /* stay as visitor, don't lock out of home */
    setError(null);
  }, []);

  /* Legacy compat */
  const setRole      = useCallback((r) => setRoleState(r), []);
  const switchRole   = logout;

  const value = {
    role,
    session,
    loading,
    error,
    isLoggedIn:  Boolean(session?.id),
    isAdmin:     role === "admin" && Boolean(session?.id),
    isMiniAdmin: role === "mini_admin" && Boolean(session?.id),
    isGuide:     role === "guide" && Boolean(session?.id),
    isCustomer:  role === "customer",
    isVisitor:   role === "customer" && !session?.id,
    user:        session?.email || null,
    loginAdmin,
    loginGuide,
    loginMiniAdmin,
    loginCustomer,
    register,
    logout,
    setRole,
    switchRole,
    login: loginAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
