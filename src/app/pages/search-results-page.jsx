import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { MapPin, Star, Search } from "lucide-react";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { formatMad } from "../lib/currency";
import { useAppData } from "../hooks/useAppData";

const GOLD   = "#C9A96E";
const GOLD_D = "#8B6914";
const NAVY   = "#1A1A2E";

function norm(s) {
  return s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
}
function nightsBetween(a, b) {
  if (!a || !b) return 1;
  const d = Math.ceil((new Date(b) - new Date(a)) / 86400000);
  return d > 0 ? d : 1;
}

/* ── All Moroccan cities with real coordinates ── */
const CITIES = [
  { id:"casablanca",   name:"Casablanca",    lat:33.5731, lng:-7.5898  },
  { id:"rabat",        name:"Rabat",          lat:33.9716, lng:-6.8498  },
  { id:"marrakech",    name:"Marrakech",      lat:31.6295, lng:-7.9811  },
  { id:"fes",          name:"Fès",            lat:34.0181, lng:-5.0078  },
  { id:"agadir",       name:"Agadir",         lat:30.4278, lng:-9.5981  },
  { id:"chefchaouen",  name:"Chefchaouen",    lat:35.1689, lng:-5.2636  },
  { id:"tanger",       name:"Tanger",         lat:35.7595, lng:-5.8340  },
  { id:"meknes",       name:"Meknès",         lat:33.8935, lng:-5.5473  },
  { id:"essaouira",    name:"Essaouira",      lat:31.5125, lng:-9.7749  },
  { id:"ouarzazate",   name:"Ouarzazate",     lat:30.9189, lng:-6.8936  },
  { id:"nador",        name:"Nador",          lat:35.1740, lng:-2.9287  },
  { id:"oujda",        name:"Oujda",          lat:34.6867, lng:-1.9114  },
  { id:"taza",         name:"Taza",           lat:34.2100, lng:-3.9970  },
  { id:"beni_mellal",  name:"Béni Mellal",    lat:32.3373, lng:-6.3498  },
  { id:"el_jadida",    name:"El Jadida",      lat:33.2316, lng:-8.5007  },
  { id:"safi",         name:"Safi",           lat:32.2994, lng:-9.2372  },
  { id:"tiznit",       name:"Tiznit",         lat:29.6974, lng:-9.7316  },
  { id:"guelmim",      name:"Guelmim",        lat:28.9870, lng:-10.0574 },
  { id:"errachidia",   name:"Errachidia",     lat:31.9314, lng:-4.4249  },
  { id:"zagora",       name:"Zagora",         lat:30.3322, lng:-5.8379  },
  { id:"merzouga",     name:"Merzouga",       lat:31.0979, lng:-3.9733  },
  { id:"ifrane",       name:"Ifrane",         lat:33.5228, lng:-5.1073  },
  { id:"al_hoceima",   name:"Al Hoceïma",     lat:35.2517, lng:-3.9372  },
  { id:"tetouan",      name:"Tétouan",        lat:35.5785, lng:-5.3684  },
  { id:"larache",      name:"Larache",        lat:35.1932, lng:-6.1560  },
  { id:"kenitra",      name:"Kénitra",        lat:34.2610, lng:-6.5802  },
  { id:"sale",         name:"Salé",           lat:34.0531, lng:-6.7985  },
  { id:"midelt",       name:"Midelt",         lat:32.6852, lng:-4.7340  },
  { id:"taroudant",    name:"Taroudant",      lat:30.4702, lng:-8.8772  },
  { id:"tan_tan",      name:"Tan-Tan",        lat:28.4378, lng:-11.1031 },
  { id:"settat",       name:"Settat",         lat:33.0010, lng:-7.6167  },
  { id:"khouribga",    name:"Khouribga",      lat:32.8811, lng:-6.9063  },
  { id:"dakhla",       name:"Dakhla",         lat:23.6848, lng:-15.9570 },
  { id:"laayoune",     name:"Laâyoune",       lat:27.1536, lng:-13.2034 },
];

