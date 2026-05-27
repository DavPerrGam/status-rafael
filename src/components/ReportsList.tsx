import { FileText } from 'lucide-react';

import type { Report } from '../types/index.js';
import { storageService } from '../services/storage.service.js';
import { IncidentTimeline } from './IncidentTimeline';

interface ReportsListProps {
  reports: Report[];
}

export function ReportsList({ reports }: ReportsListProps) {
  if (reports.length === 0) {
    return (
      <p className="text-sm text-muted">No hay reportes registrados para este servicio.</p>
    );
  }

  return (
    <div className="space-y-8">
      {reports.map((report) => {
        const events = storageService.getEventsByReport(report.id);
        return (
          <div
            key={report.id}
            className="rounded-2xl border border-brand/10 bg-brand-soft/20 p-6"
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-brand-dark">{report.title}</h3>
                <p className="text-xs text-muted">
                  {new Date(report.reportDate).toLocaleString('es-CO')}
                </p>
                <p className="mt-2 text-sm text-slate-600">{report.description}</p>
              </div>
            </div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-brand">
              Incidentes del reporte
            </h4>
            <IncidentTimeline events={events} />
          </div>
        );
      })}
    </div>
  );
}
