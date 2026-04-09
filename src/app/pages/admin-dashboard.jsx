import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  LayoutDashboard, Hotel, MapPin, FileText, LogOut,
  DollarSign, TrendingUp, Calendar, Pencil,
  ChevronRight, Bell, CheckCircle, XCircle, Clock,
  BarChart2, Settings, BookOpen, AlertCircle,
  Download, RefreshCw, Star, Phone, Mail, Globe,
  RotateCcw, X, Check, MessageSquare, ThumbsUp, Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { BrandLockup } from "../components/brand-logo";
import { formatMad } from "../lib/currency";
import { hotels as hotelsData } from "../data/hotels";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../hooks/useAuth";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

const TAB_KEYS = ["dashboard","bookings","hotels","guides","reviews","analytics","reports","settings"];
const tabFromSearch = (v) => TAB_KEYS.includes(v) ? v : "dashboard";

/* ── Data ── */
const INIT_BOOKINGS = [
  { id:"b1", guest:"Youssef Alami",          hotel:"Hôtel Corniche Atlantique", room:"Deluxe Ocean View",  checkIn:"2026-04-10", checkOut:"2026-04-14", nights:4, amount:5420,  status:"confirmed", avatar:"YA" },
  { id:"b2", guest:"Fatima-Zahra Benkirane", hotel:"Riad Al Bahia",             room:"Atlas Suite",        checkIn:"2026-04-12", checkOut:"2026-04-16", nights:4, amount:6280,  status:"confirmed", avatar:"FB" },
  { id:"b3", guest:"Omar Tazi",              hotel:"Dar El Médina",             room:"Medina Room",        checkIn:"2026-04-18", checkOut:"2026-04-21", nights:3, amount:3180,  status:"pending",   avatar:"OT" },
  { id:"b4", guest:"Salma El Idrissi",       hotel:"Rivage Hôtel & Spa",        room:"Deluxe Room",        checkIn:"2026-04-05", checkOut:"2026-04-09", nights:4, amount:7150,  status:"confirmed", avatar:"SI" },
  { id:"b5", guest:"Mehdi Cherkaoui",        hotel:"Bahia Beach Resort",        room:"Oceanfront Villa",   checkIn:"2026-04-22", checkOut:"2026-04-26", nights:4, amount:8920,  status:"pending",   avatar:"MC" },
  { id:"b6", guest:"Nadia Rhouat",           hotel:"Riad Bleu Chefchaouen",     room:"Panorama Suite",     checkIn:"2026-04-08", checkOut:"2026-04-11", nights:3, amount:2670,  status:"cancelled", avatar:"NR" },
  { id:"b7", guest:"Karim Fassi",            hotel:"Hôtel Corniche Atlantique", room:"Presidential Suite", checkIn:"2026-05-01", checkOut:"2026-05-05", nights:4, amount:12800, status:"pending",   avatar:"KF" },
  { id:"b8", guest:"Amina Berrada",          hotel:"Riad Al Bahia",             room:"Patio Room",         checkIn:"2026-05-10", checkOut:"2026-05-13", nights:3, amount:2760,  status:"confirmed", avatar:"AB" },
];

/* Default demo reviews shown even without localStorage */
const DEMO_REVIEWS = [
  { id:"dr1", author:"Sarah M.",  avatar:"SM", hotelName:"Hôtel Corniche Atlantique", rating:5, date:"March 2026", text:"Exceptional stay! The ocean view was breathtaking and the staff were incredibly welcoming.", status:"pending" },
  { id:"dr2", author:"Emma D.",   avatar:"ED", hotelName:"Riad Al Bahia",             rating:5, date:"March 2026", text:"The most authentic riad experience I've ever had. The zellige courtyard is stunning.", status:"pending" },
  { id:"dr3", author:"Karim B.",  avatar:"KB", hotelName:"Bahia Beach Resort",        rating:4, date:"Feb 2026",   text:"Great resort with amazing amenities. The private beach is absolutely beautiful.", status:"approved" },
];

const MONTHLY = [
  { month:"Oct", revenue:62000,  bookings:48 },
  { month:"Nov", revenue:71000,  bookings:55 },
  { month:"Dec", revenue:95000,  bookings:74 },
  { month:"Jan", revenue:88000,  bookings:68 },
  { month:"Feb", revenue:102000, bookings:81 },
  { month:"Mar", revenue:118000, bookings:92 },
  { month:"Apr", revenue:125000, bookings:98 },
];

const INIT_GUIDES = [
  { id:"g1", name:"Hassan Benjelloun", city:"Marrakech",    tours:28, status:"Actif", rating:4.9 },
  { id:"g2", name:"Khadija Amrani",    city:"Fès",          tours:22, status:"Actif", rating:4.8 },
  { id:"g3", name:"Younes Filali",     city:"Chefchaouen",  tours:15, status:"Actif", rating:4.7 },
  { id:"g4", name:"Imane Tazi",        city:"Casablanca",   tours:9,  status:"Pause", rating:4.5 },
];

const INIT_NOTIFS = [
  { id:"n1", type:"pending",  read:false, title:"3 bookings awaiting confirmation", body:"Omar Tazi, Mehdi Cherkaoui and Karim Fassi are waiting for confirmation.", time:"2 min ago", icon:"⏳" },
  { id:"n2", type:"alert",    read:false, title:"Bahia Beach Resort — low availability", body:"Only 2 rooms remaining for the week of April 22–28.", time:"1 hr ago",  icon:"⚠️" },
  { id:"n3", type:"info",     read:false, title:"New guide invitation accepted", body:"Hassan Benjelloun accepted your invitation and is now active.", time:"3 hr ago",  icon:"✅" },
  { id:"n4", type:"revenue",  read:true,  title:"April revenue target reached", body:"April revenue has reached 125,000 Dh, exceeding the target by 25%.", time:"Today",     icon:"📈" },
];

/* ══════════════ COMPONENTS ══════════════ */
function NavBtn({ icon:Icon, label, active, onClick, badge }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-left relative"
      style={{
        background: active?"rgba(201,169,110,0.12)":"transparent",
        color: active?GOLD_D:"rgba(255,255,255,0.45)",
        fontWeight: active?600:400,
        border: active?"1px solid rgba(201,169,110,0.25)":"1px solid transparent",
        fontSize:13, cursor:"pointer",
      }}
    >
      <Icon className="w-4 h-4 shrink-0" style={{ color:active?GOLD:"rgba(255,255,255,0.4)" }} />
      <span>{label}</span>
      {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" style={{ color:GOLD }} />}
      {badge > 0 && (
        <span className="absolute right-3 top-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background:"#ef4444", color:"#fff" }}>{badge}</span>
      )}
    </button>
  );
}

