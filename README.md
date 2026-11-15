# backoffice

Panel de administración de Discordia, de uso exclusivo del staff.

## Tabla de contenidos

- [Introducción](#introducción)
- [Pre-requisitos](#pre-requisitos)
- [Cómo correr](#cómo-correr)
- [Variables de entorno](#variables-de-entorno)
- [Comandos Docker](#comandos-docker)
- [Tests](#tests)
- [Más documentación](#más-documentación)

## Introducción

`backoffice` es la aplicación web que usa el staff de la plataforma para controlar abusos y ver cómo anda todo. Se divide en tres partes:

- **Usuarios y servidores:** listar con filtros, suspender y reactivar cuentas, suspender o eliminar servidores completos, y revisar los pedidos de recuperación de cuenta de quien perdió su segundo factor.
- **Expediente:** reunir en una sola pantalla lo que se sabe de un usuario o de un servidor (reportes, acciones de moderación y actividad) para investigar.
- **Métricas y estado:** actividad global y por servidor, crecimiento de miembros con exportación a CSV, y el estado de la plataforma con la publicación y resolución de incidentes.

Está hecho con Next.js 14 (App Router), React 18 y TypeScript, con Tailwind CSS para los estilos y Vitest para los tests. Usa el paquete [`client-shared`](https://github.com/discordia-grupo01/client-shared) para los tipos, textos y funciones que comparte con la web y la app móvil.

El navegador no le habla directo al backend: las pantallas llaman a rutas del propio servidor de Next (un BFF), que reenvía el pedido al gateway con el JWT guardado en una cookie. El gateway (Kong) valida el token, y es `admin` quien decide si el usuario es staff. Para que las pantallas se actualicen solas cuando algo cambia, se conecta por WebSocket a `notifications`. En producción corre en Vercel.

## Pre-requisitos

- **Node.js 20** y **npm**, si querés correrlo en tu máquina.
- **Docker** y **Docker Compose** v2.24 o más nuevo, si preferís correrlo en un contenedor.
- **El backend**, para que el panel tenga a quién hablarle. Lo más simple es levantarlo con el repositorio [`infrastructure`](https://github.com/discordia-grupo01/infrastructure). Sin backend, el panel abre igual y muestra la pantalla de acceso.
- **Un usuario con permisos de staff** para entrar. Cómo se da de alta está explicado en el README de [`admin`](https://github.com/discordia-grupo01/admin).

## Cómo correr

### Con Docker Compose

Levanta el panel en modo desarrollo dentro de un contenedor:

```bash
docker compose up
```

La primera vez tarda un poco, porque instala las dependencias. Cuando termine, abrí http://localhost:3001.

El contenedor busca el gateway en `host.docker.internal:8000`, que desde un contenedor es tu máquina. Si el gateway corre en otro lado, completá `API_URL_DOCKER` en el `.env`.

Este compose levanta solo el panel. Para el sistema completo, usá el compose del repositorio `infrastructure`.

### Para desarrollar

Si vas a tocar el código, te conviene correrlo en tu máquina, con recarga en caliente:

```bash
cp .env.example .env
npm install
npm run dev
```

Con el `.env` de ejemplo, el panel le habla al gateway en `http://localhost:8000` y queda en http://localhost:3000.

## Variables de entorno

Se leen del entorno o de un archivo `.env`. El archivo [`.env.example`](.env.example) trae el valor para correr en local. Las variables que empiezan con `NEXT_PUBLIC_` quedan incluidas en el código al compilar: no pongas secretos ahí.

| Variable | Default | Descripción |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | URL del gateway (Kong), al que le habla el servidor de Next. Nunca apunta directo a un servicio. |

Variables que usa solo `docker-compose.yml`:

| Variable | Default | Descripción |
|---|---|---|
| `BACKOFFICE_PORT` | `3001` | Puerto del panel en tu máquina. |
| `API_URL_DOCKER` | `http://host.docker.internal:8000` | URL del gateway para el servidor de Next que corre dentro del contenedor. |

## Comandos Docker

Todos desde la raíz del repositorio.

| Qué querés hacer | Comando |
|---|---|
| Levantar el panel | `docker compose up` |
| Levantar en segundo plano | `docker compose up -d` |
| Ver los logs | `docker compose logs -f backoffice` |
| Ver qué está corriendo | `docker compose ps` |
| Bajar todo | `docker compose down` |
| Bajar todo y borrar las dependencias instaladas | `docker compose down -v` |

El repositorio también trae un `Dockerfile` que compila el panel y lo sirve con `npm start`. La producción no lo usa: se despliega en Vercel.

```bash
docker build -t backoffice .
docker run --rm -p 3000:3000 backoffice
```

## Tests

```bash
npm test
```

Corre los tests con Vitest y Testing Library. Para revisar el resto del código:

| Qué | Comando |
|---|---|
| Linter (ESLint) | `npm run lint` |
| Tipos (TypeScript) | `npm run typecheck` |
| Formato | `npm run format:check` (y `npm run format` para arreglarlo) |

El CI corre todo eso en cada pull request. El repositorio se formatea con Prettier; activá el hook una vez por clon:

```bash
git config core.hooksPath .githooks
```

## Más documentación

- [`docs/historias-de-usuario.md`](docs/historias-de-usuario.md): las historias del catálogo que cubre el panel.
- [`admin`](https://github.com/discordia-grupo01/admin): la API que usa el panel, con la forma de dar de alta al staff.
- [`client-shared`](https://github.com/discordia-grupo01/client-shared): los tipos, textos y funciones compartidos.
