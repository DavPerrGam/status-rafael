import { RefreshCw } from 'lucide-react';

import { REFRESH_INTERVAL_MS } from '../hooks/useStorageRefresh.js';

interface LiveRefreshBadgeProps {
  lastUpdated: Date;
}

export function LiveRefreshBadge({ lastUpdated }: LiveRefreshBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border border-status-active/25 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-status-active"
      title={`Actualización automática cada ${REFRESH_INTERVAL_MS / 1000} segundos`}
    >
      <RefreshCw size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
      <span>
        En vivo · {lastUpdated.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
}