function StatCard({ icon:Icon, iconBg, iconColor, badge, badgeColor, badgeBg, value, label, sub }) {
  return (
    <div className="rounded-2xl p-5" style={{ background:"#fff", border:"1px solid #EDE8DF", boxShadow:"0 2px 12px rgba(26,26,46,0.04)" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:iconBg }}>
          <Icon className="w-5 h-5" style={{ color:iconColor }} />
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color:badgeColor, background:badgeBg }}>{badge}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color:GOLD_D }}>{sub}</p>}
    </div>
  );
}

function TableCard({ title, action, children }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:"#fff", border:"1px solid #EDE8DF", boxShadow:"0 2px 12px rgba(26,26,46,0.04)" }}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid #EDE8DF" }}>
        <h2 className="font-bold text-gray-900" style={{ fontSize:"0.95rem" }}>{title}</h2>
        {action}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function Th({ children, right }) {
  return (
    <th className={`px-5 py-3 text-xs font-bold uppercase tracking-wider ${right?"text-right":"text-left"}`}
      style={{ color:GOLD_D, letterSpacing:"0.1em" }}>{children}</th>
  );
}

function GoldBtn({ onClick, children, outline }) {
  return (
    <button type="button" onClick={onClick}
      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
      style={outline
        ? { border:`1px solid ${GOLD}50`, color:GOLD_D, background:"rgba(201,169,110,0.06)", cursor:"pointer" }
        : { background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, color:"#fff", border:"none", boxShadow:"0 2px 12px rgba(139,105,20,0.25)", cursor:"pointer" }
      }
      onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
      onMouseLeave={e => e.currentTarget.style.opacity="1"}
    >{children}</button>
  );
}

function StatusBadge({ status }) {
  const map = {
    confirmed: { label:"Confirmed", bg:"#dcfce7", color:"#15803d" },
    pending:   { label:"Pending",   bg:"#fef9c3", color:"#854d0e" },
    cancelled: { label:"Cancelled", bg:"#fee2e2", color:"#b91c1c" },
  };
  const s = map[status] || map.pending;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full"
      style={{ background:s.bg, color:s.color }}>
      {status==="confirmed"&&<CheckCircle style={{width:10,height:10}}/>}
      {status==="pending"  &&<Clock       style={{width:10,height:10}}/>}
      {status==="cancelled"&&<XCircle     style={{width:10,height:10}}/>}
      {s.label}
    </span>
  );
}

function StarRow({ rating }) {
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} style={{ width:13, height:13, fill:i<=rating?GOLD:"none", color:i<=rating?GOLD:"#e5e7eb" }} />
      ))}
    </div>
  );
}

function MiniBarChart({ data, dataKey, color, label }) {
  const max = Math.max(...data.map(d => d[dataKey]));
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height:130 }}>
        {data.map((d,i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t-md"
              style={{ height:`${(d[dataKey]/max)*110}px`, background:color, minHeight:4, transition:"height .3s" }} />
            <span style={{ fontSize:8.5, color:"#aaa" }}>{d.month}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <div className="w-3 h-3 rounded-sm" style={{ background:color }} />
        <span style={{ fontSize:11, color:"#888" }}>{label}</span>
      </div>
    </div>
  );
}

function OccupancyRing({ value }) {
  const r=38, circ=2*Math.PI*r, dash=(value/100)*circ;
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="none" stroke="#EDE8DF" strokeWidth="8"/>
      <circle cx="48" cy="48" r={r} fill="none" stroke={GOLD} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 48 48)"/>
      <text x="48" y="44" textAnchor="middle" fontSize="15" fontWeight="700" fill={NAVY}>{value}%</text>
      <text x="48" y="58" textAnchor="middle" fontSize="8.5" fill="#999">occupancy</text>
    </svg>
  );
}

