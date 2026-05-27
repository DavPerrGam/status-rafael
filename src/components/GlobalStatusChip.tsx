import { useStorageRefreshContext } from '../context/StorageRefreshContext';
import { statusService } from '../services/status.service.js';
import { StatusBadge } from './StatusBadge';

export function GlobalStatusChip() {
  const { refreshKey } = useStorageRefreshContext();
  void refreshKey;
  const globalStatus = statusService.getGlobalStatus();
  const uptime = statusService.getUptime();

  return (
    <div
      className="hidden items-center gap-2 rounded-full border border-brand/15 bg-white px-3 py-1.5 shadow-sm lg:flex"
      title="Indicador de estado global del hospital"
    >
      <StatusBadge condition={globalStatus} size="sm" variant="outline" />
      <span className="text-xs font-bold text-brand-dark">{uptime}%</span>
    </div>
  );
}
