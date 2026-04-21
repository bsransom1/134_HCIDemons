import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomSheet from "./BottomSheet.jsx";
import { useApp } from "../context/AppContext.jsx";

/**
 * mode: "offer" | "trade"
 */
export default function OfferSheet({ listing, open, onClose, mode = "offer" }) {
  const { currentUser, listings, addTrade } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(mode);
  const [amount, setAmount] = useState(listing?.price ?? "");
  const [note, setNote] = useState("");
  const [counterId, setCounterId] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!open) return;
    setActiveTab(mode);
    setAmount(listing?.price ?? "");
    setNote("");
    setCounterId("");
    setSuccess(null);
  }, [open, mode, listing]);

  const myListings = useMemo(
    () => listings.filter((l) => l.sellerId === currentUser?.id),
    [listings, currentUser],
  );

  if (!listing || !currentUser) return null;

  const canOffer = listing.tradeMode !== "trade";
  const canTrade = listing.tradeMode !== "sell";

  const tabs = [
    canOffer && { id: "offer", label: "Make Offer" },
    canTrade && { id: "trade", label: "Propose Trade" },
  ].filter(Boolean);

  const effectiveTab = tabs.find((t) => t.id === activeTab)?.id ?? tabs[0]?.id;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (effectiveTab === "offer" && !amount) return;
    if (effectiveTab === "trade" && !counterId) return;

    const trade = {
      id: `t-${Date.now()}`,
      listingId: listing.id,
      buyerId: currentUser.id,
      sellerId: listing.sellerId,
      offerType: effectiveTab === "trade" ? "trade" : "buy",
      amount: effectiveTab === "offer" ? Number(amount) : 0,
      offeredListingId: effectiveTab === "trade" ? counterId : null,
      note: note.trim(),
      status: "offer_sent",
      meetup: null,
      buyerConfirmed: false,
      sellerConfirmed: false,
      messages: note.trim()
        ? [
            {
              id: `m-${Date.now()}`,
              fromId: currentUser.id,
              text: note.trim(),
              at: new Date().toISOString(),
            },
          ]
        : [],
      rating: null,
      createdAt: new Date().toISOString(),
    };

    addTrade(trade);
    setSuccess(trade);
  };

  const goToTrades = () => {
    onClose?.();
    navigate("/trades");
  };
  const goToTrade = () => {
    onClose?.();
    if (success) navigate(`/trade/${success.id}`);
  };

  if (success) {
    return (
      <BottomSheet open={open} onClose={onClose}>
        <div className="flex flex-col items-center py-4 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
            ✓
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            {success.offerType === "trade" ? "Trade proposed!" : "Offer sent!"}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            We notified the seller. You can track this in your Trades tab.
          </p>
          <div className="mt-5 flex w-full flex-col gap-2">
            <button
              type="button"
              onClick={goToTrade}
              className="btn-primary w-full"
            >
              View trade
            </button>
            <button
              type="button"
              onClick={goToTrades}
              className="btn-secondary w-full"
            >
              Go to Trades
            </button>
          </div>
        </div>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={effectiveTab === "trade" ? "Propose a trade" : "Make an offer"}
    >
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
        <img
          src={listing.images[0]}
          alt=""
          className="h-12 w-12 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {listing.title}
          </p>
          <p className="text-xs text-slate-500">
            Listed {listing.tradeMode === "trade" ? "for trade" : `at $${listing.price}`}
          </p>
        </div>
      </div>

      {tabs.length > 1 && (
        <div className="mb-4 flex rounded-full bg-slate-100 p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
                effectiveTab === t.id
                  ? "bg-white text-uci-blue shadow-sm"
                  : "text-slate-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {effectiveTab === "offer" && (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Your offer
            </label>
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-uci-blue focus-within:ring-2 focus-within:ring-uci-blue/20">
              <span className="mr-1 text-xl font-bold text-uci-blue">$</span>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border-0 bg-transparent text-2xl font-bold text-slate-900 outline-none"
              />
            </div>
            {listing.price > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                Seller asked ${listing.price}
              </p>
            )}
          </div>
        )}

        {effectiveTab === "trade" && (
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Offer one of your listings
            </label>
            {myListings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                You don&apos;t have any active listings yet. Post something
                from the <span className="font-semibold">Sell</span> tab to
                propose a trade.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {myListings.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setCounterId(l.id)}
                    className={`overflow-hidden rounded-xl border text-left transition ${
                      counterId === l.id
                        ? "border-uci-blue ring-2 ring-uci-blue/30"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                      <img
                        src={l.images[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <p className="line-clamp-1 text-xs font-semibold text-slate-900">
                        {l.title}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {l.price > 0 ? `$${l.price}` : "Trade"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Add a note (optional)
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Let them know when you can meet, if you can cover tax, etc."
            className="input resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={effectiveTab === "trade" && !counterId}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {effectiveTab === "trade" ? "Send trade proposal" : "Send offer"}
        </button>
      </form>
    </BottomSheet>
  );
}
