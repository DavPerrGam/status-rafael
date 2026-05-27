import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronLeft } from 'lucide-react';

import { PageLayout } from '../components/PageLayout';
import { LiveRefreshBadge } from '../components/LiveRefreshBadge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { buildStatusSnapshot, downloadStatusJson } from '../services/export.service.js';
import { useStorageRefreshContext } from '../context/StorageRefreshContext';

export function PublicStatusPage() {
  const { refreshKey, lastUpdated } = useStorageRefreshContext();
  const snapshot = useMemo(() => buildStatusSnapshot(), [refreshKey]);

  return (
    <PageLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="inline-flex items-center gap-2 font-medium text-brand hover:underline">
          <ChevronLeft size={18} />
          Volver al portal
        </Link>
        <LiveRefreshBadge lastUpdated={lastUpdated} />
      </div>

      <Card className="p-8">
        <h1 className="font-display text-2xl font-bold text-brand-dark">
          API pública de estado (JSON)
        </h1>
        <p className="mt-2 text-sm text-muted">
          Vista de solo lectura para integraciones y monitoreo externo. Se actualiza cada 30 segundos.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={() => downloadStatusJson()} className="inline-flex items-center gap-2">
            <Download size={18} />
            Descargar JSON
          </Button>
        </div>

        <pre className="mt-6 max-h-[60vh] overflow-auto rounded-2xl border border-brand/10 bg-slate-950 p-4 text-xs leading-relaxed text-emerald-100">
          {JSON.stringify(snapshot, null, 2)}
        </pre>
      </Card>
    </PageLayout>
  );
}
