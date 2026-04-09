import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search, MapPin, Calendar, Users, Star, DollarSign,
  RotateCcw, Lock, Phone, Percent, Quote, ChevronRight,
  Award, Globe, Shield
} from "lucide-react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { hotels } from "../data/hotels";
import { formatMad } from "../lib/currency";
import { useAuth } from "../hooks/useAuth";

/* ─── Brand Tokens ─────────────────────────────────────────── */
// Primary gold   : #C9A96E
// Gold dark      : #8B6914
// Gold light     : #F0E0BB
// Navy            : #1A1A2E
// Navy mid        : #16213E
// Surface         : #FAFAF8
// ────────────────────────────────────────────────────────────── */

export function HomePage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [city, setCity]       = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests]   = useState("2");

  const searchTo = useMemo(() => {
    const params = new URLSearchParams();
    if (city.trim())  params.set("city", city.trim());
    if (checkIn)      params.set("checkIn", checkIn);
    if (checkOut)     params.set("checkOut", checkOut);
    if (guests)       params.set("guests", guests);
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  }, [city, checkIn, checkOut, guests]);

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1723465308831-29da05e011f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGV4dGVyaW9yfGVufDF8fHx8MTc3MTIyNTcxNHww&ixlib=rb-4.1.0&q=80&w=1920')`,
          }}
        />
        {/* Gradient overlay — navy tint, not flat black */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(26,26,46,0.82) 0%, rgba(22,33,62,0.65) 50%, rgba(26,26,46,0.75) 100%)",
          }}
        />

        {/* Gold horizontal accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: "linear-gradient(90deg, transparent, #C9A96E, transparent)" }}
        />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
            style={{
              border: "1px solid rgba(201,169,110,0.5)",
              color: "#C9A96E",
              background: "rgba(201,169,110,0.08)",
              letterSpacing: "0.18em",
            }}
          >
            <Award className="w-3.5 h-3.5" />
            Premium Moroccan Stays
          </div>

          <h1
            className="font-bold text-white mb-5"
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 24px rgba(0,0,0,0.35)",
            }}
          >
            Discover Morocco's Finest
            <br />
            <span style={{ color: "#C9A96E" }}>Hotels & Riads</span>
          </h1>

          <p
            className="text-lg mb-12 max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}
          >
            Curated properties from imperial medinas to Atlantic shores —
            transparent pricing in Moroccan Dirhams
          </p>

          {/* Search card */}
          <div
            className="rounded-2xl p-6 md:p-8 max-w-4xl mx-auto"
            style={{
              background: "rgba(250,250,248,0.97)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 24px 64px rgba(26,26,46,0.35)",
              border: "1px solid rgba(201,169,110,0.2)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Destination", icon: MapPin,  type: "text",   value: city,    onChange: setCity,    placeholder: "Marrakech, Fès…" },
                { label: "Check-in",    icon: Calendar, type: "date",   value: checkIn, onChange: setCheckIn, placeholder: "" },
                { label: "Check-out",   icon: Calendar, type: "date",   value: checkOut,onChange: setCheckOut,placeholder: "" },
                { label: "Guests",      icon: Users,    type: "number", value: guests,  onChange: setGuests,  placeholder: "2" },
              ].map(({ label, icon: Icon, type, value, onChange, placeholder }) => (
                <div key={label}>
                  <label
                    className="block text-left text-xs font-semibold uppercase tracking-wider mb-2"
                    style={{ color: "#8B6914", letterSpacing: "0.1em" }}
                  >
                    {label}
                  </label>
                  <div className="relative">
                    <Icon
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "#C9A96E" }}
                    />
                    <Input
                      type={type}
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      min={type === "number" ? "1" : undefined}
                      className="pl-10 h-12 rounded-xl text-gray-900"
                      style={{
                        border: "1.5px solid #E8D5A3",
                        background: "#FFFDF7",
                        fontSize: "0.95rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              asChild
              className="w-full mt-5 h-13 rounded-xl text-base font-semibold tracking-wide"
              style={{
                background: "linear-gradient(135deg, #C9A96E 0%, #8B6914 100%)",
                color: "#fff",
                height: "52px",
                letterSpacing: "0.04em",
                boxShadow: "0 4px 20px rgba(139,105,20,0.35)",
                border: "none",
              }}
            >
              <Link to={searchTo} viewTransition>
                <Search className="w-4 h-4 mr-2" />
                Search Available Hotels
              </Link>
            </Button>
          </div>

          {/* Trust row */}
          <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
            {["200+ Properties", "Verified Reviews", "Price Guarantee"].map((t) => (
              <div key={t} className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>
                <div className="w-1 h-1 rounded-full" style={{ background: "#C9A96E" }} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED HOTELS ──────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "#FAFAF8" }}>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-end justify-between mb-14">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "#C9A96E", letterSpacing: "0.2em" }}
              >
                Curated selection
              </p>
              <h2
                className="font-bold text-gray-900 dark:text-white"
                style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", letterSpacing: "-0.02em", lineHeight: 1.15 }}
              >
                Featured Properties
              </h2>
            </div>
            <Link
              to="/search"
              className="hidden md:flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: "#8B6914" }}
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel, i) => (
              <article
                key={hotel.id}
                className="group rounded-2xl overflow-hidden flex flex-col"
                style={{
                  background: "#fff",
                  border: "1px solid #EDE8DF",
                  boxShadow: "0 2px 16px rgba(26,26,46,0.06)",
                  transition: "box-shadow 0.3s ease, transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(26,26,46,0.14)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 16px rgba(26,26,46,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Rating badge */}
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(26,26,46,0.82)", color: "#C9A96E", backdropFilter: "blur(8px)" }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    {hotel.rating}
                  </div>
                  {/* Gold bottom gradient */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-16"
                    style={{ background: "linear-gradient(to top, rgba(26,26,46,0.5), transparent)" }}
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 mb-2" style={{ color: "#8B6914", fontSize: "0.78rem", fontWeight: 600 }}>
                    <MapPin className="w-3.5 h-3.5" />
                    {hotel.location}
                  </div>
                  <h3
                    className="font-bold text-gray-900 mb-4 flex-1"
                    style={{ fontSize: "1.1rem", lineHeight: 1.3 }}
                  >
                    {hotel.name}
                  </h3>
                  <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid #EDE8DF" }}>
                    <div>
                      <span
                        className="font-bold"
                        style={{ fontSize: "1.35rem", color: "#1A1A2E" }}
                      >
                        {formatMad(hotel.price)}
                      </span>
                      <span className="text-gray-400 text-sm ml-1">/ nuit</span>
                    </div>
                    <Link to={`/hotel/${hotel.id}`} viewTransition>
                      <button
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{
                          background: "linear-gradient(135deg, #C9A96E, #8B6914)",
                          color: "#fff",
                          border: "none",
                          boxShadow: "0 2px 12px rgba(139,105,20,0.25)",
                        }}
                      >
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6">
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, #C9A96E40, transparent)" }} />
      </div>

      {/* ── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "#FAFAF8" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#C9A96E", letterSpacing: "0.2em" }}
            >
              Why MoroccanStay
            </p>
            <h2
              className="font-bold text-gray-900 dark:text-white"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", letterSpacing: "-0.02em" }}
            >
              The Smarter Way to Book
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: DollarSign,
                title: "Best Price Guarantee",
                desc: "Exclusive rates in Moroccan Dirhams — no hidden conversion fees.",
                color: "#C9A96E",
                bg: "rgba(201,169,110,0.08)",
              },
              {
                icon: RotateCcw,
                title: "Flexible Cancellation",
                desc: "Free cancellation up to 24 hours before check-in. No stress.",
                color: "#4A9B7F",
                bg: "rgba(74,155,127,0.08)",
              },
              {
                icon: Shield,
                title: "Secure Payment",
                desc: "Bank-level encryption with Moroccan local payment options.",
                color: "#5B7FA6",
                bg: "rgba(91,127,166,0.08)",
              },
              {
                icon: Phone,
                title: "24/7 Local Support",
                desc: "Moroccan team available in Arabic, French, and English.",
                color: "#9B6B4A",
                bg: "rgba(155,107,74,0.08)",
              },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="rounded-2xl p-7 flex flex-col gap-4 transition-all duration-300 group"
                style={{
                  background: "#fff",
                  border: "1px solid #EDE8DF",
                  boxShadow: "0 2px 12px rgba(26,26,46,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 12px 36px rgba(26,26,46,0.1)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(26,26,46,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: bg }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontSize: "1rem" }}>
                    {title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFER BANNER ─────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        {/* Single background — no duplicate image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1589391886645-d51941baf7fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920')`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(26,26,46,0.92) 0%, rgba(139,105,20,0.75) 100%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{ background: "#C9A96E", color: "#1A1A2E", letterSpacing: "0.15em" }}
            >
              <Percent className="w-3.5 h-3.5" />
              Limited Time
            </div>
            <h3
              className="font-bold text-white mb-5"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em", lineHeight: 1.15 }}
            >
              Summer Paradise
              <br />
              <span style={{ color: "#C9A96E" }}>Awaits You</span>
            </h3>
            <p className="mb-6" style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.1rem", lineHeight: 1.7 }}>
              Get <strong style={{ color: "#C9A96E" }}>20% off</strong> all summer bookings along Morocco's
              beautiful Atlantic coast — Agadir, Essaouira & more.
            </p>
            <div className="flex items-center gap-6 mb-8" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" style={{ color: "#C9A96E" }} />
                Valid until Sept 30
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: "#C9A96E" }} />
                Agadir, Essaouira & more
              </span>
            </div>
            <Link to="/search" viewTransition>
              <button
                className="px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: "#C9A96E",
                  color: "#1A1A2E",
                  border: "none",
                  letterSpacing: "0.04em",
                  boxShadow: "0 4px 24px rgba(201,169,110,0.4)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#B8914A"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#C9A96E"; }}
              >
                Claim Your Offer →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ background: "#FAFAF8" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "#C9A96E", letterSpacing: "0.2em" }}
            >
              Guest Stories
            </p>
            <h2
              className="font-bold text-gray-900 dark:text-white"
              style={{ fontSize: "clamp(1.8rem, 3vw, 2.5rem)", letterSpacing: "-0.02em" }}
            >
              What Our Guests Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "Very easy booking and great hotel options. The process was smooth and customer service was excellent. Will definitely book again!",
                name: "Sarah Johnson",
                location: "Casablanca",
                time: "2 weeks ago",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80",
              },
              {
                text: "Found the perfect riad in Marrakech! The prices were great and the booking process was incredibly simple. Highly recommended!",
                name: "Mohammed Alami",
                location: "Marrakech",
                time: "3 weeks ago",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
              },
              {
                text: "Amazing experience! The hotels were exactly as described and the support team helped us throughout our stay. Merci beaucoup!",
                name: "Emma Dubois",
                location: "Fès",
                time: "3 weeks ago",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
              },
            ].map(({ text, name, location, time, avatar }) => (
              <div
                key={name}
                className="rounded-2xl p-8 flex flex-col gap-6"
                style={{
                  background: "#fff",
                  border: "1px solid #EDE8DF",
                  boxShadow: "0 2px 16px rgba(26,26,46,0.05)",
                }}
              >
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: "#C9A96E" }} />
                  ))}
                </div>

                {/* Quote mark */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(201,169,110,0.1)" }}
                >
                  <Quote className="w-4 h-4" style={{ color: "#C9A96E" }} />
                </div>

                <p className="text-gray-700 italic leading-relaxed flex-1" style={{ fontSize: "0.95rem" }}>
                  "{text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid #EDE8DF" }}>
                  <img
                    src={avatar}
                    alt={name}
                    className="w-11 h-11 rounded-full object-cover"
                    style={{ border: "2px solid #C9A96E" }}
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{name}</p>
                    <p className="text-gray-400 text-xs">
                      {location} · {time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}