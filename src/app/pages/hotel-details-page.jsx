import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  MapPin, Star, Wifi, Waves, Car, Wind, Coffee, Dumbbell,
  Sparkles, UtensilsCrossed, Calendar, Users, Trees, Bath,
  ChevronLeft, Share2, MessageSquare, ThumbsUp, Send,
} from "lucide-react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { AuthModal } from "../components/AuthModal";
import { formatMad } from "../lib/currency";
import { useAuth } from "../hooks/useAuth";
import { useAppData } from "../hooks/useAppData";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

const amenityIcons = {
  "WiFi":Wifi,"Wi-Fi":Wifi,"Pool":Waves,"Piscine":Waves,"Parking":Car,
  "Air Conditioning":Wind,"Climatisation":Wind,"Breakfast":Coffee,
  "Petit-déjeuner":Coffee,"Gym":Dumbbell,"Salle de sport":Dumbbell,
  "Spa":Sparkles,"Restaurant":UtensilsCrossed,"Fine Dining":UtensilsCrossed,
  "Beach Access":Waves,"Accès plage":Waves,"Water Sports":Waves,"Nautisme":Waves,
  "Concierge":Users,"Conciergerie":Users,"Business Center":Users,
  "Centre d'affaires":Users,"Terrasse":Trees,"Hammam":Bath,
};

/* ── Mock reviews per hotel ── */
const INIT_REVIEWS = {
  "1": [
    { id:"r1", author:"Sarah M.",    avatar:"SM", rating:5, date:"March 2026", text:"Exceptional stay! The ocean view was breathtaking and the staff were incredibly welcoming. Will definitely return.", helpful:8 },
    { id:"r2", author:"Karim B.",    avatar:"KB", rating:4, date:"Feb 2026",   text:"Great location, beautiful rooms. Breakfast could be improved but overall a very pleasant experience.", helpful:5 },
  ],
  "2": [
    { id:"r3", author:"Emma D.",     avatar:"ED", rating:5, date:"March 2026", text:"The most authentic riad experience I've ever had. The zellige courtyard is stunning, and the rooftop views are unforgettable.", helpful:12 },
  ],
  "5": [
    { id:"r4", author:"Youssef A.",  avatar:"YA", rating:5, date:"April 2026", text:"Perfect beach resort. Private beach, amazing pools, and the oceanfront villa exceeded all expectations. A true paradise.", helpful:15 },
    { id:"r5", author:"Nadia R.",    avatar:"NR", rating:4, date:"March 2026", text:"Lovely resort with great amenities. The water sports team was very professional and fun.", helpful:6 },
  ],
};

function StarRating({ value, onChange, size = 22 }) {
  const [hov, setHov] = useState(0);
  return (
    <div style={{ display:"flex", gap:4 }}>
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button"
          onClick={() => onChange?.(i)}
          onMouseEnter={() => setHov(i)}
          onMouseLeave={() => setHov(0)}
          style={{ background:"none", border:"none", cursor:onChange?"pointer":"default", padding:2 }}
        >
          <Star style={{
            width:size, height:size,
            fill: i <= (hov || value) ? GOLD : "none",
            color: i <= (hov || value) ? GOLD : "#d1d5db",
            transition:"all .1s",
          }} />
        </button>
      ))}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label style={{ display:"block", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:GOLD_D, marginBottom:6 }}>
      {children}
    </label>
  );
}

