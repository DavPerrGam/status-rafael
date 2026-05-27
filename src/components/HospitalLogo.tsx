interface HospitalLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

const sizes = {
  sm: { box: 'h-11 w-11', icon: 22, title: 'text-sm', sub: 'text-[10px]' },
  md: { box: 'h-14 w-14', icon: 28, title: 'text-base', sub: 'text-xs' },
  lg: { box: 'h-16 w-16', icon: 32, title: 'text-lg', sub: 'text-xs' },
};

export function HospitalLogo({ size = 'md', showText = true, variant = 'dark' }: HospitalLogoProps) {
  const s = sizes[size];
  const textTitle = variant === 'light' ? 'text-white' : 'text-brand-dark';
  const textSub = variant === 'light' ? 'text-white/75' : 'text-brand/70';

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${s.box} relative flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark shadow-lg shadow-brand/25`}
        aria-hidden
      >
        <svg viewBox="0 0 40 40" className="h-[55%] w-[55%]" fill="none">
          <path
            d="M20 6v28M10 16h20"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="20" cy="20" r="17" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 rounded-md bg-white px-1 py-0.5 text-[8px] font-black text-brand-dark">
          SR
        </span>
      </div>
      {showText && (
        <div className="min-w-0">
          <p className={`font-display font-bold leading-tight tracking-tight ${textTitle} ${s.title}`}>
            Hospital San Rafael
          </p>
          <p className={`font-semibold uppercase tracking-[0.22em] ${textSub} ${s.sub}`}>
            Tunja · Boyacá
          </p>
        </div>
      )}
    </div>
  );
}
