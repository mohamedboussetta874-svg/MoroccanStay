import { Link, useLocation, useNavigate } from "react-router";
import { Moon, Sun, LogOut } from "lucide-react";
import { BrandLockup } from "./brand-logo";
import { AuthModal } from "./AuthModal";
import { RoleSwitcher } from "./role-switcher";
import { useAuth } from "../hooks/useAuth";
import { useDarkMode } from "../context/DarkModeContext";
import { useState } from "react";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

export function Navbar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { role, isLoggedIn, isAdmin, isMiniAdmin, isVisitor, session, logout } = useAuth();
  const { isDark, toggleDark } = useDarkMode();
  const [authOpen, setAuthOpen] = useState(false);

  const isActive = (p) => location.pathname === p;

  /* Logout → stays on home as visitor */
  const handleLogout = () => {
    logout();
    navigate("/home", { replace: true });
  };

  /* Hide on login page */
  if (location.pathname === "/login") return null;

  const onDark  = isDark;
  const muted   = onDark ? "rgba(255,255,255,0.48)" : "#666";
  const canUseDashboard = isAdmin || isMiniAdmin;

  /* Nav links always shown for customers/visitors */
  const navLinks = [
    { to:"/home",   label:"Home"           },
    { to:"/search", label:"Browse Hotels"  },
    { to:"/guide",  label:"Tourist Guides", hideIfAdmin:true },
    { to:"/admin",  label:"Dashboard",      adminOnly:true   },
  ].filter(l => {
    if (l.adminOnly)   return canUseDashboard;
    if (l.hideIfAdmin) return !canUseDashboard;
    return true;
  });

  return (
    <>
      <nav
        className="sticky top-0 z-50"
        style={{
          background: onDark ? NAVY : "#fff",
          borderBottom: onDark
            ? "1px solid rgba(201,169,110,0.15)"
            : "1px solid rgba(0,0,0,0.06)",
          boxShadow: onDark
            ? "0 2px 24px rgba(26,26,46,0.4)"
            : "0 1px 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Gold top micro-line */}
        <div style={{ height:2, background:`linear-gradient(90deg,transparent,${GOLD}60,transparent)` }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <BrandLockup />

            {/* Nav links */}
            <div className="flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} viewTransition
                  className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: isActive(to) ? GOLD_D : muted, textDecoration:"none" }}
                >
                  {label}
                  {isActive(to) && (
                    <span
                      className="absolute bottom-1 left-4 right-4 h-[2px] rounded-full"
                      style={{ background:`linear-gradient(90deg,${GOLD},${GOLD_D})` }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">

              {/* Dark mode */}
              <button onClick={toggleDark}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: onDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                  border: onDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(201,169,110,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.background=onDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.04)"; }}
              >
                {onDark
                  ? <Sun  className="w-4 h-4" style={{ color:GOLD }} />
                  : <Moon className="w-4 h-4" style={{ color:"#666" }} />}
              </button>

              {/* ── ADMIN logged in ── */}
              {canUseDashboard && (
                <>
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                    style={{ background:"rgba(201,169,110,0.08)", border:`1px solid rgba(201,169,110,0.2)` }}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, color:NAVY }}>
                      {isMiniAdmin ? "M" : "A"}
                    </div>
                    <span className="text-sm font-medium" style={{ color:GOLD_D }}>
                      {isMiniAdmin ? "Mini-admin" : "Admin"}
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
                </>
              )}

              {/* ── CUSTOMER logged in ── */}
              {isLoggedIn && !canUseDashboard && (
                <>
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                    style={{ background:"rgba(201,169,110,0.08)", border:`1px solid rgba(201,169,110,0.2)` }}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, color:NAVY }}>
                      {(session?.name || "U")[0].toUpperCase()}
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
                </>
              )}

              {/* ── VISITOR (not logged in) ── */}
              {isVisitor && (
                <>
                  {/* Admin link — discrete */}
                  <Link to="/login"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      color: onDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
                      textDecoration:"none",
                      border:`1px solid ${onDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.07)"}`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color=GOLD_D; e.currentTarget.style.borderColor="rgba(201,169,110,0.4)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color=onDark?"rgba(255,255,255,0.25)":"rgba(0,0,0,0.25)"; e.currentTarget.style.borderColor=onDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.07)"; }}
                  >
                    Admin
                  </Link>

                  {/* Single Login button — gold style */}
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background:`linear-gradient(135deg,${GOLD},${GOLD_D})`,
                      color:"#fff", border:"none", cursor:"pointer",
                      boxShadow:"0 2px 12px rgba(139,105,20,0.25)",
                      letterSpacing:"0.02em",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity="0.88"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity="1"; }}
                  >
                    Login
                  </button>
                </>
              )}

            </div>
          </div>
        </div>
      </nav>

      {/* Global auth modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(s) => {
          setAuthOpen(false);
          if (s?.role === "admin" || s?.role === "mini_admin") navigate("/admin", { replace:true });
        }}
        allowRoleChoice
      />
    </>
  );
}
