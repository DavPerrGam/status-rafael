import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Phone,
  Shield,
  Clock,
  MapPin,
  Stethoscope,
  Monitor,
} from 'lucide-react';

import { PageLayout } from '../components/PageLayout';
import { GlobalStatus } from '../components/GlobalStatus';
import { ProductCard } from '../components/ProductCard';
import { MetricCard } from '../components/ui/MetricCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Card } from '../components/ui/Card';
import { storageService } from '../services/storage.service.js';
import { statusService } from '../services/status.service.js';
import { EventCondition } from '../types/index.js';
import { useStorageRefreshContext } from '../context/StorageRefreshContext';
import { filterProducts, type StatusFilter } from '../utils/filters.js';
import { LiveRefreshBadge } from '../components/LiveRefreshBadge';

const dashboardMetrics = [
  {
    label: 'Servicios activos',
    key: EventCondition.CONDITION_ACTIVE,
    accentClass: 'text-status-active',
    iconBgClass: 'bg-emerald-50 text-status-active',
    icon: CheckCircle2,
    delayClass: 'animate-delay-100',
  },
  {
    label: 'Alertas recientes',
    key: EventCondition.CONDITION_WARNING,
    accentClass: 'text-status-warning',
    iconBgClass: 'bg-amber-50 text-status-warning',
    icon: AlertTriangle,
    delayClass: 'animate-delay-200',
  },
  {
    label: 'Incidencias críticas',
    key: EventCondition.CONDITION_ERROR,
    accentClass: 'text-status-error',
    iconBgClass: 'bg-red-50 text-status-error',
    icon: XCircle,
    delayClass: 'animate-delay-300',
  },
];

const filterTabs = [
  { id: 'all', label: 'Todos' },
  { id: 'active', label: 'Operativos' },
  { id: 'warning', label: 'Alertas' },
  { id: 'error', label: 'Críticos' },
] as const;

const trustItemsStatic = [
  { icon: Stethoscope, label: 'Áreas clínicas', sub: 'Conectadas al monitoreo' },
  { icon: MapPin, label: 'Tunja · Boyacá', sub: 'Cobertura regional' },
] as const;

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') ?? '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed === searchQuery) return;
      if (trimmed) setSearchParams({ q: trimmed });
      else setSearchParams({});
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, setSearchParams]);
  const [activeTab, setActiveTab] = useState<StatusFilter>('all');
  const { refreshKey, lastUpdated } = useStorageRefreshContext();
  const allProducts = useMemo(() => storageService.getProducts(), [refreshKey]);
  const products = useMemo(
    () =>
      filterProducts(allProducts, {
        statusFilter: activeTab,
        search: searchQuery,
      }),
    [allProducts, activeTab, searchQuery]
  );
  const uptime = useMemo(() => statusService.getUptime(), [refreshKey]);

  const metrics = useMemo(
    () =>
      dashboardMetrics.map((metric) => ({
        ...metric,
        value: allProducts.filter(
          (product) => statusService.getCurrentProductStatus(product.id) === metric.key
        ).length,
      })),
    [allProducts, refreshKey]
  );

  return (
    <PageLayout>
      <section id="estado" className="hero-hospital mb-12 p-8 sm:p-10 lg:p-12">
        <div className="relative z-10">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="badge-tunja">
              <MapPin size={12} />
              Hospital Universitario · Tunja
            </span>
            <LiveRefreshBadge lastUpdated={lastUpdated} />
          </div>

          <div className="grid gap-10 xl:grid-cols-[1.35fr_1fr] xl:items-start">
            <div className="opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
              <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-dark sm:text-5xl lg:text-[3.25rem]">
                Estado operativo de los sistemas del{' '}
                <span className="text-gradient-brand">Hospital San Rafael</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Bienvenido a la demo del panel de estado operativo. Aquí verás cómo se presenta el
                estado de la infraestructura tecnológica del hospital, con un estilo claro y
                cercano para una demostración profesional.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                {[
                  { icon: Monitor, label: `${allProducts.length}+ sistemas`, sub: 'Infraestructura TI' },
                  ...trustItemsStatic,
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-2xl border border-brand/10 bg-white/80 px-4 py-3 shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-dark">{label}</p>
                      <p className="text-xs text-muted">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <MetricCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    icon={metric.icon}
                    accentClass={metric.accentClass}
                    iconBgClass={metric.iconBgClass}
                    delayClass={metric.delayClass}
                  />
                ))}
              </div>
            </div>

            <div
              className="space-y-4 opacity-0 animate-slide-up animate-delay-200"
              style={{ animationFillMode: 'forwards' }}
            >
              <div className="rounded-2xl border border-brand/10 bg-white/90 px-5 py-4 text-center shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                  Disponibilidad institucional
                </p>
                <p className="mt-1 font-display text-4xl font-extrabold text-brand">{uptime}%</p>
              </div>
              <GlobalStatus />
            </div>
          </div>
        </div>
      </section>

      <section id="servicios">
        <SectionHeader
          title="Sistemas y servicios hospitalarios"
          subtitle="Resumen de estado con datos de demostración para la presentación del Hospital San Rafael."
          badge={
            <div className="flex flex-col items-end gap-1">
              <LiveRefreshBadge lastUpdated={lastUpdated} />
              {searchQuery && (
                <span className="text-xs text-muted">
                  Búsqueda: &quot;{searchQuery}&quot; · {products.length} resultado(s)
                </span>
              )}
            </div>
          }
        />

        <div
          className="mb-6 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filtros visuales de servicios"
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition focus-ring ${
                activeTab === tab.id
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'border border-brand/15 bg-white text-brand-dark hover:bg-brand-soft'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {products.length === 0 ? (
          <Card className="p-10 text-center text-muted">
            {allProducts.length === 0
              ? 'No hay servicios registrados aún.'
              : 'Ningún servicio coincide con los filtros aplicados.'}
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-16" id="informacion">
        <SectionHeader
          title="Información para usuarios y personal"
          subtitle="Canales institucionales del Hospital San Rafael de Tunja."
        />
        <div className="grid gap-6 md:grid-cols-3">
          <Card accent="brand" className="p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <Phone size={22} />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
              Central de contacto
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              PBX institucional, correo oficial y línea de soporte para incidencias en sistemas de
              información hospitalaria.
            </p>
            <p className="mt-4 text-sm font-semibold text-brand-dark">+57 (8) 745 6060</p>
          </Card>
          <Card accent="accent" className="p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <Shield size={22} />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">
              Acceso restringido
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              El panel administrativo está reservado al personal de TI y coordinación de sistemas
              del hospital.
            </p>
          </Card>
          <Card accent="success" className="p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-boyaca-soft text-boyaca">
              <Clock size={22} />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-boyaca">
              Continuidad operativa
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Supervisión permanente de plataformas críticas con protocolo de escalamiento para
              áreas de urgencias y hospitalización.
            </p>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
