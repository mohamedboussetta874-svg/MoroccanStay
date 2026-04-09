import { createContext, useState, useCallback, useEffect } from "react";

export const AuthContext = createContext(undefined);

const ADMIN_EMAIL    = "admin@moroccanstay.com";
const ADMIN_PASSWORD = "admin123";
const USERS_KEY      = "ms_users";       // registered users list
const SESSION_KEY    = "ms_session";     // current session

/* ── helpers ── */
const getUsers   = () => JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
const saveUsers  = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));
const getSession = () => JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
const saveSession= (s) => s
  ? localStorage.setItem(SESSION_KEY, JSON.stringify(s))
  : localStorage.removeItem(SESSION_KEY);

export function AuthProvider({ children }) {
  const [role,    setRoleState]      = useState(null);
  const [session, setSessionState]   = useState(null); // { id, name, email }
  const [loading, setLoading]        = useState(false);
  const [error,   setError]          = useState(null);

  /* ── Restore session on mount ── */
  useEffect(() => {
    const stored = getSession();
    if (stored) {
      setSessionState(stored);
      setRoleState(stored.role || "customer");
    }
  }, []);

  /* ── Admin login ── */
  const loginAdmin = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    await new Promise(r => setTimeout(r, 400));
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const s = { id:"admin", name:"Admin", email, role:"admin" };
      saveSession(s);
      setSessionState(s);
      setRoleState("admin");
      setLoading(false);
    } else {
      setError("Invalid credentials");
      setLoading(false);
      throw new Error("Invalid credentials");
    }
  }, []);

  /* ── Customer register ── */
  const register = useCallback(async (name, email, password) => {
    setLoading(true); setError(null);
    await new Promise(r => setTimeout(r, 400));
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      setError("Email already registered");
      setLoading(false);
      throw new Error("Email already registered");
    }
    const newUser = { id: `u_${Date.now()}`, name, email, password, role:"customer" };
    saveUsers([...users, newUser]);
    const s = { id:newUser.id, name, email, role:"customer" };
    saveSession(s);
    setSessionState(s);
    setRoleState("customer");
    setLoading(false);
    return s;
  }, []);

  /* ── Customer login ── */
  const loginCustomer = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    await new Promise(r => setTimeout(r, 400));
    const users = getUsers();
    const user  = users.find(u => u.email === email && u.password === password);
    if (!user) {
      setError("Invalid email or password");
      setLoading(false);
      throw new Error("Invalid credentials");
    }
    const s = { id:user.id, name:user.name, email:user.email, role:"customer" };
    saveSession(s);
    setSessionState(s);
    setRoleState("customer");
    setLoading(false);
    return s;
  }, []);

  /* ── Logout ── */
  const logout = useCallback(() => {
    saveSession(null);
    setSessionState(null);
    setRoleState(null);
    setError(null);
  }, []);

  /* ── setRole (for role-selection-page) ── */
  const setRole = useCallback((newRole) => {
    if (newRole === "customer" && !session) {
      /* just mark as customer visitor, no account yet */
      const s = { id:null, name:null, email:null, role:"customer" };
      saveSession(s);
      setSessionState(s);
    }
    setRoleState(newRole);
  }, [session]);

  const value = {
    /* state */
    role,
    session,           /* { id, name, email, role } | null */
    isLoggedIn: Boolean(session?.id),   /* has real account */
    isAdmin:    role === "admin" && Boolean(session?.id),
    isCustomer: role === "customer",
    loading,
    error,
    /* keep `user` for admin-dashboard compat */
    user: session?.email || null,
    /* actions */
    loginAdmin,
    loginCustomer,
    register,
    logout,
    setRole,
    /* legacy compat */
    login: loginAdmin,
    switchRole: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}