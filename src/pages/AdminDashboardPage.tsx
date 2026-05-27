import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Server,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Shield,
  MapPin,
  LayoutDashboard,
  Package,
  FileText,
  Zap,
  Wrench,
} from 'lucide-react';

import { PageLayout } from '../components/PageLayout';
import { MetricCard } from '../components/ui/MetricCard';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/StatusBadge';
import { ProductsAdminPanel } from '../components/admin/ProductsAdminPanel';
import { ReportsAdminPanel } from '../components/admin/ReportsAdminPanel';
import { EventsAdminPanel } from '../components/admin/EventsAdminPanel';
import { AdminToolsPanel } from '../components/admin/AdminToolsPanel';
import { LiveRefreshBadge } from '../components/LiveRefreshBadge';
import { storageService } from '../services/storage.service.js';
import { statusService } from '../services/status.service.js';
import { EventCondition } from '../types/index.js';
import { useStorageRefreshContext } from '../context/StorageRefreshContext';
import { authService } from '../services/auth.service.js';

type AdminTab = 'dashboard' | 'products' | 'reports' | 'events' | 'tools';

const tabs: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'reports', label: 'Reportes', icon: FileText },
  { id: 'events', label: 'Eventos', icon: Zap },
  { id: 'tools', label: 'Herramientas', icon: Wrench },
];

const validTabs = new Set<AdminTab>(['dashboard', 'products', 'reports', 'events', 'tools']);

export function AdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') ?? 'dashboard';
  const activeTab: AdminTab = validTabs.has(tabParam as AdminTab)
    ? (tabParam as AdminTab)
    : 'dashboard';
  const productId = searchParams.get('productId') ?? undefined;

  const { refreshKey, lastUpdated } = useStorageRefreshContext();
  const user = authService.getUser();
  const sessionExpires = authService.getSessionExpiresAt();

  const products = useMemo(() => storageService.getProducts(), [refreshKey]);
  const reports = useMemo(() => storageService.getReports(), [refreshKey]);
  const events = useMemo(() => storageService.getEvents(), [refreshKey]);

  const activeCount = products.filter(
    (p) => statusService.getCurrentProductStatus(p.id) === EventCondition.CONDITION_ACTIVE
  ).length;
  const warningCount = products.filter(
    (p) => statusService.getCurrentProductStatus(p.id) === EventCondition.CONDITION_WARNING
  ).length;
  const errorCount = products.filter(
    (p) => statusService.getCurrentProductStatus(p.id) === EventCondition.CONDITION_ERROR
  ).length;
  const uptime = useMemo(() => statusService.getUptime(), [refreshKey]);
  const total = products.length || 1;
  const globalStatus = useMemo(() => statusService.getGlobalStatus(), [refreshKey]);

  const setTab = (tab: AdminTab) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    if (tab !== 'reports' && tab !== 'events') {
      next.delete('productId');
    }
    setSearchParams(next);
  };

  return (
    <PageLayout isAdmin showFooter={false}>
      <div className="hero-hospital mb-8 overflow-hidden p-8">
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">
              <Shield size={14} />
              Sesión administrativa
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold text-brand-dark sm:text-4xl">
              Panel de gestión — San Rafael
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
              <MapPin size={14} className="text-boyaca" />
              Hospital Universitario San Rafael de Tunja
            </p>
            {user?.email && (
              <p className="mt-1 text-xs text-muted">
                {user.email}
                {sessionExpires &&
                  ` · Sesión hasta ${sessionExpires.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-3">
            <LiveRefreshBadge lastUpdated={lastUpdated} />
            <div className="rounded-2xl border border-brand/15 bg-white px-6 py-4 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Estado global</p>
              <div className="mt-2">
                <StatusBadge condition={globalStatus} size="md" />
              </div>
              <p className="mt-2 font-display text-3xl font-bold text-brand">{uptime}%</p>
            </div>
          </div>
        </div>
      </div>

      <nav
        className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-brand/10 bg-white p-2 shadow-sm"
        aria-label="Secciones administrativas"
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-ring ${
              activeTab === id
                ? 'bg-brand text-white shadow-md'
                : 'text-brand-dark hover:bg-brand-soft'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      {activeTab === 'dashboard' && (
        <>
          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Productos" value={products.length} icon={Server} />
            <MetricCard
              label="Operativos"
              value={activeCount}
              icon={CheckCircle2}
              accentClass="text-status-active"
              iconBgClass="bg-emerald-50 text-status-active"
            />
            <MetricCard
              label="Advertencias"
              value={warningCount}
              icon={AlertTriangle}
              accentClass="text-status-warning"
              iconBgClass="bg-amber-50 text-status-warning"
            />
            <MetricCard
              label="Errores"
              value={errorCount}
              icon={XCircle}
              accentClass="text-status-error"
              iconBgClass="bg-red-50 text-status-error"
            />
          </div>

          <Card className="mb-8 p-8">
            <h2 className="font-display text-xl font-bold text-brand-dark">Disponibilidad del sistema</h2>
            <div className="mt-6 flex h-5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="bg-status-active transition-all"
                style={{ width: `${(activeCount / total) * 100}%` }}
              />
              <div
                className="bg-status-warning transition-all"
                style={{ width: `${(warningCount / total) * 100}%` }}
              />
              <div
                className="bg-status-error transition-all"
                style={{ width: `${(errorCount / total) * 100}%` }}
              />
            </div>
            <p className="mt-4 text-sm text-muted">
              {reports.length} reportes · {events.length} eventos · Actualización cada 30 s
            </p>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="border-b border-brand/10 bg-brand-soft/40 px-6 py-4">
              <h2 className="font-display text-lg font-bold text-brand-dark">Todos los servicios</h2>
            </div>
            <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
              {products.map((product) => {
                const status = statusService.getCurrentProductStatus(product.id);
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4 px-6 py-3 hover:bg-brand-soft/20"
                  >
                    <div>
                      <Link
                        to={`/products/${product.id}`}
                        className="font-medium text-brand hover:underline"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-muted">{product.type}</p>
                    </div>
                    <StatusBadge condition={status} size="sm" variant="outline" />
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}

      {activeTab === 'products' && <ProductsAdminPanel products={products} />}
      {activeTab === 'reports' && (
        <ReportsAdminPanel
          products={products}
          reports={reports}
          defaultProductId={productId}
          autoOpenCreate={Boolean(productId)}
        />
      )}
      {activeTab === 'events' && (
        <EventsAdminPanel
          products={products}
          reports={reports}
          events={events}
          defaultProductId={productId}
          autoOpenCreate={Boolean(productId)}
        />
      )}
      {activeTab === 'tools' && <AdminToolsPanel />}
    </PageLayout>
  );
}
