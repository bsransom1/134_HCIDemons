import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { userById } from "../data/users";
import Header from "../components/Header.jsx";
import StarRating from "../components/StarRating.jsx";
import ItemCard from "../components/ItemCard.jsx";

export default function Profile() {
  const { userId } = useParams();
  const {
    currentUser,
    listings,
    archivedListings,
    trades,
    markSold,
    toast,
  } = useApp();
  const profile = userId ? userById(userId) : currentUser;
  const isSelf = !userId || userId === currentUser?.id;
  const [tab, setTab] = useState("listings");

  const their = useMemo(
    () => listings.filter((l) => l.sellerId === profile?.id),
    [listings, profile?.id],
  );

  const theirCompleted = useMemo(
    () =>
      trades.filter(
        (t) =>
          t.status === "complete" &&
          (t.buyerId === profile?.id || t.sellerId === profile?.id),
      ),
    [trades, profile?.id],
  );

  if (!profile) {
    return (
      <div className="page-enter pb-nav">
        <Header back title="Profile" to="/feed" />
        <p className="px-6 pt-16 text-center text-slate-600">User not found.</p>
      </div>
    );
  }

  const handleMarkSold = (id) => {
    markSold(id);
    toast("Listing marked as sold.");
  };

  return (
    <div className="page-enter pb-nav">
      {isSelf ? (
        <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 px-4 pt-safe backdrop-blur">
          <div className="flex h-14 items-center justify-between">
            <h1 className="text-base font-semibold text-slate-900">Profile</h1>
            <button
              type="button"
              aria-label="Settings"
              onClick={() => toast("Settings coming soon.")}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
            >
              <GearIcon />
            </button>
          </div>
        </header>
      ) : (
        <Header back title={profile.name} to="/feed" />
      )}

      <section className="px-4 pt-5">
        <div className="flex flex-col items-center text-center">
          <img
            src={profile.avatar}
            alt=""
            className="h-24 w-24 rounded-full object-cover ring-4 ring-uci-gold/50"
          />
          <h2 className="mt-3 font-display text-2xl text-slate-900">
            {profile.name}
          </h2>
          <p className="text-sm text-slate-600">
            {profile.major} · {profile.year}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="rounded-full bg-uci-blue/10 px-2.5 py-1 text-xs font-semibold text-uci-blue">
              Zot #{profile.zotId}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-600">
              <StarRating value={profile.rating} size={14} readOnly />
              <span className="font-semibold text-slate-800">
                {profile.rating.toFixed(1)}
              </span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-700">
            {profile.bio}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatCard label="Trades" value={profile.completedTrades} />
          <StatCard label="Active" value={their.length} />
          <StatCard label="Member" value={profile.memberSince?.split(" ")[1] ?? "—"} />
        </div>
      </section>

      <div className="mt-6 border-b border-slate-200 px-4">
        <div className="flex gap-6">
          {[
            { id: "listings", label: isSelf ? "My Listings" : "Listings" },
            { id: "history", label: "Trade History" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative pb-3 text-sm font-semibold transition ${
                tab === t.id ? "text-uci-blue" : "text-slate-500"
              }`}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-uci-blue" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        {tab === "listings" && (
          <>
            {isSelf ? (
              <div className="grid grid-cols-1 gap-3">
                {their.map((l) => (
                  <MyListingRow
                    key={l.id}
                    listing={l}
                    onSold={() => handleMarkSold(l.id)}
                  />
                ))}
                {!their.length && (
                  <EmptyListings self />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {their.map((l) => (
                  <ItemCard key={l.id} listing={l} />
                ))}
                {!their.length && <EmptyListings />}
              </div>
            )}
          </>
        )}

        {tab === "history" && (
          <div className="space-y-2">
            {theirCompleted.map((t) => (
              <HistoryRow key={t.id} trade={t} viewerId={profile.id} />
            ))}
            {!theirCompleted.length && (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-600">
                No completed trades yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center">
      <p className="text-xl font-bold text-slate-900">{value}</p>
      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>
  );
}

function MyListingRow({ listing, onSold }) {
  return (
    <div className="card flex gap-3 p-3">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <img
          src={listing.images[0]}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-semibold text-slate-900">
          {listing.title}
        </p>
        <p className="text-sm font-bold text-uci-blue">
          {listing.tradeMode === "trade" ? "Trade" : `$${listing.price}`}
        </p>
        <div className="mt-2 flex gap-2">
          <Link
            to={`/item/${listing.id}`}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
          >
            View
          </Link>
          <button
            type="button"
            onClick={onSold}
            className="rounded-full bg-uci-blue px-3 py-1 text-xs font-semibold text-white"
          >
            Mark as sold
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryRow({ trade, viewerId }) {
  const { listings, archivedListings } = useApp();
  const listing =
    listings.find((l) => l.id === trade.listingId) ??
    archivedListings.find((l) => l.id === trade.listingId);
  const other = userById(
    viewerId === trade.sellerId ? trade.buyerId : trade.sellerId,
  );

  return (
    <Link
      to={`/trade/${trade.id}`}
      className="card flex items-center gap-3 p-3"
    >
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {listing?.images?.[0] && (
          <img
            src={listing.images[0]}
            alt=""
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-sm font-semibold text-slate-900">
          {listing?.title ?? "Listing"}
        </p>
        <p className="text-xs text-slate-500">with {other?.name}</p>
        {trade.rating ? (
          <div className="mt-1">
            <StarRating value={trade.rating} size={12} readOnly />
          </div>
        ) : (
          <p className="mt-0.5 text-[11px] font-semibold text-uci-blue">
            Rate this trade →
          </p>
        )}
      </div>
    </Link>
  );
}

function EmptyListings({ self }) {
  return (
    <div className="col-span-2 rounded-2xl border border-dashed border-slate-200 p-8 text-center">
      <p className="font-display text-lg text-slate-900">
        {self ? "You haven’t listed anything yet" : "No listings yet"}
      </p>
      <p className="mt-1 text-sm text-slate-600">
        {self
          ? "Snap a photo, set a price, and your first listing is live."
          : "Check back soon."}
      </p>
      {self && (
        <Link to="/create" className="btn-primary mt-4 inline-flex">
          Create a listing
        </Link>
      )}
    </div>
  );
}

function GearIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.3l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.7 7l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}
