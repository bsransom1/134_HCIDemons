import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function NotificationBell() {
  const { notifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Link
      to="/notifications"
      aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </svg>
      {unread > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
          {unread}
        </span>
      )}
    </Link>
  );
}
