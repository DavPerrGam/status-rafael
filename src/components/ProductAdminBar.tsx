import { Link } from 'react-router-dom';
import { Settings, FilePlus, Zap } from 'lucide-react';

import { authService } from '../services/auth.service.js';

interface ProductAdminBarProps {
  productId: string;
}

export function ProductAdminBar({ productId }: ProductAdminBarProps) {
  if (!authService.isAuthenticated()) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-brand/15 bg-brand-soft/50 px-4 py-3">
      <Settings size={18} className="text-brand" />
      <span className="text-sm font-semibold text-brand-dark">Gestión administrativa</span>
      <Link
        to={`/admin?tab=reports&productId=${productId}`}
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-sm hover:shadow focus-ring"
      >
        <FilePlus size={14} />
        Crear reporte
      </Link>
      <Link
        to={`/admin?tab=events&productId=${productId}`}
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand shadow-sm hover:shadow focus-ring"
      >
        <Zap size={14} />
        Registrar evento
      </Link>
      <Link
        to={`/admin?tab=products`}
        className="text-xs font-medium text-brand hover:underline"
      >
        Ir al panel completo
      </Link>
    </div>
  );
}
