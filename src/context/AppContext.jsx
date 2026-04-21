import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { initialListings, pastListings } from "../data/listings";
import { JORDAN_ID, users } from "../data/users";
import { initialNotifications, initialTrades } from "../data/trades";

const AppContext = createContext(null);

const jordan = users.find((u) => u.id === JORDAN_ID);

const initialState = {
  currentUser: jordan,
  listings: [...initialListings],
  archivedListings: [...pastListings],
  trades: [...initialTrades],
  notifications: [...initialNotifications],
  toasts: [],
  favorites: new Set(),
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_LISTING":
      return { ...state, listings: [action.payload, ...state.listings] };
    case "UPDATE_LISTING":
      return {
        ...state,
        listings: state.listings.map((l) =>
          l.id === action.payload.id ? { ...l, ...action.payload.patch } : l,
        ),
      };
    case "MARK_SOLD": {
      const sold = state.listings.find((l) => l.id === action.payload);
      if (!sold) return state;
      return {
        ...state,
        listings: state.listings.filter((l) => l.id !== action.payload),
        archivedListings: [sold, ...state.archivedListings],
      };
    }
    case "ADD_TRADE":
      return { ...state, trades: [action.payload, ...state.trades] };
    case "UPDATE_TRADE":
      return {
        ...state,
        trades: state.trades.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.patch } : t,
        ),
      };
    case "ADD_TRADE_MESSAGE":
      return {
        ...state,
        trades: state.trades.map((t) =>
          t.id === action.payload.id
            ? { ...t, messages: [...(t.messages ?? []), action.payload.message] }
            : t,
        ),
      };
    case "TOGGLE_FAVORITE": {
      const next = new Set(state.favorites);
      if (next.has(action.payload)) next.delete(action.payload);
      else next.add(action.payload);
      return { ...state, favorites: next };
    }
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n,
        ),
      };
    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    case "PUSH_TOAST":
      return { ...state, toasts: [...state.toasts, action.payload] };
    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addListing = useCallback(
    (listing) => dispatch({ type: "ADD_LISTING", payload: listing }),
    [],
  );
  const updateListing = useCallback(
    (id, patch) =>
      dispatch({ type: "UPDATE_LISTING", payload: { id, patch } }),
    [],
  );
  const markSold = useCallback(
    (id) => dispatch({ type: "MARK_SOLD", payload: id }),
    [],
  );
  const addTrade = useCallback(
    (trade) => dispatch({ type: "ADD_TRADE", payload: trade }),
    [],
  );
  const updateTrade = useCallback(
    (id, patch) => dispatch({ type: "UPDATE_TRADE", payload: { id, patch } }),
    [],
  );
  const sendTradeMessage = useCallback(
    (id, message) =>
      dispatch({ type: "ADD_TRADE_MESSAGE", payload: { id, message } }),
    [],
  );
  const toggleFavorite = useCallback(
    (listingId) => dispatch({ type: "TOGGLE_FAVORITE", payload: listingId }),
    [],
  );
  const markNotificationRead = useCallback(
    (id) => dispatch({ type: "MARK_NOTIFICATION_READ", payload: id }),
    [],
  );
  const markAllNotificationsRead = useCallback(
    () => dispatch({ type: "MARK_ALL_NOTIFICATIONS_READ" }),
    [],
  );

  const toast = useCallback((message) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    dispatch({ type: "PUSH_TOAST", payload: { id, message } });
    setTimeout(() => dispatch({ type: "DISMISS_TOAST", payload: id }), 3000);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      allUsers: users,
      addListing,
      updateListing,
      markSold,
      addTrade,
      updateTrade,
      sendTradeMessage,
      toggleFavorite,
      markNotificationRead,
      markAllNotificationsRead,
      toast,
    }),
    [
      state,
      addListing,
      updateListing,
      markSold,
      addTrade,
      updateTrade,
      sendTradeMessage,
      toggleFavorite,
      markNotificationRead,
      markAllNotificationsRead,
      toast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
