import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Layers, User, AlertCircle, Calendar } from 'lucide-react';

import { PageLayout } from '../components/PageLayout';
import type { Product, Event, Report } from '../types/index.js';
import { storageService } from '../services/storage.service.js';
import { statusService } from '../services/status.service.js';
import { IncidentTimeline } from '../components/IncidentTimeline';
import { ReportsList } from '../components/ReportsList';
import { StatusBadge } from '../components/StatusBadge';
import { GlobalStatus } from '../components/GlobalStatus';
import { LiveRefreshBadge } from '../components/LiveRefreshBadge';
import { MetricCard } from '../components/ui/MetricCard';
import { Card } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { useStorageRefreshContext } from '../context/StorageRefreshContext';
import { ProductAdminBar } from '../components/ProductAdminBar';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { refreshKey, lastUpdated } = useStorageRefreshContext();

  const product = useMemo<Product | null>(() => {
    if (!id) return null;
    return storageService.getProducts().find((p) => p.id === id) ?? null;
  }, [id, refreshKey]);

  const events = useMemo<Event[]>(() => {
    if (!id) return [];
    return storageService.getEventsByProduct(id);
  }, [id, refreshKey]);

  const reports = useMemo<Report[]>(() => {
    if (!id) return [];
    return storageService.getReportsByProduct(id);
  }, [id, refreshKey]);

  if (!product) {
    return (
      <PageLayout>
        <Card className="p-12 text-center">
          <p className="text-lg font-semibold text-slate-800">Servicio no encontrado</p>
          <Link to="/" className="mt-4 inline-block font-medium text-brand hover:underline">
            Volver al inicio
          </Link>
        </Card>
      </PageLayout>
    );
  }

  const currentStatus = statusService.getCurrentProductStatus(product.id);
  const incidentCount = events.length;

  return (
    <PageLayout>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <ProductAdminBar productId={product.id} />
        <LiveRefreshBadge lastUpdated={lastUpdated} />
      </div>

      <nav
        className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted"
        aria-label="Breadcrumb"
      >
        <Link to="/" className="font-medium text-brand hover:underline">
          Hospital San Rafael
        </Link>
        <span>/</span>
        <Link to="/#servicios" className="font-medium text-brand/80 hover:underline">
          Servicios TI
        </Link>
        <span>/</span>
        <span className="font-medium text-brand-dark">{product.name}</span>
      </nav>

      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 rounded-lg font-medium text-brand transition hover:text-brand-dark focus-ring"
      >
        <ChevronLeft size={20} />
        Volver al inicio
      </Link>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <Card className="p-8">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand">
                Estado individual del servicio
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-brand-dark">{product.name}</h1>
              <p className="mt-3 leading-relaxed text-muted">{product.description}</p>
            </div>
            <StatusBadge condition={currentStatus} size="lg" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Tipo de servicio"
              value={product.type}
              icon={Layers}
              accentClass="text-brand"
              iconBgClass="bg-brand-soft text-brand"
            />
            <MetricCard
              label="Responsable"
              value={product.owner}
              icon={User}
              accentClass="text-brand"
              iconBgClass="bg-brand-soft text-brand"
            />
            <MetricCard
              label="Incidentes totales"
              value={incidentCount}
              icon={AlertCircle}
              accentClass="text-status-warning"
              iconBgClass="bg-amber-50 text-status-warning"
            />
            <MetricCard
              label="Reportes"
              value={reports.length}
              icon={Calendar}
              accentClass="text-brand"
              iconBgClass="bg-brand-soft text-brand"
            />
          </div>
        </Card>

        <div className="space-y-6">
          <GlobalStatus />
          <Card className="p-6">
            <h2 className="font-display text-lg font-bold text-brand-dark">Visión rápida</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Uptime institucional: {statusService.getUptime()}%. El estado individual se calcula
              según el último evento registrado.
            </p>
          </Card>
        </div>
      </div>

      <section className="mt-10">
        <SectionHeader
          title="Reportes por producto"
          subtitle="Consulte los reportes y sus incidentes asociados."
        />
        <Card className="p-8">
          <ReportsList reports={reports} />
        </Card>
      </section>

      <section className="mt-10">
        <SectionHeader
          title="Historial de incidentes"
          subtitle="Línea de tiempo consolidada de todos los eventos del servicio."
        />
        <Card className="p-8">
          <IncidentTimeline events={events} />
        </Card>
      </section>
    </PageLayout>
  );
}
