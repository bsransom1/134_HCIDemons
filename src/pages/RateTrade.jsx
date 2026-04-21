import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { userById } from "../data/users";
import Header from "../components/Header.jsx";
import StarRating from "../components/StarRating.jsx";

export default function RateTrade() {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const { trades, listings, archivedListings, currentUser, updateTrade, toast } =
    useApp();
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState("");

  const trade = useMemo(
    () => trades.find((t) => t.id === tradeId),
    [trades, tradeId],
  );
  const lookup = (id) =>
    listings.find((l) => l.id === id) ??
    archivedListings.find((l) => l.id === id);

  if (!trade || !currentUser) {
    return (
      <div className="page-enter pb-nav">
        <Header back title="Rate trade" to="/trades" />
        <p className="px-6 pt-16 text-center text-slate-600">
          Nothing to rate yet.
        </p>
      </div>
    );
  }

  const listing = lookup(trade.listingId);
  const other = userById(
    currentUser.id === trade.sellerId ? trade.buyerId : trade.sellerId,
  );

  const submit = (e) => {
    e.preventDefault();
    updateTrade(trade.id, {
      rating: stars,
      review: review.trim(),
    });
    toast("Thanks — your review was saved.");
    navigate("/trades");
  };

  return (
    <div className="page-enter pb-nav">
      <Header back title="Rate this trade" to="/trades" />

      <div className="flex flex-col items-center px-6 pt-6 text-center">
        <img
          src={other?.avatar}
          alt=""
          className="h-20 w-20 rounded-full object-cover ring-4 ring-uci-gold/50"
        />
        <p className="mt-3 font-display text-xl text-slate-900">
          How was your trade with {other?.firstName}?
        </p>
        {listing && (
          <p className="mt-1 text-sm text-slate-500">for {listing.title}</p>
        )}

        <div className="mt-5">
          <StarRating value={stars} onChange={setStars} size={32} />
        </div>

        <form onSubmit={submit} className="mt-6 w-full text-left">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Add a short review (optional)
          </label>
          <textarea
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="They were friendly, on time, and the item was as described."
            className="input resize-none"
          />
          <button type="submit" className="btn-primary mt-5 w-full">
            Submit rating
          </button>
          <Link to="/trades" className="mt-2 block text-center text-xs text-slate-500">
            Skip for now
          </Link>
        </form>
      </div>
    </div>
  );
}
