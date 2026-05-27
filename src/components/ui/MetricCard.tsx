import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accentClass?: string;
  iconBgClass?: string;
  delayClass?: string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  accentClass = 'text-brand',
  iconBgClass = 'bg-brand-soft text-brand',
  delayClass = '',
}: MetricCardProps) {
  return (
    <div
      className={`surface-card p-6 opacity-0 animate-slide-up ${delayClass}`}
      style={{ animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
          <p className={`mt-3 text-3xl font-bold font-display ${accentClass}`}>{value}</p>
        </div>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBgClass}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