/* ════════ Leaflet Map Component ════════ */
function MoroccoLeafletMap({ selected, onSelect, hotelCityNorms }) {
  const mapRef    = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef({});
  const mapId     = useRef("map-" + Math.random().toString(36).slice(2));

  useEffect(() => {
    if (leafletRef.current) return;

    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id   = "leaflet-css";
      link.rel  = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => initMap();
    document.head.appendChild(script);

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
  }, []);

  const initMap = () => {
    const L = window.L;
    if (!L || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [31.7917, -7.0926],
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);

    leafletRef.current = map;
    renderMarkers(L, map);
  };

  const renderMarkers = (L, map) => {
    // Clear old markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    CITIES.forEach(city => {
      const hasH = hotelCityNorms?.has(norm(city.name));
      const isSel = selected?.id === city.id;

      const icon = L.divIcon({
        className: "",
        html: `
          <div style="
            position:relative;
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <div style="
              width:${isSel ? 18 : hasH ? 14 : 10}px;
              height:${isSel ? 18 : hasH ? 14 : 10}px;
              border-radius:50%;
              background:${isSel ? GOLD : hasH ? GOLD : "#94a3b8"};
              border:${isSel ? `3px solid ${GOLD_D}` : hasH ? `2px solid rgba(139,105,20,0.5)` : "2px solid rgba(148,163,184,0.4)"};
              box-shadow:${isSel ? `0 0 0 4px rgba(201,169,110,0.25), 0 2px 8px rgba(0,0,0,0.2)` : "0 1px 4px rgba(0,0,0,0.15)"};
              transition:all .2s;
            "></div>
          </div>
        `,
        iconSize: [isSel ? 18 : hasH ? 14 : 10, isSel ? 18 : hasH ? 14 : 10],
        iconAnchor: [isSel ? 9 : hasH ? 7 : 5, isSel ? 9 : hasH ? 7 : 5],
      });

      const marker = L.marker([city.lat, city.lng], { icon })
        .addTo(map)
        .bindTooltip(`
          <div style="font-family:sans-serif;padding:2px 0">
            <strong style="font-size:12px;color:${NAVY}">${city.name}</strong>
            ${hasH ? `<br/><span style="font-size:11px;color:${GOLD_D}">● Hotels available</span>` : ""}
          </div>
        `, { direction: "top", offset: [0, -8] });

      marker.on("click", () => onSelect(city));
      markersRef.current[city.id] = marker;
    });
  };

  // Re-render markers when selected changes
  useEffect(() => {
    const L = window.L;
    const map = leafletRef.current;
    if (!L || !map) return;
    renderMarkers(L, map);

    if (selected) {
      map.flyTo([selected.lat, selected.lng], 9, { duration: 0.8 });
    } else {
      map.flyTo([31.7917, -7.0926], 5, { duration: 0.8 });
    }
  }, [selected]);

  return (
    <div
      ref={mapRef}
      id={mapId.current}
      style={{
        width: "100%",
        height: 460,
        borderRadius: "var(--border-radius-lg)",
        border: "0.5px solid var(--color-border-tertiary)",
        overflow: "hidden",
        zIndex: 0,
      }}
    />
  );
}

