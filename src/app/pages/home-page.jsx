import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  Search, MapPin, Calendar, Users, Star,
  DollarSign, RotateCcw, Phone,
  Percent, Quote, ChevronRight, Award, Shield,
} from "lucide-react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { formatMad } from "../lib/currency";
import { useDarkMode } from "../context/DarkModeContext";
import { useAppData } from "../hooks/useAppData";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

const TESTIMONIALS = [
  { text:"Very easy booking and great hotel options. The process was smooth and customer service was excellent. Will definitely book again!", name:"Sarah Johnson",  loc:"Casablanca",  time:"2 weeks ago", rating:5, img:"photo-1494790108755-2616b612b786" },
  { text:"Found the perfect riad in Marrakech! The prices were great and the booking process was incredibly simple. Highly recommended!", name:"Mohammed Alami", loc:"Marrakech",   time:"3 weeks ago", rating:5, img:"photo-1507003211169-0a1dd7228f2d" },
  { text:"Amazing experience! The hotels were exactly as described and the support team helped us throughout our stay. Merci beaucoup!",  name:"Emma Dubois",    loc:"Fès",         time:"3 weeks ago", rating:5, img:"photo-1438761681033-6461ffad8d80" },
  { text:"Exceptional service from start to finish. The riad was breathtaking and the staff were incredibly warm and welcoming.",          name:"Youssef Tazi",   loc:"Agadir",      time:"1 month ago", rating:5, img:"photo-1472099645785-5658abf4ff4e" },
  { text:"Booked through MoroccanStay for the first time and I'm completely impressed. Transparent pricing, beautiful properties.",        name:"Laila Bensouda", loc:"Rabat",       time:"1 month ago", rating:5, img:"photo-1489424731084-a5d8b219a5bb" },
  { text:"The Chefchaouen riad was absolutely magical. Every detail was perfect. Already planning my next trip to Morocco!",               name:"Carlos Mendez",  loc:"Chefchaouen", time:"5 weeks ago", rating:5, img:"photo-1500648767791-00dcc994a43e" },
];

/* ── GoldButton ── */
function GoldButton({ children, to, onClick, outline }) {
  const base = {
    display:"inline-flex", alignItems:"center", gap:8,
    padding:"12px 26px", borderRadius:12,
    fontSize:14, fontWeight:700, cursor:"pointer",
    letterSpacing:"0.03em", transition:"all .2s", textDecoration:"none",
    ...(outline ? {
      background:"transparent", border:`1.5px solid ${GOLD}`, color:GOLD_D, boxShadow:"none",
    } : {
      background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, border:"none",
      color:"#fff", boxShadow:`0 4px 20px rgba(139,105,20,0.3)`,
    }),
  };
  const hIn  = (e) => { e.currentTarget.style.opacity="0.88"; e.currentTarget.style.transform="translateY(-1px)"; };
  const hOut = (e) => { e.currentTarget.style.opacity="1";    e.currentTarget.style.transform="translateY(0)"; };
  if (to) return <Link to={to} viewTransition style={base} onMouseEnter={hIn} onMouseLeave={hOut}>{children}</Link>;
  return <button type="button" onClick={onClick} style={base} onMouseEnter={hIn} onMouseLeave={hOut}>{children}</button>;
}

