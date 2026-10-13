# discordia-backoffice

Panel de administración de Discordia, de uso exclusivo del staff de la plataforma (React + Next.js, App Router).

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript estricto
- Tailwind CSS v4 (`@tailwindcss/postcss`, sin archivo de config), con los design tokens de Discordia puenteados desde `@discordia/client-shared/theme.css`, igual que web-client
- `@discordia/client-shared` para contratos, validaciones y textos compartidos con el resto de los fronts
- axios para HTTP, lucide-react para iconos, recharts para los gráficos, papaparse para el CSV
- Vitest + Testing Library (jsdom) para tests

## Setup local

```bash
cp .env.example .env
npm install
npm run dev
```

## Conectar con el backend real

El login le pega al backend real. Las requests siempre van al Gateway (Kong), nunca directo a un microservicio, y el Gateway queda en `http://localhost:8000`, que es el valor por defecto de `NEXT_PUBLIC_API_URL`.

Para probar el login alcanza con `identity` y el Gateway. Desde `infrastructure/`:

```bash
cp -n .env.example .env
docker compose up -d --build identity-db identity-migrations identity servers-db servers-migrations servers rabbitmq kong-config mailhog
docker compose up -d --no-deps gateway
```

El Gateway se levanta aparte con `--no-deps` porque depende de `signaling`, que se construye desde el repo `voice-sfu`. Si lo tenés clonado alcanza con `docker compose up --build`.

Para entrar hace falta una cuenta con el mail verificado. Los mails llegan a Mailhog, en `http://localhost:8025`.

## Variables de entorno

| Variable            | Default               | Descripcion                                                              |
| ------------------- | --------------------- | ------------------------------------------------------------------------ |
| NEXT_PUBLIC_API_URL | http://localhost:8000 | URL base del Gateway (Kong) al que le pega el servidor de Next (el BFF). |

`.env.example` solo trae la estructura (sin valores sensibles). Los valores reales van en tu propio `.env`, que nunca se sube (ya está en `.gitignore`).

## Estructura de carpetas

