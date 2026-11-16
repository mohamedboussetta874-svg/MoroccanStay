import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { CreditCard, Lock, Check, ChevronLeft, MapPin, Star, Shield } from "lucide-react";
import { Navbar } from "../components/navbar";
import { Input } from "../components/ui/input";
import { formatMad } from "../lib/currency";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: GOLD_D, letterSpacing: "0.1em" }}>
      {children}
    </label>
  );
}
function GoldInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: GOLD }} />}
      <Input
        {...props}
        className={`h-11 rounded-xl text-gray-900 ${Icon ? "pl-10" : ""}`}
        style={{ border: "1.5px solid #E8D5A3", background: "#FFFDF7" }}
      />
    </div>
  );
}

export function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hotels, createBooking, createPayment, createAssignment } = useAppData();
  const { session, isLoggedIn } = useAuth();
  const hotel = hotels.find((h) => h.id === id);

  const [form, setForm] = useState({ cardNumber: "", cardName: "", expiryDate: "", cvv: "" });
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete]     = useState(false);

  const draft = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("ms_booking_draft") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please sign in to pay.");
      navigate(`/reservation/${id}`, { replace: true });
    }
  }, [isLoggedIn, id, navigate]);

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#FAFAF8" }}>
        <p className="text-xl font-bold text-gray-900">Property not found</p>
        <Link to="/home">
          <button className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: `linear-gradient(135deg,${GOLD},${GOLD_D})`, border: "none" }}>
            Back to Home
          </button>
        </Link>
      </div>
    );
  }

  const selectedRoom = hotel.rooms.find((r) => r.id === draft?.roomId) || hotel.rooms[0];
  const nights = draft?.nights || 1;
  const subtotal = draft?.subtotal ?? selectedRoom.price * nights;
  const service = draft?.serviceFee ?? Math.round(subtotal * 0.1);
  const taxes = Math.round(subtotal * 0.12);
  const total = (draft?.total ?? (subtotal + service)) + taxes;

  const handleCardNumber = (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 16);
    setForm((p) => ({ ...p, cardNumber: v.match(/.{1,4}/g)?.join(" ") ?? v }));
  };
  const handleExpiry = (e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
    setForm((p) => ({ ...p, expiryDate: v.length >= 2 ? `${v.slice(0,2)}/${v.slice(2)}` : v }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    (async () => {
      try {
        const booking = await createBooking({
          userId: session?.id,
          guest: draft?.fullName || session?.name || "Guest",
          email: draft?.email || session?.email || "",
          phone: draft?.phone || "",
          hotelId: hotel.id,
          hotel: hotel.name,
          roomId: selectedRoom.id,
          room: selectedRoom.name,
          checkIn: draft?.checkIn || new Date().toISOString().slice(0, 10),
          checkOut: draft?.checkOut || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
          nights,
          amount: total,
          guideId: draft?.guide?.id || null,
          guideName: draft?.guide?.name || null,
        });
        await createPayment({
          bookingId: booking.id,
          amount: total,
          method: "card",
          meta: { last4: String(form.cardNumber || "").replace(/\s/g, "").slice(-4) },
        });
        if (draft?.guide?.id) {
          await createAssignment({
            guideId: draft.guide.id,
            guideName: draft.guide.name,
            bookingId: booking.id,
            hotelId: hotel.id,
            hotelName: hotel.name,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            status: "requested",
          });
        }
        sessionStorage.removeItem("ms_booking_draft");
        setComplete(true);
        toast.success("Payment successful!");
        setTimeout(() => navigate("/home", { viewTransition: true }), 3000);
      } catch (err) {
        toast.error(err?.message || "Payment failed");
      } finally {
        setProcessing(false);
      }
    })();
  };

  /* ── Success screen ── */
  if (complete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: NAVY }}>
        <div
          className="max-w-md w-full rounded-2xl p-10 text-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,169,110,0.25)", backdropFilter: "blur(16px)" }}
        >
          {/* Check circle */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(201,169,110,0.15)", border: `2px solid ${GOLD}` }}
          >
            <Check className="w-9 h-9" style={{ color: GOLD }} />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GOLD, letterSpacing: "0.2em" }}>
            Booking confirmed
          </p>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
            Payment successful!
          </h1>
          <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
            Your stay at <span style={{ color: GOLD }}>{hotel.name}</span> is confirmed.
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Redirecting to home…</p>

          <div
            className="mt-6 h-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg,${GOLD},${GOLD_D})`, animation: "progress 3s linear forwards" }}
            />
          </div>
          <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-7 text-sm" style={{ color: GOLD_D }}>
          <Link to={`/reservation/${hotel.id}`} className="flex items-center gap-1 hover:opacity-70 transition-opacity font-medium">
            <ChevronLeft className="w-4 h-4" /> Back
          </Link>
          <span style={{ color: GOLD }}>·</span>
          <span style={{ color: "#999" }}>Payment</span>
        </div>

        <h1 className="font-bold text-gray-900 mb-8" style={{ fontSize: "1.7rem", letterSpacing: "-0.02em" }}>
          Secure payment
        </h1>

        <div className="grid grid-cols-3 gap-10">
          {/* ── Payment form ── */}
          <div className="col-span-2">
            <div
              className="rounded-2xl p-8"
              style={{ background: "#fff", border: "1px solid #EDE8DF", boxShadow: "0 2px 16px rgba(26,26,46,0.06)" }}
            >
              <div className="h-1 rounded-full mb-7" style={{ background: `linear-gradient(90deg,${GOLD},${GOLD_D})` }} />

              {/* Security badge */}
              <div
                className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl text-sm"
                style={{ background: "rgba(201,169,110,0.06)", border: `1px solid rgba(201,169,110,0.2)` }}
              >
                <Shield className="w-4 h-4" style={{ color: GOLD }} />
                <span style={{ color: GOLD_D, fontSize: "0.82rem" }}>
                  Your payment details are encrypted and secured (demo UI)
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <FieldLabel>Name on card</FieldLabel>
                  <GoldInput type="text" placeholder="Youssef Alami" value={form.cardName}
                    onChange={(e) => setForm((p) => ({ ...p, cardName: e.target.value }))} required />
                </div>

                <div>
                  <FieldLabel>Card number</FieldLabel>
                  <GoldInput icon={CreditCard} type="text" placeholder="1234 5678 9012 3456"
                    value={form.cardNumber} onChange={handleCardNumber} maxLength={19} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Expiry date</FieldLabel>
                    <GoldInput type="text" placeholder="MM/YY" value={form.expiryDate}
                      onChange={handleExpiry} maxLength={5} required />
                  </div>
                  <div>
                    <FieldLabel>CVV</FieldLabel>
                    <GoldInput icon={Lock} type="text" placeholder="123"
                      value={form.cvv}
                      onChange={(e) => setForm((p) => ({ ...p, cvv: e.target.value.replace(/\D/g,"").slice(0,3) }))}
                      maxLength={3} required />
                  </div>
                </div>

                {/* Terms note */}
                <div
                  className="rounded-xl px-4 py-3 text-xs"
                  style={{ background: "rgba(201,169,110,0.05)", border: `1px solid rgba(201,169,110,0.15)`, color: "#999" }}
                >
                  By confirming, you agree to MoroccanStay's booking and cancellation terms.
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full h-12 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
                  style={{
                    background: processing ? "rgba(201,169,110,0.4)" : `linear-gradient(135deg,${GOLD},${GOLD_D})`,
                    color: "#fff",
                    border: "none",
                    letterSpacing: "0.04em",
                    boxShadow: processing ? "none" : "0 4px 20px rgba(139,105,20,0.3)",
                    cursor: processing ? "not-allowed" : "pointer",
                  }}
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing payment…
                    </>
                  ) : (
                    `Pay ${formatMad(total)}`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* ── Summary ── */}
          <div className="col-span-1">
            <div
              className="sticky top-24 rounded-2xl p-6"
              style={{ background: "#fff", border: "1px solid #EDE8DF", boxShadow: "0 8px 32px rgba(26,26,46,0.08)" }}
            >
              <div className="h-1 rounded-full mb-5" style={{ background: `linear-gradient(90deg,${GOLD},${GOLD_D})` }} />

              {/* Hotel */}
              <div className="mb-5">
                <div className="relative overflow-hidden rounded-xl mb-3" style={{ height: 120 }}>
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                  <div
                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(26,26,46,0.82)", color: GOLD }}
                  >
                    <Star className="w-3 h-3 fill-current" /> {hotel.rating}
                  </div>
                </div>
                <p className="font-bold text-gray-900 text-sm">{hotel.name}</p>
                <p className="flex items-center gap-1 text-xs mt-0.5" style={{ color: GOLD_D }}>
                  <MapPin className="w-3 h-3" /> {hotel.location}
                </p>
              </div>

              {/* Booking details */}
              <div
                className="rounded-xl px-4 py-3 mb-4 space-y-2 text-xs"
                style={{ background: "#FFFDF7", border: "1px solid #EDE8DF" }}
              >
                {[
                  ["Room",   selectedRoom.name],
                  ["Dates",  "20–24 Feb 2026"],
                  ["Nights", nights],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color: "#999" }}>{k}</span>
                    <span className="font-semibold text-gray-800">{v}</span>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 mb-4 text-sm">
                {[
                  [`${formatMad(selectedRoom.price)} × ${nights} nuits`, formatMad(subtotal)],
                  ["Service fee",                                          formatMad(service)],
                  ["Tax (est.)",                                           formatMad(taxes)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-gray-500">
                    <span>{k}</span><span>{v}</span>
                  </div>
                ))}
              </div>

              <div
                className="flex justify-between items-center pt-4 font-bold"
                style={{ borderTop: "1px solid #EDE8DF", color: NAVY }}
              >
                <span>Total</span>
                <span style={{ fontSize: "1.25rem" }}>{formatMad(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}