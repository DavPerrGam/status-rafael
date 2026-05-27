import { createContext, useContext, type ReactNode } from 'react';

import { useStorageRefresh } from '../hooks/useStorageRefresh';

type StorageRefreshValue = ReturnType<typeof useStorageRefresh>;

const StorageRefreshContext = createContext<StorageRefreshValue | null>(null);

export function StorageRefreshProvider({ children }: { children: ReactNode }) {
  const value = useStorageRefresh();
  return (
    <StorageRefreshContext.Provider value={value}>{children}</StorageRefreshContext.Provider>
  );
}

export function useStorageRefreshContext() {
  const ctx = useContext(StorageRefreshContext);
  if (!ctx) {
    throw new Error('useStorageRefreshContext requiere StorageRefreshProvider');
  }
  return ctx;
}
