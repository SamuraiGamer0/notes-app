# Notas — App de notas personales (sin autenticación)

CRUD de notas con frontend y backend separados. Sin login ni registro:
pensada para uso personal en local.

## Stack elegido y por qué

| Capa            | Elección                          | Motivo |
|-----------------|------------------------------------|--------|
| Backend         | Node.js + Express                  | Mínima curva de configuración para una API REST pequeña; enorme documentación y soporte en VS Code. |
| Base de datos   | SQLite (`better-sqlite3`)          | Un solo archivo (`notes.db`), sin servidor de base de datos que instalar ni administrar; API síncrona que simplifica el código en un CRUD de este tamaño. Ideal para una app de un solo usuario sin autenticación. |
| Frontend        | React + Vite                       | Recarga instantánea en desarrollo, build de producción optimizado, y el modelo de componentes de React encaja naturalmente con listar/editar/eliminar notas. |
| Comunicación    | `fetch` nativo (sin Axios)          | Evita una dependencia extra; el navegador ya trae todo lo necesario para este alcance. |
| Gestor de deps. | npm                                 | Viene con Node.js, sin pasos adicionales. |

No se listan alternativas porque, dadas las condiciones del proyecto (sin
autenticación, un solo usuario, alcance acotado a CRUD + búsqueda), esta
combinación es la de menor fricción y mayor documentación disponible.

## Estructura

```
notes-app/
├── backend/          # API REST (Express + SQLite)
│   ├── server.js
│   ├── db.js
│   └── routes/notes.js
└── frontend/          # SPA (React + Vite)
    └── src/
        ├── App.jsx
        ├── api.js
        └── components/
```

## Requisitos previos

- Node.js 18 o superior (probado con Node 22) — https://nodejs.org
- npm (incluido con Node.js)
- VS Code

## Extensiones de VS Code recomendadas

- **ESLint** (`dbaeumer.vscode-eslint`) — detecta errores de sintaxis y estilo mientras escribes.
- **Prettier - Code formatter** (`esbenp.prettier-vscode`) — formatea el código automáticamente.
- **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`) — snippets para componentes React.
- **Thunder Client** (`rangav.vscode-thunder-client`) — cliente REST integrado en VS Code para probar los endpoints de la API sin salir del editor.
- **SQLite Viewer** (`qwtel.sqlite-viewer`) — permite abrir e inspeccionar `notes.db` directamente en VS Code.
- **GitLens** (`eamodio.gitlens`) — útil dado el interés en gestión de repositorios GitHub.

## Instalación

Desde la carpeta `notes-app/`:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Ejecución en desarrollo

Se necesitan **dos terminales** (puedes abrir ambas desde el menú *Terminal ›
Split Terminal* de VS Code):

**Terminal 1 — Backend (puerto 4000):**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend (puerto 5173):**
```bash
cd frontend
npm run dev
```

Abre `http://localhost:5173` en el navegador. El frontend redirige
automáticamente las peticiones `/api/...` hacia el backend (configurado en
`frontend/vite.config.js`), por lo que no hay problemas de CORS en
desarrollo.

La base de datos `backend/notes.db` se crea automáticamente en el primer
arranque del backend; no requiere ningún paso manual.

## Build de producción del frontend

```bash
cd frontend
npm run build
npm run preview   # sirve dist/ localmente para verificar el build
```

## Endpoints de la API

| Método | Ruta                        | Descripción                          |
|--------|-----------------------------|---------------------------------------|
| GET    | `/api/notes`                | Lista todas las notas                 |
| GET    | `/api/notes?search=texto`   | Filtra notas cuyo título contiene "texto" |
| GET    | `/api/notes/:id`            | Obtiene una nota por id               |
| POST   | `/api/notes`                | Crea una nota (`{ title, content }`)  |
| PUT    | `/api/notes/:id`            | Edita una nota (`{ title, content }`) |
| DELETE | `/api/notes/:id`            | Elimina una nota                      |

## Requisitos funcionales cubiertos

1. Listado de notas en la página principal (`GET /api/notes`, `NoteList.jsx`).
2. Creación con título y contenido (`NoteFormModal.jsx`, validación de título obligatorio en frontend y backend).
3. Edición de notas existentes (mismo modal, precargado con los datos de la nota).
4. Eliminación con cartel de confirmación (`ConfirmDeleteModal.jsx`: Cancelar / Eliminar).
5. Búsqueda por título con `LIKE` en SQLite, con debounce de 300ms en el frontend.
6. Diseño responsive: grid de notas que pasa a una columna y controles que se apilan en pantallas ≤640px (ver media query en `styles.css`).

## Verificación realizada

Antes de entregar este proyecto se verificó de extremo a extremo:
- Instalación de dependencias en ambos paquetes sin errores.
- Backend: creación, listado, búsqueda, edición y eliminación de notas vía `curl`, incluyendo validación de título vacío (400) y nota inexistente (404).
- Frontend: build de producción con Vite sin errores de compilación, y verificación del proxy `/api` sirviendo datos reales del backend.
