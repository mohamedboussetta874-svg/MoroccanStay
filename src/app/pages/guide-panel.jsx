import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { MapPin, Calendar, Users, Star, ArrowLeft, Clock, Check } from "lucide-react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { useAuth } from "../hooks/useAuth";
import { useAppData } from "../hooks/useAppData";
import { toast } from "sonner";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

function StatCard({ icon: Icon, iconColor, iconBg, value, label }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#fff", border: "1px solid #EDE8DF", boxShadow: "0 2px 12px rgba(26,26,46,0.04)" }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: iconBg }}
      >
        <Icon className="w-4.5 h-4.5" style={{ color: iconColor, width: 18, height: 18 }} />
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

export function GuidePanel() {
  const { role, session, isLoggedIn } = useAuth();
  const { guides, listAssignmentsForGuide, setGuideAvailability } = useAppData();
  const [booked, setBooked]   = useState([]);
  const [flash, setFlash]     = useState("");
  const [assignments, setAssignments] = useState([]);

  const guideProfile = useMemo(() => {
    if (role !== "guide") return null;
    return guides.find((g) => g.id === session?.id || g.email === session?.email) || null;
  }, [role, guides, session?.id, session?.email]);

  useEffect(() => {
    if (role !== "guide" || !isLoggedIn) return;
    let alive = true;
    listAssignmentsForGuide(session?.id)
      .then((a) => { if (alive) setAssignments(a); })
      .catch(() => {});
    return () => { alive = false; };
  }, [role, isLoggedIn, listAssignmentsForGuide, session?.id]);

  const handleBook = (guide) => {
    if (!guide.available || booked.includes(guide.id)) return;
    setBooked((p) => [...p, guide.id]);
    setFlash(`Request sent for ${guide.name}!`);
    setTimeout(() => setFlash(""), 3000);
  };

  const avgRating = (guides.reduce((s, g) => s + g.rating, 0) / guides.length).toFixed(1);

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <Navbar />

      {/* ── Page header ── */}
      <div style={{ background: NAVY, borderBottom: `1px solid rgba(201,169,110,0.15)` }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/home" viewTransition>
              <button
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </button>
            </Link>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: GOLD, letterSpacing: "0.18em" }}>
                MoroccanStay
              </p>
              <h1 className="text-xl font-bold text-white" style={{ letterSpacing: "-0.01em" }}>
                Tourist Guides
              </h1>
            </div>
          </div>

          {/* Flash message */}
          {flash && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "rgba(201,169,110,0.15)", border: `1px solid rgba(201,169,110,0.3)`, color: GOLD }}
            >
              <Check className="w-4 h-4" />
              {flash}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── Guide mode (assignments + availability) ── */}
        {role === "guide" && (
          <div className="mb-10 space-y-4">
            <div
              className="rounded-2xl p-6 flex items-center justify-between gap-4"
              style={{ background: "#fff", border: "1px solid #EDE8DF", boxShadow: "0 2px 16px rgba(26,26,46,0.05)" }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: GOLD, letterSpacing: "0.18em" }}>
                  Guide panel
                </p>
                <h2 className="text-lg font-bold text-gray-900" style={{ letterSpacing: "-0.01em" }}>
                  Welcome, {session?.name}
                </h2>
                <p className="text-sm" style={{ color: "#777" }}>
                  Manage your assignments and availability.
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    if (!guideProfile) return toast.error("Guide profile not found.");
                    const updated = await setGuideAvailability(guideProfile.id, !guideProfile.available);
                    toast.success(updated.available ? "You are now available" : "You are now unavailable");
                  } catch (e) {
                    toast.error(e?.message || "Failed to update availability");
                  }
                }}
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
                style={
                  guideProfile?.available
                    ? { background: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0", cursor: "pointer" }
                    : { background: "#f3f4f6", color: "#6b7280", border: "1px solid #e5e7eb", cursor: "pointer" }
                }
              >
                {guideProfile?.available ? "Available" : "Unavailable"}
              </button>
            </div>

            <div
              className="rounded-2xl p-6"
              style={{ background: "#fff", border: "1px solid #EDE8DF", boxShadow: "0 2px 16px rgba(26,26,46,0.05)" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: GOLD, letterSpacing: "0.18em" }}>
                Your assignments
              </p>
              {assignments.length === 0 ? (
                <p className="text-sm" style={{ color: "#999" }}>No assignments yet.</p>
              ) : (
                <div className="space-y-3">
                  {assignments.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between gap-4 rounded-xl px-5 py-4"
                      style={{ background: "rgba(201,169,110,0.06)", border: `1px solid rgba(201,169,110,0.2)` }}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{a.hotelName}</p>
                        <p className="text-xs" style={{ color: "#999" }}>
                          {a.checkIn} → {a.checkOut} · {a.status}
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#fef9c3", color: "#854d0e" }}>
                        {a.status === "requested" ? "Requested" : a.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <StatCard icon={MapPin}   iconColor={GOLD}        iconBg="rgba(201,169,110,0.1)"  value={guides.length}                      label="Total guides"  />
          <StatCard icon={Users}    iconColor="#4A9B7F"      iconBg="rgba(74,155,127,0.1)"   value={guides.filter(g=>g.available).length} label="Available now" />
          <StatCard icon={Star}     iconColor="#9B6B4A"      iconBg="rgba(155,107,74,0.1)"   value={avgRating}                          label="Avg rating"    />
          <StatCard icon={Calendar} iconColor={GOLD_D}       iconBg="rgba(201,169,110,0.08)" value={booked.length}                      label="Your bookings" />
        </div>

        {/* ── Section title ── */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: GOLD, letterSpacing: "0.18em" }}>
            Browse
          </p>
          <h2 className="text-xl font-bold text-gray-900" style={{ letterSpacing: "-0.01em" }}>
            Available guides
          </h2>
        </div>

        {/* ── Guide cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => {
            const isBooked    = booked.includes(guide.id);
            const canBook     = guide.available && !isBooked;

            return (
              <div
                key={guide.id}
                className="rounded-2xl p-6 flex gap-5"
                style={{
                  background: "#fff",
                  border: isBooked ? `1px solid rgba(201,169,110,0.4)` : "1px solid #EDE8DF",
                  boxShadow: "0 2px 16px rgba(26,26,46,0.05)",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold text-lg"
                  style={{
                    background: guide.available
                      ? "rgba(201,169,110,0.12)"
                      : "rgba(0,0,0,0.05)",
                    color: guide.available ? GOLD_D : "#aaa",
                  }}
                >
                  {guide.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-gray-900" style={{ fontSize: "1rem" }}>
                      {guide.name}
                    </h3>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                      style={
                        guide.available
                          ? { background: "#dcfce7", color: "#15803d" }
                          : { background: "#f3f4f6", color: "#9ca3af" }
                      }
                    >
                      {guide.available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  <div className="space-y-1 mb-3 text-sm" style={{ color: "#666" }}>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" style={{ color: GOLD }} />
                      {guide.city}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" style={{ color: GOLD }} />
                      {guide.language}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: GOLD_D, fontWeight: 600 }}>{guide.rate} Dh</span>
                      <span style={{ color: "#aaa" }}>/ hour</span>
                    </div>
                  </div>

                  {/* Rating stars */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {[1,2,3,4,5].map((i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5"
                          style={{ color: i <= Math.round(guide.rating) ? GOLD : "#e5e7eb" }}
                          fill={i <= Math.round(guide.rating) ? GOLD : "none"}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold" style={{ color: GOLD_D }}>{guide.rating}</span>
                  </div>

                  {/* Book button */}
                  <button
                    disabled={!canBook}
                    onClick={() => handleBook(guide)}
                    className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={
                      isBooked
                        ? { background: "rgba(201,169,110,0.12)", color: GOLD_D, border: `1px solid rgba(201,169,110,0.3)`, cursor: "default" }
                        : canBook
                        ? { background: `linear-gradient(135deg,${GOLD},${GOLD_D})`, color: "#fff", border: "none", boxShadow: "0 2px 12px rgba(139,105,20,0.25)", cursor: "pointer" }
                        : { background: "#f3f4f6", color: "#d1d5db", border: "none", cursor: "not-allowed" }
                    }
                    onMouseEnter={(e) => { if (canBook) e.currentTarget.style.opacity = "0.88"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  >
                    {isBooked ? (
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" /> Booked
                      </span>
                    ) : canBook ? "Book guide" : "Unavailable"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Empty completed section ── handled gracefully ── */}
        {booked.length > 0 && (
          <div className="mt-12">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: GOLD, letterSpacing: "0.18em" }}>
                Your bookings
              </p>
              <h2 className="text-xl font-bold text-gray-900" style={{ letterSpacing: "-0.01em" }}>
                Confirmed requests
              </h2>
            </div>
            <div className="space-y-3">
              {booked.map((gid) => {
                const g = guides.find((x) => x.id === gid);
                if (!g) return null;
                return (
                  <div
                    key={gid}
                    className="flex items-center gap-4 rounded-xl px-5 py-4"
                    style={{ background: "rgba(201,169,110,0.06)", border: `1px solid rgba(201,169,110,0.2)` }}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(201,169,110,0.15)" }}>
                      <Check className="w-4 h-4" style={{ color: GOLD_D }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{g.name}</p>
                      <p className="text-xs" style={{ color: "#999" }}>{g.city} · {g.rate} Dh/hr</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#dcfce7", color: "#15803d" }}>
                      Confirmed
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}