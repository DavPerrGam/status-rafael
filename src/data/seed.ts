import type { Product } from '../types/index.js';
import { EventCondition } from '../types/index.js';
import { storageService, notifyStorageUpdate } from '../services/storage.service.js';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  PRODUCTS: 'sr_products',
  REPORTS: 'sr_reports',
  EVENTS: 'sr_events',
};

const INITIAL_PRODUCTS: Product[] = [
  { id: uuidv4(), name: 'Sistema de Historia Clínica Electrónica', description: 'Gestión de historias clínicas electrónicas de pacientes', type: 'Sistema', owner: 'TI Clínica', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema de Citas Médicas', description: 'Programación y gestión de citas médicas', type: 'Sistema', owner: 'TI Clínica', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema de Facturación', description: 'Gestión de facturación y cobros', type: 'Sistema', owner: 'TI Administrativo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema de Admisiones', description: 'Registro y gestión de admisiones de pacientes', type: 'Sistema', owner: 'TI Clínica', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'API de Laboratorio Clínico', description: 'Servicios de laboratorio clínico', type: 'Servicio', owner: 'TI Servicios', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema de Radiología e Imágenes', description: 'Gestión de imágenes radiológicas y diagnóstico', type: 'Aplicación', owner: 'TI Clínica', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Servidor de Base de Datos Principal', description: 'Servidor principal de base de datos hospitalaria', type: 'Infraestructura', owner: 'TI Infraestructura', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Portal Web Institucional', description: 'Sitio web público del hospital', type: 'Plataforma', owner: 'TI Comunicaciones', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema de Farmacia', description: 'Gestión de medicamentos y farmacia', type: 'Sistema', owner: 'TI Clínica', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema de Urgencias', description: 'Gestión de pacientes en urgencias', type: 'Sistema', owner: 'TI Clínica', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema de Hospitalización', description: 'Gestión de camas y pacientes hospitalizados', type: 'Sistema', owner: 'TI Clínica', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema de Cirugía', description: 'Gestión de quirófanos y procedimientos quirúrgicos', type: 'Sistema', owner: 'TI Clínica', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema de Gestión Documental', description: 'Almacenamiento y gestión de documentos', type: 'Plataforma', owner: 'TI Administrativo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema de Nómina', description: 'Gestión de nóminas y recursos humanos', type: 'Sistema', owner: 'TI Administrativo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema Financiero', description: 'Gestión financiera del hospital', type: 'Sistema', owner: 'TI Administrativo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema de Inventarios Biomédicos', description: 'Control de inventarios de equipos biomédicos', type: 'Sistema', owner: 'TI Infraestructura', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Red Interna Hospitalaria', description: 'Infraestructura de red del hospital', type: 'Infraestructura', owner: 'TI Infraestructura', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Servicio de Correo Institucional', description: 'Servidor de correo electrónico', type: 'Servicio', owner: 'TI Infraestructura', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema de Autorizaciones EPS', description: 'Gestión de autorizaciones de EPS', type: 'Aplicación', owner: 'TI Administrativo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Plataforma de Telemedicina', description: 'Servicios de atención telemédica', type: 'Plataforma', owner: 'TI Servicios', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Sistema de Gestión de Turnos', description: 'Programación de turnos de personal', type: 'Sistema', owner: 'TI Administrativo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Servicio de Backups Hospitalarios', description: 'Servicio de respaldo y recuperación de datos', type: 'Servicio', owner: 'TI Infraestructura', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

function seedInitialData() {
  const now = new Date();

  INITIAL_PRODUCTS.forEach((product, index) => {
    storageService.saveProduct(product);

    const reportId = uuidv4();
    storageService.saveReport({
      id: reportId,
      productId: product.id,
      title: `Reporte ${product.name}`,
      description: `Reporte de monitoreo de ${product.name}`,
      reportDate: now.toISOString(),
      createdAt: now.toISOString(),
    });

    const conditions = [
      EventCondition.CONDITION_ACTIVE,
      EventCondition.CONDITION_ACTIVE,
      EventCondition.CONDITION_ACTIVE,
      EventCondition.CONDITION_WARNING,
      EventCondition.CONDITION_ERROR,
    ];
    const condition = conditions[index % conditions.length];

    storageService.saveEvent({
      id: uuidv4(),
      reportId,
      productId: product.id,
      condition,
      title: 'Estado actual',
      description: `Últimas mediciones del sistema ${product.name}`,
      occurredAt: now.toISOString(),
      createdAt: now.toISOString(),
    });

    if (index % 4 === 0) {
      storageService.saveEvent({
        id: uuidv4(),
        reportId,
        productId: product.id,
        condition: EventCondition.CONDITION_ACTIVE,
        title: 'Verificación rutinaria',
        description: 'Control preventivo sin novedades.',
        occurredAt: new Date(now.getTime() - 86400000).toISOString(),
        createdAt: now.toISOString(),
      });
    }
  });
}

export const seedDatabase = () => {
  if (storageService.getProducts().length === 0) {
    seedInitialData();
    notifyStorageUpdate();
  }
};

export const resetDatabase = () => {
  localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
  localStorage.removeItem(STORAGE_KEYS.REPORTS);
  localStorage.removeItem(STORAGE_KEYS.EVENTS);
  seedInitialData();
  notifyStorageUpdate();
};
