import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { userById } from "../data/users";
import { tradeZones, zoneById } from "../data/tradeZones";
import { matchesMajor } from "../data/phenotypes";
import OfferSheet from "../components/OfferSheet.jsx";
import Header from "../components/Header.jsx";

const conditionStyles = {
  new: "bg-emerald-500 text-white",
  "like-new": "bg-emerald-100 text-emerald-800 border border-emerald-200",
  good: "bg-amber-100 text-amber-800 border border-amber-200",
  fair: "bg-slate-200 text-slate-700 border border-slate-300",
};

const conditionLabel = {
  new: "New",
  "like-new": "Like new",
  good: "Good",
  fair: "Fair",
};

function nearestZones(listing, count = 3) {
  if (!listing?.location) return tradeZones.slice(0, count);
  const preferred = zoneById(listing.location.zoneId);
  const others = tradeZones.filter((z) => z.id !== preferred?.id);
  return preferred ? [preferred, ...others].slice(0, count) : tradeZones.slice(0, count);
}

export default function ItemDetail() {
  const { id } = useParams();
  const { listings, currentUser, favorites, toggleFavorite } = useApp();
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState("offer");

  const listing = useMemo(
    () => listings.find((l) => l.id === id),
    [listings, id],
  );

  if (!listing) {
    return (
      <div className="page-enter px-6 pb-nav pt-16 text-center">
        <Header back title="Not found" />
        <p className="mt-6 text-slate-600">This listing is no longer available.</p>
        <Link to="/feed" className="mt-6 inline-block text-uci-blue underline">
          Back to feed
        </Link>
      </div>
    );
  }

  const seller = userById(listing.sellerId);
  const isOwn = currentUser?.id === listing.sellerId;
  const matches = !isOwn && matchesMajor(listing, currentUser?.major);
  const faved = favorites.has(listing.id);
  const priceMain =
    listing.tradeMode === "trade" ? "Open to trade" : `$${listing.price}`;

  const openSheet = (mode) => {
    setSheetMode(mode);
    setSheetOpen(true);
  };

  const spots = nearestZones(listing);

  return (
    <div className="page-enter pb-nav">
      <Header transparent back right={
        <button
          type="button"
          onClick={() => toggleFavorite(listing.id)}
          aria-label={faved ? "Remove favorite" : "Favorite listing"}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-rose-500 shadow"
        >
          {faved ? "♥" : "♡"}
        </button>
      } />

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-4 bottom-4 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${conditionStyles[listing.condition]}`}
          >
            {conditionLabel[listing.condition]}
          </span>
          <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-semibold capitalize text-white">
            {listing.category}
          </span>
          {matches && (
            <span className="rounded-full bg-uci-blue px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Matches your major
            </span>
          )}
        </div>
      </div>

      <div className="px-4 pt-5">
        <h1 className="text-2xl font-bold leading-tight text-slate-900">
          {listing.title}
        </h1>
        <p className="mt-1 text-3xl font-bold text-uci-blue">{priceMain}</p>

        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-700">
          {listing.description}
        </p>

        {seller && (
          <Link
            to={seller.id === currentUser?.id ? "/profile" : `/profile/${seller.id}`}
            className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-uci-blue/40"
          >
            <img
              src={seller.avatar}
              alt=""
              className="h-12 w-12 rounded-full object-cover ring-2 ring-uci-gold/60"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold text-slate-900">{seller.name}</p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                  Zot #{seller.zotId}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                ★ {seller.rating.toFixed(1)} · {seller.completedTrades} trades ·
                Member since {seller.memberSince}
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-400"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </Link>
        )}

        <section className="mt-6">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            Safe meetup spots
          </h2>
          <div className="space-y-2">
            {spots.map((z) => (
              <div
                key={z.id}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3"
              >
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  ✓
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {z.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {z.hours} · {z.indoor ? "Indoor" : "Outdoor"}
                    {z.hasCameras ? " · Cameras" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {!isOwn ? (
          <div className="mt-6 space-y-2">
            {listing.tradeMode !== "trade" && (
              <button
                type="button"
                onClick={() => openSheet("offer")}
                className="btn-primary w-full"
              >
                Make offer
              </button>
            )}
            {listing.tradeMode !== "sell" && (
              <button
                type="button"
                onClick={() => openSheet("trade")}
                className="btn-gold w-full"
              >
                {listing.tradeMode === "trade"
                  ? "Propose a trade"
                  : "Propose a trade instead"}
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate(`/item/${listing.id}/message`)}
              className="btn-secondary w-full"
            >
              Message seller
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-600">
            This is your listing. Manage it from your Profile.
          </div>
        )}
      </div>

      <OfferSheet
        listing={listing}
        open={sheetOpen}
        mode={sheetMode}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  );
}
