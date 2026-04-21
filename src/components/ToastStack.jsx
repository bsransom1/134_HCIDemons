import { useApp } from "../context/AppContext.jsx";

export default function ToastStack() {
  const { toasts } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-[100] flex w-full max-w-mobile -translate-x-1/2 flex-col gap-2 px-4 pt-safe">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-lg"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
