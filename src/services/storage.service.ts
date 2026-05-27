import type { Product, Report, Event } from '../types/index.js';

const STORAGE_KEYS = {
  PRODUCTS: 'sr_products',
  REPORTS: 'sr_reports',
  EVENTS: 'sr_events',
};

export const STORAGE_UPDATED_EVENT = 'sr_storage_updated';

export function notifyStorageUpdate(): void {
  window.dispatchEvent(new CustomEvent(STORAGE_UPDATED_EVENT));
}

export const storageService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },

  saveProduct: (product: Product) => {
    const products = storageService.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    const updated = { ...product, updatedAt: new Date().toISOString() };
    if (index > -1) {
      products[index] = updated;
    } else {
      products.push({
        ...updated,
        createdAt: product.createdAt || new Date().toISOString(),
      });
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    notifyStorageUpdate();
  },

  deleteProduct: (productId: string) => {
    const products = storageService.getProducts().filter((p) => p.id !== productId);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    const reports = storageService
      .getReports()
      .filter((r) => r.productId !== productId);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

    const events = storageService.getEvents().filter((e) => e.productId !== productId);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    notifyStorageUpdate();
  },

  getReports: (): Report[] => {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return data ? JSON.parse(data) : [];
  },

  getReportsByProduct: (productId: string): Report[] => {
    return storageService
      .getReports()
      .filter((r) => r.productId === productId)
      .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());
  },

  saveReport: (report: Report) => {
    const reports = storageService.getReports();
    const index = reports.findIndex((r) => r.id === report.id);
    if (index > -1) {
      reports[index] = report;
    } else {
      reports.push(report);
    }
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    notifyStorageUpdate();
  },

  deleteReport: (reportId: string) => {
    const reports = storageService.getReports().filter((r) => r.id !== reportId);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));

    const events = storageService.getEvents().filter((e) => e.reportId !== reportId);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    notifyStorageUpdate();
  },

  getEvents: (): Event[] => {
    const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return data ? JSON.parse(data) : [];
  },

  getEventsByProduct: (productId: string): Event[] => {
    return storageService.getEvents().filter((e) => e.productId === productId);
  },

  getEventsByReport: (reportId: string): Event[] => {
    return storageService
      .getEvents()
      .filter((e) => e.reportId === reportId)
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  },

  saveEvent: (event: Event) => {
    const events = storageService.getEvents();
    const index = events.findIndex((e) => e.id === event.id);
    if (index > -1) {
      events[index] = event;
    } else {
      events.push(event);
    }
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    notifyStorageUpdate();
  },

  deleteEvent: (eventId: string) => {
    const events = storageService.getEvents().filter((e) => e.id !== eventId);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    notifyStorageUpdate();
  },
};
