import { CheckCircle2 } from 'lucide-react';

import type { Event } from '../types/index.js';
import { getStatusAccentBorder } from '../utils/statusColors.js';
import { StatusBadge } from './StatusBadge';

interface IncidentTimelineProps {
  events: Event[];
}

export function IncidentTimeline({ events }: IncidentTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  );

  if (sortedEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-status-active">
          <CheckCircle2 size={32} />
        </div>
        <p className="font-semibold text-slate-800">Sin incidentes registrados</p>
        <p className="mt-2 max-w-sm text-sm text-muted">
          Este servicio no presenta eventos en el historial. El monitoreo continúa activo.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedEvents.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="timeline-marker h-3.5 w-3.5 rounded-full shadow-md ring-4 ring-white" />
            {index < sortedEvents.length - 1 && (
              <div className="mt-2 w-0.5 flex-1 bg-gradient-to-b from-brand to-brand/20" />
            )}
          </div>

          <div
            className={`w-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm border-l-4 ${getStatusAccentBorder(event.condition)}`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="font-semibold text-slate-950">{event.title}</h4>
                <p className="text-sm text-muted">
                  {new Date(event.occurredAt).toLocaleString('es-CO')}
                </p>
              </div>
              <StatusBadge condition={event.condition} size="sm" variant="outline" />
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
