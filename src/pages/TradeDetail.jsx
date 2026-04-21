import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { userById } from "../data/users";
import { tradeZones, zoneById } from "../data/tradeZones";
import Header from "../components/Header.jsx";

const stepLabels = [
  "Offer sent",
  "Accepted",
  "Meetup set",
  "Completed",
];

function stepIndex(trade) {
  if (trade.status === "complete") return 3;
  if (trade.status === "meetup_set") return 2;
  if (trade.status === "accepted") return 1;
  if (trade.status === "declined") return -1;
  return 0;
}

function suggestTimeLocal() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(14, 0, 0, 0);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatMeetupTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TradeDetail() {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const {
    trades,
    listings,
    archivedListings,
    currentUser,
    updateTrade,
    sendTradeMessage,
    toast,
  } = useApp();

  const trade = useMemo(
    () => trades.find((t) => t.id === tradeId),
    [trades, tradeId],
  );

  const lookup = (id) =>
    listings.find((l) => l.id === id) ??
    archivedListings.find((l) => l.id === id);

  const listing = trade ? lookup(trade.listingId) : null;
  const offeredListing = trade?.offeredListingId ? lookup(trade.offeredListingId) : null;

  const [zoneId, setZoneId] = useState(
    trade?.meetup?.zoneId ?? tradeZones[0].id,
  );
  const [time, setTime] = useState(trade?.meetup?.time ?? suggestTimeLocal());
  const [draft, setDraft] = useState("");
  const msgScrollRef = useRef(null);

  useEffect(() => {
    if (msgScrollRef.current) {
      msgScrollRef.current.scrollTop = msgScrollRef.current.scrollHeight;
    }
  }, [trade?.messages?.length]);

  if (!trade || !listing || !currentUser) {
    return (
      <div className="page-enter pb-nav">
        <Header back title="Trade" to="/trades" />
        <div className="px-6 pt-16 text-center">
          <p className="text-slate-600">This trade is no longer available.</p>
          <Link to="/trades" className="mt-4 inline-block text-uci-blue underline">
            Back to trades
          </Link>
        </div>
      </div>
    );
  }

  const isSeller = currentUser.id === trade.sellerId;
  const isBuyer = currentUser.id === trade.buyerId;
  const other = userById(isSeller ? trade.buyerId : trade.sellerId);
  const zone = zoneById(trade.meetup?.zoneId);
  const idx = stepIndex(trade);

  const acceptOffer = () => {
    updateTrade(trade.id, { status: "accepted" });
    toast("Offer accepted — pick a meetup.");
  };
  const declineOffer = () => {
    updateTrade(trade.id, { status: "declined" });
    toast("Offer declined.");
  };

  const setMeetup = (e) => {
    e?.preventDefault?.();
    if (!zoneId || !time) return;
    updateTrade(trade.id, {
      status: "meetup_set",
      meetup: { zoneId, time: new Date(time).toISOString() },
    });
    toast("Meetup confirmed — both parties notified.");
  };

  const markComplete = () => {
    updateTrade(trade.id, {
      status: "complete",
      buyerConfirmed: true,
      sellerConfirmed: true,
      completedAt: new Date().toISOString(),
    });
    toast("Trade complete — nice work.");
    navigate(`/trade/${trade.id}/rate`);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    sendTradeMessage(trade.id, {
      id: `m-${Date.now()}`,
      fromId: currentUser.id,
      text,
      at: new Date().toISOString(),
    });
    setDraft("");
  };

  return (
    <div className="page-enter pb-nav">
      <Header
        back
        to="/trades"
        title={isSeller ? "Incoming offer" : "Your offer"}
        subtitle={`with ${other?.name}`}
      />

      <div className="px-4 pt-4">
        <Link
          to={`/item/${listing.id}`}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3 transition hover:border-uci-blue/40"
        >
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
            {listing.images?.[0] && (
              <img
                src={listing.images[0]}
                alt=""
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-semibold text-slate-900">
              {listing.title}
            </p>
            <p className="mt-0.5 text-sm font-bold text-uci-blue">
              {trade.offerType === "trade"
                ? "Trade offer"
                : `Offer: $${trade.amount}`}
            </p>
          </div>
        </Link>

        {offeredListing && (
          <div className="mt-3 rounded-2xl border border-dashed border-slate-300 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
              In exchange for
            </p>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-14 w-14 overflow-hidden rounded-lg bg-slate-100">
                <img
                  src={offeredListing.images?.[0]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {offeredListing.title}
              </p>
            </div>
          </div>
        )}

        <ProgressBar idx={idx} declined={trade.status === "declined"} />

        {trade.status === "offer_sent" && isSeller && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">
              {other?.firstName} sent an offer
            </p>
            {trade.note && (
              <p className="mt-1 text-sm text-slate-600">“{trade.note}”</p>
            )}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={acceptOffer}
                className="btn-primary flex-1"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={declineOffer}
                className="btn-danger flex-1"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {trade.status === "offer_sent" && isBuyer && (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Waiting on {other?.firstName} to accept your offer.
          </div>
        )}

        {trade.status === "accepted" && (
          <form
            onSubmit={setMeetup}
            className="mt-6 space-y-3 rounded-2xl border border-slate-200 p-4"
          >
            <p className="font-semibold text-slate-900">Pick a safe trade zone</p>
            <div className="grid grid-cols-1 gap-2">
              {tradeZones.map((z) => (
                <label
                  key={z.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                    zoneId === z.id
                      ? "border-uci-blue bg-uci-blue/5"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="zone"
                    value={z.id}
                    checked={zoneId === z.id}
                    onChange={() => setZoneId(z.id)}
                    className="mt-1 accent-uci-blue"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {z.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {z.hours} · {z.indoor ? "Indoor" : "Outdoor"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Time
              </label>
              <input
                type="datetime-local"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input mt-1"
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Confirm meetup
            </button>
          </form>
        )}

        {trade.status === "meetup_set" && (
          <div className="mt-6 space-y-3 rounded-2xl border border-uci-blue/30 bg-uci-blue/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-uci-blue">
              Meetup set
            </p>
            <p className="text-lg font-semibold text-slate-900">{zone?.name}</p>
            <p className="text-sm text-slate-600">
              {formatMeetupTime(trade.meetup?.time)}
            </p>
            <Link
              to="/map"
              className="inline-flex items-center gap-1 text-xs font-semibold text-uci-blue"
            >
              View on map →
            </Link>
            <button
              type="button"
              onClick={markComplete}
              className="btn-gold w-full"
            >
              I met up — mark complete
            </button>
          </div>
        )}

        {trade.status === "complete" && (
          <div className="mt-6 space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
            <p className="text-2xl">✓</p>
            <p className="text-sm font-semibold text-slate-900">
              Trade complete with {other?.firstName}
            </p>
            {trade.rating ? (
              <p className="text-xs text-slate-600">
                You rated them {trade.rating} ★
              </p>
            ) : (
              <Link to={`/trade/${trade.id}/rate`} className="btn-primary inline-flex">
                Leave a rating
              </Link>
            )}
          </div>
        )}

        {trade.status === "declined" && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            This offer was declined.
          </div>
        )}

        {trade.status !== "complete" && trade.status !== "declined" && (
          <section className="mt-8">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              Messages
            </h2>
            <div
              ref={msgScrollRef}
              className="mb-3 max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3"
            >
              {(trade.messages ?? []).length === 0 && (
                <p className="py-6 text-center text-xs text-slate-500">
                  No messages yet — say hi.
                </p>
              )}
              {(trade.messages ?? []).map((m) => {
                const mine = m.fromId === currentUser.id;
                return (
                  <div
                    key={m.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        mine
                          ? "bg-uci-blue text-white"
                          : "bg-white text-slate-800 shadow-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
            </div>
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Message ${other?.firstName}…`}
                className="input flex-1"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="btn-primary px-4 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ idx, declined }) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, i) => {
          const active = !declined && i <= idx;
          const current = !declined && i === idx;
          return (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${
                  active
                    ? "bg-uci-blue text-white"
                    : "bg-slate-100 text-slate-400"
                } ${current ? "ring-2 ring-uci-blue/30" : ""}`}
              >
                {i + 1}
              </div>
              <span
                className={`mt-1 text-center text-[10px] font-semibold ${
                  active ? "text-uci-blue" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      {declined && (
        <p className="mt-2 text-center text-xs font-semibold text-rose-600">
          Offer declined
        </p>
      )}
    </div>
  );
}
