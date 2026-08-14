import React from "react";
import { Routes, Route } from "react-router-dom";
import { ConfigProvider } from "./context/ConfigContext.jsx";
import Header from "./components/Header.jsx";
import RoleSelect from "./pages/RoleSelect.jsx";
import BuyerView from "./pages/BuyerView.jsx";
import OrganizerView from "./pages/OrganizerView.jsx";
import PlatformOwnerView from "./pages/PlatformOwnerView.jsx";

export default function App() {
  return (
    <ConfigProvider>
      <div className="min-h-screen bg-paper font-sans">
        <Header />
        <main className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:py-10">
          <Routes>
            <Route path="/" element={<RoleSelect />} />
            <Route path="/buyer" element={<BuyerView />} />
            <Route path="/organizer" element={<OrganizerView />} />
            <Route path="/platform" element={<PlatformOwnerView />} />
          </Routes>
        </main>
      </div>
    </ConfigProvider>
  );
}
