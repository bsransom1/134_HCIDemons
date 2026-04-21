import { NavLink, useNavigate } from "react-router-dom";

const itemBase =
  "flex min-h-[3rem] flex-col items-center justify-end gap-1 text-[10px] font-medium leading-none transition";

const linkClass = ({ isActive }) =>
  `${itemBase} ${isActive ? "text-uci-blue" : "text-slate-500"}`;

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-mobile -translate-x-1/2 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto grid max-w-mobile grid-cols-5 items-end gap-0 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        <NavLink to="/feed" className={linkClass}>
          <Icon name="home" />
          <span>Feed</span>
        </NavLink>
        <NavLink to="/map" className={linkClass}>
          <Icon name="map" />
          <span>Map</span>
        </NavLink>

        <div className="relative flex min-h-[3rem] flex-col items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => navigate("/create")}
            aria-label="Create listing"
            className="absolute -top-7 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-uci-gold text-uci-blue shadow-lg ring-4 ring-white transition hover:brightness-95 active:scale-95"
          >
            <Plus />
          </button>
          <span className="text-[10px] font-semibold leading-none text-uci-blue">
            Sell
          </span>
        </div>

        <NavLink to="/trades" className={linkClass}>
          <Icon name="swap" />
          <span>Trades</span>
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          <Icon name="profile" />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}

function Plus() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function Icon({ name }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  if (name === "home")
    return (
      <svg {...common}>
        <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z" />
      </svg>
    );
  if (name === "map")
    return (
      <svg {...common}>
        <path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z" />
        <path d="M9 4v14M15 6v14" />
      </svg>
    );
  if (name === "swap")
    return (
      <svg {...common}>
        <path d="M7 7h13M7 7l3-3M7 7l3 3M17 17H4M17 17l-3-3M17 17l-3 3" />
      </svg>
    );
  if (name === "profile")
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    );
  return null;
}
