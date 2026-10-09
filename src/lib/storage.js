import { useEffect, useState } from "react";

/** localStorage-backed useState. Falls back to memory when storage is unavailable. */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {
      /* storage unavailable or corrupt – use initial */
    }
    return initial;
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);
  // Another tab changed this key (e.g. placed an order) – follow it instead of showing stale data.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key || e.newValue == null) return;
      try { setValue(JSON.parse(e.newValue)); } catch { /* ignore */ }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);
  return [value, setValue];
}

export const money = (n) => `$${n.toFixed(2)}`;
