import { Link } from "react-router";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { BrandLockup } from "./brand-logo";
import { BRAND_NAME, BRAND_EMAIL } from "../brand";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

export function Footer() {
  return (
    <footer style={{ background: NAVY, borderTop: `1px solid rgba(201,169,110,0.15)`, marginTop: "5rem" }}>

      {/* Gold top accent line */}
      <div style={{ height: "2px", background: `linear-gradient(90deg, transparent, ${GOLD}50, transparent)` }} />

      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand col */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <BrandLockup variant="light" />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.38)", lineHeight: 1.75 }}>
              Premium hotel, riad and resort bookings across Morocco — imperial cities,
              Atlantic coast and Atlas mountains.
            </p>
            {/* Contact icons */}
            <div className="mt-5 space-y-2.5">
              {[
                { icon: Mail,   val: BRAND_EMAIL                },
                { icon: Phone,  val: "+212 5 22 12 34 56"       },
                { icon: MapPin, val: "Casablanca, Morocco"      },
              ].map(({ icon: Icon, val }) => (
                <div key={val} className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: GOLD }} />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: GOLD, letterSpacing: "0.18em" }}
            >
              Navigation
            </p>
            <ul className="space-y-3">
              {[
                { to: "/home",   label: "Home"            },
                { to: "/search", label: "Browse Hotels"   },
                { to: "/guide",  label: "Tourist Guides"  },
                { to: "/admin",  label: "Admin Dashboard" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    viewTransition
                    className="text-sm transition-all hover:translate-x-0.5"
                    style={{ color: "rgba(255,255,255,0.38)", display: "inline-block" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = GOLD; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.38)"; }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: GOLD, letterSpacing: "0.18em" }}
            >
              Support
            </p>
            <ul className="space-y-3">
              {["Help Center", "FAQs", "Terms of Service", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-all"
                    style={{ color: "rgba(255,255,255,0.38)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = GOLD; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.38)"; }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: GOLD, letterSpacing: "0.18em" }}
            >
              About
            </p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.35)", lineHeight: 1.7 }}>
              MoroccanStay connects travelers with handpicked properties across Morocco's most
              iconic destinations.
            </p>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              style={{
                background: "rgba(201,169,110,0.1)",
                border: `1px solid rgba(201,169,110,0.25)`,
                color: GOLD,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(201,169,110,0.18)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(201,169,110,0.1)"; }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Learn more
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 0 1.5rem" }} />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
            © 2026 {BRAND_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD, opacity: 0.6 }} />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
              Premium Moroccan Hospitality
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}