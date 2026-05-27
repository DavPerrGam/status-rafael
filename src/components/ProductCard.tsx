import { Link } from 'react-router-dom';
import { ChevronRight, Server } from 'lucide-react';

import type { Product } from '../types/index.js';
import { statusService } from '../services/status.service.js';
import { getStatusAccentBorder, getStatusIconBg } from '../utils/statusColors.js';
import { StatusBadge } from './StatusBadge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const status = statusService.getCurrentProductStatus(product.id);

  return (
    <Link to={`/products/${product.id}`} className="group block focus-ring rounded-3xl">
      <div
        className={`product-card border-l-4 ${getStatusAccentBorder(status)} overflow-hidden`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${getStatusIconBg(status)}`}
            >
              <Server size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand transition-colors">
                {product.name}
              </h3>
              <p className="mt-0.5 text-sm font-medium text-brand/70">{product.type}</p>
            </div>
          </div>
          <StatusBadge condition={status} size="sm" />
        </div>

        <p className="mb-6 text-sm leading-relaxed text-slate-600">{product.description}</p>

        <div className="flex items-center justify-between border-t border-brand/10 pt-4 text-xs font-semibold text-brand/80">
          <span>{product.owner}</span>
          <ChevronRight
            size={16}
            className="text-accent transition group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}
