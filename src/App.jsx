import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ToastStack from "./components/ToastStack.jsx";
import Feed from "./pages/Feed.jsx";
import ItemDetail from "./pages/ItemDetail.jsx";
import MapView from "./pages/MapView.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import TradeDetail from "./pages/TradeDetail.jsx";
import RateTrade from "./pages/RateTrade.jsx";
import Profile from "./pages/Profile.jsx";
import Trades from "./pages/Trades.jsx";
import Notifications from "./pages/Notifications.jsx";
import MessageThread from "./pages/MessageThread.jsx";

function AppShell() {
  return (
    <div className="min-h-[100dvh] bg-slate-100">
      <ToastStack />
      <div className="mx-auto min-h-[100dvh] w-full max-w-mobile bg-white shadow-xl">
        <Outlet />
      </div>
      <Navbar />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/feed" replace />} />
        <Route path="feed" element={<Feed />} />
        <Route path="item/:id" element={<ItemDetail />} />
        <Route path="item/:id/message" element={<MessageThread />} />
        <Route path="map" element={<MapView />} />
        <Route path="create" element={<CreateListing />} />
        <Route path="trades" element={<Trades />} />
        <Route path="trade/:tradeId" element={<TradeDetail />} />
        <Route path="trade/:tradeId/rate" element={<RateTrade />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:userId" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Route>
    </Routes>
  );
}
