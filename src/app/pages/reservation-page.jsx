import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  Calendar, Users, Mail, Phone, User,
  ChevronLeft, MapPin, Star, CheckCircle,
  UserCheck, Info,
} from "lucide-react";
import { Navbar } from "../components/navbar";
import { AuthModal } from "../components/AuthModal";
import { hotels } from "../data/hotels";
import { formatMad } from "../lib/currency";
import { useAuth } from "../hooks/useAuth";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

const GUIDES = [
  { id:"g1", name:"Hassan Benjelloun", city:"Marrakech",    lang:"French, English",  rate:120, rating:4.9 },
  { id:"g2", name:"Khadija Amrani",    city:"Fès",          lang:"French, Arabic",   rate:95,  rating:4.8 },
  { id:"g3", name:"Younes Filali",     city:"Chefchaouen",  lang:"English, Spanish", rate:110, rating:4.7 },
  { id:"g4", name:"Nadia Laarbi",      city:"Casablanca",   lang:"French, Arabic",   rate:100, rating:4.9 },
];

function FieldLabel({ children }) {
  return (
    <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:GOLD_D, marginBottom:6 }}>
      {children}
    </label>
  );
}
function StyledInput({ icon:Icon, ...props }) {
  return (
    <div style={{ position:"relative" }}>
      {Icon && <Icon style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", width:16, height:16, color:GOLD, pointerEvents:"none" }} />}
      <input
        {...props}
        style={{
          width:"100%", height:44,
          padding:`0 14px 0 ${Icon ? "40px" : "14px"}`,
          borderRadius:12, border:"1.5px solid #E8D5A3",
          background:"#FFFDF7", fontSize:14, color:NAVY, outline:"none",
          ...props.style,
        }}
        onFocus={e => { e.target.style.borderColor=GOLD; e.target.style.boxShadow="0 0 0 3px rgba(201,169,110,0.1)"; }}
        onBlur={e  => { e.target.style.borderColor="#E8D5A3"; e.target.style.boxShadow="none"; }}
      />
    </div>
  );
}

export function ReservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, session } = useAuth();

  const hotel = hotels.find(h => h.id === id);

  const [form, setForm] = useState({
    fullName:  session?.name  || "",
    email:     session?.email || "",
    phone:     "",
    checkIn:   "2026-05-10",
    checkOut:  "2026-05-13",
    guests:    "2",
  });

  /* Guide option */
  const [wantsGuide,   setWantsGuide]   = useState(false);
  const [selectedGuide,setSelectedGuide]= useState(null);

  /* Auth modal */
  const [authOpen, setAuthOpen] = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]:e.target.value }));

  if (!hotel) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, background:"#FAFAF8" }}>
        <p style={{ fontSize:"1.2rem", fontWeight:700, color:NAVY }}>Property not found</p>
        <Link to="/home"><button style={{ padding:"10px 24px", borderRadius:12, background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, color:"#fff", border:"none", cursor:"pointer" }}>Back to Home</button></Link>
      </div>
    );
  }

  const selectedRoom = hotel.rooms[0];
  const nights = Math.max(1, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000));
  const subtotal   = selectedRoom.price * nights;
  const serviceFee = Math.round(subtotal * 0.1);
  const guideTotal = wantsGuide && selectedGuide ? selectedGuide.rate * 8 : 0;
  const total      = subtotal + serviceFee + guideTotal;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setAuthOpen(true);
      return;
    }
    navigate(`/payment/${hotel.id}`, { viewTransition:true });
  };

  const handleAuthSuccess = () => {
    setAuthOpen(false);
    /* pre-fill name/email from session after login */
    navigate(`/payment/${hotel.id}`, { viewTransition:true });
  };

  return (
    <div style={{ minHeight:"100vh", background:"#FAFAF8" }}>
      <Navbar />

      {/* Auth modal */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        reason="Sign in or create an account to complete your reservation."
      />

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"40px 24px" }}>

        {/* Breadcrumb */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28, fontSize:13 }}>
          <Link to={`/hotel/${hotel.id}`} style={{ display:"flex", alignItems:"center", gap:4, color:GOLD_D, fontWeight:600, textDecoration:"none" }}>
            <ChevronLeft style={{ width:16, height:16 }} /> Back
          </Link>
          <span style={{ color:GOLD }}>·</span>
          <span style={{ color:"#999" }}>Reservation</span>
        </div>

        <h1 style={{ fontSize:"1.6rem", fontWeight:700, color:NAVY, letterSpacing:"-0.02em", marginBottom:28 }}>
          Complete your reservation
        </h1>

        {/* Login gate banner — shown only if not logged in */}
        {!isLoggedIn && (
          <div
            style={{
              display:"flex", alignItems:"center", gap:12, padding:"14px 18px",
              borderRadius:14, marginBottom:24,
              background:"rgba(201,169,110,0.08)",
              border:`1px solid rgba(201,169,110,0.3)`,
            }}
          >
            <Info style={{ width:18, height:18, color:GOLD, flexShrink:0 }} />
            <p style={{ fontSize:13, color:GOLD_D, flex:1, margin:0 }}>
              You need an account to make a reservation. You can sign in or register when you click "Continue to payment".
            </p>
            <button type="button" onClick={() => setAuthOpen(true)}
              style={{ padding:"7px 16px", borderRadius:10, background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, color:"#fff", border:"none", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0 }}>
              Sign in now
            </button>
          </div>
        )}

        {/* Logged in as */}
        {isLoggedIn && (
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", borderRadius:12, marginBottom:20, background:"#dcfce7", border:"1px solid #bbf7d0" }}>
            <CheckCircle style={{ width:16, height:16, color:"#15803d", flexShrink:0 }} />
            <p style={{ fontSize:13, color:"#15803d", margin:0 }}>
              Logged in as <strong>{session?.name}</strong> ({session?.email})
            </p>
          </div>
        )}

        <div style={{ display:"grid", gridTemplateColumns:"1fr minmax(0,380px)", gap:28, alignItems:"start" }}>

          {/* ── LEFT: form ── */}
          <div>
            <div style={{ background:"#fff", borderRadius:20, padding:28, border:"1px solid #EDE8DF", boxShadow:"0 2px 16px rgba(26,26,46,0.05)", marginBottom:20 }}>
              <div style={{ height:3, borderRadius:2, background:`linear-gradient(90deg,${GOLD},${GOLD_D})`, marginBottom:22 }} />
              <h2 style={{ fontSize:"1.05rem", fontWeight:700, color:NAVY, marginBottom:20 }}>Contact details</h2>

              <form id="res-form" onSubmit={handleSubmit}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  <div style={{ gridColumn:"1/-1" }}>
                    <FieldLabel>Full name</FieldLabel>
                    <StyledInput icon={User} type="text" placeholder="Youssef Alami" value={form.fullName} onChange={set("fullName")} required />
                  </div>
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <StyledInput icon={Mail} type="email" placeholder="your@email.com" value={form.email} onChange={set("email")} required />
                  </div>
                  <div>
                    <FieldLabel>Phone</FieldLabel>
                    <StyledInput icon={Phone} type="tel" placeholder="+212 6 12 34 56 78" value={form.phone} onChange={set("phone")} required />
                  </div>
                  <div>
                    <FieldLabel>Check-in</FieldLabel>
                    <StyledInput icon={Calendar} type="date" value={form.checkIn} onChange={set("checkIn")} required />
                  </div>
                  <div>
                    <FieldLabel>Check-out</FieldLabel>
                    <StyledInput icon={Calendar} type="date" value={form.checkOut} onChange={set("checkOut")} required />
                  </div>
                  <div>
                    <FieldLabel>Guests</FieldLabel>
                    <StyledInput icon={Users} type="number" min="1" value={form.guests} onChange={set("guests")} required />
                  </div>
                </div>
              </form>
            </div>

            {/* ── Guide option ── */}
            <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1px solid #EDE8DF", boxShadow:"0 2px 16px rgba(26,26,46,0.05)" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: wantsGuide ? 20 : 0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:"rgba(201,169,110,0.1)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <UserCheck style={{ width:18, height:18, color:GOLD }} />
                  </div>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:NAVY, margin:0 }}>Add a tourist guide</p>
                    <p style={{ fontSize:11, color:"#999", margin:0 }}>Optional — explore Morocco with a local expert</p>
                  </div>
                </div>
                {/* Toggle */}
                <button type="button"
                  onClick={() => { setWantsGuide(!wantsGuide); setSelectedGuide(null); }}
                  style={{
                    width:46, height:26, borderRadius:13,
                    background: wantsGuide ? `linear-gradient(135deg,${GOLD},${GOLD_D})` : "#e5e7eb",
                    border:"none", cursor:"pointer", position:"relative", transition:"background .2s", flexShrink:0,
                  }}
                >
                  <div style={{
                    position:"absolute", top:3,
                    left: wantsGuide ? 23 : 3,
                    width:20, height:20, borderRadius:"50%",
                    background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.15)",
                    transition:"left .2s",
                  }} />
                </button>
              </div>

              {wantsGuide && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {GUIDES.map(g => {
                    const isSel = selectedGuide?.id === g.id;
                    return (
                      <div key={g.id} onClick={() => setSelectedGuide(isSel ? null : g)}
                        style={{
                          padding:"12px 14px", borderRadius:12, cursor:"pointer", transition:"all .15s",
                          background: isSel ? "rgba(201,169,110,0.08)" : "#FAFAF8",
                          border: isSel ? `1.5px solid ${GOLD}` : "1.5px solid #EDE8DF",
                        }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
                          <p style={{ fontSize:13, fontWeight:700, color:NAVY, margin:0 }}>{g.name}</p>
                          {isSel && <CheckCircle style={{ width:14, height:14, color:GOLD_D }} />}
                        </div>
                        <p style={{ fontSize:11, color:"#888", margin:"0 0 4px" }}>
                          <MapPin style={{ width:10, height:10, display:"inline", marginRight:3 }} />{g.city}
                        </p>
                        <p style={{ fontSize:11, color:"#aaa", margin:"0 0 6px" }}>{g.lang}</p>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                          <span style={{ fontSize:12, fontWeight:700, color:GOLD_D }}>{g.rate} Dh/hr</span>
                          <div style={{ display:"flex", alignItems:"center", gap:3, background:"rgba(201,169,110,0.1)", padding:"1px 7px", borderRadius:20 }}>
                            <Star style={{ width:9, height:9, fill:GOLD, color:GOLD }} />
                            <span style={{ fontSize:10, fontWeight:600, color:GOLD_D }}>{g.rating}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: summary ── */}
          <div style={{ position:"sticky", top:88 }}>
            <div style={{ background:"#fff", borderRadius:20, padding:22, border:"1px solid #EDE8DF", boxShadow:"0 8px 32px rgba(26,26,46,0.08)" }}>
              <div style={{ height:3, borderRadius:2, background:`linear-gradient(90deg,${GOLD},${GOLD_D})`, marginBottom:18 }} />

              {/* Hotel preview */}
              <div style={{ marginBottom:16 }}>
                <div style={{ borderRadius:12, overflow:"hidden", height:110, marginBottom:10 }}>
                  <img src={hotel.image} alt={hotel.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                </div>
                <p style={{ fontSize:14, fontWeight:700, color:NAVY, margin:"0 0 3px" }}>{hotel.name}</p>
                <p style={{ fontSize:11, color:GOLD_D, margin:0, display:"flex", alignItems:"center", gap:4 }}>
                  <MapPin style={{ width:10, height:10 }} />{hotel.location}
                </p>
              </div>

              {/* Details */}
              <div style={{ background:"#FFFDF7", borderRadius:12, padding:"10px 14px", marginBottom:14, border:"1px solid #EDE8DF" }}>
                {[
                  ["Room",     selectedRoom.name],
                  ["Check-in", form.checkIn],
                  ["Check-out",form.checkOut],
                  ["Nights",   nights],
                  ["Guests",   form.guests],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
                    <span style={{ color:"#999" }}>{k}</span>
                    <span style={{ fontWeight:600, color:NAVY }}>{v}</span>
                  </div>
                ))}
                {wantsGuide && selectedGuide && (
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginTop:6, paddingTop:6, borderTop:"1px solid #EDE8DF" }}>
                    <span style={{ color:"#999" }}>Guide</span>
                    <span style={{ fontWeight:600, color:GOLD_D }}>{selectedGuide.name}</span>
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div style={{ fontSize:13, marginBottom:14 }}>
                {[
                  [`${formatMad(selectedRoom.price)} × ${nights} night${nights>1?"s":""}`, formatMad(subtotal)],
                  ["Service fee (10%)", formatMad(serviceFee)],
                  ...(guideTotal > 0 ? [[`Guide (${selectedGuide?.name})`, formatMad(guideTotal)]] : []),
                ].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", color:"#888", marginBottom:5 }}>
                    <span>{k}</span><span>{v}</span>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:"1rem", color:NAVY, paddingTop:10, marginTop:4, borderTop:"1px solid #EDE8DF" }}>
                  <span>Total</span><span>{formatMad(total)}</span>
                </div>
              </div>

              <button type="submit" form="res-form"
                style={{
                  width:"100%", height:46, borderRadius:14, fontWeight:700, fontSize:14,
                  background:`linear-gradient(135deg,${GOLD},${GOLD_D})`,
                  color:"#fff", border:"none", cursor:"pointer",
                  boxShadow:"0 4px 20px rgba(139,105,20,0.3)",
                  letterSpacing:"0.04em",
                }}>
                {isLoggedIn ? "Continue to payment →" : "Sign in & continue →"}
              </button>

              <p style={{ textAlign:"center", fontSize:11, color:"#aaa", marginTop:10 }}>
                Free cancellation · No hidden fees
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}