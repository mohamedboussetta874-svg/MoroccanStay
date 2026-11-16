import { useState } from "react";
import { X, Eye, EyeOff, Loader2, Shield, Hotel, CheckCircle, Globe, User, Building2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDarkMode } from "../context/DarkModeContext";
import { BRAND_NAME } from "../brand";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

/**
 * AuthModal
 * Props:
 *   open       – boolean
 *   onClose    – () => void
 *   onSuccess  – (session) => void
 *   reason     – string | null   shown above the form
 *   defaultTab – "login" | "register"
 */
export function AuthModal({ open, onClose, onSuccess, reason, defaultTab = "login", allowRoleChoice = false }) {
  const { loginCustomer, loginMiniAdmin, register, loading } = useAuth();
  const { isDark } = useDarkMode();

  const [tab,     setTab]     = useState(defaultTab);
  const [showPwd, setShowPwd] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [error,   setError]   = useState("");
  const [form,    setForm]    = useState({ name:"", email:"", password:"", confirm:"", accountRole:"customer" });

  if (!open) return null;

  const modalBg = isDark ? "#172033" : "#FAFAF8";
  const surfaceBg = isDark ? "#111827" : "#FFFDF7";
  const switchBg = isDark ? "#111827" : "#EEEBE6";
  const activeBg = isDark ? "rgba(255,255,255,0.06)" : "#fff";
  const textMain = isDark ? "#f8fafc" : NAVY;
  const textMuted = isDark ? "rgba(248,250,252,0.68)" : "#888";
  const textSoft = isDark ? "rgba(248,250,252,0.55)" : "#aaa";
  const borderSoft = isDark ? "rgba(201,169,110,0.18)" : "#E8E3DC";

  const set = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (tab === "register") {
      if (form.password !== form.confirm) { setError("Passwords don't match"); return; }
      if (form.password.length < 6)       { setError("Password must be at least 6 characters"); return; }
      try {
        const s = await register(form.name, form.email, form.password, allowRoleChoice ? form.accountRole : "customer");
        onSuccess?.(s); onClose?.();
      } catch (err) { setError(err.message); }
      return;
    }
    try {
      const s = await loginCustomer(form.email, form.password);
      onSuccess?.(s); onClose?.();
    } catch (err) {
      if (!allowRoleChoice) {
        setError(err.message || "Invalid email or password");
        return;
      }
      try {
        const s = await loginMiniAdmin(form.email, form.password);
        onSuccess?.(s); onClose?.();
      } catch (miniAdminErr) {
        setError(miniAdminErr.message || "Invalid email or password");
      }
    }
  };

  const inp = {
    width:"100%", height:44, padding:"0 42px",
    borderRadius:11, border:`1.5px solid ${isDark ? "rgba(201,169,110,0.28)" : "#E8D5A3"}`,
    background:surfaceBg, fontSize:14, color:textMain,
    outline:"none", fontFamily:"inherit", transition:"border-color .2s, box-shadow .2s",
  };
  const onFocus = (e) => { e.target.style.borderColor=GOLD; e.target.style.boxShadow=`0 0 0 3px rgba(201,169,110,0.12)`; };
  const onBlur  = (e) => { e.target.style.borderColor=isDark ? "rgba(201,169,110,0.28)" : "#E8D5A3"; e.target.style.boxShadow="none"; };

  const FieldIcon = ({ icon:Icon }) => (
    <Icon style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", width:15, height:15, color:GOLD, pointerEvents:"none" }}/>
  );

  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"rgba(26,26,46,0.6)", backdropFilter:"blur(4px)" }}
      onClick={e => { if (e.target===e.currentTarget) onClose?.(); }}
    >
      <div
        style={{ width:"100%", maxWidth:440, background:modalBg, color:textMain, borderRadius:22, boxShadow:isDark ? "0 32px 80px rgba(0,0,0,0.45)" : "0 32px 80px rgba(26,26,46,0.25)", overflow:"hidden", position:"relative", border:isDark ? "1px solid rgba(201,169,110,0.16)" : "none" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Gold top accent */}
        <div style={{ height:3, background:`linear-gradient(90deg,transparent,${GOLD},${GOLD_D},transparent)` }}/>

        {/* Header */}
        <div style={{ padding:"22px 28px 0", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div>
            {/* Brand mini */}
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:14 }}>
              <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L16.2 10.5L24 7.5L18.5 14L24 20.5L16.2 17.5L14 26L11.8 17.5L4 20.5L9.5 14L4 7.5L11.8 10.5Z" fill={GOLD}/>
                <circle cx="14" cy="14" r="2.5" fill={GOLD_D}/>
              </svg>
              <span style={{ fontSize:13, fontWeight:700, color:textMain, letterSpacing:"-0.01em" }}>{BRAND_NAME}</span>
            </div>

            {reason && (
              <div style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 12px", borderRadius:8, background:"rgba(201,169,110,0.08)", border:`1px solid rgba(201,169,110,0.2)`, marginBottom:12 }}>
                <CheckCircle style={{ width:13, height:13, color:GOLD_D, flexShrink:0 }}/>
                <p style={{ fontSize:12, color:GOLD_D, margin:0, lineHeight:1.4 }}>{reason}</p>
              </div>
            )}

            <h2 style={{ fontSize:"1.3rem", fontWeight:700, color:textMain, letterSpacing:"-0.02em", margin:0 }}>
              {tab==="login" ? "Sign in to continue" : "Create your account"}
            </h2>
            <p style={{ fontSize:13, color:textMuted, margin:"4px 0 0" }}>
              {tab==="login" ? "Access your bookings and reservations." : "Join and start booking your Moroccan stay."}
            </p>
          </div>

          <button type="button" onClick={onClose}
            style={{ width:32, height:32, borderRadius:8, background:isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginLeft:12 }}>
            <X style={{ width:15, height:15, color:textMuted }}/>
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ padding:"16px 28px 0" }}>
          <div style={{ display:"flex", gap:0, background:switchBg, borderRadius:12, padding:3, border:`1px solid ${borderSoft}` }}>
            {[
              { key:"login",    label:"Sign In",  icon:Hotel },
              { key:"register", label:"Register", icon:Globe },
            ].map(({ key, label, icon:Icon }) => {
              const active = tab===key;
              return (
                <button key={key} type="button" onClick={()=>{setTab(key);setError("");}}
                  style={{
                    flex:1, height:38, borderRadius:9, fontSize:13, fontWeight:600,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                    cursor:"pointer", transition:"all .18s", border:"none",
                    background: active ? activeBg : "transparent",
                    color: active ? textMain : textSoft,
                    boxShadow: active ? "0 2px 8px rgba(26,26,46,0.08)" : "none",
                  }}>
                  <Icon style={{ width:13, height:13, color:active?GOLD_D:textSoft }}/>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div style={{ padding:"20px 28px 26px" }}>
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {tab==="register" && (
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:GOLD_D, marginBottom:5 }}>Full name</label>
                <div style={{ position:"relative" }}>
                  <FieldIcon icon={Hotel}/>
                  <input type="text" required placeholder="Youssef Alami" value={form.name} onChange={set("name")} style={inp} onFocus={onFocus} onBlur={onBlur}/>
                </div>
              </div>
            )}

            {tab==="register" && allowRoleChoice && (
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:GOLD_D, marginBottom:5 }}>Account type</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    { value:"customer", label:"Client", icon:User },
                    { value:"mini_admin", label:"Directeur", icon:Building2 },
                  ].map(({ value, label, icon:Icon }) => {
                    const active = form.accountRole === value;
                    return (
                      <button key={value} type="button" onClick={() => setForm(p=>({...p, accountRole:value}))}
                        style={{
                          height:40, borderRadius:10, border:`1.5px solid ${active ? GOLD : borderSoft}`,
                          background:active ? "rgba(201,169,110,0.12)" : surfaceBg,
                          color:active ? GOLD_D : textMuted, cursor:"pointer",
                          display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                          fontSize:12, fontWeight:700,
                        }}>
                        <Icon style={{ width:14, height:14, color:active ? GOLD_D : textSoft }} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:GOLD_D, marginBottom:5 }}>Email</label>
              <div style={{ position:"relative" }}>
                <svg style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", width:15, height:15, pointerEvents:"none" }} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                <input type="email" required placeholder="your@email.com" value={form.email} onChange={set("email")} style={inp} onFocus={onFocus} onBlur={onBlur}/>
              </div>
            </div>

            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:GOLD_D, marginBottom:5 }}>Password</label>
              <div style={{ position:"relative" }}>
                <FieldIcon icon={Shield}/>
                <input type={showPwd?"text":"password"} required placeholder="••••••••" value={form.password} onChange={set("password")} style={{ ...inp, paddingRight:42 }} onFocus={onFocus} onBlur={onBlur}/>
                <button type="button" onClick={()=>setShowPwd(!showPwd)}
                  style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:textSoft, padding:0, display:"flex" }}>
                  {showPwd?<EyeOff style={{width:15,height:15}}/>:<Eye style={{width:15,height:15}}/>}
                </button>
              </div>
            </div>

            {tab==="register" && (
              <div>
                <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:GOLD_D, marginBottom:5 }}>Confirm password</label>
                <div style={{ position:"relative" }}>
                  <FieldIcon icon={Shield}/>
                  <input type={showPw2?"text":"password"} required placeholder="••••••••" value={form.confirm} onChange={set("confirm")} style={{ ...inp, paddingRight:42 }} onFocus={onFocus} onBlur={onBlur}/>
                  <button type="button" onClick={()=>setShowPw2(!showPw2)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:textSoft, padding:0, display:"flex" }}>
                    {showPw2?<EyeOff style={{width:15,height:15}}/>:<Eye style={{width:15,height:15}}/>}
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 13px", borderRadius:9, background:"#fee2e2", border:"1px solid #fecaca", fontSize:12, color:"#b91c1c" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{
                height:46, borderRadius:13, fontWeight:700, fontSize:14,
                background: loading ? "rgba(201,169,110,0.45)" : `linear-gradient(135deg,${GOLD},${GOLD_D})`,
                color:"#fff", border:"none", cursor:loading?"not-allowed":"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow: loading?"none":"0 4px 18px rgba(139,105,20,0.3)",
                letterSpacing:"0.03em", marginTop:4,
                transition:"all .2s",
              }}
              onMouseEnter={e=>{if(!loading)e.currentTarget.style.boxShadow="0 6px 24px rgba(139,105,20,0.42)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow=loading?"none":"0 4px 18px rgba(139,105,20,0.3)";}}>
              {loading
                ? <><Loader2 style={{width:15,height:15}} className="animate-spin"/>{tab==="login"?"Signing in…":"Creating account…"}</>
                : tab==="login" ? "Sign In →" : "Create Account →"}
            </button>

            <p style={{ textAlign:"center", fontSize:12, color:textSoft, margin:0 }}>
              {tab==="login" ? "No account? " : "Already registered? "}
              <button type="button" onClick={()=>{setTab(tab==="login"?"register":"login");setError("");}}
                style={{ color:GOLD_D, fontWeight:700, background:"none", border:"none", cursor:"pointer", padding:0, textDecoration:"underline", textUnderlineOffset:2 }}>
                {tab==="login" ? "Register here" : "Sign in"}
              </button>
            </p>
          </form>

          {/* Register benefits */}
          {tab==="register" && (
            <div style={{ marginTop:16, padding:"12px 14px", borderRadius:10, background:isDark ? "rgba(201,169,110,0.09)" : "rgba(201,169,110,0.06)", border:`1px solid rgba(201,169,110,0.15)` }}>
              {["Manage your reservations","Leave reviews","Book tourist guides","Exclusive offers"].map(f=>(
                <div key={f} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:6 }}>
                  <CheckCircle style={{ width:12, height:12, color:GOLD, flexShrink:0 }}/>
                  <span style={{ fontSize:11, color:textMuted }}>{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
