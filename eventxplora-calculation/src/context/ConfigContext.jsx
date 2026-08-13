import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultAdminConfig, defaultEventConfig } from "../lib/engine.js";

const ConfigContext = createContext(null);

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
    } catch {
      return fallback;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore storage errors (e.g. private browsing) */
    }
  }, [key, value]);
  return [value, setValue];
}

export function ConfigProvider({ children }) {
  const [adminConfig, setAdminConfig] = useStoredState(
    "eventxplora.adminConfig",
    defaultAdminConfig
  );
  const [eventConfig, setEventConfig] = useStoredState(
    "eventxplora.eventConfig",
    defaultEventConfig
  );
  const [buyerQty, setBuyerQty] = useState(1);

  return (
    <ConfigContext.Provider
      value={{
        adminConfig,
        setAdminConfig,
        eventConfig,
        setEventConfig,
        buyerQty,
        setBuyerQty,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used inside ConfigProvider");
  return ctx;
}
