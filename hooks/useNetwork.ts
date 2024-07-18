import { useEffect, useMemo, useState } from "react";

export const useNetwork = () => {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    setOnline(window.navigator.onLine);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);
  return useMemo(
    () => ({
      online,
    }),
    [online]
  );
};
