import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { tradeZones } from "../data/tradeZones";
import Header from "../components/Header.jsx";

const categories = [
  { id: "textbooks", label: "Textbooks" },
  { id: "tech", label: "Tech" },
  { id: "dorm", label: "Dorm" },
  { id: "clothing", label: "Clothing" },
  { id: "sports", label: "Sports" },
  { id: "art", label: "Art" },
];

const conditions = [
  { id: "new", label: "New" },
  { id: "like-new", label: "Like new" },
  { id: "good", label: "Good" },
  { id: "fair", label: "Fair" },
];

const tradeModes = [
  { id: "sell", label: "Sell" },
  { id: "both", label: "Sell or trade" },
  { id: "trade", label: "Trade only" },
];

const fallbackImage = (cat) =>
  `https://picsum.photos/seed/zotswap-${cat}-${Date.now()}/800/600`;

export default function CreateListing() {
  const { currentUser, addListing, toast } = useApp();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("tech");
  const [condition, setCondition] = useState("good");
  const [tradeMode, setTradeMode] = useState("sell");
  const [price, setPrice] = useState("");
  const [zoneId, setZoneId] = useState(currentUser?.homeZoneId ?? tradeZones[0].id);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const zone = tradeZones.find((z) => z.id === zoneId) ?? tradeZones[0];
    const id = `l-${Date.now()}`;
    addListing({
      id,
      title: title.trim(),
      description: description.trim(),
      price: tradeMode === "trade" ? 0 : Number(price) || 0,
      tradeMode,
      category,
      condition,
      images: [fallbackImage(category)],
      sellerId: currentUser.id,
      createdAt: new Date().toISOString(),
      tags: [category],
      location: { zoneId: zone.id, lat: zone.lat, lng: zone.lng },
    });
    toast("Listing posted — it's live.");
    navigate("/feed");
  };

  return (
    <div className="page-enter pb-nav">
      <Header back title="New listing" to="/feed" />

      <form onSubmit={handleSubmit} className="space-y-5 px-4 pt-4">
        <Field label="Title">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Monitor stand, barely used"
            className="input"
          />
        </Field>
        <Field label="Description">
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Condition, why you're selling, pickup notes…"
            className="input resize-none"
          />
        </Field>

        <Field label="Category">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`chip ${category === c.id ? "chip-active" : "chip-inactive"}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Condition">
          <div className="grid grid-cols-4 gap-2">
            {conditions.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCondition(c.id)}
                className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                  condition === c.id
                    ? "border-uci-blue bg-uci-blue/5 text-uci-blue"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="How are you selling?">
          <div className="grid grid-cols-3 gap-2">
            {tradeModes.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setTradeMode(m.id)}
                className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                  tradeMode === m.id
                    ? "border-uci-blue bg-uci-blue/5 text-uci-blue"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </Field>

        {tradeMode !== "trade" && (
          <Field label="Price">
            <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-uci-blue focus-within:ring-2 focus-within:ring-uci-blue/20">
              <span className="mr-1 text-xl font-bold text-uci-blue">$</span>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full border-0 bg-transparent text-2xl font-bold text-slate-900 outline-none"
              />
            </div>
          </Field>
        )}

        <Field label="Preferred meetup spot">
          <select
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            className="input"
          >
            {tradeZones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </Field>

        <button type="submit" className="btn-primary w-full">
          Publish listing
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}
