import { Link, useNavigate } from "react-router-dom";

export default function Header({
  title,
  subtitle,
  back = true,
  to = -1,
  right,
  transparent = false,
}) {
  const navigate = useNavigate();

  const base = transparent
    ? "absolute inset-x-0 top-0 z-30"
    : "sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur";

  return (
    <header className={`${base} px-4 pt-safe`}>
      <div className="flex h-14 items-center gap-3">
        {back ? (
          typeof to === "string" ? (
            <Link
              to={to}
              aria-label="Back"
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                transparent
                  ? "bg-white/85 text-slate-900 shadow"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              <ArrowLeft />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => navigate(to)}
              aria-label="Back"
              className={`flex h-9 w-9 items-center justify-center rounded-full ${
                transparent
                  ? "bg-white/85 text-slate-900 shadow"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              <ArrowLeft />
            </button>
          )
        ) : (
          <div className="w-9" />
        )}
        <div className="min-w-0 flex-1">
          {title && (
            <h1 className="truncate text-base font-semibold text-slate-900">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="truncate text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">{right}</div>
      </div>
    </header>
  );
}

function ArrowLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}
