import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { userById } from "../data/users";
import Header from "../components/Header.jsx";

/**
 * Lightweight direct-message thread tied to a listing. For the demo it
 * lives in local component state — enough to prove the interaction.
 */
export default function MessageThread() {
  const { id } = useParams();
  const { listings, currentUser } = useApp();

  const listing = useMemo(
    () => listings.find((l) => l.id === id),
    [listings, id],
  );
  const seller = listing ? userById(listing.sellerId) : null;

  const [messages, setMessages] = useState([
    {
      id: "m0",
      fromId: seller?.id ?? "seller",
      text: `Hey! Thanks for reaching out about the ${listing?.title ?? "listing"}. What were you thinking?`,
      at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
  ]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  if (!listing || !seller) {
    return (
      <div className="page-enter pb-nav">
        <Header back to="/feed" title="Message" />
        <p className="px-6 pt-16 text-center text-slate-600">
          This listing is no longer available.
        </p>
      </div>
    );
  }

  if (seller.id === currentUser?.id) {
    return (
      <div className="page-enter pb-nav">
        <Header back to={`/item/${listing.id}`} title="Message" />
        <p className="px-6 pt-16 text-center text-slate-600">
          This is your own listing.
        </p>
      </div>
    );
  }

  const send = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        fromId: currentUser.id,
        text,
        at: new Date().toISOString(),
      },
    ]);
    setDraft("");
  };

  return (
    <div className="page-enter flex h-minus-bottom-nav flex-col">
      <Header
        back
        to={`/item/${listing.id}`}
        title={seller.name}
        subtitle={`about "${listing.title}"`}
      />

      <Link
        to={`/item/${listing.id}`}
        className="mx-4 mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 p-2 transition hover:border-uci-blue/40"
      >
        <img
          src={listing.images[0]}
          alt=""
          className="h-12 w-12 rounded-lg object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-semibold text-slate-900">
            {listing.title}
          </p>
          <p className="text-xs font-semibold text-uci-blue">
            {listing.tradeMode === "trade" ? "Trade" : `$${listing.price}`}
          </p>
        </div>
      </Link>

      <div
        ref={scrollRef}
        className="flex-1 space-y-2 overflow-y-auto px-4 py-4"
      >
        {messages.map((m) => {
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

      <form
        onSubmit={send}
        className="flex items-center gap-2 border-t border-slate-200 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Message ${seller.firstName}…`}
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
    </div>
  );
}
