import { useState } from 'react';
import { Download, RotateCcw, Database } from 'lucide-react';

import { resetDatabase } from '../../data/seed.js';
import { exportFullBackup } from '../../services/export.service.js';
import { downloadStatusJson } from '../../services/export.service.js';
import { useToast } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ConfirmDialog } from './ConfirmDialog';

export function AdminToolsPanel() {
  const { showToast } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    resetDatabase();
    setConfirmReset(false);
    showToast('Datos de demostración restaurados', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-brand-dark">Herramientas y DevOps</h2>
        <p className="text-sm text-muted">
          Exportación de datos, respaldos y restauración del entorno demo.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <Database size={24} className="text-brand" />
          <h3 className="mt-3 font-bold text-brand-dark">Exportar estado público</h3>
          <p className="mt-2 text-sm text-muted">
            Genera un JSON con el estado global y de cada producto (requerimiento de visualización
            pública).
          </p>
          <Button
            type="button"
            className="mt-4 inline-flex items-center gap-2"
            onClick={() => {
              downloadStatusJson();
              showToast('JSON de estado descargado', 'info');
            }}
          >
            <Download size={16} />
            Descargar estado JSON
          </Button>
        </Card>

        <Card className="p-6">
          <Download size={24} className="text-brand" />
          <h3 className="mt-3 font-bold text-brand-dark">Respaldo completo</h3>
          <p className="mt-2 text-sm text-muted">
            Exporta productos, reportes y eventos para respaldo o migración.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-4 inline-flex items-center gap-2"
            onClick={() => {
              exportFullBackup();
              showToast('Respaldo descargado', 'info');
            }}
          >
            <Download size={16} />
            Exportar backup
          </Button>
        </Card>

        <Card className="p-6 md:col-span-2 border-amber-200 bg-amber-50/50">
          <RotateCcw size={24} className="text-status-warning" />
          <h3 className="mt-3 font-bold text-brand-dark">Restaurar datos demo</h3>
          <p className="mt-2 text-sm text-muted">
            Elimina todos los datos y vuelve a cargar los 22 sistemas hospitalarios de ejemplo con
            reportes e incidentes.
          </p>
          <Button
            type="button"
            variant="danger"
            className="mt-4"
            onClick={() => setConfirmReset(true)}
          >
            Restaurar seed inicial
          </Button>
        </Card>
      </div>

      {confirmReset && (
        <ConfirmDialog
          message="¿Restaurar todos los datos de demostración? Se perderán los cambios manuales."
          onConfirm={handleReset}
          onCancel={() => setConfirmReset(false)}
        />
      )}
    </div>
  );
}
