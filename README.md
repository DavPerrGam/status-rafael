# Status Rafael — Aplicación React

Portal de monitoreo del **Hospital Universitario San Rafael de Tunja**.

Documentación completa del proyecto: [../README.md](../README.md)  
Documento para PDF: [../docs/DOCUMENTACION_FINAL.md](../docs/DOCUMENTACION_FINAL.md)

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # producción
npm run preview  # vista previa del build
npm run lint     # ESLint
```

## Módulos principales

| Carpeta | Descripción |
|---------|-------------|
| `src/pages/` | Home, detalle, login, admin |
| `src/components/admin/` | CRUD productos, reportes, eventos |
| `src/services/` | Auth, storage, cálculo de estados |
| `src/hooks/useStorageRefresh.ts` | Auto-refresh 30 s |

## Credenciales demo

- Email: `admin@sanrafael.gov.co`
- Contraseña: `SanRafael2026*`
