import { Link } from "react-router";
import { House, ArrowLeft } from "lucide-react";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

export function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 text-center relative overflow-hidden"
      style={{ background: NAVY }}
    >
      {/* Background subtle image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')`,
          opacity: 0.08,
        }}
      />
      {/* Gold top line */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      />

      <div className="relative z-10">
        {/* 404 number */}
        <div
          className="font-bold mb-4"
          style={{
            fontSize: "clamp(6rem, 18vw, 10rem)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            background: `linear-gradient(135deg, ${GOLD} 0%, rgba(201,169,110,0.25) 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </div>

        <p
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: GOLD, letterSpacing: "0.2em" }}
        >
          Page not found
        </p>

        <h2 className="text-2xl font-bold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
          This page doesn't exist
        </h2>
        <p className="text-sm max-w-sm mx-auto mb-10" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}>
          The page you're looking for may have been moved, deleted, or never existed. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/home" viewTransition>
            <button
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: `linear-gradient(135deg,${GOLD},${GOLD_D})`,
                color: NAVY,
                border: "none",
                boxShadow: "0 4px 20px rgba(139,105,20,0.35)",
                letterSpacing: "0.04em",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              <House className="w-4 h-4" />
              Back to Home
            </button>
          </Link>
          <Link to="/select-role" viewTransition>
            <button
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.55)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            >
              <ArrowLeft className="w-4 h-4" />
              Role selection
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}