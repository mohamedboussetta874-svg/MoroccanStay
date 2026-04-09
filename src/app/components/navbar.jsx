import { Link, useLocation, useNavigate } from "react-router";
import { Moon, Sun, User, LogOut, ChevronDown } from "lucide-react";
import { BrandLockup } from "./brand-logo";
import { RoleSwitcher } from "./role-switcher";
import { AuthModal } from "./AuthModal";
import { useAuth } from "../hooks/useAuth";
import { useDarkMode } from "../context/DarkModeContext";
import { useState } from "react";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

export function Navbar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { role, isLoggedIn, session, logout } = useAuth();
  const { isDark, toggleDark } = useDarkMode();

  const [authOpen, setAuthOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/select-role", { replace: true });
  };

  if (location.pathname === "/select-role" || location.pathname === "/admin/login") return null;

  const onDark   = isDark;
  const muted    = onDark ? "rgba(255,255,255,0.48)" : "#666";
  const isAdmin  = role === "admin";
  const isCust   = role === "customer";

  return (
    <>
      <nav
        className="sticky top-0 z-50"
        style={{
          background: onDark ? NAVY : "#fff",
          borderBottom: onDark ? "1px solid rgba(201,169,110,0.15)" : "1px solid rgba(0,0,0,0.06)",
          boxShadow: onDark ? "0 2px 24px rgba(26,26,46,0.4)" : "0 1px 12px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ height:2, background:`linear-gradient(90deg,transparent,${GOLD}60,transparent)` }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            <BrandLockup />

            {/* Nav links */}
            <div className="flex items-center gap-1">
              {[
                { to:"/home",   label:"Home",           show:isCust  },
                { to:"/guide",  label:"Tourist Guides", show:isCust  },
                { to:"/search", label:"Browse",         show:isCust  },
                { to:"/admin",  label:"Dashboard",      show:isAdmin },
              ].filter(l => l.show).map(({ to, label }) => (
                <Link key={to} to={to} viewTransition
                  className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: isActive(to) ? GOLD_D : muted, textDecoration:"none" }}
                >
                  {label}
                  {isActive(to) && (
                    <span className="absolute bottom-1 left-4 right-4 h-[2px] rounded-full"
                      style={{ background:`linear-gradient(90deg,${GOLD},${GOLD_D})` }} />
                  )}
                </Link>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">

              {/* Dark toggle */}
              <button onClick={toggleDark}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: onDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                  border: onDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(201,169,110,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.background=onDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.04)"; }}
              >
                {onDark ? <Sun  className="w-4 h-4" style={{ color:GOLD }} />
                        : <Moon className="w-4 h-4" style={{ color:"#666" }} />}
              </button>

              {/* ── ADMIN ── */}
              {isAdmin && (
                <>
                  <RoleSwitcher />
                  <button onClick={handleLogout}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    style={{ color:muted, background:"transparent", border:"none", cursor:"pointer" }}
                    onMouseEnter={e => { e.currentTarget.style.color="#ef4444"; }}
                    onMouseLeave={e => { e.currentTarget.style.color=muted; }}
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </>
              )}

              {/* ── CUSTOMER ── */}
              {isCust && (
                <>
                  {isLoggedIn ? (
                    /* Logged in → avatar + name + logout */
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                        style={{ background:"rgba(201,169,110,0.08)", border:`1px solid rgba(201,169,110,0.2)` }}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, color:"#fff" }}>
                          {(session?.name || "?")[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium" style={{ color:GOLD_D }}>
                          {session?.name?.split(" ")[0]}
                        </span>
                      </div>
                      <button onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-colors"
                        style={{ color:muted, background:"transparent", border:"none", cursor:"pointer" }}
                        onMouseEnter={e => { e.currentTarget.style.color="#ef4444"; }}
                        onMouseLeave={e => { e.currentTarget.style.color=muted; }}
                      >
                        <LogOut className="w-3.5 h-3.5" /> Logout
                      </button>
                    </div>
                  ) : (
                    /* Not logged in → Login + Sign Up buttons */
                    <>
                      <button onClick={() => setAuthOpen(true)}
                        className="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                        style={{ color:muted, background:"transparent", border:"none", cursor:"pointer" }}
                        onMouseEnter={e => { e.currentTarget.style.color=onDark?"#fff":"#111"; }}
                        onMouseLeave={e => { e.currentTarget.style.color=muted; }}
                      >
                        Login
                      </button>
                      <button onClick={() => setAuthOpen(true)}
                        className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background:`linear-gradient(135deg,${GOLD},${GOLD_D})`,
                          color:"#fff", border:"none", cursor:"pointer",
                          boxShadow:"0 2px 12px rgba(139,105,20,0.25)",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.opacity=".88"; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity="1"; }}
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                  <RoleSwitcher />
                </>
              )}

              {/* ── NO ROLE ── */}
              {!role && (
                <>
                  <button onClick={() => setAuthOpen(true)}
                    className="px-4 py-2 rounded-xl text-sm font-medium"
                    style={{ color:muted, background:"transparent", border:"none", cursor:"pointer" }}
                  >
                    Login
                  </button>
                  <button onClick={() => setAuthOpen(true)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{
                      background:`linear-gradient(135deg,${GOLD},${GOLD_D})`,
                      color:"#fff", border:"none", cursor:"pointer",
                      boxShadow:"0 2px 12px rgba(139,105,20,0.25)",
                    }}
                  >
                    Sign Up
                  </button>
                  <Link to="/select-role" viewTransition>
                    <button className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{
                        background: onDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.04)",
                        border: onDark?"1px solid rgba(255,255,255,0.08)":"1px solid rgba(0,0,0,0.06)",
                      }}>
                      <User className="w-4 h-4" style={{ color:muted }} />
                    </button>
                  </Link>
                </>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* Auth modal — global */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => setAuthOpen(false)}
      />
    </>
  );
}