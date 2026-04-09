import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { LogIn, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { BrandLockup } from "../components/brand-logo";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

export function AdminLoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back, Admin!");
      navigate("/admin", { replace: true });
    } catch {
      toast.error(error || "Invalid credentials. Please try again.");
    }
  };

  const canSubmit = !loading && email.trim() && password.trim();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: NAVY }}
    >
      {/* BG image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')`,
          opacity: 0.12,
        }}
      />
      {/* Gold top line */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201,169,110,0.06) 0%, transparent 70%)` }}
      />

      <div className="relative z-10 w-full max-w-md">

        {/* Back link */}
        <Link
          to="/select-role"
          className="inline-flex items-center gap-2 mb-8 text-sm transition-opacity hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to role selection
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <BrandLockup variant="light" />
          </div>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: GOLD, letterSpacing: "0.2em" }}
          >
            Administration
          </p>
          <h1
            className="text-2xl font-bold text-white mb-1"
            style={{ letterSpacing: "-0.02em" }}
          >
            Sign in to your account
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.88rem" }}>
            Administrator access only
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(16px)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@moroccanstay.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="h-12 rounded-xl text-white placeholder:text-gray-500"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  outline: "none",
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-12 rounded-xl pr-11 text-white placeholder:text-gray-500"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#fca5a5" }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full h-12 rounded-xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                background: canSubmit
                  ? `linear-gradient(135deg, ${GOLD}, ${GOLD_D})`
                  : "rgba(255,255,255,0.08)",
                color: canSubmit ? NAVY : "rgba(255,255,255,0.25)",
                border: "none",
                boxShadow: canSubmit ? "0 4px 20px rgba(139,105,20,0.35)" : "none",
                cursor: canSubmit ? "pointer" : "not-allowed",
                letterSpacing: "0.04em",
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div
            className="mt-6 pt-6 rounded-xl px-4 py-4"
            style={{ background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.15)" }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: GOLD, letterSpacing: "0.15em" }}
            >
              Demo credentials
            </p>
            <div className="space-y-2">
              {[
                { label: "Email", val: "admin@moroccanstay.com" },
                { label: "Password", val: "admin123" },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span style={{ color: "rgba(255,255,255,0.3)" }}>{label}</span>
                  <code
                    className="px-2 py-0.5 rounded font-mono"
                    style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}
                  >
                    {val}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}