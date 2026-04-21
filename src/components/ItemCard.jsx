import { Link } from "react-router-dom";
import { userById } from "../data/users";
import { matchesMajor } from "../data/phenotypes";
import { useApp } from "../context/AppContext.jsx";

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

export default function ItemCard({ listing }) {
  const { currentUser } = useApp();
  const seller = userById(listing.sellerId);
  const isMine = seller?.id === currentUser?.id;
  const matches = !isMine && matchesMajor(listing, currentUser?.major);

  return (
    <Link
      to={`/item/${listing.id}`}
      className="card group block overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={listing.images[0]}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${conditionStyles[listing.condition]}`}
        >
          {conditionLabel[listing.condition]}
        </span>
      </div>

      <div className="p-3">
        {matches && (
          <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-uci-blue/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-uci-blue">
            ★ Major match
          </span>
        )}
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 flex-1 text-sm font-semibold leading-snug text-slate-900">
            {listing.title}
          </p>
          <p className="shrink-0 text-base font-bold text-uci-blue">
            {listing.tradeMode === "trade" ? "Trade" : `$${listing.price}`}
          </p>
        </div>

        {seller && (
          <div className="mt-2.5 flex items-center gap-2">
            <img
              src={seller.avatar}
              alt=""
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="truncate text-xs text-slate-600">
              {seller.name}
            </span>
            <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
              Zot #{seller.zotId}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
