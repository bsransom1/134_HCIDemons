import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { matchesMajor } from "../data/phenotypes";
import ItemCard from "../components/ItemCard.jsx";
import NotificationBell from "../components/NotificationBell.jsx";

const categories = [
  { id: "all", label: "For you" },
  { id: "textbooks", label: "Textbooks" },
  { id: "tech", label: "Tech" },
  { id: "dorm", label: "Dorm" },
  { id: "clothing", label: "Clothing" },
  { id: "sports", label: "Sports" },
  { id: "trade", label: "Trade only" },
];

export default function Feed() {
  const { listings, currentUser } = useApp();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const ranked = useMemo(() => {
    return [...listings].sort((a, b) => {
      const am = matchesMajor(a, currentUser?.major) ? 1 : 0;
      const bm = matchesMajor(b, currentUser?.major) ? 1 : 0;
      if (am !== bm) return bm - am;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [listings, currentUser?.major]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return ranked.filter((l) => {
      if (
        needle &&
        !`${l.title} ${l.category} ${l.description}`
          .toLowerCase()
          .includes(needle)
      )
        return false;
      if (filter === "all") return true;
      if (filter === "trade") return l.tradeMode === "trade";
      return l.category === filter;
    });
  }, [ranked, q, filter]);

  return (
    <div className="page-enter pb-nav">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 px-4 pt-safe backdrop-blur">
        <div className="flex h-14 items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold text-uci-blue">
              ZotSwap
            </h1>
            <p className="text-[11px] text-slate-500">
              Hi {currentUser?.firstName} — Anteater-to-Anteater.
            </p>
          </div>
          <NotificationBell />
        </div>
        <div className="pb-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-sm focus-within:border-uci-blue focus-within:ring-2 focus-within:ring-uci-blue/20">
            <SearchIcon />
            <input
              type="search"
              placeholder="Search textbooks, tech, dorm…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={`chip ${filter === c.id ? "chip-active" : "chip-inactive"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 px-4 pt-4">
        {filtered.map((l) => (
          <ItemCard key={l.id} listing={l} />
        ))}
      </div>
      {!filtered.length && (
        <div className="px-6 py-16 text-center">
          <p className="font-display text-lg text-slate-900">No matches.</p>
          <p className="mt-1 text-sm text-slate-600">
            Try a different category or clear the search.
          </p>
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-slate-400"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}
