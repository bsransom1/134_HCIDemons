import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useApp } from "../context/AppContext.jsx";
import { tradeZones } from "../data/tradeZones";
import { userById } from "../data/users";
import ZoneMarker from "../components/ZoneMarker.jsx";

const UCI_BOUNDS = [
  [33.6405, -117.848],
  [33.652, -117.82],
];
const DEFAULT_CENTER = [33.6461, -117.8426];

const myIcon = L.divIcon({
  className: "zot-my-marker",
  html: `<div style="width:16px;height:16px;border-radius:9999px;background:#0064A4;border:3px solid #FFD200;box-shadow:0 1px 6px rgba(0,0,0,.35)"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const otherIcon = L.divIcon({
  className: "zot-other-marker",
  html: `<div style="width:12px;height:12px;border-radius:9999px;background:#94a3b8;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.25)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function MapView() {
  const { listings, currentUser } = useApp();
  const [legendOpen, setLegendOpen] = useState(true);

  const { mine, others } = useMemo(() => {
    const m = [];
    const o = [];
    listings.forEach((l) => {
      const pt = {
        id: l.id,
        title: l.title,
        price: l.price,
        tradeMode: l.tradeMode,
        image: l.images?.[0],
        lat: l.location?.lat,
        lng: l.location?.lng,
        sellerId: l.sellerId,
      };
      if (!pt.lat || !pt.lng) return;
      if (l.sellerId === currentUser?.id) m.push(pt);
      else o.push(pt);
    });
    return { mine: m, others: o };
  }, [listings, currentUser?.id]);

  return (
    <div className="page-enter flex h-minus-bottom-nav flex-col">
      <header className="px-4 pt-safe">
        <div className="flex items-center justify-between pt-3">
          <div>
            <h1 className="font-display text-xl font-semibold text-uci-blue">
              Campus map
            </h1>
            <p className="text-xs text-slate-500">
              Safe zones, your listings, and nearby Anteaters.
            </p>
          </div>
        </div>
      </header>

      <div className="relative flex-1 px-3 pb-3 pt-3">
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={15}
          minZoom={14}
          maxZoom={18}
          maxBounds={UCI_BOUNDS}
          maxBoundsViscosity={1}
          className="h-full w-full rounded-2xl border border-slate-200 shadow-sm"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {tradeZones.map((z) => (
            <ZoneMarker key={z.id} zone={z} />
          ))}
          {mine.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lng]} icon={myIcon}>
              <Popup>
                <MiniListing listing={m} accent="Your listing" />
              </Popup>
            </Marker>
          ))}
          {others.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lng]} icon={otherIcon}>
              <Popup>
                <MiniListing listing={m} accent={userById(m.sellerId)?.name} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {legendOpen && (
          <div className="pointer-events-auto absolute left-5 right-5 top-5 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Legend
              </p>
              <button
                type="button"
                onClick={() => setLegendOpen(false)}
                aria-label="Hide legend"
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
              <LegendDot color="bg-emerald-600" label="Safe zone" />
              <LegendDot color="bg-uci-blue ring-2 ring-uci-gold" label="Your listing" />
              <LegendDot color="bg-slate-400" label="Nearby" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-slate-700">{label}</span>
    </div>
  );
}

function MiniListing({ listing, accent }) {
  return (
    <div className="w-48">
      {listing.image && (
        <img
          src={listing.image}
          alt=""
          className="mb-2 h-24 w-full rounded-md object-cover"
        />
      )}
      <p className="text-sm font-semibold leading-tight text-slate-900">
        {listing.title}
      </p>
      <p className="mt-0.5 text-xs text-uci-blue">
        {listing.tradeMode === "trade" ? "Trade" : `$${listing.price}`}
      </p>
      {accent && (
        <p className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-500">
          {accent}
        </p>
      )}
      <Link
        to={`/item/${listing.id}`}
        className="mt-2 inline-block rounded-full bg-uci-blue px-3 py-1 text-xs font-semibold text-white"
      >
        View listing
      </Link>
    </div>
  );
}
