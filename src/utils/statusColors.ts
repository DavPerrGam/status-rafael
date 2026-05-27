import { EventCondition } from '../types/index.js';

export const getStatusColor = (condition: EventCondition): string => {
  switch (condition) {
    case EventCondition.CONDITION_ACTIVE:
      return 'bg-status-active';
    case EventCondition.CONDITION_WARNING:
      return 'bg-status-warning';
    case EventCondition.CONDITION_ERROR:
      return 'bg-status-error';
    default:
      return 'bg-gray-500';
  }
};

export const getStatusOutlineColor = (condition: EventCondition): string => {
  switch (condition) {
    case EventCondition.CONDITION_ACTIVE:
      return 'border-status-active/40 bg-emerald-50 text-emerald-800';
    case EventCondition.CONDITION_WARNING:
      return 'border-status-warning/40 bg-amber-50 text-amber-800';
    case EventCondition.CONDITION_ERROR:
      return 'border-status-error/40 bg-red-50 text-red-800';
    default:
      return 'border-gray-300 bg-gray-50 text-gray-700';
  }
};

export const getStatusAccentBorder = (condition: EventCondition): string => {
  switch (condition) {
    case EventCondition.CONDITION_ACTIVE:
      return 'status-accent-active';
    case EventCondition.CONDITION_WARNING:
      return 'status-accent-warning';
    case EventCondition.CONDITION_ERROR:
      return 'status-accent-error';
    default:
      return 'border-l-gray-300';
  }
};

export const getStatusIconBg = (condition: EventCondition): string => {
  switch (condition) {
    case EventCondition.CONDITION_ACTIVE:
      return 'bg-emerald-50 text-status-active';
    case EventCondition.CONDITION_WARNING:
      return 'bg-amber-50 text-status-warning';
    case EventCondition.CONDITION_ERROR:
      return 'bg-red-50 text-status-error';
    default:
      return 'bg-slate-100 text-slate-600';
  }
};

export const getStatusText = (condition: EventCondition): string => {
  switch (condition) {
    case EventCondition.CONDITION_ACTIVE:
      return 'Operativo';
    case EventCondition.CONDITION_WARNING:
      return 'Advertencia';
    case EventCondition.CONDITION_ERROR:
      return 'Error';
    default:
      return 'Desconocido';
  }
};
