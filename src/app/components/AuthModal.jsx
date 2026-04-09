import { useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

/**
 * AuthModal
 * Props:
 *   open       – boolean
 *   onClose    – () => void
 *   onSuccess  – (session) => void   called after login or register
 *   reason     – string | null       shown above the form ("Please sign in to continue")
 *   defaultTab – "login" | "register"
 */
export function AuthModal({ open, onClose, onSuccess, reason, defaultTab = "login" }) {
  const { loginCustomer, register, loading, error } = useAuth();
  const [tab,     setTab]     = useState(defaultTab);
  const [showPwd, setShowPwd] = useState(false);
  const [form,    setForm]    = useState({ name:"", email:"", password:"", confirm:"" });
  const [localErr,setLocalErr]= useState("");

  if (!open) return null;

  const set = (k) => (e) => setForm(p => ({ ...p, [k]:e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalErr("");
    try {
      const s = await loginCustomer(form.email, form.password);
      onSuccess?.(s);
      onClose?.();
    } catch (err) {
      setLocalErr(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLocalErr("");
    if (form.password !== form.confirm) { setLocalErr("Passwords don't match"); return; }
    if (form.password.length < 6)        { setLocalErr("Password must be at least 6 characters"); return; }
    try {
      const s = await register(form.name, form.email, form.password);
      onSuccess?.(s);
      onClose?.();
    } catch (err) {
      setLocalErr(err.message);
    }
  };

  const inputStyle = {
    width:"100%", height:44, padding:"0 12px",
    borderRadius:10, border:"1.5px solid #E8D5A3",
    background:"#FFFDF7", fontSize:14, color:NAVY, outline:"none",
  };
  const labelStyle = {
    display:"block", fontSize:11, fontWeight:700,
    textTransform:"uppercase", letterSpacing:"0.1em",
    color:GOLD_D, marginBottom:5,
  };

  return (
    /* Backdrop */
    <div
      style={{
        position:"fixed", inset:0, zIndex:1000,
        background:"rgba(26,26,46,0.55)",
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div
        style={{
          width:"100%", maxWidth:420,
          background:"#fff", borderRadius:20,
          boxShadow:"0 24px 64px rgba(26,26,46,0.22)",
          overflow:"hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding:"20px 24px 0", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div>
            <div style={{ height:3, width:40, borderRadius:2, background:`linear-gradient(90deg,${GOLD},${GOLD_D})`, marginBottom:12 }} />
            {reason && (
              <p style={{ fontSize:12, color:"#888", marginBottom:6 }}>{reason}</p>
            )}
            <h2 style={{ fontSize:"1.2rem", fontWeight:700, color:NAVY, margin:0, letterSpacing:"-0.02em" }}>
              {tab === "login" ? "Sign in to your account" : "Create your account"}
            </h2>
          </div>
          <button type="button" onClick={onClose}
            style={{ background:"rgba(0,0,0,0.05)", border:"none", borderRadius:8, width:32, height:32, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <X style={{ width:16, height:16, color:"#666" }} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, padding:"16px 24px 0" }}>
          {["login","register"].map(t => (
            <button key={t} type="button" onClick={() => { setTab(t); setLocalErr(""); }}
              style={{
                flex:1, height:38, borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer",
                background: tab===t ? `linear-gradient(135deg,${GOLD},${GOLD_D})` : "rgba(201,169,110,0.07)",
                color: tab===t ? "#fff" : GOLD_D,
                border: tab===t ? "none" : `1px solid rgba(201,169,110,0.2)`,
                transition:"all .15s",
              }}>
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ padding:"20px 24px 24px" }}>
          {tab === "login" ? (
            <form onSubmit={handleLogin} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" required placeholder="your@email.com"
                  value={form.email} onChange={set("email")} style={inputStyle}
                  onFocus={e=>{e.target.style.borderColor=GOLD;}} onBlur={e=>{e.target.style.borderColor="#E8D5A3";}} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position:"relative" }}>
                  <input type={showPwd?"text":"password"} required placeholder="••••••••"
                    value={form.password} onChange={set("password")}
                    style={{ ...inputStyle, paddingRight:40 }}
                    onFocus={e=>{e.target.style.borderColor=GOLD;}} onBlur={e=>{e.target.style.borderColor="#E8D5A3";}} />
                  <button type="button" onClick={()=>setShowPwd(!showPwd)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#bbb" }}>
                    {showPwd ? <EyeOff style={{width:16,height:16}}/> : <Eye style={{width:16,height:16}}/>}
                  </button>
                </div>
              </div>
              {(localErr || error) && (
                <p style={{ fontSize:12, color:"#b91c1c", background:"#fee2e2", padding:"8px 12px", borderRadius:8, margin:0 }}>
                  {localErr || error}
                </p>
              )}
              <button type="submit" disabled={loading}
                style={{
                  height:44, borderRadius:12, fontWeight:700, fontSize:14,
                  background:`linear-gradient(135deg,${GOLD},${GOLD_D})`,
                  color:"#fff", border:"none", cursor:loading?"not-allowed":"pointer",
                  opacity:loading?0.7:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                }}>
                {loading ? <><Loader2 style={{width:16,height:16}} className="animate-spin"/>Signing in…</> : "Sign In"}
              </button>
              <p style={{ textAlign:"center", fontSize:13, color:"#888", margin:0 }}>
                No account?{" "}
                <button type="button" onClick={() => setTab("register")}
                  style={{ color:GOLD_D, fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>
                  Create one
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={labelStyle}>Full name</label>
                <input type="text" required placeholder="Youssef Alami"
                  value={form.name} onChange={set("name")} style={inputStyle}
                  onFocus={e=>{e.target.style.borderColor=GOLD;}} onBlur={e=>{e.target.style.borderColor="#E8D5A3";}} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" required placeholder="your@email.com"
                  value={form.email} onChange={set("email")} style={inputStyle}
                  onFocus={e=>{e.target.style.borderColor=GOLD;}} onBlur={e=>{e.target.style.borderColor="#E8D5A3";}} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <div style={{ position:"relative" }}>
                  <input type={showPwd?"text":"password"} required placeholder="Min. 6 characters"
                    value={form.password} onChange={set("password")}
                    style={{ ...inputStyle, paddingRight:40 }}
                    onFocus={e=>{e.target.style.borderColor=GOLD;}} onBlur={e=>{e.target.style.borderColor="#E8D5A3";}} />
                  <button type="button" onClick={()=>setShowPwd(!showPwd)}
                    style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#bbb" }}>
                    {showPwd ? <EyeOff style={{width:16,height:16}}/> : <Eye style={{width:16,height:16}}/>}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Confirm password</label>
                <input type="password" required placeholder="••••••••"
                  value={form.confirm} onChange={set("confirm")} style={inputStyle}
                  onFocus={e=>{e.target.style.borderColor=GOLD;}} onBlur={e=>{e.target.style.borderColor="#E8D5A3";}} />
              </div>
              {(localErr || error) && (
                <p style={{ fontSize:12, color:"#b91c1c", background:"#fee2e2", padding:"8px 12px", borderRadius:8, margin:0 }}>
                  {localErr || error}
                </p>
              )}
              <button type="submit" disabled={loading}
                style={{
                  height:44, borderRadius:12, fontWeight:700, fontSize:14,
                  background:`linear-gradient(135deg,${GOLD},${GOLD_D})`,
                  color:"#fff", border:"none", cursor:loading?"not-allowed":"pointer",
                  opacity:loading?0.7:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                }}>
                {loading ? <><Loader2 style={{width:16,height:16}} className="animate-spin"/>Creating account…</> : "Create Account"}
              </button>
              <p style={{ textAlign:"center", fontSize:13, color:"#888", margin:0 }}>
                Already have an account?{" "}
                <button type="button" onClick={() => setTab("login")}
                  style={{ color:GOLD_D, fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}