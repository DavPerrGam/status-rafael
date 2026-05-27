import type { HTMLAttributes, ReactNode } from 'react';

type CardVariant = 'default' | 'strong' | 'metric';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
  accent?: 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'none';
}

const variantClasses: Record<CardVariant, string> = {
  default: 'surface-card',
  strong: 'surface-card-strong',
  metric: 'surface-card p-6',
};

const accentClasses = {
  brand: 'border-l-4 border-l-brand',
  accent: 'border-l-4 border-l-accent',
  success: 'border-l-4 border-l-status-active',
  warning: 'border-l-4 border-l-status-warning',
  danger: 'border-l-4 border-l-status-error',
  none: '',
};

export function Card({
  variant = 'default',
  accent = 'none',
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div className={`${variantClasses[variant]} ${accentClasses[accent]} ${className}`} {...props}>
      {children}
    </div>
  );
}