/* ── Hotel card ── */
function HotelCard({ hotel, dark }) {
  const [hov, setHov] = useState(false);
  const cardBg     = dark ? "#1e2a3a" : "#fff";
  const cardBorder = dark ? "rgba(201,169,110,0.12)" : "#EDE8DF";
  const textMain   = dark ? "#f0e8d8" : NAVY;
  const textMuted  = dark ? "rgba(255,255,255,0.45)" : "#aaa";

  return (
    <article
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:20, overflow:"hidden",
        background: cardBg,
        border:`1px solid ${cardBorder}`,
        boxShadow: hov
          ? "0 20px 56px rgba(26,26,46,0.22)"
          : dark ? "0 2px 16px rgba(0,0,0,0.3)" : "0 2px 16px rgba(26,26,46,0.06)",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        cursor:"pointer",
      }}
    >
      <div style={{ position:"relative", height:224, overflow:"hidden" }}>
        <img src={hotel.image} alt={hotel.name} style={{
          width:"100%", height:"100%", objectFit:"cover",
          transform: hov ? "scale(1.08)" : "scale(1)",
          transition:"transform 0.6s ease",
        }}/>
        <div style={{
          position:"absolute", inset:0,
          background: hov
            ? "linear-gradient(to top,rgba(26,26,46,0.6) 0%,transparent 60%)"
            : "linear-gradient(to top,rgba(26,26,46,0.28) 0%,transparent 60%)",
          transition:"background 0.4s ease",
        }}/>
        {/* Rating */}
        <div style={{
          position:"absolute", top:12, right:12,
          display:"flex", alignItems:"center", gap:4, padding:"4px 10px", borderRadius:20,
          background: hov ? `linear-gradient(135deg,${GOLD},${GOLD_D})` : "rgba(26,26,46,0.72)",
          backdropFilter:"blur(8px)", transition:"background 0.3s",
        }}>
          <Star style={{ width:11, height:11, fill: hov?"#fff":GOLD, color: hov?"#fff":GOLD }}/>
          <span style={{ fontSize:12, fontWeight:700, color:"#fff" }}>{hotel.rating}</span>
        </div>
        {/* Location slide-up on hover */}
        <div style={{
          position:"absolute", bottom:12, left:12, right:12,
          opacity: hov?1:0, transform: hov?"translateY(0)":"translateY(8px)",
          transition:"all 0.3s ease",
          display:"flex", alignItems:"center", gap:5,
        }}>
          <MapPin style={{ width:13, height:13, color:GOLD }}/>
          <span style={{ fontSize:12, color:"rgba(255,255,255,0.9)", fontWeight:500 }}>{hotel.location}</span>
        </div>
      </div>

      <div style={{ padding:"18px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:6 }}>
          <MapPin style={{ width:11, height:11, color:GOLD }}/>
          <span style={{ fontSize:11, color:GOLD_D, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>
            {hotel.location.split(",")[0]}
          </span>
        </div>
        <h3 style={{ fontSize:"1rem", fontWeight:700, color:textMain, margin:"0 0 14px", lineHeight:1.3 }}>
          {hotel.name}
        </h3>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:12, borderTop:`1px solid ${dark?"rgba(255,255,255,0.07)":"#F0EDE8"}` }}>
          <div>
            <span style={{ fontSize:"1.2rem", fontWeight:700, color:textMain }}>{formatMad(hotel.price)}</span>
            <span style={{ fontSize:12, color:textMuted, marginLeft:4 }}>/ night</span>
          </div>
          <Link to={`/hotel/${hotel.id}`} viewTransition>
            <button style={{
              padding:"7px 16px", borderRadius:10, fontSize:12, fontWeight:700, cursor:"pointer",
              background: hov ? `linear-gradient(135deg,${GOLD},${GOLD_D})` : "rgba(201,169,110,0.1)",
              color: hov ? "#fff" : GOLD_D,
              border: hov ? "none" : `1px solid rgba(201,169,110,0.3)`,
              boxShadow: hov ? "0 2px 12px rgba(139,105,20,0.25)" : "none",
              transition:"all 0.3s ease",
            }}>
              View offer
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ── Auto-scrolling testimonials ── */
function TestimonialsScroll({ dark }) {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const items = [...TESTIMONIALS, ...TESTIMONIALS];

  const cardBg     = dark ? "#1e2a3a" : "#fff";
  const cardBorder = dark ? "rgba(201,169,110,0.12)" : "#EDE8DF";
  const textMain   = dark ? "#f0e8d8" : NAVY;
  const textMuted  = dark ? "rgba(255,255,255,0.4)" : "#aaa";
  const textBody   = dark ? "rgba(255,255,255,0.6)" : "#555";
  const fadeBg     = dark ? "#111827" : "#FAFAF8";

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let x = 0, raf;
    const singleWidth = track.scrollWidth / 2;
    const animate = () => {
      if (!paused) {
        x += 0.5;
        if (x >= singleWidth) x = 0;
        track.style.transform = `translateX(-${x}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  return (
    <div style={{ overflow:"hidden", position:"relative" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>
      {/* Fade edges */}
      {["left","right"].map(side => (
        <div key={side} style={{
          position:"absolute", top:0, bottom:0, width:100, zIndex:2, pointerEvents:"none",
          [side]:0,
          background:`linear-gradient(to ${side==="left"?"right":"left"},${fadeBg},transparent)`,
        }}/>
      ))}
      <div ref={trackRef} style={{ display:"flex", gap:18, width:"max-content" }}>
        {items.map((t, i) => (
          <div key={i} style={{
            width:296, flexShrink:0, padding:"20px 22px", borderRadius:18,
            background:cardBg, border:`1px solid ${cardBorder}`,
            boxShadow: dark ? "0 2px 12px rgba(0,0,0,0.25)" : "0 2px 12px rgba(26,26,46,0.05)",
          }}>
            <div style={{ display:"flex", gap:2, marginBottom:10 }}>
              {[1,2,3,4,5].map(s=><Star key={s} style={{ width:13, height:13, fill:GOLD, color:GOLD }}/>)}
            </div>
            <Quote style={{ width:18, height:18, color:"rgba(201,169,110,0.35)", marginBottom:8 }}/>
            <p style={{ fontSize:13, color:textBody, lineHeight:1.65, margin:"0 0 14px", fontStyle:"italic" }}>
              "{t.text}"
            </p>
            <div style={{ display:"flex", alignItems:"center", gap:10, paddingTop:12, borderTop:`1px solid ${dark?"rgba(255,255,255,0.07)":"#F0EDE8"}` }}>
              <img
                src={`https://images.unsplash.com/${t.img}?w=80&h=80&fit=crop&q=80`}
                alt={t.name}
                style={{ width:36, height:36, borderRadius:"50%", objectFit:"cover", border:`2px solid ${GOLD}` }}
              />
              <div>
                <p style={{ fontSize:12, fontWeight:700, color:textMain, margin:0 }}>{t.name}</p>
                <p style={{ fontSize:11, color:textMuted, margin:0 }}>{t.loc} · {t.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════ PAGE ══════════════ */
export function HomePage() {
  const { isDark } = useDarkMode();
  const { hotels } = useAppData();

  /* Theme tokens */
  const bg         = isDark ? "#111827" : "#FAFAF8";
  const bgSection  = isDark ? "#0f172a" : "#fff";
  const textMain   = isDark ? "#f0e8d8" : NAVY;
  const textSub    = isDark ? "rgba(255,255,255,0.55)" : "#555";
  const textMuted  = isDark ? "rgba(255,255,255,0.35)" : "#aaa";
  const cardBorder = isDark ? "rgba(201,169,110,0.12)" : "#EDE8DF";
  const cardBg     = isDark ? "#1e2a3a" : "#FAFAF8";

  const [city,    setCity]    = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut,setCheckOut]= useState("");
  const [guests,  setGuests]  = useState("2");

  const searchTo = useMemo(() => {
    const p = new URLSearchParams();
    if (city.trim()) p.set("city", city.trim());
    if (checkIn)     p.set("checkIn", checkIn);
    if (checkOut)    p.set("checkOut", checkOut);
    if (guests)      p.set("guests", guests);
    return p.toString() ? `/search?${p}` : "/search";
  }, [city, checkIn, checkOut, guests]);

  const inputStyle = {
    width:"100%", height:52, borderRadius:12,
    border:"1.5px solid rgba(255,255,255,0.15)",
    background:"rgba(255,255,255,0.08)",
    fontSize:14, color:"#fff", outline:"none",
    transition:"border-color .2s", fontFamily:"inherit",
    padding:"0 14px 0 42px",
  };

  return (
    <div style={{ minHeight:"100vh", background:bg }}>
      <Navbar />

      {/* ══ HERO ══ */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundSize:"cover", backgroundPosition:"center", backgroundImage:`url('https://images.unsplash.com/photo-1723465308831-29da05e011f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')` }}/>
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(160deg,rgba(26,26,46,0.85) 0%,rgba(22,33,62,0.62) 50%,rgba(26,26,46,0.82) 100%)" }}/>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,transparent,${GOLD},transparent)` }}/>

        <div style={{ position:"relative", zIndex:10, width:"100%", maxWidth:1000, margin:"0 auto", padding:"0 24px", textAlign:"center" }}>
          {/* Badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"6px 18px", borderRadius:30, marginBottom:24, border:`1px solid rgba(201,169,110,0.45)`, background:"rgba(201,169,110,0.1)" }}>
            <Award style={{ width:13, height:13, color:GOLD }}/>
            <span style={{ fontSize:12, fontWeight:700, color:GOLD, letterSpacing:"0.15em", textTransform:"uppercase" }}>Premium Moroccan Stays</span>
          </div>

          <h1 style={{ fontSize:"clamp(2.4rem,5.5vw,4.2rem)", fontWeight:700, color:"#fff", lineHeight:1.1, letterSpacing:"-0.03em", margin:"0 0 18px" }}>
            Find your perfect stay<br/>
            <span style={{ background:`linear-gradient(90deg,${GOLD},#f0d080,${GOLD})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              in Morocco
            </span>
          </h1>

          <p style={{ fontSize:17, color:"rgba(255,255,255,0.6)", marginBottom:40, lineHeight:1.7, maxWidth:560, margin:"0 auto 40px" }}>
            Hotels, riads and resorts — from the medina to the Atlantic, prices in dirhams (Dh)
          </p>

          {/* Search card */}
          <div style={{ background:"rgba(26,26,46,0.72)", backdropFilter:"blur(20px)", borderRadius:20, padding:"28px 32px", border:"1px solid rgba(201,169,110,0.2)", boxShadow:"0 24px 64px rgba(26,26,46,0.4)" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:16 }}>
              {[
                { label:"Destination", icon:MapPin,   type:"text",   val:city,     set:setCity,     ph:"Where to?" },
                { label:"Check-in",    icon:Calendar, type:"date",   val:checkIn,  set:setCheckIn,  ph:""          },
                { label:"Check-out",   icon:Calendar, type:"date",   val:checkOut, set:setCheckOut, ph:""          },
                { label:"Guests",      icon:Users,    type:"number", val:guests,   set:setGuests,   ph:"2"         },
              ].map(({ label, icon:Icon, type, val, set, ph }) => (
                <div key={label}>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:GOLD, marginBottom:7 }}>
                    {label}
                  </label>
                  <div style={{ position:"relative" }}>
                    <Icon style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", width:15, height:15, color:"rgba(255,255,255,0.4)", pointerEvents:"none" }}/>
                    <input type={type} placeholder={ph} value={val} min={type==="number"?"1":undefined}
                      onChange={e=>set(e.target.value)} style={inputStyle}
                      onFocus={e=>{e.target.style.borderColor=GOLD;}}
                      onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.15)";}}/>
                  </div>
                </div>
              ))}
            </div>
            <Link to={searchTo} viewTransition style={{ display:"block", textDecoration:"none" }}>
              <button style={{
                width:"100%", height:52, borderRadius:14, fontSize:15, fontWeight:700,
                background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, color:"#fff", border:"none", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                boxShadow:"0 4px 20px rgba(139,105,20,0.4)", letterSpacing:"0.04em", transition:"all .2s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 28px rgba(139,105,20,0.55)";e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 4px 20px rgba(139,105,20,0.4)";e.currentTarget.style.transform="translateY(0)";}}>
                <Search style={{ width:18, height:18 }}/> Search Available Hotels
              </button>
            </Link>
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:32, marginTop:28, flexWrap:"wrap" }}>
            {["200+ Properties","Verified Reviews","Best Price Guarantee","24/7 Support"].map(t=>(
              <div key={t} style={{ display:"flex", alignItems:"center", gap:6, color:"rgba(255,255,255,0.45)", fontSize:12 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:GOLD }}/>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED HOTELS ══ */}
      <section style={{ padding:"80px 24px", background:bg }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:48 }}>
            <div>
              <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:GOLD, marginBottom:8 }}>Curated selection</p>
              <h2 style={{ fontSize:"clamp(1.8rem,3vw,2.6rem)", fontWeight:700, color:textMain, letterSpacing:"-0.025em", margin:0 }}>
                Featured Properties
              </h2>
            </div>
            <GoldButton to="/search" outline>View all <ChevronRight style={{ width:15, height:15 }}/></GoldButton>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {hotels.map(h => <HotelCard key={h.id} hotel={h} dark={isDark}/>)}
          </div>
        </div>
      </section>

      {/* ══ WHY US ══ */}
      <section style={{ padding:"80px 24px", background:bgSection }}>
        <div style={{ maxWidth:1200, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:GOLD, marginBottom:8 }}>Why MoroccanStay</p>
            <h2 style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)", fontWeight:700, color:textMain, letterSpacing:"-0.025em", margin:0 }}>
              The smarter way to book
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {[
              { icon:DollarSign, color:"#C9A96E", bg:isDark?"rgba(201,169,110,0.12)":"rgba(201,169,110,0.1)", title:"Best Price Guarantee", desc:"Exclusive rates in Moroccan Dirhams — no hidden fees or currency conversion." },
              { icon:RotateCcw,  color:"#4A9B7F", bg:isDark?"rgba(74,155,127,0.12)" :"rgba(74,155,127,0.1)",  title:"Free Cancellation",   desc:"Cancel up to 24 hours before check-in. Plans change — we understand." },
              { icon:Shield,     color:"#5B7FA6", bg:isDark?"rgba(91,127,166,0.12)" :"rgba(91,127,166,0.1)",  title:"Secure Payment",      desc:"Bank-level encryption with Moroccan local payment options supported." },
              { icon:Phone,      color:"#9B6B4A", bg:isDark?"rgba(155,107,74,0.12)" :"rgba(155,107,74,0.1)",  title:"24/7 Local Support",  desc:"Our Moroccan team speaks Arabic, French and English — always available." },
            ].map(({ icon:Icon, color, bg, title, desc }) => (
              <div key={title} style={{
                padding:"24px 22px", borderRadius:18,
                background: isDark ? "#1e2a3a" : "#FAFAF8",
                border:`1px solid ${cardBorder}`,
                transition:"all .3s",
              }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=isDark?"0 12px 36px rgba(0,0,0,0.35)":"0 12px 36px rgba(26,26,46,0.09)";e.currentTarget.style.transform="translateY(-4px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{ width:44, height:44, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                  <Icon style={{ width:20, height:20, color }}/>
                </div>
                <h3 style={{ fontSize:"0.92rem", fontWeight:700, color:textMain, margin:"0 0 8px" }}>{title}</h3>
                <p style={{ fontSize:13, color:textSub, lineHeight:1.65, margin:0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SPECIAL OFFER ══ */}
      <section style={{ position:"relative", padding:"88px 24px", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundSize:"cover", backgroundPosition:"center", backgroundImage:`url('https://images.unsplash.com/photo-1589391886645-d51941baf7fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')` }}/>
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,${isDark?"rgba(10,15,30,0.94)":"rgba(26,26,46,0.92)"},rgba(139,105,20,0.78))` }}/>
        <div style={{ position:"relative", zIndex:1, maxWidth:1200, margin:"0 auto" }}>
          <div style={{ maxWidth:580 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7, padding:"5px 14px", borderRadius:20, background:GOLD, marginBottom:20 }}>
              <Percent style={{ width:13, height:13, color:NAVY }}/>
              <span style={{ fontSize:11, fontWeight:700, color:NAVY, letterSpacing:"0.12em", textTransform:"uppercase" }}>Limited time</span>
            </div>
            <h3 style={{ fontSize:"clamp(2rem,4vw,3rem)", fontWeight:700, color:"#fff", letterSpacing:"-0.025em", lineHeight:1.15, margin:"0 0 16px" }}>
              Summer Paradise<br/><span style={{ color:GOLD }}>Awaits You</span>
            </h3>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.65)", lineHeight:1.7, marginBottom:20 }}>
              Get <strong style={{ color:GOLD }}>20% off</strong> all summer bookings — Agadir, Essaouira & more.
            </p>
            <div style={{ display:"flex", gap:20, marginBottom:28, fontSize:13, color:"rgba(255,255,255,0.5)" }}>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}><Calendar style={{ width:14, height:14, color:GOLD }}/> Valid until Sept 30</span>
              <span style={{ display:"flex", alignItems:"center", gap:6 }}><MapPin style={{ width:14, height:14, color:GOLD }}/> Agadir, Essaouira & more</span>
            </div>
            <GoldButton to="/search">Claim Your Offer →</GoldButton>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ padding:"80px 0", background:bg, overflow:"hidden" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", marginBottom:40 }}>
          <div style={{ textAlign:"center" }}>
            <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", color:GOLD, marginBottom:8 }}>Guest stories</p>
            <h2 style={{ fontSize:"clamp(1.8rem,3vw,2.4rem)", fontWeight:700, color:textMain, letterSpacing:"-0.025em", margin:0 }}>
              What our guests say
            </h2>
            <p style={{ fontSize:14, color:textMuted, marginTop:10 }}>Hover to pause · Real reviews from real travelers</p>
          </div>
        </div>
        <TestimonialsScroll dark={isDark}/>
      </section>

      <Footer />
    </div>
  );
}