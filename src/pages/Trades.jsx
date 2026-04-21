import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { userById } from "../data/users";

function statusBadge(status) {
  switch (status) {
    case "offer_sent":
      return "bg-amber-100 text-amber-800";
    case "accepted":
      return "bg-sky-100 text-sky-800";
    case "meetup_set":
      return "bg-indigo-100 text-indigo-800";
    case "complete":
      return "bg-emerald-100 text-emerald-800";
    case "declined":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function statusLabel(status) {
  return (
    {
      offer_sent: "Pending",
      accepted: "Accepted",
      meetup_set: "Meetup set",
      complete: "Completed",
      declined: "Declined",
    }[status] ?? status
  );
}

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Trades() {
  const { trades, currentUser, listings, archivedListings } = useApp();
  const [tab, setTab] = useState("incoming");

  const lookupListing = (id) =>
    listings.find((l) => l.id === id) ??
    archivedListings.find((l) => l.id === id);

  const { incoming, outgoing, completed } = useMemo(() => {
    const inc = [];
    const out = [];
    const done = [];
    trades.forEach((t) => {
      if (t.status === "complete") done.push(t);
      else if (t.sellerId === currentUser?.id) inc.push(t);
      else if (t.buyerId === currentUser?.id) out.push(t);
    });
    const order = (arr) =>
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return {
      incoming: order(inc),
      outgoing: order(out),
      completed: order(done),
    };
  }, [trades, currentUser?.id]);

  const list =
    tab === "incoming"
      ? incoming
      : tab === "outgoing"
        ? outgoing
        : completed;

  const tabs = [
    { id: "incoming", label: "Incoming", count: incoming.length },
    { id: "outgoing", label: "Outgoing", count: outgoing.length },
    { id: "completed", label: "Completed", count: completed.length },
  ];

  return (
    <div className="page-enter pb-nav">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 px-4 pt-safe backdrop-blur">
        <div className="flex h-14 items-center">
          <h1 className="text-base font-semibold text-slate-900">Trades</h1>
        </div>
        <div className="-mb-px flex gap-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative pb-3 text-sm font-semibold transition ${
                tab === t.id ? "text-uci-blue" : "text-slate-500"
              }`}
            >
              {t.label}{" "}
              <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                {t.count}
              </span>
              {tab === t.id && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-uci-blue" />
              )}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col gap-3 px-4 pt-4">
        {list.map((t) => {
          const isSeller = t.sellerId === currentUser?.id;
          const other = userById(isSeller ? t.buyerId : t.sellerId);
          const listing = lookupListing(t.listingId);
          const isCompleted = t.status === "complete";
          return (
            <Link
              key={t.id}
              to={`/trade/${t.id}`}
              className={`card flex gap-3 overflow-hidden p-3 transition hover:border-uci-blue/40 ${
                isCompleted ? "opacity-85" : ""
              }`}
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {listing?.images?.[0] && (
                  <img
                    src={listing.images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-1 text-sm font-semibold text-slate-900">
                    {listing?.title ?? "Listing"}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusBadge(t.status)}`}
                  >
                    {statusLabel(t.status)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {isSeller ? "From" : "To"} {other?.name} · Zot #{other?.zotId}
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-uci-blue">
                    {t.offerType === "trade" ? "Trade offer" : `$${t.amount}`}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {timeAgo(t.createdAt)}
                  </p>
                </div>
                {isCompleted && !t.rating && (
                  <p className="mt-1 text-[11px] font-semibold text-uci-blue">
                    Tap to leave a rating →
                  </p>
                )}
              </div>
            </Link>
          );
        })}

        {!list.length && <EmptyState tab={tab} />}
      </div>
    </div>
  );
}

function EmptyState({ tab }) {
  const copy = {
    incoming: {
      title: "No incoming offers yet",
      body: "When another Anteater offers on one of your listings, it'll show up here.",
      cta: { to: "/create", label: "List something" },
    },
    outgoing: {
      title: "No outgoing offers yet",
      body: "Browse the feed and make an offer — it'll appear here when it's sent.",
      cta: { to: "/feed", label: "Browse feed" },
    },
    completed: {
      title: "No completed trades yet",
      body: "Finish a trade and it'll live here — ratings and all.",
      cta: { to: "/feed", label: "Find your first trade" },
    },
  }[tab];

  return (
    <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
      <p className="font-display text-lg text-slate-900">{copy.title}</p>
      <p className="mt-1 text-sm text-slate-600">{copy.body}</p>
      <Link to={copy.cta.to} className="btn-primary mt-5 inline-flex">
        {copy.cta.label}
      </Link>
    </div>
  );
}
