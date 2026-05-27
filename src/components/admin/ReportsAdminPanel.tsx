import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import type { Product, Report } from '../../types/index.js';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storage.service.js';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from './ConfirmDialog';

interface ReportsAdminPanelProps {
  products: Product[];
  reports: Report[];
  defaultProductId?: string;
  autoOpenCreate?: boolean;
}

export function ReportsAdminPanel({
  products,
  reports,
  defaultProductId,
  autoOpenCreate,
}: ReportsAdminPanelProps) {
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Report | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    productId: products[0]?.id ?? '',
    title: '',
    description: '',
    reportDate: new Date().toISOString().slice(0, 16),
  });

  const getProductName = (id: string) => products.find((p) => p.id === id)?.name ?? '—';

  useEffect(() => {
    if (autoOpenCreate && defaultProductId && products.some((p) => p.id === defaultProductId)) {
      setForm({
        productId: defaultProductId,
        title: '',
        description: '',
        reportDate: new Date().toISOString().slice(0, 16),
      });
      setIsCreating(true);
      setEditing(null);
    }
  }, [autoOpenCreate, defaultProductId, products]);

  const openCreate = () => {
    setForm({
      productId: defaultProductId ?? products[0]?.id ?? '',
      title: '',
      description: '',
      reportDate: new Date().toISOString().slice(0, 16),
    });
    setIsCreating(true);
    setEditing(null);
  };

  const openEdit = (report: Report) => {
    setForm({
      productId: report.productId,
      title: report.title,
      description: report.description,
      reportDate: report.reportDate.slice(0, 16),
    });
    setEditing(report);
    setIsCreating(false);
  };

  const closeModal = () => {
    setEditing(null);
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const payload: Report = {
      id: editing?.id ?? uuidv4(),
      productId: form.productId,
      title: form.title,
      description: form.description,
      reportDate: new Date(form.reportDate).toISOString(),
      createdAt: editing?.createdAt ?? now,
    };
    storageService.saveReport(payload);
    closeModal();
    showToast(editing ? 'Reporte actualizado' : 'Reporte creado', 'success');
  };

  const handleDelete = () => {
    if (deleteId) {
      storageService.deleteReport(deleteId);
      setDeleteId(null);
      showToast('Reporte eliminado', 'success');
    }
  };

  if (products.length === 0) {
    return (
      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Cree al menos un producto antes de registrar reportes.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-brand-dark">Gestión de reportes</h2>
          <p className="text-sm text-muted">Crear reportes por producto para agrupar incidentes.</p>
        </div>
        <Button type="button" onClick={openCreate} className="inline-flex items-center gap-2">
          <Plus size={18} />
          Nuevo reporte
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-soft/60 text-xs font-bold uppercase tracking-wider text-brand-dark">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Producto</th>
              <th className="hidden px-4 py-3 md:table-cell">Fecha</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-brand-soft/20">
                <td className="px-4 py-3 font-medium">{report.title}</td>
                <td className="px-4 py-3 text-muted">{getProductName(report.productId)}</td>
                <td className="hidden px-4 py-3 text-muted md:table-cell">
                  {new Date(report.reportDate).toLocaleString('es-CO')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(report)}
                      className="rounded-lg p-2 text-brand hover:bg-brand-soft focus-ring"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(report.id)}
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
        {reports.length === 0 && (
          <p className="p-8 text-center text-muted">No hay reportes registrados.</p>
        )}
      </div>

      {(isCreating || editing) && (
        <Modal title={editing ? 'Editar reporte' : 'Crear reporte'} onClose={closeModal} wide>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-brand-dark">Producto</label>
              <select
                className="input-field !rounded-xl"
                value={form.productId}
                onChange={(e) => setForm({ ...form, productId: e.target.value })}
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
              <label className="mb-1 block text-sm font-semibold text-brand-dark">Fecha del reporte</label>
              <input
                type="datetime-local"
                className="input-field !rounded-xl"
                value={form.reportDate}
                onChange={(e) => setForm({ ...form, reportDate: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={closeModal}>
                Cancelar
              </Button>
              <Button type="submit">{editing ? 'Guardar' : 'Crear reporte'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="¿Eliminar este reporte? También se eliminarán los eventos vinculados."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
