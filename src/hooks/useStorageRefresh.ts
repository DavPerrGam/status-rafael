import { useEffect, useState, useCallback } from 'react';

import { STORAGE_UPDATED_EVENT } from '../services/storage.service.js';

const REFRESH_INTERVAL_MS = 30_000;

export function useStorageRefresh(intervalMs = REFRESH_INTERVAL_MS) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  const bump = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    const onStorage = () => bump();
    window.addEventListener(STORAGE_UPDATED_EVENT, onStorage);
    const interval = setInterval(bump, intervalMs);
    return () => {
      window.removeEventListener(STORAGE_UPDATED_EVENT, onStorage);
      clearInterval(interval);
    };
  }, [intervalMs, bump]);

  return { refreshKey, lastUpdated, bump };
}

export { REFRESH_INTERVAL_MS };
