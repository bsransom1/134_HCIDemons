import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import Header from "../components/Header.jsx";

const typeStyles = {
  favorite: "bg-rose-100 text-rose-600",
  offer: "bg-uci-blue/10 text-uci-blue",
  complete: "bg-emerald-100 text-emerald-700",
};

const typeIcon = {
  favorite: "♥",
  offer: "$",
  complete: "✓",
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function Notifications() {
  const navigate = useNavigate();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();

  const open = (n) => {
    markNotificationRead(n.id);
    navigate(n.link);
  };

  return (
    <div className="page-enter pb-nav">
      <Header
        back
        to="/feed"
        title="Notifications"
        right={
          notifications.some((n) => !n.read) ? (
            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="text-xs font-semibold text-uci-blue"
            >
              Mark all read
            </button>
          ) : null
        }
      />

      <div className="px-4 pt-4">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
            <p className="font-display text-lg text-slate-900">All caught up</p>
            <p className="mt-1 text-sm text-slate-600">
              We&apos;ll ping you when there&apos;s news.
            </p>
            <Link to="/feed" className="btn-primary mt-4 inline-flex">
              Back to feed
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => open(n)}
                className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition ${
                  n.read
                    ? "border-slate-200 bg-white"
                    : "border-uci-blue/30 bg-uci-blue/5"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold ${typeStyles[n.type] ?? "bg-slate-100 text-slate-600"}`}
                >
                  {typeIcon[n.type] ?? "•"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">{n.message}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-slate-400">
                    {timeAgo(n.at)}
                  </span>
                  {!n.read && (
                    <span className="h-2 w-2 rounded-full bg-uci-blue" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