/* ══════════════ MAIN ══════════════ */
export function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const activeSection = tabFromSearch(searchParams.get("tab"));

  const [hotelList, setHotelList] = useState(hotelsData);
  const [guideList, setGuideList] = useState(INIT_GUIDES);
  const [bookings,  setBookings]  = useState(INIT_BOOKINGS);
  const [notifs,    setNotifs]    = useState(INIT_NOTIFS);
  const [bookingFilter, setBookingFilter] = useState("all");

  /* Reviews — merge demo + localStorage pending */
  const [reviews, setReviews] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("ms_pending_reviews") || "[]");
    const storedMapped = stored.map(r => ({ ...r, status:"pending" }));
    /* avoid duplicates with demo */
    const ids = new Set(storedMapped.map(r => r.id));
    return [...storedMapped, ...DEMO_REVIEWS.filter(d => !ids.has(d.id))];
  });

  /* Sync reviews to/from localStorage */
  const syncReviews = (updated) => {
    setReviews(updated);
    const pendingOnly = updated.filter(r => !r.id.startsWith("dr")); /* don't persist demo */
    localStorage.setItem("ms_pending_reviews", JSON.stringify(pendingOnly));
  };

  /* Notifications panel */
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [selectedNotif,setSelectedNotif]= useState(null);

  /* Forms */
  const [showHotelForm,setShowHotelForm]= useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [hotelForm,    setHotelForm]    = useState({ name:"",location:"",price:"",rooms:"",rating:"" });
  const [showGuideForm,setShowGuideForm]= useState(false);
  const [guideForm,    setGuideForm]    = useState({ name:"",city:"",email:"" });
  const [settings,     setSettings]     = useState({
    siteName:"MoroccanStay", email:"contact@moroccanstay.ma",
    phone:"+212 5 22 12 34 56", address:"Casablanca, Morocco",
    currency:"MAD", serviceFee:"10", defaultCheckIn:"14:00", defaultCheckOut:"12:00",
  });

  const setTab = (tab) =>
    tab==="dashboard" ? setSearchParams({},{replace:true}) : setSearchParams({tab},{replace:true});

  const handleLogout = () => { logout(); navigate("/",{replace:true}); };

  /* ── Notifications ── */
  const unreadCount  = notifs.filter(n=>!n.read).length;
  const markRead     = (id) => setNotifs(p=>p.map(n=>n.id===id?{...n,read:true}:n));
  const markAllRead  = () => setNotifs(p=>p.map(n=>({...n,read:true})));
  const deleteNotif  = (id) => { setNotifs(p=>p.filter(n=>n.id!==id)); if(selectedNotif?.id===id)setSelectedNotif(null); };
  const openNotif    = (n) => { setSelectedNotif(n); markRead(n.id); };

  /* ── Bookings ── */
  const updateBooking = (id, status) => {
    setBookings(p=>p.map(b=>b.id===id?{...b,status}:b));
    const b = bookings.find(b=>b.id===id);
    if (b) {
      setNotifs(p=>[{ id:`n-${Date.now()}`, type:status==="confirmed"?"info":"alert", read:false,
        title:`Booking ${status} — ${b.guest}`, body:`${b.hotel} · ${b.checkIn}→${b.checkOut}`, time:"Just now",
        icon:status==="confirmed"?"✅":"❌" }, ...p]);
    }
    toast.success(status==="confirmed"?"✅ Confirmed":status==="cancelled"?"❌ Cancelled":"🔄 Restored");
  };
  const filteredBookings = bookings.filter(b=>bookingFilter==="all"||b.status===bookingFilter);

  /* ── Reviews ── */
  const approveReview = (id) => {
    const updated = reviews.map(r=>r.id===id?{...r,status:"approved"}:r);
    syncReviews(updated);
    toast.success("✅ Review approved and published");
  };
  const rejectReview = (id) => {
    const updated = reviews.filter(r=>r.id!==id);
    syncReviews(updated);
    toast.success("🗑 Review removed");
  };

  const pendingReviews  = reviews.filter(r=>r.status==="pending").length;
  const approvedReviews = reviews.filter(r=>r.status==="approved").length;
  const pendingCount    = bookings.filter(b=>b.status==="pending").length;

  /* ── Hotels ── */
  const openAddHotel = () => { setEditingHotel(null); setHotelForm({name:"",location:"",price:"",rooms:"",rating:""}); setShowHotelForm(true); };
  const openEditHotel = (h) => { setEditingHotel(h); setHotelForm({name:h.name,location:h.location,price:String(h.price),rooms:String(h.rooms||""),rating:String(h.rating||"")}); setShowHotelForm(true); };
  const saveHotel = () => {
    if(!hotelForm.name||!hotelForm.location||!hotelForm.price){toast.error("Fill required fields");return;}
    if(editingHotel){
      setHotelList(p=>p.map(h=>h.id===editingHotel.id?{...h,name:hotelForm.name,location:hotelForm.location,price:+hotelForm.price,rooms:+hotelForm.rooms||h.rooms,rating:+hotelForm.rating||h.rating}:h));
      toast.success(`"${hotelForm.name}" updated`);
    } else {
      setHotelList(p=>[...p,{id:`h-${Date.now()}`,name:hotelForm.name,location:hotelForm.location,price:+hotelForm.price,rooms:+hotelForm.rooms||0,rating:+hotelForm.rating||0,guests:0,image:"",images:[],description:"",amenities:[],roomsList:[]}]);
      toast.success(`"${hotelForm.name}" added`);
    }
    setShowHotelForm(false);
  };
  const deleteHotel = (id) => { setHotelList(p=>p.filter(h=>h.id!==id)); toast.success("Hotel removed"); };

  /* ── Guides ── */
  const saveGuide = () => {
    if(!guideForm.name||!guideForm.city||!guideForm.email){toast.error("Fill all fields");return;}
    setGuideList(p=>[...p,{id:`g-${Date.now()}`,name:guideForm.name,city:guideForm.city,tours:0,status:"Actif",rating:0}]);
    toast.success(`Invitation sent to ${guideForm.name}`);
    setShowGuideForm(false); setGuideForm({name:"",city:"",email:""});
  };

  /* ── Export ── */
  const exportCSV = () => {
    const csv=["Hotel,City,Price,Rating",...hotelList.map(h=>`"${h.name}","${h.location}",${h.price},${h.rating}`)].join("\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    Object.assign(document.createElement("a"),{href:url,download:`hotels-${new Date().toISOString().split("T")[0]}.csv`}).click();
    URL.revokeObjectURL(url); toast.success("CSV exported");
  };

  const NAV = [
    { key:"dashboard", icon:LayoutDashboard, label:"Dashboard"                    },
    { key:"bookings",  icon:BookOpen,        label:"Bookings",  badge:pendingCount },
    { key:"hotels",    icon:Hotel,           label:"Hotels"                        },
    { key:"guides",    icon:MapPin,          label:"Guides"                        },
    { key:"reviews",   icon:MessageSquare,   label:"Reviews",   badge:pendingReviews },
    { key:"analytics", icon:BarChart2,       label:"Analytics"                     },
    { key:"reports",   icon:FileText,        label:"Reports"                       },
    { key:"settings",  icon:Settings,        label:"Settings"                      },
  ];

  return (
    <div className="flex h-screen" style={{ background:"#F5F4F0" }}>

      {/* ══ SIDEBAR ══ */}
      <aside className="flex flex-col shrink-0" style={{ width:240, background:NAVY, boxShadow:"4px 0 24px rgba(26,26,46,0.18)" }}>
        <div className="px-5 py-5" style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <BrandLockup variant="light" />
          <p className="text-xs mt-1" style={{ color:"rgba(255,255,255,0.3)" }}>Administration</p>
        </div>
        <div className="mx-5 h-px" style={{ background:`linear-gradient(90deg,${GOLD}50,transparent)`, margin:"0 20px 4px" }} />
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({key,icon,label,badge})=>(
            <NavBtn key={key} icon={icon} label={label} active={activeSection===key} onClick={()=>setTab(key)} badge={badge} />
          ))}
        </nav>

        {/* Notifications */}
        <div className="px-3 pb-2">
          <button type="button" onClick={()=>setNotifOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all relative"
            style={{ color:"rgba(255,255,255,0.45)", fontSize:13, background:"transparent", border:"none", cursor:"pointer" }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
            <Bell className="w-4 h-4 shrink-0" style={{ color:"rgba(255,255,255,0.4)" }} />
            <span>Notifications</span>
            {unreadCount>0&&<span className="absolute right-3 top-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background:"#ef4444", color:"#fff" }}>{unreadCount}</span>}
          </button>
        </div>

        {/* User */}
        <div className="px-3 pb-4 pt-2" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2" style={{ background:"rgba(255,255,255,0.05)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, color:NAVY }}>
              {user?user[0].toUpperCase():"A"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color:"rgba(255,255,255,0.85)" }}>{user||"Admin"}</p>
              <p className="text-xs" style={{ color:"rgba(255,255,255,0.3)" }}>Administrator</p>
            </div>
          </div>
          <button type="button" onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all"
            style={{ color:"rgba(255,255,255,0.35)", background:"transparent", border:"none", cursor:"pointer" }}
            onMouseEnter={e=>{e.currentTarget.style.color="#ff7875";e.currentTarget.style.background="rgba(255,120,117,0.08)";}}
            onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.35)";e.currentTarget.style.background="transparent";}}>
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <main className="flex-1 overflow-auto">
        <div className="p-8" style={{ maxWidth:1100 }}>
          <div className="mb-7">
            <h1 className="font-bold text-gray-900 mb-1" style={{ fontSize:"1.5rem", letterSpacing:"-0.02em" }}>
              {{ dashboard:"Dashboard", bookings:"Bookings", hotels:"Hotels", guides:"Guides",
                 reviews:"Reviews", analytics:"Analytics", reports:"Reports", settings:"Settings" }[activeSection]}
            </h1>
          </div>

          {/* ══ DASHBOARD ══ */}
          {activeSection==="dashboard"&&(
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={Calendar}   iconBg="rgba(201,169,110,0.1)"  iconColor={GOLD}    badge="+12.5%" badgeColor="#15803d" badgeBg="#dcfce7" value="1,247"            label="Total Bookings"   sub={pendingCount>0?`${pendingCount} pending`:null} />
                <StatCard icon={DollarSign} iconBg="rgba(74,155,127,0.1)"   iconColor="#4A9B7F" badge="+8.2%"  badgeColor="#15803d" badgeBg="#dcfce7" value={formatMad(894320)} label="Revenue"          />
                <StatCard icon={Hotel}      iconBg="rgba(91,127,166,0.1)"   iconColor="#5B7FA6" badge="Active" badgeColor="#1d4ed8" badgeBg="#dbeafe" value={hotelList.length}  label="Active Hotels"    />
                <StatCard icon={MessageSquare} iconBg="rgba(201,169,110,0.08)" iconColor={GOLD_D} badge={`${pendingReviews} pending`} badgeColor="#854d0e" badgeBg="#fef9c3" value={reviews.length} label="Total Reviews" />
              </div>
              {pendingCount>0&&(
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
                  style={{ background:"rgba(254,249,195,0.9)", border:"1px solid rgba(234,179,8,0.35)" }}>
                  <AlertCircle className="w-4 h-4 shrink-0" style={{ color:"#854d0e" }} />
                  <p className="text-sm font-medium flex-1" style={{ color:"#854d0e" }}>{pendingCount} booking{pendingCount>1?"s":""} awaiting confirmation</p>
                  <button type="button" onClick={()=>setTab("bookings")}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg"
                    style={{ background:"#854d0e", color:"#fff", border:"none", cursor:"pointer" }}>
                    Review now →
                  </button>
                </div>
              )}
              {pendingReviews>0&&(
                <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
                  style={{ background:"rgba(201,169,110,0.08)", border:`1px solid rgba(201,169,110,0.3)` }}>
                  <MessageSquare className="w-4 h-4 shrink-0" style={{ color:GOLD_D }} />
                  <p className="text-sm font-medium flex-1" style={{ color:GOLD_D }}>{pendingReviews} review{pendingReviews>1?"s":""} awaiting moderation</p>
                  <button type="button" onClick={()=>setTab("reviews")}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg"
                    style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, color:"#fff", border:"none", cursor:"pointer" }}>
                    Moderate →
                  </button>
                </div>
              )}
              <TableCard title="Recent reservations">
                <table className="w-full text-sm">
                  <thead style={{ background:"#FAFAF8", borderBottom:"1px solid #EDE8DF" }}>
                    <tr><Th>Guest</Th><Th>Hotel</Th><Th>Check-in</Th><Th>Amount</Th><Th>Status</Th></tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0,5).map(b=>(
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom:"1px solid #F0EDE6" }}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{ background:"rgba(201,169,110,0.12)", color:GOLD_D }}>{b.avatar}</div>
                            <span className="font-medium text-gray-900 text-sm">{b.guest}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600 text-sm">{b.hotel}</td>
                        <td className="px-5 py-3.5 text-gray-600 text-sm">{b.checkIn}</td>
                        <td className="px-5 py-3.5 font-semibold text-gray-900 text-sm">{formatMad(b.amount)}</td>
                        <td className="px-5 py-3.5"><StatusBadge status={b.status}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableCard>
            </div>
          )}

          {/* ══ BOOKINGS ══ */}
          {activeSection==="bookings"&&(
            <div className="space-y-5">
              <div className="flex gap-2 flex-wrap">
                {[{key:"all",label:"All",count:bookings.length},{key:"pending",label:"Pending",count:bookings.filter(b=>b.status==="pending").length},{key:"confirmed",label:"Confirmed",count:bookings.filter(b=>b.status==="confirmed").length},{key:"cancelled",label:"Cancelled",count:bookings.filter(b=>b.status==="cancelled").length}]
                  .map(({key,label,count})=>(
                    <button key={key} type="button" onClick={()=>setBookingFilter(key)}
                      className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all"
                      style={{ background:bookingFilter===key?`linear-gradient(135deg,${GOLD},${GOLD_D})`:"rgba(201,169,110,0.08)", color:bookingFilter===key?"#fff":GOLD_D, border:`1px solid ${bookingFilter===key?"transparent":"rgba(201,169,110,0.2)"}`, cursor:"pointer" }}>
                      {label} ({count})
                    </button>
                  ))}
              </div>
              <TableCard title={`${bookingFilter==="all"?"All":bookingFilter.charAt(0).toUpperCase()+bookingFilter.slice(1)} bookings (${filteredBookings.length})`}>
                <table className="w-full text-sm">
                  <thead style={{ background:"#FAFAF8", borderBottom:"1px solid #EDE8DF" }}>
                    <tr><Th>Guest</Th><Th>Hotel / Room</Th><Th>Check-in</Th><Th>Check-out</Th><Th>Amount</Th><Th>Status</Th><Th right>Actions</Th></tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(b=>(
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom:"1px solid #F0EDE6" }}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                              style={{ background:"rgba(201,169,110,0.12)", color:GOLD_D }}>{b.avatar}</div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{b.guest}</p>
                              <p className="text-xs text-gray-400">{b.nights} nights</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4"><p className="text-sm font-medium text-gray-900">{b.hotel}</p><p className="text-xs text-gray-400">{b.room}</p></td>
                        <td className="px-5 py-4 text-sm text-gray-700">{b.checkIn}</td>
                        <td className="px-5 py-4 text-sm text-gray-700">{b.checkOut}</td>
                        <td className="px-5 py-4 font-semibold text-gray-900">{formatMad(b.amount)}</td>
                        <td className="px-5 py-4"><StatusBadge status={b.status}/></td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            {b.status==="pending"&&<>
                              <button type="button" onClick={()=>updateBooking(b.id,"confirmed")}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                style={{ background:"#dcfce7", color:"#15803d", border:"1px solid #bbf7d0", cursor:"pointer" }}
                                onMouseEnter={e=>e.currentTarget.style.background="#bbf7d0"}
                                onMouseLeave={e=>e.currentTarget.style.background="#dcfce7"}>
                                <Check style={{width:12,height:12}}/> Confirm
                              </button>
                              <button type="button" onClick={()=>updateBooking(b.id,"cancelled")}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                style={{ background:"#fee2e2", color:"#b91c1c", border:"1px solid #fecaca", cursor:"pointer" }}
                                onMouseEnter={e=>e.currentTarget.style.background="#fecaca"}
                                onMouseLeave={e=>e.currentTarget.style.background="#fee2e2"}>
                                <X style={{width:12,height:12}}/> Cancel
                              </button>
                            </>}
                            {b.status==="confirmed"&&<button type="button" onClick={()=>updateBooking(b.id,"cancelled")}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                              style={{ background:"#fee2e2", color:"#b91c1c", border:"1px solid #fecaca", cursor:"pointer" }}
                              onMouseEnter={e=>e.currentTarget.style.background="#fecaca"}
                              onMouseLeave={e=>e.currentTarget.style.background="#fee2e2"}>
                              <XCircle style={{width:12,height:12}}/> Cancel
                            </button>}
                            {b.status==="cancelled"&&<button type="button" onClick={()=>updateBooking(b.id,"pending")}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                              style={{ background:"rgba(201,169,110,0.1)", color:GOLD_D, border:`1px solid rgba(201,169,110,0.3)`, cursor:"pointer" }}
                              onMouseEnter={e=>e.currentTarget.style.background="rgba(201,169,110,0.2)"}
                              onMouseLeave={e=>e.currentTarget.style.background="rgba(201,169,110,0.1)"}>
                              <RotateCcw style={{width:12,height:12}}/> Restore
                            </button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredBookings.length===0&&<div className="py-12 text-center text-gray-400 text-sm">No {bookingFilter} bookings.</div>}
              </TableCard>
            </div>
          )}

          {/* ══ HOTELS ══ */}
          {activeSection==="hotels"&&(
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[{label:"Listed properties",value:hotelList.length,accent:false},{label:"Pending updates",value:2,accent:false},{label:"Availability alerts",value:1,accent:true}]
                  .map(({label,value,accent})=>(
                    <div key={label} className="p-5 rounded-xl" style={{ background:"#fff", border:"1px solid #EDE8DF" }}>
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="text-2xl font-bold" style={{ color:accent?"#b45309":NAVY }}>{value}</p>
                    </div>
                  ))}
              </div>
              <TableCard title={`Hotels (${hotelList.length})`} action={<GoldBtn onClick={openAddHotel}>+ Add hotel</GoldBtn>}>
                <table className="w-full text-sm">
                  <thead style={{ background:"#FAFAF8", borderBottom:"1px solid #EDE8DF" }}>
                    <tr><Th>Name</Th><Th>City</Th><Th>Price / night</Th><Th>Rating</Th><Th right>Actions</Th></tr>
                  </thead>
                  <tbody>
                    {hotelList.map(h=>(
                      <tr key={h.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom:"1px solid #F0EDE6" }}>
                        <td className="px-5 py-3.5 font-medium text-gray-900">{h.name}</td>
                        <td className="px-5 py-3.5 text-gray-600">{h.location}</td>
                        <td className="px-5 py-3.5 font-semibold" style={{ color:GOLD_D }}>{formatMad(h.price)}</td>
                        <td className="px-5 py-3.5"><div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-current" style={{ color:GOLD }}/><span className="text-gray-700">{h.rating}</span></div></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 justify-end">
                            <button type="button" onClick={()=>openEditHotel(h)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                              style={{ background:"rgba(201,169,110,0.1)", color:GOLD_D, border:`1px solid rgba(201,169,110,0.25)`, cursor:"pointer" }}>
                              <Pencil style={{width:12,height:12}}/> Edit
                            </button>
                            <button type="button" onClick={()=>deleteHotel(h.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                              style={{ background:"#fee2e2", color:"#b91c1c", border:"1px solid #fecaca", cursor:"pointer" }}>
                              <XCircle style={{width:12,height:12}}/> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableCard>
            </div>
          )}

          {/* ══ GUIDES ══ */}
          {activeSection==="guides"&&(
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {[{label:"Active guides",value:guideList.filter(g=>g.status==="Actif").length},{label:"Tours this month",value:guideList.reduce((s,g)=>s+g.tours,0)}]
                  .map(({label,value})=>(<div key={label} className="p-5 rounded-xl" style={{ background:"#fff", border:"1px solid #EDE8DF" }}><p className="text-xs text-gray-500 mb-1">{label}</p><p className="text-2xl font-bold text-gray-900">{value}</p></div>))}
              </div>
              <TableCard title="Tourist guides" action={<GoldBtn onClick={()=>setShowGuideForm(true)}>+ Invite guide</GoldBtn>}>
                <table className="w-full text-sm">
                  <thead style={{ background:"#FAFAF8", borderBottom:"1px solid #EDE8DF" }}>
                    <tr><Th>Name</Th><Th>City</Th><Th>Tours</Th><Th>Rating</Th><Th>Status</Th></tr>
                  </thead>
                  <tbody>
                    {guideList.map(g=>(
                      <tr key={g.id} className="hover:bg-gray-50 transition-colors" style={{ borderBottom:"1px solid #F0EDE6" }}>
                        <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background:"rgba(201,169,110,0.12)", color:GOLD_D }}>{g.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div><span className="font-medium text-gray-900">{g.name}</span></div></td>
                        <td className="px-5 py-3.5 text-gray-600">{g.city}</td>
                        <td className="px-5 py-3.5 text-gray-600">{g.tours}</td>
                        <td className="px-5 py-3.5">{g.rating>0&&<div className="flex items-center gap-1"><Star className="w-3 h-3 fill-current" style={{ color:GOLD }}/><span className="text-xs text-gray-700">{g.rating}</span></div>}</td>
                        <td className="px-5 py-3.5"><span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full" style={g.status==="Actif"?{background:"#dcfce7",color:"#15803d"}:{background:"#f3f4f6",color:"#6b7280"}}>{g.status==="Actif"?"Active":"Paused"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TableCard>
            </div>
          )}

          {/* ══ REVIEWS ══ */}
          {activeSection==="reviews"&&(
            <div className="space-y-5">

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label:"Total reviews",    value:reviews.length,  color:NAVY         },
                  { label:"Pending",          value:pendingReviews,  color:"#854d0e"    },
                  { label:"Published",        value:approvedReviews, color:"#15803d"    },
                ].map(({label,value,color})=>(
                  <div key={label} className="p-5 rounded-xl" style={{ background:"#fff", border:"1px solid #EDE8DF" }}>
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Pending reviews */}
              {reviews.filter(r=>r.status==="pending").length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color:GOLD_D, letterSpacing:"0.12em" }}>
                    Awaiting moderation ({reviews.filter(r=>r.status==="pending").length})
                  </h3>
                  <div className="space-y-3">
                    {reviews.filter(r=>r.status==="pending").map(r=>(
                      <div key={r.id} className="rounded-2xl p-5"
                        style={{ background:"#fff", border:`1px solid rgba(201,169,110,0.3)`, boxShadow:"0 2px 10px rgba(26,26,46,0.04)" }}>
                        <div className="flex items-start justify-between gap-4">
                          {/* Left: review content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, color:"#fff" }}>
                                {r.avatar}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{r.author}</p>
                                <p className="text-xs text-gray-400">{r.hotelName} · {r.date}</p>
                              </div>
                              <StarRow rating={r.rating} />
                              <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
                                style={{ background:"#fef9c3", color:"#854d0e", flexShrink:0 }}>
                                Pending
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop:"1px solid #EDE8DF" }}>
                          <button type="button" onClick={()=>approveReview(r.id)}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all"
                            style={{ background:"#dcfce7", color:"#15803d", border:"1px solid #bbf7d0", cursor:"pointer" }}
                            onMouseEnter={e=>e.currentTarget.style.background="#bbf7d0"}
                            onMouseLeave={e=>e.currentTarget.style.background="#dcfce7"}>
                            <CheckCircle style={{width:15,height:15}}/> Approve & Publish
                          </button>
                          <button type="button" onClick={()=>rejectReview(r.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                            style={{ background:"#fee2e2", color:"#b91c1c", border:"1px solid #fecaca", cursor:"pointer" }}
                            onMouseEnter={e=>e.currentTarget.style.background="#fecaca"}
                            onMouseLeave={e=>e.currentTarget.style.background="#fee2e2"}>
                            <Trash2 style={{width:14,height:14}}/> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approved reviews */}
              {reviews.filter(r=>r.status==="approved").length > 0 && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color:"#15803d", letterSpacing:"0.12em" }}>
                    Published ({reviews.filter(r=>r.status==="approved").length})
                  </h3>
                  <div className="space-y-3">
                    {reviews.filter(r=>r.status==="approved").map(r=>(
                      <div key={r.id} className="rounded-2xl p-5 flex items-start gap-4"
                        style={{ background:"#fff", border:"1px solid #EDE8DF", boxShadow:"0 2px 10px rgba(26,26,46,0.03)" }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background:"rgba(201,169,110,0.12)", color:GOLD_D }}>
                          {r.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <p className="text-sm font-bold text-gray-900">{r.author}</p>
                            <p className="text-xs text-gray-400">{r.hotelName} · {r.date}</p>
                            <StarRow rating={r.rating} />
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:"#dcfce7", color:"#15803d" }}>Published</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                        </div>
                        <button type="button" onClick={()=>rejectReview(r.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0"
                          style={{ background:"#fee2e2", border:"none", cursor:"pointer" }}
                          title="Remove"
                          onMouseEnter={e=>e.currentTarget.style.background="#fecaca"}
                          onMouseLeave={e=>e.currentTarget.style.background="#fee2e2"}>
                          <Trash2 style={{width:14,height:14,color:"#b91c1c"}}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reviews.length===0&&(
                <div className="py-16 text-center" style={{ border:"1px dashed #EDE8DF", borderRadius:16, color:"#bbb" }}>
                  <MessageSquare style={{width:28,height:28,margin:"0 auto 10px",opacity:.25}}/>
                  <p className="text-sm">No reviews yet.</p>
                </div>
              )}
            </div>
          )}

          {/* ══ ANALYTICS ══ */}
          {activeSection==="analytics"&&(
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-5">
                <StatCard icon={DollarSign} iconBg="rgba(201,169,110,0.1)" iconColor={GOLD}    badge="+8.2%"  badgeColor="#15803d" badgeBg="#dcfce7" value={formatMad(125000)} label="April Revenue"  />
                <StatCard icon={BookOpen}   iconBg="rgba(74,155,127,0.1)"  iconColor="#4A9B7F" badge="+6.5%"  badgeColor="#15803d" badgeBg="#dcfce7" value="98"              label="April Bookings" />
                <StatCard icon={TrendingUp} iconBg="rgba(91,127,166,0.1)"  iconColor="#5B7FA6" badge="↑2.1%"  badgeColor="#15803d" badgeBg="#dcfce7" value="94.2%"          label="Occupancy Rate" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-2xl p-6" style={{ background:"#fff", border:"1px solid #EDE8DF" }}>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">Monthly revenue</h3>
                  <p className="text-xs text-gray-400 mb-4">Last 7 months (MAD)</p>
                  <MiniBarChart data={MONTHLY} dataKey="revenue" color={GOLD} label="Revenue"/>
                </div>
                <div className="rounded-2xl p-6" style={{ background:"#fff", border:"1px solid #EDE8DF" }}>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">Bookings per month</h3>
                  <p className="text-xs text-gray-400 mb-4">Last 7 months</p>
                  <div className="flex items-end gap-6">
                    <div className="flex-1"><MiniBarChart data={MONTHLY} dataKey="bookings" color="#5B7FA6" label="Bookings"/></div>
                    <OccupancyRing value={94}/>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl p-6" style={{ background:"#fff", border:"1px solid #EDE8DF" }}>
                <h3 className="font-bold text-gray-900 mb-5 text-sm">Top performing hotels</h3>
                <div className="space-y-3">
                  {[{name:"Bahia Beach Resort",rev:248000,pct:85},{name:"Rivage Hôtel & Spa",rev:196000,pct:70},{name:"Hôtel Corniche Atlantique",rev:182000,pct:65},{name:"Riad Al Bahia",rev:156000,pct:55},{name:"Dar El Médina",rev:112000,pct:40}]
                    .map(({name,rev,pct})=>(
                      <div key={name}>
                        <div className="flex items-center justify-between mb-1"><span className="text-sm text-gray-700">{name}</span><span className="text-sm font-semibold" style={{ color:GOLD_D }}>{formatMad(rev)}</span></div>
                        <div className="h-2 rounded-full" style={{ background:"#EDE8DF" }}><div className="h-2 rounded-full" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${GOLD},${GOLD_D})` }}/></div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ REPORTS ══ */}
          {activeSection==="reports"&&(
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[{label:"Cumulative revenue",value:formatMad(894320)},{label:"Total bookings",value:"1,247"},{label:"Occupancy rate",value:"94.2%"}]
                  .map(({label,value})=>(<div key={label} className="p-5 rounded-xl" style={{ background:"#fff", border:"1px solid #EDE8DF" }}><p className="text-xs text-gray-500 mb-1">{label}</p><p className="text-xl font-bold text-gray-900">{value}</p></div>))}
              </div>
              <div className="rounded-2xl p-7" style={{ background:"#fff", border:"1px solid #EDE8DF" }}>
                <h2 className="font-bold text-gray-900 mb-2">Export data</h2>
                <p className="text-sm text-gray-500 mb-6">Download reports for accounting.</p>
                <div className="flex gap-3 flex-wrap">
                  <GoldBtn onClick={exportCSV}><Download className="w-3.5 h-3.5"/> Export Hotels CSV</GoldBtn>
                  <GoldBtn outline onClick={()=>{
                    const lines=[`MoroccanStay — Report`,`Generated: ${new Date().toLocaleString()}`,``,`Bookings: ${bookings.length} | Confirmed: ${bookings.filter(b=>b.status==="confirmed").length} | Pending: ${bookings.filter(b=>b.status==="pending").length}`,`Reviews: ${reviews.length} | Published: ${approvedReviews}`,``,`BOOKINGS`,`--------`,...bookings.map(b=>`${b.guest} | ${b.hotel} | ${b.checkIn}→${b.checkOut} | ${formatMad(b.amount)} | ${b.status}`)];
                    const url=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/plain"}));
                    Object.assign(document.createElement("a"),{href:url,download:`report-${new Date().toISOString().split("T")[0]}.txt`}).click();
                    URL.revokeObjectURL(url); toast.success("Report exported");
                  }}><FileText className="w-3.5 h-3.5"/> Export Full Report</GoldBtn>
                </div>
              </div>
            </div>
          )}

          {/* ══ SETTINGS ══ */}
          {activeSection==="settings"&&(
            <div className="space-y-5">
              <div className="rounded-2xl p-7" style={{ background:"#fff", border:"1px solid #EDE8DF" }}>
                <h2 className="font-bold text-gray-900 mb-5">General settings</h2>
                <div className="grid grid-cols-2 gap-5">
                  {[{key:"siteName",label:"Site name",icon:Globe},{key:"email",label:"Contact email",icon:Mail},{key:"phone",label:"Phone",icon:Phone},{key:"address",label:"Address",icon:MapPin}]
                    .map(({key,label,icon:Icon})=>(
                      <div key={key}>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color:GOLD_D,letterSpacing:"0.1em" }}>{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:GOLD }}/>
                          <input value={settings[key]} onChange={e=>setSettings(p=>({...p,[key]:e.target.value}))}
                            className="w-full h-11 pl-10 pr-4 rounded-xl text-gray-900 text-sm outline-none"
                            style={{ border:"1.5px solid #E8D5A3", background:"#FFFDF7" }}
                            onFocus={e=>{e.target.style.borderColor=GOLD;}} onBlur={e=>{e.target.style.borderColor="#E8D5A3";}}/>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="rounded-2xl p-7" style={{ background:"#fff", border:"1px solid #EDE8DF" }}>
                <h2 className="font-bold text-gray-900 mb-5">Booking configuration</h2>
                <div className="grid grid-cols-2 gap-5">
                  {[{key:"currency",label:"Currency"},{key:"serviceFee",label:"Service fee (%)"},{key:"defaultCheckIn",label:"Default check-in"},{key:"defaultCheckOut",label:"Default check-out"}]
                    .map(({key,label})=>(
                      <div key={key}>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color:GOLD_D,letterSpacing:"0.1em" }}>{label}</label>
                        <input value={settings[key]} onChange={e=>setSettings(p=>({...p,[key]:e.target.value}))}
                          className="w-full h-11 px-4 rounded-xl text-gray-900 text-sm outline-none"
                          style={{ border:"1.5px solid #E8D5A3", background:"#FFFDF7" }}
                          onFocus={e=>{e.target.style.borderColor=GOLD;}} onBlur={e=>{e.target.style.borderColor="#E8D5A3";}}/>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex justify-end">
                <GoldBtn onClick={()=>toast.success("Settings saved!")}><RefreshCw className="w-3.5 h-3.5"/> Save settings</GoldBtn>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ══ NOTIFICATIONS PANEL ══ */}
      {notifOpen&&(
        <>
          <div className="fixed inset-0 z-40" style={{ background:"rgba(0,0,0,0.25)" }}
            onClick={()=>{setNotifOpen(false);setSelectedNotif(null);}}/>
          <div className="fixed top-0 right-0 h-full z-50 flex flex-col"
            style={{ width:420, background:"#fff", boxShadow:"-8px 0 40px rgba(26,26,46,0.15)", borderLeft:"1px solid #EDE8DF" }}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom:"1px solid #EDE8DF" }}>
              <div><h2 className="font-bold text-gray-900">Notifications</h2><p className="text-xs text-gray-400">{unreadCount} unread</p></div>
              <div className="flex items-center gap-2">
                {unreadCount>0&&<button type="button" onClick={markAllRead}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background:"rgba(201,169,110,0.1)", color:GOLD_D, border:`1px solid rgba(201,169,110,0.2)`, cursor:"pointer" }}>
                  Mark all read
                </button>}
                <button type="button" onClick={()=>{setNotifOpen(false);setSelectedNotif(null);}}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background:"rgba(0,0,0,0.04)", border:"none", cursor:"pointer" }}>
                  <X className="w-4 h-4 text-gray-500"/>
                </button>
              </div>
            </div>
            {selectedNotif?(
              <div className="flex-1 overflow-auto">
                <button type="button" onClick={()=>setSelectedNotif(null)}
                  className="flex items-center gap-2 px-5 py-3 text-sm font-medium w-full"
                  style={{ color:GOLD_D, background:"none", border:"none", cursor:"pointer", borderBottom:"1px solid #EDE8DF" }}>
                  ← Back
                </button>
                <div className="px-5 py-6">
                  <div className="text-3xl mb-4">{selectedNotif.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontSize:"1.05rem" }}>{selectedNotif.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">{selectedNotif.time}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">{selectedNotif.body}</p>
                  {selectedNotif.type==="pending"&&<button type="button" onClick={()=>{setNotifOpen(false);setSelectedNotif(null);setTab("bookings");}} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, border:"none", cursor:"pointer" }}><BookOpen className="w-4 h-4"/> Go to Bookings</button>}
                  {selectedNotif.type==="alert"&&<button type="button" onClick={()=>{setNotifOpen(false);setSelectedNotif(null);setTab("hotels");}} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, border:"none", cursor:"pointer" }}><Hotel className="w-4 h-4"/> Go to Hotels</button>}
                  {selectedNotif.type==="revenue"&&<button type="button" onClick={()=>{setNotifOpen(false);setSelectedNotif(null);setTab("analytics");}} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, border:"none", cursor:"pointer" }}><BarChart2 className="w-4 h-4"/> View Analytics</button>}
                  <button type="button" onClick={()=>{deleteNotif(selectedNotif.id);setSelectedNotif(null);}} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold mt-3" style={{ background:"#fee2e2", color:"#b91c1c", border:"none", cursor:"pointer" }}>
                    <XCircle className="w-3.5 h-3.5"/> Delete
                  </button>
                </div>
              </div>
            ):(
              <div className="flex-1 overflow-auto">
                {notifs.length===0?(
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                    <Bell className="w-10 h-10 opacity-20"/><p className="text-sm">No notifications</p>
                  </div>
                ):notifs.map(n=>(
                  <div key={n.id} onClick={()=>openNotif(n)}
                    className="flex items-start gap-3 px-5 py-4 cursor-pointer transition-all"
                    style={{ borderBottom:"1px solid #F5F4F0", background:n.read?"#fff":"rgba(201,169,110,0.04)" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="rgba(201,169,110,0.06)";}}
                    onMouseLeave={e=>{e.currentTarget.style.background=n.read?"#fff":"rgba(201,169,110,0.04)";}}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base" style={{ background:"rgba(201,169,110,0.08)" }}>{n.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-gray-900 leading-snug" style={{ fontWeight:n.read?400:600 }}>{n.title}</p>
                        {!n.read&&<div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background:GOLD }}/>}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ══ HOTEL DIALOG ══ */}
      <Dialog open={showHotelForm} onOpenChange={setShowHotelForm}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle>{editingHotel?"Edit hotel":"Add hotel"}</DialogTitle></DialogHeader>
          <div className="h-0.5 rounded-full mb-2" style={{ background:`linear-gradient(90deg,${GOLD},${GOLD_D})` }}/>
          <div className="space-y-4">
            {[{id:"h-name",label:"Hotel name *",key:"name",type:"text",ph:"Riad Al Baraka"},{id:"h-loc",label:"City *",key:"location",type:"text",ph:"Marrakech, Maroc"},{id:"h-price",label:"Price / night (MAD) *",key:"price",type:"number",ph:"1200"},{id:"h-rooms",label:"Rooms",key:"rooms",type:"number",ph:"24"},{id:"h-rat",label:"Rating (0–5)",key:"rating",type:"number",ph:"4.8",step:"0.1"}]
              .map(({id,label,key,type,ph,step})=>(
                <div key={id}>
                  <Label htmlFor={id} className="text-xs font-bold uppercase tracking-wider" style={{ color:GOLD_D }}>{label}</Label>
                  <Input id={id} type={type} placeholder={ph} step={step} value={hotelForm[key]}
                    onChange={e=>setHotelForm(p=>({...p,[key]:e.target.value}))} className="rounded-xl mt-1.5"/>
                </div>
              ))}
          </div>
          <DialogFooter>
            <button type="button" onClick={()=>setShowHotelForm(false)} className="px-4 py-2 rounded-xl text-sm border text-gray-600 cursor-pointer">Cancel</button>
            <button type="button" onClick={saveHotel} className="px-5 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer" style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, border:"none" }}>{editingHotel?"Update":"Add"}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══ GUIDE DIALOG ══ */}
      <Dialog open={showGuideForm} onOpenChange={setShowGuideForm}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle>Invite guide</DialogTitle></DialogHeader>
          <div className="h-0.5 rounded-full mb-2" style={{ background:`linear-gradient(90deg,${GOLD},${GOLD_D})` }}/>
          <div className="space-y-4">
            {[{id:"g-name",label:"Guide name",key:"name",type:"text",ph:"Hassan Benjelloun"},{id:"g-city",label:"City",key:"city",type:"text",ph:"Marrakech"},{id:"g-mail",label:"Email",key:"email",type:"email",ph:"guide@example.ma"}]
              .map(({id,label,key,type,ph})=>(
                <div key={id}>
                  <Label htmlFor={id} className="text-xs font-bold uppercase tracking-wider" style={{ color:GOLD_D }}>{label}</Label>
                  <Input id={id} type={type} placeholder={ph} value={guideForm[key]}
                    onChange={e=>setGuideForm(p=>({...p,[key]:e.target.value}))} className="rounded-xl mt-1.5"/>
                </div>
              ))}
          </div>
          <DialogFooter>
            <button type="button" onClick={()=>setShowGuideForm(false)} className="px-4 py-2 rounded-xl text-sm border text-gray-600 cursor-pointer">Cancel</button>
            <button type="button" onClick={saveGuide} className="px-5 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer" style={{ background:`linear-gradient(135deg,${GOLD},${GOLD_D})`, border:"none" }}>Send invitation</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}