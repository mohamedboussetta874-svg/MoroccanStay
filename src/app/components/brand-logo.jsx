import { Link } from "react-router";
import { cn } from "./ui/utils";
import { BRAND_NAME } from "../brand";
import { useDarkMode } from "../context/DarkModeContext";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

/* Minimal Moroccan star SVG mark */
function StarMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {/* Outer 8-point star */}
      <path
        d="M14 2L16.2 10.5L24 7.5L18.5 14L24 20.5L16.2 17.5L14 26L11.8 17.5L4 20.5L9.5 14L4 7.5L11.8 10.5Z"
        fill={GOLD}
        opacity="0.9"
      />
      {/* Inner dot */}
      <circle cx="14" cy="14" r="2.5" fill={GOLD_D} />
    </svg>
  );
}

export function BrandLockup({ className, variant = "default" }) {
  const { isDark } = useDarkMode();
  const onDark = variant === "light" || isDark;

  return (
    <Link
      to="/"
      viewTransition
      className={cn("inline-flex items-center gap-2.5 hover:opacity-85 transition-opacity", className)}
    >
      <StarMark size={26} />
      <div className="flex flex-col leading-none">
        <span
          className="font-semibold tracking-tight"
          style={{
            fontSize: "1.1rem",
            color: onDark ? "#fff" : NAVY,
            letterSpacing: "-0.02em",
          }}
        >
          {BRAND_NAME}
        </span>
        <span
          className="text-xs font-medium"
          style={{
            color: onDark ? GOLD : GOLD_D,
            letterSpacing: "0.08em",
            fontSize: "0.62rem",
            textTransform: "uppercase",
          }}
        >
          Morocco
        </span>
      </div>
    </Link>
  );
}