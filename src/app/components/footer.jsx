import { Link } from "react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { BrandLockup } from "./brand-logo";
import { BRAND_NAME, BRAND_EMAIL } from "../brand";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

/* ── Social SVG icons ── */
const SOCIALS = [
  {
    label:"Instagram",
    href:"#",
    svg:(
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label:"Facebook",
    href:"#",
    svg:(
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label:"X / Twitter",
    href:"#",
    svg:(
      <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label:"TripAdvisor",
    href:"#",
    svg:(
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.49 0 2.9.37 4.13 1.02L14.5 7.5C13.74 7.18 12.89 7 12 7s-1.74.18-2.5.5L7.87 6.02C9.1 5.37 10.51 5 12 5zm-5.5 7a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm8.5 2.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM6.54 8.54l1.42 1.42A4.48 4.48 0 0 0 7.5 12c0 .59.11 1.16.31 1.68L6.24 15.1A6.46 6.46 0 0 1 5.5 12c0-1.3.38-2.51 1.04-3.46zm10.92 0C18.12 9.49 18.5 10.7 18.5 12c0 1.09-.27 2.12-.74 3.02l-1.56-1.34c.19-.52.3-1.08.3-1.68 0-.59-.1-1.15-.3-1.68l1.26-1.78zM12 19c-2.1 0-3.99-.82-5.4-2.15l1.56-1.34A4.97 4.97 0 0 0 12 17c1.37 0 2.61-.55 3.52-1.44l1.5 1.38A6.96 6.96 0 0 1 12 19z"/>
      </svg>
    ),
  },
  {
    label:"WhatsApp",
    href:"#",
    svg:(
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer style={{ background:NAVY, borderTop:`1px solid rgba(201,169,110,0.12)`, marginTop:"5rem" }}>
      <div style={{ height:2, background:`linear-gradient(90deg,transparent,${GOLD}50,transparent)` }}/>

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"56px 24px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 1fr", gap:40, marginBottom:48 }}>

          {/* Brand col */}
          <div>
            <div style={{ marginBottom:16 }}><BrandLockup variant="light"/></div>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.38)", lineHeight:1.75, marginBottom:20, maxWidth:260 }}>
              Premium hotel, riad and resort bookings across Morocco — imperial cities, Atlantic coast and Atlas mountains.
            </p>

            {/* Contact */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { icon:Mail,   val:BRAND_EMAIL              },
                { icon:Phone,  val:"+212 5 22 12 34 56"     },
                { icon:MapPin, val:"Casablanca, Morocco"    },
              ].map(({ icon:Icon, val }) => (
                <div key={val} style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <Icon style={{ width:14, height:14, color:GOLD, flexShrink:0 }}/>
                  <span style={{ fontSize:12, color:"rgba(255,255,255,0.38)" }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display:"flex", gap:8, marginTop:22 }}>
              {SOCIALS.map(({ label, href, svg }) => (
                <a key={label} href={href} title={label} target="_blank" rel="noopener noreferrer"
                  style={{
                    width:36, height:36, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
                    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)",
                    color:"rgba(255,255,255,0.4)", textDecoration:"none", transition:"all .2s",
                  }}
                  onMouseEnter={e=>{
                    e.currentTarget.style.background=`rgba(201,169,110,0.15)`;
                    e.currentTarget.style.borderColor=`rgba(201,169,110,0.4)`;
                    e.currentTarget.style.color=GOLD;
                    e.currentTarget.style.transform="translateY(-2px)";
                  }}
                  onMouseLeave={e=>{
                    e.currentTarget.style.background="rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";
                    e.currentTarget.style.color="rgba(255,255,255,0.4)";
                    e.currentTarget.style.transform="translateY(0)";
                  }}>
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.18em", color:GOLD, marginBottom:18 }}>
              Navigation
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[
                { to:"/home",   label:"Home"         },
                { to:"/search", label:"Browse Hotels"},
                { to:"/guide",  label:"Tourist Guides"},
                { to:"/login",  label:"Admin Login"  },
              ].map(({ to, label }) => (
                <Link key={to} to={to} viewTransition
                  style={{ fontSize:13, color:"rgba(255,255,255,0.38)", textDecoration:"none", transition:"color .15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.color=GOLD;}}
                  onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.38)";}}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.18em", color:GOLD, marginBottom:18 }}>
              Support
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {["Help Center","FAQs","Terms of Service","Privacy Policy","Cancellation Policy"].map(item => (
                <a key={item} href="#"
                  style={{ fontSize:13, color:"rgba(255,255,255,0.38)", textDecoration:"none", transition:"color .15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.color=GOLD;}}
                  onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.38)";}}>
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <p style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.18em", color:GOLD, marginBottom:18 }}>
              Destinations
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {["Casablanca","Marrakech","Fès","Rabat","Agadir","Chefchaouen"].map(city => (
                <Link key={city} to={`/search?city=${city}`} viewTransition
                  style={{ fontSize:13, color:"rgba(255,255,255,0.38)", textDecoration:"none", transition:"color .15s", display:"flex", alignItems:"center", gap:6 }}
                  onMouseEnter={e=>{e.currentTarget.style.color=GOLD;}}
                  onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.38)";}}>
                  <MapPin style={{ width:10, height:10, color:GOLD, flexShrink:0 }}/>{city}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height:1, background:"rgba(255,255,255,0.06)", margin:"0 0 24px" }}/>

        {/* Bottom bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:32, flexWrap:"wrap", gap:12 }}>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.2)", margin:0 }}>
            © 2026 {BRAND_NAME}. All rights reserved.
          </p>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:GOLD, opacity:.6 }}/>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.2)", margin:0 }}>
              Premium Moroccan Hospitality
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}