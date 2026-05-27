import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Pencil, Plus, Trash2 } from 'lucide-react';

import type { Product } from '../../types/index.js';
import { useToast } from '../../context/ToastContext';
import { storageService } from '../../services/storage.service.js';
import { statusService } from '../../services/status.service.js';
import { StatusBadge } from '../StatusBadge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from './ConfirmDialog';

interface ProductsAdminPanelProps {
  products: Product[];
}

const emptyProduct = (): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> => ({
  name: '',
  description: '',
  type: 'Sistema',
  owner: '',
});

export function ProductsAdminPanel({ products }: ProductsAdminPanelProps) {
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct());

  const openCreate = () => {
    setForm(emptyProduct());
    setIsCreating(true);
    setEditing(null);
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      type: product.type,
      owner: product.owner,
    });
    setEditing(product);
    setIsCreating(false);
  };

  const closeModal = () => {
    setEditing(null);
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    if (editing) {
      storageService.saveProduct({ ...editing, ...form, updatedAt: now });
    } else {
      storageService.saveProduct({
        id: uuidv4(),
        ...form,
        createdAt: now,
        updatedAt: now,
      });
    }
    closeModal();
    showToast(editing ? 'Producto actualizado' : 'Producto creado', 'success');
  };

  const handleDelete = () => {
    if (deleteId) {
      storageService.deleteProduct(deleteId);
      setDeleteId(null);
      showToast('Producto eliminado', 'success');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-brand-dark">Gestión de productos</h2>
          <p className="text-sm text-muted">Crear, editar y eliminar sistemas hospitalarios monitorizados.</p>
        </div>
        <Button type="button" onClick={openCreate} className="inline-flex items-center gap-2">
          <Plus size={18} />
          Nuevo producto
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-soft/60 text-xs font-bold uppercase tracking-wider text-brand-dark">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="hidden px-4 py-3 md:table-cell">Tipo</th>
              <th className="hidden px-4 py-3 lg:table-cell">Responsable</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-brand-soft/20">
                <td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
                <td className="hidden px-4 py-3 text-muted md:table-cell">{product.type}</td>
                <td className="hidden px-4 py-3 text-muted lg:table-cell">{product.owner}</td>
                <td className="px-4 py-3">
                  <StatusBadge
                    condition={statusService.getCurrentProductStatus(product.id)}
                    size="sm"
                    variant="outline"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="rounded-lg p-2 text-brand hover:bg-brand-soft focus-ring"
                      aria-label="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(product.id)}
                      className="rounded-lg p-2 text-status-error hover:bg-red-50 focus-ring"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-8 text-center text-muted">No hay productos registrados.</p>
        )}
      </div>

      {(isCreating || editing) && (
        <Modal title={editing ? 'Editar producto' : 'Crear producto'} onClose={closeModal}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-brand-dark">Nombre</label>
              <input
                className="input-field !rounded-xl"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-brand-dark">Tipo</label>
                <select
                  className="input-field !rounded-xl"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {['Sistema', 'Servicio', 'Aplicación', 'Infraestructura', 'Plataforma'].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-brand-dark">Responsable</label>
                <input
                  className="input-field !rounded-xl"
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={closeModal}>
                Cancelar
              </Button>
              <Button type="submit">{editing ? 'Guardar cambios' : 'Crear producto'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="¿Eliminar este producto? Se borrarán también sus reportes y eventos asociados."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
