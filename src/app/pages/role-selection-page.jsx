import { Link } from "react-router";
import { Lock, Hotel, ChevronRight, Shield } from "lucide-react";
import { BrandLockup } from "../components/brand-logo";
import { useAuth } from "../hooks/useAuth";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

export function RoleSelectionPage() {
  const { setRole } = useAuth();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: NAVY }}
    >
      {/* Background image with deep overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')`,
          opacity: 0.18,
        }}
      />

      {/* Gold top line */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      />

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.07) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-xl">

        {/* Brand */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-5">
            <BrandLockup variant="light" />
          </div>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: GOLD, letterSpacing: "0.2em" }}
          >
            Premium Moroccan Stays
          </p>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            How would you like to continue?
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>
            Select your access level to get started
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-4 mb-8">

          {/* Customer */}
          <Link to="/home" onClick={() => setRole("customer")}>
            <div
              className="group flex items-center gap-5 rounded-2xl p-6 cursor-pointer transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid rgba(255,255,255,0.1)`,
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(201,169,110,0.1)";
                e.currentTarget.style.border = `1px solid rgba(201,169,110,0.4)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.border = `1px solid rgba(255,255,255,0.1)`;
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(201,169,110,0.15)", border: `1px solid rgba(201,169,110,0.3)` }}
              >
                <Hotel className="w-6 h-6" style={{ color: GOLD }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-lg mb-0.5">Book a Hotel</p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem" }}>
                  Browse properties, make reservations, explore guides
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:translate-x-1"
                style={{ background: "rgba(201,169,110,0.15)" }}
              >
                <ChevronRight className="w-4 h-4" style={{ color: GOLD }} />
              </div>
            </div>
          </Link>

          {/* Admin */}
          <Link to="/admin/login" onClick={() => setRole("admin")}>
            <div
              className="group flex items-center gap-5 rounded-2xl p-6 cursor-pointer transition-all duration-300 mt-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid rgba(255,255,255,0.1)`,
                backdropFilter: "blur(12px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                e.currentTarget.style.border = `1px solid rgba(255,255,255,0.25)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.border = `1px solid rgba(255,255,255,0.1)`;
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.07)", border: `1px solid rgba(255,255,255,0.12)` }}
              >
                <Shield className="w-6 h-6" style={{ color: "rgba(255,255,255,0.6)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-white text-lg">Admin Access</p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}
                  >
                    Restricted
                  </span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
                  Manage hotels, guides, bookings and analytics
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all group-hover:translate-x-1"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <Lock className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
              </div>
            </div>
          </Link>
        </div>

        {/* Demo credentials */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}
          >
            Demo credentials
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { label: "Email", value: "admin@moroccanstay.com" },
              { label: "Password", value: "admin123" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>{label}:</span>
                <code
                  className="text-xs px-2 py-1 rounded-lg font-mono"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}
                >
                  {value}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center mt-8 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          © 2026 MoroccanStay · All rights reserved
        </p>
      </div>
    </div>
  );
}