export function HotelDetailsPage() {
  const { id } = useParams();
  const { isLoggedIn, session } = useAuth();
  const { hotels, listApprovedReviews, submitReviewPending } = useAppData();
  const navigate = useNavigate();
  const hotel = hotels.find(h => h.id === id);
  const [pendingBook, setPendingBook] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn,  setCheckIn]  = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests,   setGuests]   = useState("2");
  const [selectedRoom, setSelectedRoom] = useState(hotel?.rooms[0].id || "");

  /* Reviews state */
  const [reviews,    setReviews]    = useState(INIT_REVIEWS[id] || []);
  const [newRating,  setNewRating]  = useState(0);
  const [newText,    setNewText]    = useState("");
  const [reviewSent, setReviewSent] = useState(false);
  const [helpfulIds, setHelpfulIds] = useState([]);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const approved = await listApprovedReviews(id);
        if (!alive) return;
        if (approved?.length) {
          // merge: show approved first, then existing demo
          const demo = INIT_REVIEWS[id] || [];
          const merged = [
            ...approved.map((r) => ({ ...r, pending: false, helpful: r.helpful ?? 0 })),
            ...demo,
          ];
          // dedupe by id
          const seen = new Set();
          setReviews(merged.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true))));
        }
      } catch {
        // ignore, keep demo reviews
      }
    })();
    return () => { alive = false; };
  }, [id, listApprovedReviews]);

  /* Auth modal */
  const [authOpen,   setAuthOpen]   = useState(false);
  const [authReason, setAuthReason] = useState("");

  if (!hotel) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, background:"#FAFAF8" }}>
        <p style={{ fontSize:"1.2rem", fontWeight:700, color:NAVY }}>Property not found</p>
        <Link to="/home"><button style={{ padding:"10px 24px", borderRadius:12, background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, color:"#fff", border:"none", cursor:"pointer" }}>Back</button></Link>
      </div>
    );
  }

  const selectedRoomData = hotel.rooms.find(r => r.id === selectedRoom) || hotel.rooms[0];
  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
    : 1;
  const totalPrice = selectedRoomData.price * nights;
  const serviceFee = Math.round(totalPrice * 0.1);
  const avgRating  = reviews.length
    ? (reviews.reduce((s,r) => s+r.rating, 0) / reviews.length).toFixed(1)
    : hotel.rating;

  const handleBookNow = () => {
    if (!isLoggedIn) {
      setPendingBook(true);
      setAuthReason("Sign in or create an account to book this property.");
      setAuthOpen(true);
    } else {
      navigate(`/reservation/${hotel.id}`, { viewTransition: true });
    }
  };

  const submitReview = () => {
    if (!isLoggedIn) {
      setAuthReason("Please sign in to leave a review.");
      setAuthOpen(true);
      return;
    }
    if (newRating === 0 || !newText.trim()) return;
    const review = {
      id: `r-${Date.now()}`,
      author: session?.name || "Anonymous",
      avatar: (session?.name || "A").split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(),
      rating: newRating,
      date: new Date().toLocaleDateString("en-US", { month:"long", year:"numeric" }),
      text: newText.trim(),
      helpful: 0,
      pending: true, /* goes to admin for moderation */
    };
    setReviews(p => [review, ...p]);
    setNewRating(0);
    setNewText("");
    setReviewSent(true);
    submitReviewPending({ ...review, hotelId:id, hotelName:hotel.name, userId:session?.id })
      .catch(() => {});
  };

  const toggleHelpful = (rid) => {
    if (helpfulIds.includes(rid)) return;
    setHelpfulIds(p => [...p, rid]);
    setReviews(p => p.map(r => r.id===rid ? { ...r, helpful:r.helpful+1 } : r));
  };

  const inputStyle = {
    width:"100%", height:44, padding:"0 14px 0 40px",
    borderRadius:12, border:"1.5px solid #E8D5A3",
    background:"#FFFDF7", fontSize:14, color:NAVY, outline:"none",
  };

  return (
    <div style={{ minHeight:"100vh", background:"#FAFAF8" }}>
      <Navbar />

      <AuthModal
        open={authOpen}
        onClose={() => { setAuthOpen(false); setPendingBook(false); }}
        onSuccess={() => {
          setAuthOpen(false);
          if (pendingBook) {
            setPendingBook(false);
            navigate(`/reservation/${hotel.id}`, { viewTransition: true });
          }
        }}
        reason={authReason}
      />

      <div style={{ maxWidth:1200, margin:"0 auto", padding:"36px 24px" }}>

        {/* Breadcrumb */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:22, fontSize:13 }}>
          <Link to="/home" style={{ display:"flex", alignItems:"center", gap:4, color:GOLD_D, fontWeight:600, textDecoration:"none" }}>
            <ChevronLeft style={{ width:16, height:16 }} /> Back
          </Link>
          <span style={{ color:GOLD }}>·</span>
          <span style={{ color:"#999" }}>{hotel.location}</span>
          <span style={{ color:GOLD }}>·</span>
          <span style={{ color:"#555" }}>{hotel.name}</span>
        </div>

        {/* Gallery */}
        <div style={{ display:"grid", gridTemplateColumns:"3fr 1fr", gap:10, marginBottom:36, borderRadius:20, overflow:"hidden", maxHeight:500 }}>
          <div style={{ position:"relative", overflow:"hidden" }}>
            <img src={hotel.images[selectedImage]} alt={hotel.name}
              style={{ width:"100%", height:"100%", objectFit:"cover", minHeight:460, transition:"all .4s" }} />
            <button type="button"
              style={{ position:"absolute", top:14, right:14, width:36, height:36, borderRadius:"50%", background:"rgba(26,26,46,0.6)", border:"1px solid rgba(201,169,110,0.3)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <Share2 style={{ width:15, height:15, color:GOLD }} />
            </button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {hotel.images.slice(1,5).map((img,i) => (
              <div key={i} onClick={() => setSelectedImage(i+1)}
                style={{
                  flex:1, overflow:"hidden", borderRadius:8, cursor:"pointer",
                  border: selectedImage===i+1 ? `2.5px solid ${GOLD}` : "2.5px solid transparent",
                  transition:"border-color .2s",
                }}>
                <img src={img} alt={`${hotel.name} ${i+2}`}
                  style={{ width:"100%", height:"100%", objectFit:"cover", minHeight:100 }}
                  onMouseEnter={e => { e.currentTarget.style.opacity=".82"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity="1"; }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main 2-col */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr minmax(0,360px)", gap:32 }}>

          {/* ── Left ── */}
          <div>
            {/* Header */}
            <div style={{ marginBottom:24 }}>
              <h1 style={{ fontSize:"clamp(1.5rem,3vw,2.2rem)", fontWeight:700, color:NAVY, letterSpacing:"-0.02em", marginBottom:12 }}>
                {hotel.name}
              </h1>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:8, background:`linear-gradient(135deg,${GOLD},${GOLD_D})` }}>
                  <Star style={{ width:14, height:14, fill:"#fff", color:"#fff" }} />
                  <span style={{ fontSize:14, fontWeight:700, color:"#fff" }}>{avgRating}</span>
                  <span style={{ fontSize:11, color:"rgba(255,255,255,0.75)" }}>({reviews.length} reviews)</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:4, color:"#888", fontSize:13 }}>
                  <MapPin style={{ width:14, height:14, color:GOLD }} />
                  {hotel.location}
                </div>
              </div>
            </div>

            <div style={{ height:1, background:`linear-gradient(90deg,rgba(201,169,110,0.3),transparent)`, marginBottom:24 }} />

            {/* Description */}
            <div style={{ marginBottom:28 }}>
              <h2 style={{ fontSize:"1.1rem", fontWeight:700, color:NAVY, marginBottom:12 }}>About this property</h2>
              <p style={{ fontSize:14, color:"#555", lineHeight:1.75 }}>{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div style={{ marginBottom:32 }}>
              <h2 style={{ fontSize:"1.1rem", fontWeight:700, color:NAVY, marginBottom:16 }}>Amenities</h2>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
                {hotel.amenities.map(a => {
                  const Icon = amenityIcons[a] ?? Wifi;
                  return (
                    <div key={a} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:12, background:"#fff", border:"1px solid #EDE8DF", fontSize:13, color:"#555" }}>
                      <Icon style={{ width:18, height:18, color:GOLD, flexShrink:0 }} />
                      {a}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── REVIEWS SECTION ── */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <MessageSquare style={{ width:20, height:20, color:GOLD }} />
                <h2 style={{ fontSize:"1.1rem", fontWeight:700, color:NAVY, margin:0 }}>
                  Guest reviews ({reviews.length})
                </h2>
              </div>

              {/* Existing reviews */}
              {reviews.length > 0 ? (
                <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:28 }}>
                  {reviews.map(r => (
                    <div key={r.id} style={{
                      padding:"16px 18px", borderRadius:16, background:"#fff",
                      border: r.pending ? `1px solid rgba(201,169,110,0.3)` : "1px solid #EDE8DF",
                      boxShadow:"0 2px 10px rgba(26,26,46,0.04)",
                    }}>
                      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:10 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#fff", flexShrink:0 }}>
                            {r.avatar}
                          </div>
                          <div>
                            <p style={{ fontSize:13, fontWeight:700, color:NAVY, margin:0 }}>{r.author}</p>
                            <p style={{ fontSize:11, color:"#aaa", margin:0 }}>{r.date}</p>
                          </div>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} style={{ width:12, height:12, fill:i<=r.rating?GOLD:"none", color:i<=r.rating?GOLD:"#e5e7eb" }} />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize:13, color:"#555", lineHeight:1.7, margin:"0 0 10px" }}>{r.text}</p>
                      {r.pending && (
                        <span style={{ fontSize:10, fontWeight:700, color:GOLD_D, background:"rgba(201,169,110,0.1)", padding:"2px 8px", borderRadius:20 }}>
                          Pending moderation
                        </span>
                      )}
                      {!r.pending && (
                        <button type="button" onClick={() => toggleHelpful(r.id)}
                          style={{
                            display:"flex", alignItems:"center", gap:5, fontSize:11, color:helpfulIds.includes(r.id)?GOLD_D:"#aaa",
                            background:"none", border:"none", cursor:helpfulIds.includes(r.id)?"default":"pointer", padding:0,
                          }}>
                          <ThumbsUp style={{ width:12, height:12 }} />
                          Helpful ({r.helpful})
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding:"24px", textAlign:"center", borderRadius:14, border:"1px dashed #EDE8DF", color:"#bbb", fontSize:13, marginBottom:24 }}>
                  No reviews yet. Be the first to leave a review!
                </div>
              )}

              {/* ── Write a review ── */}
              {reviewSent ? (
                <div style={{ padding:"18px 20px", borderRadius:14, background:"#dcfce7", border:"1px solid #bbf7d0", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:20 }}>✅</span>
                  <div>
                    <p style={{ fontSize:14, fontWeight:700, color:"#15803d", margin:0 }}>Review submitted!</p>
                    <p style={{ fontSize:12, color:"#16a34a", margin:0 }}>Your review is pending moderation and will appear shortly.</p>
                  </div>
                </div>
              ) : (
                <div style={{ background:"#fff", borderRadius:16, padding:20, border:"1px solid #EDE8DF" }}>
                  <h3 style={{ fontSize:14, fontWeight:700, color:NAVY, marginBottom:14 }}>
                    {isLoggedIn ? `Leave a review as ${session?.name}` : "Leave a review"}
                  </h3>
                  {!isLoggedIn && (
                    <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(201,169,110,0.07)", border:`1px solid rgba(201,169,110,0.2)`, marginBottom:14, fontSize:12, color:GOLD_D }}>
                      <button type="button" onClick={() => { setAuthReason("Sign in to leave a review."); setAuthOpen(true); }}
                        style={{ fontWeight:700, color:GOLD_D, background:"none", border:"none", cursor:"pointer", padding:0, textDecoration:"underline" }}>
                        Sign in
                      </button>
                      {" "}or{" "}
                      <button type="button" onClick={() => { setAuthReason("Create an account to leave a review."); setAuthOpen(true); }}
                        style={{ fontWeight:700, color:GOLD_D, background:"none", border:"none", cursor:"pointer", padding:0, textDecoration:"underline" }}>
                        create an account
                      </button>
                      {" "}to leave a review.
                    </div>
                  )}
                  <div style={{ marginBottom:14 }}>
                    <FieldLabel>Your rating</FieldLabel>
                    <StarRating value={newRating} onChange={setNewRating} />
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <FieldLabel>Your comment</FieldLabel>
                    <textarea
                      value={newText}
                      onChange={e => setNewText(e.target.value)}
                      placeholder="Share your experience with this property..."
                      rows={4}
                      style={{
                        width:"100%", padding:12, borderRadius:12,
                        border:"1.5px solid #E8D5A3", background:"#FFFDF7",
                        fontSize:13, color:NAVY, outline:"none", resize:"vertical",
                        lineHeight:1.6, fontFamily:"inherit",
                      }}
                      onFocus={e => { e.target.style.borderColor=GOLD; }}
                      onBlur={e  => { e.target.style.borderColor="#E8D5A3"; }}
                    />
                  </div>
                  <button type="button" onClick={submitReview}
                    disabled={!isLoggedIn || newRating===0 || !newText.trim()}
                    style={{
                      display:"flex", alignItems:"center", gap:8,
                      padding:"10px 20px", borderRadius:12, fontSize:13, fontWeight:700,
                      background: (!isLoggedIn||newRating===0||!newText.trim()) ? "#EDE8DF" : `linear-gradient(135deg,${GOLD},${GOLD_D})`,
                      color: (!isLoggedIn||newRating===0||!newText.trim()) ? "#bbb" : "#fff",
                      border:"none",
                      cursor: (!isLoggedIn||newRating===0||!newText.trim()) ? "not-allowed" : "pointer",
                    }}>
                    <Send style={{ width:14, height:14 }} />
                    Submit review
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Booking card ── */}
          <div style={{ position:"sticky", top:88, alignSelf:"start" }}>
            <div style={{ background:"#fff", borderRadius:20, padding:24, border:"1px solid #EDE8DF", boxShadow:"0 8px 40px rgba(26,26,46,0.1)" }}>
              <div style={{ height:3, borderRadius:2, background:`linear-gradient(90deg,${GOLD},${GOLD_D})`, marginBottom:20 }} />

              {/* Price */}
              <div style={{ marginBottom:20 }}>
                <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                  <span style={{ fontSize:"1.8rem", fontWeight:700, color:NAVY, letterSpacing:"-0.02em" }}>
                    {formatMad(selectedRoomData.price)}
                  </span>
                  <span style={{ fontSize:13, color:"#aaa" }}>/ night</span>
                </div>
              </div>

              {/* Fields */}
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
                {[
                  { label:"Check-in",  icon:Calendar, type:"date",   val:checkIn,  set:setCheckIn  },
                  { label:"Check-out", icon:Calendar, type:"date",   val:checkOut, set:setCheckOut },
                  { label:"Guests",    icon:Users,    type:"number", val:guests,   set:setGuests   },
                ].map(({ label, icon:Icon, type, val, set:setter }) => (
                  <div key={label}>
                    <FieldLabel>{label}</FieldLabel>
                    <div style={{ position:"relative" }}>
                      <Icon style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", width:15, height:15, color:GOLD, pointerEvents:"none" }} />
                      <input type={type} value={val} min={type==="number"?"1":undefined}
                        onChange={e => setter(e.target.value)}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor=GOLD; }}
                        onBlur={e  => { e.target.style.borderColor="#E8D5A3"; }}
                      />
                    </div>
                  </div>
                ))}

                {/* Room select */}
                <div>
                  <FieldLabel>Room type</FieldLabel>
                  <select
                    value={selectedRoom}
                    onChange={e => setSelectedRoom(e.target.value)}
                    style={{ ...inputStyle, paddingLeft:14, appearance:"none", cursor:"pointer" }}
                    onFocus={e => { e.target.style.borderColor=GOLD; }}
                    onBlur={e  => { e.target.style.borderColor="#E8D5A3"; }}
                  >
                    {hotel.rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.name} — {formatMad(r.price)}/night</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price breakdown */}
              <div style={{ background:"#FFFDF7", borderRadius:12, padding:"10px 14px", marginBottom:16, border:"1px solid #EDE8DF" }}>
                {[
                  [`${formatMad(selectedRoomData.price)} × ${nights} night${nights>1?"s":""}`, formatMad(totalPrice)],
                  ["Service fee (10%)", formatMad(serviceFee)],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#888", marginBottom:5 }}>
                    <span>{k}</span><span>{v}</span>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:14, color:NAVY, paddingTop:8, marginTop:4, borderTop:"1px solid #EDE8DF" }}>
                  <span>Total</span><span>{formatMad(totalPrice+serviceFee)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBookNow}
                style={{
                  width:"100%", height:48, borderRadius:14, fontWeight:700, fontSize:14,
                  background:`linear-gradient(135deg,${GOLD},${GOLD_D})`,
                  color:"#fff", border:"none", cursor:"pointer",
                  boxShadow:"0 4px 20px rgba(139,105,20,0.3)",
                  letterSpacing:"0.04em",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity=".9"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity="1"; }}
              >
                {isLoggedIn ? "Book Now →" : "Sign in & Book →"}
              </button>

              <p style={{ textAlign:"center", fontSize:11, color:"#bbb", marginTop:10 }}>
                Free cancellation · No hidden fees
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}