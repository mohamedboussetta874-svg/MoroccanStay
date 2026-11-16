import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import {
  Eye, EyeOff, Loader2, ArrowLeft,
  Star, MapPin, Shield, Hotel,
  CheckCircle, Globe, User, Building2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useDarkMode } from "../context/DarkModeContext";
import { BRAND_NAME } from "../brand";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";
const NAVY2  = "#16213E";

/* ── Moroccan cities shown on the left panel ── */
const DESTINATIONS = [
  { name:"Marrakech",   img:"photo-1551882547-ff40c63fe5fa", tag:"Imperial city"       },
  { name:"Chefchaouen", img:"photo-1496417262490-62ad7fcd3a4a", tag:"Blue city"         },
  { name:"Agadir",      img:"photo-1582719508461-905c673771fd", tag:"Atlantic coast"    },
];

/* ── Animated destination slideshow ── */
function DestinationSlide({ dest, active }) {
  return (
    <div style={{
      position:"absolute", inset:0,
      opacity: active ? 1 : 0,
      transition:"opacity 1.2s ease",
    }}>
      <img
        src={`https://images.unsplash.com/${dest.img}?auto=format&fit=crop&w=1200&q=80`}
        alt={dest.name}
        style={{ width:"100%", height:"100%", objectFit:"cover" }}
      />
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(160deg, rgba(26,26,46,0.75) 0%, rgba(26,26,46,0.45) 50%, rgba(26,26,46,0.82) 100%)",
      }}/>
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { loginAdmin, loginGuide, loginMiniAdmin, loginCustomer, register, loading, isLoggedIn, isAdmin, role } = useAuth();
  const { isDark } = useDarkMode();

  const [tab,      setTab]      = useState("login");
  const [showPwd,  setShowPwd]  = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [error,    setError]    = useState("");
  const [slideIdx, setSlideIdx] = useState(0);
  const [form,     setForm]     = useState({ name:"", email:"", password:"", confirm:"", accountRole:"customer" });

  /* Redirect if already logged in */
  useEffect(() => {
    if (isAdmin)    navigate("/admin", { replace:true });
    else if (role === "mini_admin" && isLoggedIn) navigate("/admin", { replace:true });
    else if (role === "guide" && isLoggedIn) navigate("/guide", { replace:true });
    else if (isLoggedIn) navigate("/home", { replace:true });
  }, [isLoggedIn, isAdmin, role, navigate]);

  /* Auto-slide destinations */
  useEffect(() => {
    const t = setInterval(() => setSlideIdx(i => (i+1) % DESTINATIONS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const set = (k) => (e) => { setForm(p => ({ ...p, [k]: e.target.value })); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (tab === "register") {
      if (form.password !== form.confirm) { setError("Passwords don't match"); return; }
      if (form.password.length < 6)       { setError("Password must be at least 6 characters"); return; }
      try {
        const session = await register(form.name, form.email, form.password, form.accountRole);
        navigate(session?.role === "mini_admin" ? "/admin" : "/home", { replace:true });
      } catch (err) { setError(err.message); }
      return;
    }
    /* Sign in — try admin first, then customer */
    try {
      await loginAdmin(form.email, form.password);
      navigate("/admin", { replace:true });
    } catch {
      try {
        await loginMiniAdmin(form.email, form.password);
        navigate("/admin", { replace:true });
      } catch {
        try {
          await loginGuide(form.email, form.password);
          navigate("/guide", { replace:true });
        } catch {
          try {
            await loginCustomer(form.email, form.password);
            navigate("/home", { replace:true });
          } catch { setError("Invalid email or password. Please try again."); }
        }
      }
    }
  };

  /* Shared input style */
  const pageBg = isDark ? "#0f172a" : "#FAFAF8";
  const surfaceBg = isDark ? "#172033" : "#FFFDF7";
  const softBg = isDark ? "#111827" : "#F0EDE8";
  const cardBg = isDark ? "rgba(23,32,51,0.9)" : "#fff";
  const textMain = isDark ? "#f8fafc" : NAVY;
  const textMuted = isDark ? "rgba(248,250,252,0.68)" : "#888";
  const textSoft = isDark ? "rgba(248,250,252,0.55)" : "#999";
  const borderSoft = isDark ? "rgba(201,169,110,0.18)" : "#EDE8DF";

  const inp = {
    width:"100%", height:48, padding:"0 44px 0 44px",
    borderRadius:12, fontSize:14, color:textMain, outline:"none",
    border:`1.5px solid ${isDark ? "rgba(201,169,110,0.28)" : "#E8D5A3"}`, background:surfaceBg,
    transition:"border-color .2s, box-shadow .2s",
    fontFamily:"inherit",
  };
  const onFocus = (e) => { e.target.style.borderColor=GOLD; e.target.style.boxShadow=`0 0 0 3px rgba(201,169,110,0.15)`; };
  const onBlur  = (e) => { e.target.style.borderColor=isDark ? "rgba(201,169,110,0.28)" : "#E8D5A3"; e.target.style.boxShadow="none"; };

  const Label = ({ children }) => (
    <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:GOLD_D, marginBottom:6 }}>
      {children}
    </label>
  );

  return (
    <div style={{ minHeight:"100vh", display:"flex", fontFamily:"var(--font-sans, sans-serif)" }}>

      {/* ══ LEFT PANEL — visual ══ */}
      <div className="hidden lg:flex"
        style={{ width:"48%", position:"relative", overflow:"hidden", flexDirection:"column", justifyContent:"space-between" }}>

        {/* Slideshow */}
        {DESTINATIONS.map((d, i) => (
          <DestinationSlide key={d.name} dest={d} active={i === slideIdx} />
        ))}

        {/* Gold top line */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,transparent,${GOLD},transparent)`, zIndex:10 }}/>

        {/* Top: brand */}
        <div style={{ position:"relative", zIndex:10, padding:"36px 40px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L16.2 10.5L24 7.5L18.5 14L24 20.5L16.2 17.5L14 26L11.8 17.5L4 20.5L9.5 14L4 7.5L11.8 10.5Z" fill={GOLD} opacity="0.95"/>
              <circle cx="14" cy="14" r="2.8" fill={GOLD_D}/>
            </svg>
            <div>
              <p style={{ fontSize:"1.15rem", fontWeight:700, color:"#fff", letterSpacing:"-0.02em", margin:0 }}>{BRAND_NAME}</p>
              <p style={{ fontSize:"0.6rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:GOLD, margin:0 }}>Premium Morocco</p>
            </div>
          </div>

          <h1 style={{ fontSize:"clamp(2rem,3.5vw,2.8rem)", fontWeight:700, color:"#fff", lineHeight:1.1, letterSpacing:"-0.03em", margin:0 }}>
            Discover Morocco's<br/>
            <span style={{
              background:`linear-gradient(90deg,${GOLD},#f0d080)`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>
              Finest Stays
            </span>
          </h1>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.55)", marginTop:14, lineHeight:1.7, maxWidth:340 }}>
            Hotels, riads and resorts across Morocco's most iconic destinations — imperial medinas to Atlantic shores.
          </p>
        </div>

        {/* Bottom: current destination + dots + stats */}
        <div style={{ position:"relative", zIndex:10, padding:"0 40px 36px" }}>

          {/* Destination badge */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            {DESTINATIONS.map((d, i) => (
              <button key={d.name} type="button" onClick={() => setSlideIdx(i)}
                style={{
                  background:"none", border:"none", cursor:"pointer", padding:0,
                  display:"flex", alignItems:"center", gap:6,
                  opacity: i===slideIdx ? 1 : 0.4,
                  transition:"opacity .3s",
                }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background: i===slideIdx ? GOLD : "#fff" }}/>
                {i===slideIdx && (
                  <span style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.85)" }}>
                    {d.name} <span style={{ color:GOLD, fontSize:10 }}>· {d.tag}</span>
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Stats row */}
          <div style={{ display:"flex", gap:24 }}>
            {[
              { val:"200+", label:"Properties"  },
              { val:"4.9",  label:"Avg. rating" },
              { val:"50K+", label:"Guests"      },
            ].map(({ val, label }) => (
              <div key={label}>
                <p style={{ fontSize:"1.3rem", fontWeight:700, color:"#fff", margin:0, letterSpacing:"-0.02em" }}>{val}</p>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:0 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div style={{
            marginTop:20, padding:"14px 16px", borderRadius:14,
            background:"rgba(255,255,255,0.07)",
            border:"1px solid rgba(255,255,255,0.1)",
            backdropFilter:"blur(10px)",
          }}>
            <div style={{ display:"flex", gap:2, marginBottom:8 }}>
              {[1,2,3,4,5].map(i=><Star key={i} style={{ width:12, height:12, fill:GOLD, color:GOLD }}/>)}
            </div>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", margin:"0 0 10px", fontStyle:"italic", lineHeight:1.55 }}>
              "The riad in Marrakech was absolutely breathtaking. Every detail was perfect."
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:NAVY }}>S</div>
              <div>
                <p style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.8)", margin:0 }}>Sarah Johnson</p>
                <p style={{ fontSize:10, color:"rgba(255,255,255,0.35)", margin:0, display:"flex", alignItems:"center", gap:3 }}>
                  <MapPin style={{width:9,height:9}}/> Marrakech · March 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — form ══ */}
      <div style={{
        flex:1, display:"flex", flexDirection:"column",
        background:pageBg, overflowY:"auto", color:textMain,
      }}>
        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"24px 40px 0" }}>
          <Link to="/home"
            style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:13, color:textSoft, textDecoration:"none", fontWeight:500, transition:"color .15s" }}
            onMouseEnter={e=>{e.currentTarget.style.color=GOLD_D;}}
            onMouseLeave={e=>{e.currentTarget.style.color=textSoft;}}>
            <ArrowLeft style={{width:14,height:14}}/> Back to home
          </Link>
          <div className="lg:hidden" style={{ display:"flex", alignItems:"center", gap:7 }}>
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L16.2 10.5L24 7.5L18.5 14L24 20.5L16.2 17.5L14 26L11.8 17.5L4 20.5L9.5 14L4 7.5L11.8 10.5Z" fill={GOLD}/>
              <circle cx="14" cy="14" r="2.5" fill={GOLD_D}/>
            </svg>
            <span style={{ fontSize:"0.95rem", fontWeight:700, color:textMain }}>{BRAND_NAME}</span>
          </div>
        </div>

        {/* Form container */}
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 40px" }}>
          <div style={{ width:"100%", maxWidth:420 }}>

            {/* Header */}
            <div style={{ marginBottom:28 }}>
              <div style={{ width:36, height:3, borderRadius:2, background:`linear-gradient(90deg,${GOLD},${GOLD_D})`, marginBottom:16 }}/>
              <h2 style={{ fontSize:"1.75rem", fontWeight:700, color:textMain, letterSpacing:"-0.025em", margin:"0 0 6px" }}>
                {tab==="login" ? "Welcome back" : "Create your account"}
              </h2>
              <p style={{ fontSize:14, color:textMuted, margin:0, lineHeight:1.6 }}>
                {tab==="login"
                  ? "Sign in to access your bookings and manage your stays."
                  : "Join thousands of travelers discovering Morocco with us."}
              </p>
            </div>

            {/* Tab switcher */}
            <div style={{
              display:"flex", gap:0, marginBottom:28,
              background:softBg, borderRadius:14, padding:4,
              border:`1px solid ${borderSoft}`,
            }}>
              {[
                { key:"login",    label:"Sign In",  icon:Hotel  },
                { key:"register", label:"Register", icon:Globe  },
              ].map(({ key, label, icon:Icon }) => {
                const active = tab===key;
                return (
                  <button key={key} type="button" onClick={() => { setTab(key); setError(""); }}
                    style={{
                      flex:1, height:42, borderRadius:10, fontSize:13, fontWeight:600,
                      display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                      cursor:"pointer", transition:"all .2s", border:"none",
                      background: active ? cardBg : "transparent",
                      color: active ? textMain : textSoft,
                      boxShadow: active ? "0 2px 8px rgba(26,26,46,0.08)" : "none",
                    }}>
                    <Icon style={{ width:14, height:14, color: active ? GOLD_D : textSoft }} />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:18 }}>

              {tab==="register" && (
                <div>
                  <Label>Full name</Label>
                  <div style={{ position:"relative" }}>
                    <Hotel style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", width:16, height:16, color:GOLD, pointerEvents:"none" }}/>
                    <input type="text" required placeholder="Youssef Alami" value={form.name}
                      onChange={set("name")} style={inp} onFocus={onFocus} onBlur={onBlur}/>
                  </div>
                </div>
              )}

              {tab==="register" && (
                <div>
                  <Label>Account type</Label>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                    {[
                      { value:"customer", label:"Client", icon:User },
                      { value:"mini_admin", label:"Directeur d'hotel", icon:Building2 },
                    ].map(({ value, label, icon:Icon }) => {
                      const active = form.accountRole === value;
                      return (
                        <button key={value} type="button" onClick={() => setForm(p=>({...p, accountRole:value}))}
                          style={{
                            height:46, borderRadius:12, border:`1.5px solid ${active ? GOLD : borderSoft}`,
                            background:active ? "rgba(201,169,110,0.12)" : surfaceBg,
                            color:active ? GOLD_D : textMuted, cursor:"pointer",
                            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                            fontSize:13, fontWeight:700,
                          }}>
                          <Icon style={{ width:15, height:15, color:active ? GOLD_D : textSoft }} />
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                <Label>Email address</Label>
                <div style={{ position:"relative" }}>
                  <svg style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", width:16, height:16, color:GOLD, pointerEvents:"none" }} viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
                  <input type="email" required placeholder="your@email.com" value={form.email}
                    onChange={set("email")} style={inp} onFocus={onFocus} onBlur={onBlur}/>
                </div>
              </div>

              <div>
                <Label>Password</Label>
                <div style={{ position:"relative" }}>
                  <Shield style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", width:16, height:16, color:GOLD, pointerEvents:"none" }}/>
                  <input type={showPwd?"text":"password"} required
                    placeholder={tab==="register"?"Min. 6 characters":"••••••••"}
                    value={form.password} onChange={set("password")}
                    style={{ ...inp, paddingRight:44 }} onFocus={onFocus} onBlur={onBlur}/>
                  <button type="button" onClick={()=>setShowPwd(!showPwd)}
                    style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:textSoft, padding:0, display:"flex" }}>
                    {showPwd ? <EyeOff style={{width:16,height:16}}/> : <Eye style={{width:16,height:16}}/>}
                  </button>
                </div>
              </div>

              {tab==="register" && (
                <div>
                  <Label>Confirm password</Label>
                  <div style={{ position:"relative" }}>
                    <Shield style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", width:16, height:16, color:GOLD, pointerEvents:"none" }}/>
                    <input type={showPwd2?"text":"password"} required placeholder="••••••••"
                      value={form.confirm} onChange={set("confirm")}
                      style={{ ...inp, paddingRight:44 }} onFocus={onFocus} onBlur={onBlur}/>
                    <button type="button" onClick={()=>setShowPwd2(!showPwd2)}
                      style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:textSoft, padding:0, display:"flex" }}>
                      {showPwd2 ? <EyeOff style={{width:16,height:16}}/> : <Eye style={{width:16,height:16}}/>}
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 14px", borderRadius:10, background:"#fee2e2", border:"1px solid #fecaca", fontSize:13, color:"#b91c1c" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{
                  height:50, borderRadius:14, fontWeight:700, fontSize:15,
                  background: loading ? "rgba(201,169,110,0.5)" : `linear-gradient(135deg,${GOLD} 0%,${GOLD_D} 100%)`,
                  color:"#fff", border:"none",
                  cursor: loading?"not-allowed":"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  boxShadow: loading ? "none" : "0 4px 20px rgba(139,105,20,0.35)",
                  letterSpacing:"0.03em", transition:"all .2s",
                  marginTop:4,
                }}
                onMouseEnter={e=>{if(!loading)e.currentTarget.style.boxShadow="0 6px 28px rgba(139,105,20,0.45)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow=loading?"none":"0 4px 20px rgba(139,105,20,0.35)";}}>
                {loading
                  ? <><Loader2 style={{width:17,height:17}} className="animate-spin"/> {tab==="login"?"Signing in…":"Creating account…"}</>
                  : tab==="login" ? "Sign In →" : "Create Account →"}
              </button>

              {/* Switch tab */}
              <p style={{ textAlign:"center", fontSize:13, color:textSoft, margin:0 }}>
                {tab==="login" ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={()=>{setTab(tab==="login"?"register":"login");setError("");}}
                  style={{ color:GOLD_D, fontWeight:700, background:"none", border:"none", cursor:"pointer", padding:0, textDecoration:"underline", textUnderlineOffset:2 }}>
                  {tab==="login" ? "Register here" : "Sign in"}
                </button>
              </p>
            </form>

            {/* Features list — register tab */}
            {tab==="register" && (
              <div style={{ marginTop:24, padding:"14px 16px", borderRadius:12, background:isDark ? "rgba(201,169,110,0.09)" : "rgba(201,169,110,0.06)", border:`1px solid rgba(201,169,110,0.18)` }}>
                <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:GOLD_D, marginBottom:10 }}>What you get</p>
                {(form.accountRole === "mini_admin"
                  ? ["Open the hotel dashboard","Manage hotel reservations","Track reviews and availability","Update hotel details"]
                  : ["Save and manage your reservations","Leave reviews after your stays","Book tourist guides","Exclusive member offers"]
                ).map(f=>(
                  <div key={f} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                    <CheckCircle style={{ width:14, height:14, color:GOLD, flexShrink:0 }}/>
                    <span style={{ fontSize:12, color:textMuted }}>{f}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Demo credentials — login tab */}
            {tab==="login" && (
              <div style={{ marginTop:22, padding:"14px 16px", borderRadius:12, background:isDark ? "rgba(201,169,110,0.09)" : "rgba(201,169,110,0.06)", border:`1px solid rgba(201,169,110,0.18)` }}>
                <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:GOLD_D, marginBottom:10 }}>Demo credentials</p>
                <div
                  onClick={() => setForm(p=>({...p, email:"admin@moroccanstay.com", password:"admin123"}))}
                  style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"9px 12px", borderRadius:10,
                    background:isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)", border:`1px solid ${borderSoft}`,
                    cursor:"pointer", transition:"background .15s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(201,169,110,0.1)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background=isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)";}}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Shield style={{ width:13, height:13, color:NAVY }}/>
                    </div>
                    <div>
                      <p style={{ fontSize:12, fontWeight:700, color:textMain, margin:0 }}>Admin account</p>
                      <p style={{ fontSize:11, color:textSoft, margin:0 }}>admin@moroccanstay.com</p>
                    </div>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, color:GOLD_D, background:"rgba(201,169,110,0.1)", padding:"3px 10px", borderRadius:20, border:`1px solid rgba(201,169,110,0.25)` }}>
                    Click to fill
                  </span>
                </div>
              </div>
            )}

            {/* Footer note */}
            <p style={{ textAlign:"center", fontSize:11, color:textSoft, marginTop:24 }}>
              By continuing, you agree to our{" "}
              <a href="#" style={{ color:GOLD_D, textDecoration:"none" }}>Terms of Service</a>
              {" "}and{" "}
              <a href="#" style={{ color:GOLD_D, textDecoration:"none" }}>Privacy Policy</a>.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
