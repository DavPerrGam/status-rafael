import { EventCondition } from '../types/index.js';
import { storageService } from './storage.service.js';

export const statusService = {
  getCurrentProductStatus: (productId: string): EventCondition => {
    const events = storageService.getEventsByProduct(productId);
    if (events.length === 0) {
      return EventCondition.CONDITION_ACTIVE;
    }
    
    const sortedEvents = events.sort((a, b) => 
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );
    
    return sortedEvents[0].condition;
  },

  getGlobalStatus: (): EventCondition => {
    const products = storageService.getProducts();
    const conditions = products.map(p => 
      statusService.getCurrentProductStatus(p.id)
    );

    if (conditions.includes(EventCondition.CONDITION_ERROR)) {
      return EventCondition.CONDITION_ERROR;
    }
    if (conditions.includes(EventCondition.CONDITION_WARNING)) {
      return EventCondition.CONDITION_WARNING;
    }
    return EventCondition.CONDITION_ACTIVE;
  },

  getUptime: (): number => {
    const products = storageService.getProducts();
    if (products.length === 0) return 100;

    const activeCount = products.filter(p => 
      statusService.getCurrentProductStatus(p.id) === EventCondition.CONDITION_ACTIVE
    ).length;

    return Math.round((activeCount / products.length) * 100);
  },
};