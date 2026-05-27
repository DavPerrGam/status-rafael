import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import type { Product, Report, Event } from '../../types/index.js';
import { EventCondition } from '../../types/index.js';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storage.service.js';
import { StatusBadge } from '../StatusBadge';
import { getStatusText } from '../../utils/statusColors.js';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from './ConfirmDialog';

interface EventsAdminPanelProps {
  products: Product[];
  reports: Report[];
  events: Event[];
  defaultProductId?: string;
  autoOpenCreate?: boolean;
}

const CONDITIONS = [
  EventCondition.CONDITION_ACTIVE,
  EventCondition.CONDITION_WARNING,
  EventCondition.CONDITION_ERROR,
];

export function EventsAdminPanel({
  products,
  reports,
  events,
  defaultProductId,
  autoOpenCreate,
}: EventsAdminPanelProps) {
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    productId: products[0]?.id ?? '',
    reportId: reports[0]?.id ?? '',
    condition: EventCondition.CONDITION_ACTIVE as EventCondition,
    title: '',
    description: '',
    occurredAt: new Date().toISOString().slice(0, 16),
  });

  const reportsForProduct = reports.filter((r) => r.productId === form.productId);

  const getProductName = (id: string) => products.find((p) => p.id === id)?.name ?? '—';

  useEffect(() => {
    if (autoOpenCreate && defaultProductId && products.some((p) => p.id === defaultProductId)) {
      const productReports = reports.filter((r) => r.productId === defaultProductId);
      setForm({
        productId: defaultProductId,
        reportId: productReports[0]?.id ?? '',
        condition: EventCondition.CONDITION_ACTIVE,
        title: '',
        description: '',
        occurredAt: new Date().toISOString().slice(0, 16),
      });
      setIsCreating(true);
      setEditing(null);
    }
  }, [autoOpenCreate, defaultProductId, products, reports]);

  const openCreate = () => {
    const pid = defaultProductId ?? products[0]?.id ?? '';
    const productReports = reports.filter((r) => r.productId === pid);
    setForm({
      productId: pid,
      reportId: productReports[0]?.id ?? '',
      condition: EventCondition.CONDITION_ACTIVE,
      title: '',
      description: '',
      occurredAt: new Date().toISOString().slice(0, 16),
    });
    setIsCreating(true);
    setEditing(null);
  };

  const openEdit = (event: Event) => {
    setForm({
      productId: event.productId,
      reportId: event.reportId,
      condition: event.condition,
      title: event.title,
      description: event.description,
      occurredAt: event.occurredAt.slice(0, 16),
    });
    setEditing(event);
    setIsCreating(false);
  };

  const closeModal = () => {
    setEditing(null);
    setIsCreating(false);
  };

  const onProductChange = (productId: string) => {
    const productReports = reports.filter((r) => r.productId === productId);
    setForm({
      ...form,
      productId,
      reportId: productReports[0]?.id ?? '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.reportId) return;
    const now = new Date().toISOString();
    storageService.saveEvent({
      id: editing?.id ?? uuidv4(),
      productId: form.productId,
      reportId: form.reportId,
      condition: form.condition,
      title: form.title,
      description: form.description,
      occurredAt: new Date(form.occurredAt).toISOString(),
      createdAt: editing?.createdAt ?? now,
    });
    closeModal();
    showToast(editing ? 'Evento actualizado' : 'Evento registrado', 'success');
  };

  const handleDelete = () => {
    if (deleteId) {
      storageService.deleteEvent(deleteId);
      setDeleteId(null);
      showToast('Evento eliminado', 'success');
    }
  };

  if (products.length === 0 || reports.length === 0) {
    return (
      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Necesita productos y reportes antes de registrar eventos (incidentes).
      </p>
    );
  }

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-brand-dark">Gestión de eventos</h2>
          <p className="text-sm text-muted">
            Registrar y editar incidentes con condición: operativo, advertencia o error.
          </p>
        </div>
        <Button type="button" onClick={openCreate} className="inline-flex items-center gap-2">
          <Plus size={18} />
          Nuevo evento
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-soft/60 text-xs font-bold uppercase tracking-wider text-brand-dark">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="hidden px-4 py-3 md:table-cell">Producto</th>
              <th className="px-4 py-3">Condición</th>
              <th className="hidden px-4 py-3 lg:table-cell">Fecha</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedEvents.map((event) => (
              <tr key={event.id} className="hover:bg-brand-soft/20">
                <td className="px-4 py-3 font-medium">{event.title}</td>
                <td className="hidden px-4 py-3 text-muted md:table-cell">
                  {getProductName(event.productId)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge condition={event.condition} size="sm" variant="outline" />
                </td>
                <td className="hidden px-4 py-3 text-muted lg:table-cell">
                  {new Date(event.occurredAt).toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(event)}
                      className="rounded-lg p-2 text-brand hover:bg-brand-soft focus-ring"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(event.id)}
                      className="rounded-lg p-2 text-status-error hover:bg-red-50 focus-ring"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <p className="p-8 text-center text-muted">No hay eventos registrados.</p>
        )}
      </div>

      {(isCreating || editing) && (
        <Modal title={editing ? 'Editar evento' : 'Registrar evento'} onClose={closeModal} wide>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-brand-dark">Producto</label>
                <select
                  className="input-field !rounded-xl"
                  value={form.productId}
                  onChange={(e) => onProductChange(e.target.value)}
                  required
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-brand-dark">Reporte</label>
                <select
                  className="input-field !rounded-xl"
                  value={form.reportId}
                  onChange={(e) => setForm({ ...form, reportId: e.target.value })}
                  required
                >
                  {reportsForProduct.length === 0 ? (
                    <option value="">Sin reportes para este producto</option>
                  ) : (
                    reportsForProduct.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-brand-dark">
                Condición del evento
              </label>
              <select
                className="input-field !rounded-xl"
                value={form.condition}
                onChange={(e) =>
                  setForm({ ...form, condition: e.target.value as EventCondition })
                }
                required
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {getStatusText(c)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-brand-dark">Título</label>
              <input
                className="input-field !rounded-xl"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-brand-dark">Descripción</label>
              <textarea
                className="input-field !rounded-xl min-h-[80px]"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-brand-dark">Fecha de ocurrencia</label>
              <input
                type="datetime-local"
                className="input-field !rounded-xl"
                value={form.occurredAt}
                onChange={(e) => setForm({ ...form, occurredAt: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={closeModal}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!form.reportId}>
                {editing ? 'Guardar' : 'Registrar evento'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="¿Eliminar este evento del historial?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
