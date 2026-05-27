import { MapPin, Building2, HeartPulse } from 'lucide-react';

export function InstitutionStrip() {
  return (
    <div className="institution-strip">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2.5 text-xs font-semibold sm:justify-between sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-1.5">
          <Building2 size={14} className="text-brand-light" />
          Empresa Social del Estado
        </span>
        <span className="hidden h-3 w-px bg-brand/20 sm:block" />
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={14} className="text-brand-light" />
          Tunja, Boyacá — Colombia
        </span>
        <span className="hidden h-3 w-px bg-brand/20 sm:block" />
        <span className="inline-flex items-center gap-1.5">
          <HeartPulse size={14} className="text-status-active" />
          Monitoreo de sistemas críticos 24/7
        </span>
      </div>
    </div>
  );
}
