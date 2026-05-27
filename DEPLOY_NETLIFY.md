# Desplegar en Netlify

Esta guía rápida explica cómo desplegar el proyecto `status-rafael` en Netlify.

Opciones disponibles:

## Recomendado: Conectar el repositorio a Netlify (Git)
1. Sube tu repositorio a GitHub / GitLab / Bitbucket.
2. En Netlify: `New site` → `Import from Git` → conecta tu cuenta y selecciona el repo.
3. Configura:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - `netlify.toml` ya está presente en el repo, así que Netlify usará `npm run build` y `dist`.
4. Click `Deploy site`.

Ventajas: deploys automáticos en cada push, integración con previews.

## Alternativa: Usar Netlify CLI desde tu máquina (sin Git)
1. Instala Netlify CLI (si no lo añadiste como dependencia global):

```powershell
npm install -g netlify-cli
# o usar la dependencia local con:
# npm install
# npx netlify --version
```

2. Logueate (abrirá el navegador para autenticarte):

```powershell
netlify login
```

3. Genera el build y despliega en producción:

```powershell
cd status-rafael
npm run build
netlify deploy --prod --dir=dist
```

4. Si quieres crear la configuración inicial (site link):

```powershell
cd status-rafael
netlify init
# sigue las instrucciones interactivas para asociar/crear un sitio
```

Nota: El proyecto ya incluye `netlify.toml` con `command = "npm run build"` y `publish = "dist"`, y un redirect `/* -> /index.html`.

## CI / GitHub Actions (opcional)
- Para deploys automatizados desde CI, agrega el secreto `NETLIFY_AUTH_TOKEN` en tu repo y usa la acción oficial `netlify/actions/cli` o ejecuta `npx netlify deploy --prod --dir=dist` desde la acción.

## Script npm añadido
- He añadido el script `deploy` en `package.json`:

```powershell
# desde la carpeta status-rafael
npm run deploy
```

Este script usa `netlify deploy --prod --dir=dist` y requiere netlify-cli instalado o disponible como `npx`.

---

Si quieres, puedo:
- intentar ejecutar `npm run deploy` aquí (necesitarás autenticar Netlify en tu máquina), o
- ayudarte a conectar tu repo a Netlify paso a paso (puedo mostrar clicks y opciones), o
- crear un workflow de GitHub Actions que despliegue automáticamente (te indicaré cómo añadir el secreto `NETLIFY_AUTH_TOKEN`).

Dime qué prefieres y lo hago.