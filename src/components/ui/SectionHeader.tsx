import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
}

export function SectionHeader({ title, subtitle, badge }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-3 border-b border-brand/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-bold text-brand-dark sm:text-3xl">{title}</h2>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-muted">{subtitle}</p>
        )}
      </div>
      {badge}
    </div>
  );
}
