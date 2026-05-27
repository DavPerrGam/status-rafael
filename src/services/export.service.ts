import { storageService } from './storage.service.js';
import { statusService } from './status.service.js';
import { EventCondition } from '../types/index.js';

export interface StatusSnapshot {
  hospital: string;
  location: string;
  generatedAt: string;
  globalStatus: EventCondition;
  uptimePercent: number;
  totals: {
    products: number;
    reports: number;
    events: number;
    active: number;
    warning: number;
    error: number;
  };
  products: Array<{
    id: string;
    name: string;
    type: string;
    status: EventCondition;
  }>;
}

export function buildStatusSnapshot(): StatusSnapshot {
  const products = storageService.getProducts();
  const statuses = products.map((p) => statusService.getCurrentProductStatus(p.id));

  return {
    hospital: 'Hospital Universitario San Rafael de Tunja',
    location: 'Tunja, Boyacá, Colombia',
    generatedAt: new Date().toISOString(),
    globalStatus: statusService.getGlobalStatus(),
    uptimePercent: statusService.getUptime(),
    totals: {
      products: products.length,
      reports: storageService.getReports().length,
      events: storageService.getEvents().length,
      active: statuses.filter((s) => s === EventCondition.CONDITION_ACTIVE).length,
      warning: statuses.filter((s) => s === EventCondition.CONDITION_WARNING).length,
      error: statuses.filter((s) => s === EventCondition.CONDITION_ERROR).length,
    },
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      status: statusService.getCurrentProductStatus(p.id),
    })),
  };
}

export function downloadStatusJson(filename = 'estado-hospital-san-rafael.json') {
  const snapshot = buildStatusSnapshot();
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportFullBackup() {
  const backup = {
    exportedAt: new Date().toISOString(),
    products: storageService.getProducts(),
    reports: storageService.getReports(),
    events: storageService.getEvents(),
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `backup-monitoreo-${Date.now()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}
