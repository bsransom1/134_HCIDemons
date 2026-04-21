export default function StarRating({
  value = 0,
  onChange,
  size = 20,
  readOnly = false,
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="flex items-center gap-1">
      {stars.map((s) => {
        const active = s <= Math.round(value);
        if (readOnly) {
          return <Star key={s} size={size} active={active} />;
        }
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange?.(s)}
            aria-label={`${s} star${s === 1 ? "" : "s"}`}
            className="rounded-full p-1 transition hover:bg-slate-100"
          >
            <Star size={size} active={active} />
          </button>
        );
      })}
    </div>
  );
}

function Star({ size, active }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={active ? "#FFD200" : "none"}
      stroke={active ? "#C79900" : "#CBD5E1"}
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M12 2.5l2.9 6.2 6.6.7-4.9 4.6 1.4 6.5L12 17.7 5.9 20.5l1.4-6.5L2.5 9.4l6.6-.7L12 2.5z" />
    </svg>
  );
}