/* ════════ Hotel Card ════════ */
function HotelCard({ hotel, nights }) {
  const cheapest = hotel.rooms.reduce((m, r) => r.price < m.price ? r : m, hotel.rooms[0]);
  const subtotal  = cheapest.price * nights;
  const total     = subtotal + Math.round(subtotal * 0.1);

  return (
    <Link to={`/hotel/${hotel.id}`} viewTransition style={{ textDecoration: "none" }}>
      <div
        style={{
          display: "flex", gap: 14, padding: "12px 14px",
          borderRadius: "var(--border-radius-lg)",
          background: "var(--color-background-primary)",
          border: "1px solid var(--color-border-tertiary)",
          boxShadow: "0 2px 10px rgba(26,26,46,0.04)",
          transition: "box-shadow .2s, border-color .2s, transform .2s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 28px rgba(26,26,46,0.1)";
          e.currentTarget.style.borderColor = GOLD;
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 2px 10px rgba(26,26,46,0.04)";
          e.currentTarget.style.borderColor = "var(--color-border-tertiary)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div style={{ width: 88, height: 88, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
          <img src={hotel.image} alt={hotel.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {hotel.name}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(201,169,110,0.1)", padding: "2px 7px", borderRadius: 20, flexShrink: 0 }}>
                <Star style={{ width: 10, height: 10, fill: GOLD, color: GOLD }} />
                <span style={{ fontSize: 11, fontWeight: 500, color: GOLD_D }}>{hotel.rating}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 8 }}>
              <MapPin style={{ width: 11, height: 11, color: GOLD, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{hotel.location}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 500, color: NAVY }}>{formatMad(cheapest.price)}</span>
              <span style={{ fontSize: 11, color: "var(--color-text-secondary)", marginLeft: 4 }}>/ night</span>
            </div>
            {nights > 1 && (
              <span style={{ fontSize: 12, color: GOLD_D, fontWeight: 500 }}>
                {formatMad(total)} total
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ════════ PAGE ════════ */
export function SearchResultsPage() {
  const { hotels } = useAppData();
  const [searchParams, setSearchParams] = useSearchParams();
  const cityParam = searchParams.get("city")    ?? "";
  const checkIn   = searchParams.get("checkIn")  ?? "";
  const checkOut  = searchParams.get("checkOut") ?? "";
  const nights    = nightsBetween(checkIn, checkOut);

  const [query,   setQuery]   = useState(cityParam);
  const [mapCity, setMapCity] = useState(
    () => CITIES.find(c => norm(c.name) === norm(cityParam)) ?? null
  );

  const applyCity = (name) => {
    const p = new URLSearchParams(searchParams);
    if (name.trim()) p.set("city", name.trim()); else p.delete("city");
    setSearchParams(p, { replace: true });
  };

  const handleMapSelect = (c) => {
    setMapCity(c);
    setQuery(c.name);
    applyCity(c.name);
  };

  const handleInput = (e) => {
    const v = e.target.value;
    setQuery(v);
    const match = CITIES.find(c => norm(c.name) === norm(v));
    setMapCity(match ?? null);
    applyCity(v);
  };

  const clearSearch = () => {
    setQuery(""); setMapCity(null); applyCity("");
  };

  const results = useMemo(() => {
    const q = norm(cityParam);
    return hotels
      .filter(h => !q || norm(h.location).includes(q) || norm(h.name).includes(q))
      .sort((a, b) => b.rating - a.rating || a.price - b.price);
  }, [cityParam, hotels]);

  const hotelCityNorms = useMemo(() => {
    return new Set(hotels.map((h) => norm(String(h.location || "").split(",")[0] || "")));
  }, [hotels]);

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: NAVY, borderBottom: "1px solid rgba(201,169,110,0.15)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginBottom: 3 }}>
            Search
          </p>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
            {cityParam.trim()
              ? `${results.length} hotel${results.length !== 1 ? "s" : ""} in ${cityParam}`
              : "Browse all hotels"}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* ── LEFT: input + real map ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Search input */}
            <div style={{ position: "relative" }}>
              <Search style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)",
                width: 16, height: 16, color: GOLD, pointerEvents: "none",
              }} />
              <input
                value={query}
                onChange={handleInput}
                placeholder="Type a city or click on the map…"
                style={{
                  width: "100%", height: 44,
                  padding: "0 40px 0 40px",
                  borderRadius: "var(--border-radius-lg)",
                  border: "1.5px solid #E8D5A3",
                  background: "#FFFDF7",
                  fontSize: 14, color: NAVY, outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = GOLD;
                  e.target.style.boxShadow = "0 0 0 3px rgba(201,169,110,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#E8D5A3";
                  e.target.style.boxShadow = "none";
                }}
              />
              {query && (
                <button onClick={clearSearch} style={{
                  position: "absolute", right: 10, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", color: "#bbb",
                  fontSize: 20, lineHeight: 1, padding: "0 4px",
                }}>×</button>
              )}
            </div>

            {/* Real Leaflet map */}
            <MoroccoLeafletMap selected={mapCity} onSelect={handleMapSelect} hotelCityNorms={hotelCityNorms} />

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { color: GOLD,      label: "Cities with hotels" },
                { color: "#94a3b8", label: "Other cities"       },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--color-text-secondary)" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: results ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

            {!cityParam.trim() && (
              <div style={{
                padding: "48px 20px", textAlign: "center",
                borderRadius: "var(--border-radius-lg)",
                border: "1px dashed var(--color-border-secondary)",
                color: "var(--color-text-tertiary)",
              }}>
                <MapPin style={{ width: 28, height: 28, marginBottom: 10, opacity: 0.25, display: "block", margin: "0 auto 10px", color: GOLD }} />
                <p style={{ fontSize: 14, marginBottom: 4 }}>Click a city on the map</p>
                <p style={{ fontSize: 12 }}>or type a destination to see available hotels</p>
              </div>
            )}

            {cityParam.trim() && results.length === 0 && (
              <div style={{
                padding: "32px 20px", textAlign: "center",
                borderRadius: "var(--border-radius-lg)",
                background: "var(--color-background-secondary)",
                fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7,
              }}>
                No hotels found in <strong style={{ color: GOLD_D }}>{cityParam}</strong>.<br />
                <span style={{ fontSize: 12 }}>Try: Casablanca, Marrakech, Fès, Rabat, Agadir or Chefchaouen.</span>
              </div>
            )}

            {results.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: GOLD_D }}>
                    {results.length} propert{results.length !== 1 ? "ies" : "y"} found
                  </p>
                  {nights > 1 && (
                    <p style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>
                      {nights} nights · incl. 10% service fee
                    </p>
                  )}
                </div>
                {results.map(h => (
                  <HotelCard key={h.id} hotel={h} nights={nights} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}