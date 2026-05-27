import { EventCondition, type EventCondition as EventConditionType } from '../types/index.js';

import { getStatusColor, getStatusOutlineColor, getStatusText } from '../utils/statusColors.js';

interface StatusBadgeProps {
  condition: EventConditionType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline';
}

export function StatusBadge({ condition, size = 'md', variant = 'solid' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs font-semibold',
    md: 'px-3 py-1.5 text-sm font-semibold',
    lg: 'px-4 py-2 text-base font-bold',
  };

  const showPulse =
    variant === 'solid' &&
    (condition === EventCondition.CONDITION_WARNING ||
      condition === EventCondition.CONDITION_ERROR);

  const colorClass =
    variant === 'outline' ? getStatusOutlineColor(condition) : `${getStatusColor(condition)} text-white`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${colorClass} ${sizeClasses[size]}`}
    >
      {showPulse && (
        <span className="h-2 w-2 shrink-0 rounded-full bg-white animate-pulse-soft" />
      )}
      {getStatusText(condition)}
    </span>
  );
}