```
discordia-backoffice/
├── src/
│   ├── app/                     App Router: cada carpeta con page.tsx es una ruta
│   │   ├── layout.tsx           layout raíz (fuentes, tema, metadata)
│   │   ├── globals.css          Tailwind, tokens propios del backoffice y utilidades compartidas
│   │   ├── login/               pantalla de acceso
│   │   ├── (panel)/             route group: las secciones del panel comparten sidebar
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/       home del staff: métricas globales
│   │   └── api/                 route handlers del BFF (ver "Autenticación")
│   │       ├── auth/login/
│   │       └── metrics/
│   ├── middleware.ts            guardia de rutas (corre antes de cada request)
│   ├── components/
│   │   ├── ui/                  piezas genéricas reutilizables (TextField, ThemeToggle, BrandLogo, ...)
│   │   ├── auth/                componentes del login
│   │   ├── layout/              marco del panel: Sidebar, PanelHeader, PanelShell
│   │   │   └── hooks/           useSidebar, useStaffAccess
│   │   └── metrics/             componentes del dashboard: tarjetas, gráficos, estados
│   │       ├── hooks/           usePlatformMetrics
│   │       └── utils/           formato de ejes, armado del CSV, estado vacío
│   ├── services/                código agrupado por dominio del backend
│   │   ├── auth/                client (browser), service (server), session, session-shape
│   │   └── metrics/             client (browser), service (server), mockPlatformMetrics
│   ├── types/                   tipos por dominio: <dominio>.types.ts
│   ├── hooks/                   hooks de React que usan varias features (useTheme, useMediaQuery)
│   ├── utils/                   funciones auxiliares sin UI (metricsPeriod, downloadFile)
│   └── lib/
│       ├── apiClient.ts          cliente HTTP hacia el Gateway (server-only)
│       ├── browserApiClient.ts   cliente HTTP del navegador hacia el BFF (`/api/*`)
│       ├── cn.ts                 une clases de Tailwind (clsx + tailwind-merge)
│       ├── apiRoute.ts           respuestas estándar de los route handlers
│       ├── setCookie.ts          lee cookies del header `Set-Cookie` del backend
│       ├── constants.ts          constantes de la app (rutas, cookie de sesión, ...)
│       └── env.ts                lectura centralizada de variables de entorno
├── public/                      logos
├── .github/
│   └── workflows/
│       └── ci.yml               format:check, lint, test y build en cada PR/push a main
├── .githooks/
│   └── pre-commit               hook de prettier local
├── next.config.mjs
├── tsconfig.json
├── postcss.config.mjs           plugin de Tailwind v4
├── vitest.config.ts             config de tests
├── vitest.setup.ts              setup de Testing Library
├── Dockerfile                   build multi-stage para la imagen de producción
└── .env.example                 estructura de variables de entorno (sin valores sensibles)
```

Los tipos de cada dominio (`Session`, `PlatformMetrics`, ...) viven en `types/<dominio>.types.ts`, no dentro de `services/<dominio>/`: así se pueden importar sin arrastrar `service.ts` (server-only) ni `client.ts` (que pega contra el BFF).

Los hooks de una sola feature viven con ella, en su carpeta `hooks/`; los que usan varias features van en `src/hooks/`. Los formatters y demás funciones auxiliares de una feature van en su carpeta `utils/`, para distinguirlos de los componentes.

## Convenciones de Next (App Router)

- **Rutas por carpeta.** Un `page.tsx` dentro de `src/app/x/` crea la ruta `/x`.
- **Route groups.** Una carpeta entre paréntesis, como `(panel)`, agrupa rutas para compartir un `layout.tsx` sin aparecer en la URL: `(panel)/dashboard/page.tsx` responde a `/dashboard`.
- **Route handlers.** Un `route.ts` es un endpoint HTTP. Se exporta una función por verbo (`GET`, `POST`, ...). La lógica vive en `services/`; el `route.ts` es solo la cáscara HTTP.
- **Server vs client.** Los componentes corren en el servidor por defecto. Los que necesitan estado o eventos del navegador llevan `"use client"` en la primera línea.
- **`middleware.ts`.** Corre antes de cada request. Se usa para redirigir según haya o no sesión.
- **Alias `@/`.** `@/x` apunta a `src/x` (configurado en `tsconfig.json`).

## Autenticación

El navegador nunca habla directo con el backend. Pega contra los route handlers de `/api/*` (mismo origen) y Next hace de intermediario (patrón BFF): reenvía la llamada al Gateway y guarda la sesión en una cookie `httpOnly` que el JavaScript del navegador no puede leer.

```
navegador ──► /api/... (Next) ──► Gateway (Kong) ──► identify-service
                  │
                  └─ sesión en cookie httpOnly (discordia_backoffice_session)
```

- `middleware.ts` es el guardia: sin sesión, `/dashboard` redirige a `/login`; con sesión, `/login` redirige al dashboard.
- Cada feature con llamadas autenticadas sigue el mismo camino: `route.ts` en `app/api/` + lógica en `services/<dominio>/`.
- La cookie tiene un nombre propio (`discordia_backoffice_session`): las cookies se comparten entre puertos de un mismo host, y con el mismo nombre que otra app se pisarían la sesión en `localhost`.

## Comandos

- `npm run dev` - corre el servicio localmente.
- `npm run lint` - corre ESLint (`next/core-web-vitals`).
- `npm run typecheck` - chequea tipos con `tsc` (sin emitir).
- `npm run format` / `npm run format:check` - formatea o chequea el formato con Prettier.
- `npm run test` - corre los tests con Vitest.
- `npm run build` - compila para producción.

## Formateo automático

Este repo se autoformatea con Prettier en cada commit. Activalo una vez por clone:

```bash
git config core.hooksPath .githooks
```

Si usan VS Code con la extensión oficial de Prettier, también formatea al guardar (ya configurado en .vscode/settings.json).

El CI corre `npm run format:check` como red de seguridad (falla si encuentra archivos sin formatear), por si alguien clonó sin activar el hook.
