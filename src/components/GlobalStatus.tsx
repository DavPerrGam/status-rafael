import { Activity, AlertTriangle, AlertCircle } from 'lucide-react';

import { EventCondition } from '../types/index.js';
import { statusService } from '../services/status.service.js';
import { StatusBadge } from './StatusBadge';

const statusConfig = {
  [EventCondition.CONDITION_ACTIVE]: {
    icon: Activity,
    label: 'Operativo',
    description:
      'Los sistemas tecnológicos del Hospital San Rafael operan dentro de parámetros normales.',
    ringColor: '#057a57',
    bgGradient: 'from-emerald-50/90 to-white',
    borderAccent: 'status-accent-active',
  },
  [EventCondition.CONDITION_WARNING]: {
    icon: AlertTriangle,
    label: 'Advertencia',
    description:
      'Existen alertas en servicios que requieren seguimiento del equipo de tecnología hospitalaria.',
    ringColor: '#c97a12',
    bgGradient: 'from-amber-50/90 to-white',
    borderAccent: 'status-accent-warning',
  },
  [EventCondition.CONDITION_ERROR]: {
    icon: AlertCircle,
    label: 'Incidencia crítica',
    description:
      'Se reportan fallas en sistemas que pueden afectar la atención en el Hospital San Rafael.',
    ringColor: '#b83832',
    bgGradient: 'from-red-50/90 to-white',
    borderAccent: 'status-accent-error',
  },
};

function UptimeRing({ uptime, color }: { uptime: number; color: string }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (uptime / 100) * circumference;

  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
      <svg className="-rotate-90" width="112" height="112" viewBox="0 0 112 112">
        <circle cx="56" cy="56" r={radius} fill="none" stroke="#e8eef4" strokeWidth="9" />
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-bold text-brand-dark">{uptime}%</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
          Uptime
        </span>
      </div>
    </div>
  );
}

export function GlobalStatus() {
  const globalStatus = statusService.getGlobalStatus();
  const uptime = statusService.getUptime();
  const config = statusConfig[globalStatus];
  const Icon = config.icon;

  return (
    <div
      className={`surface-card-strong border-l-4 bg-gradient-to-br p-6 sm:p-8 ${config.borderAccent} ${config.bgGradient}`}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand">
            Semáforo institucional
          </p>
          <h2 className="mt-2 font-display text-xl font-bold text-brand-dark sm:text-2xl">
            Estado general del hospital
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{config.description}</p>
          <div className="mt-4">
            <StatusBadge condition={globalStatus} size="md" />
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <UptimeRing uptime={uptime} color={config.ringColor} />
          <div>
            <div
              className={`mb-2 flex h-11 w-11 items-center justify-center rounded-xl ${
                globalStatus === EventCondition.CONDITION_ACTIVE
                  ? 'bg-emerald-50 text-status-active'
                  : globalStatus === EventCondition.CONDITION_WARNING
                    ? 'bg-amber-50 text-status-warning'
                    : 'bg-red-50 text-status-error'
              }`}
            >
              <Icon size={22} />
            </div>
            <p className="font-display text-lg font-bold text-brand-dark">{config.label}</p>
            <p className="text-xs text-muted">Consolidado · Tunja</p>
          </div>
        </div>
      </div>
    </div>
  );
}
