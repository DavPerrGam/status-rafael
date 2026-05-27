import type { Product } from '../types/index.js';
import { EventCondition } from '../types/index.js';
import { statusService } from '../services/status.service.js';

export type StatusFilter = 'all' | 'active' | 'warning' | 'error';

export function filterProducts(
  products: Product[],
  options: { statusFilter?: StatusFilter; search?: string }
): Product[] {
  let result = [...products];

  if (options.search?.trim()) {
    const q = options.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q)
    );
  }

  if (options.statusFilter && options.statusFilter !== 'all') {
    const conditionMap: Record<Exclude<StatusFilter, 'all'>, EventCondition> = {
      active: EventCondition.CONDITION_ACTIVE,
      warning: EventCondition.CONDITION_WARNING,
      error: EventCondition.CONDITION_ERROR,
    };
    const condition = conditionMap[options.statusFilter];
    result = result.filter((p) => statusService.getCurrentProductStatus(p.id) === condition);
  }

  return result;
}
