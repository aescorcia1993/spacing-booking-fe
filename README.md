# 🎨 SpaceBooking Frontend

Aplicación web moderna para la gestión de reservas de espacios corporativos, construida con Angular 19 y PrimeNG.

## 📋 Tabla de Contenidos
- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Características](#características)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Rutas de la Aplicación](#rutas-de-la-aplicación)
- [Estado de la Aplicación (NgRx)](#estado-de-la-aplicación-ngrx)
- [Componentes Principales](#componentes-principales)
- [Integración con Backend](#integración-con-backend)
- [Deployment](#deployment)

## 🎯 Descripción

Interfaz de usuario moderna y responsiva para el sistema SpaceBooking. Permite a los usuarios navegar espacios disponibles, realizar reservas, gestionar sus reservas existentes, y a los administradores gestionar la plataforma completa.

## 🛠 Tecnologías

- **Framework:** Angular 19 (Standalone Components)
- **UI Library:** PrimeNG 19.1.4
- **State Management:** NgRx 19
- **Reactive Programming:** RxJS
- **Routing:** Angular Router
- **HTTP Client:** Angular HttpClient
- **Forms:** Reactive Forms + Template-driven Forms
- **Icons:** PrimeIcons
- **Styling:** SCSS + PrimeNG Themes
- **Build Tool:** Angular CLI + esbuild
- **Deployment:** Azure Static Web Apps

## ✨ Características

### Para Usuarios
- ✅ **Exploración de Espacios:** Navegación visual con filtros y búsqueda
- ✅ **Reservas Inteligentes:** Verificación de disponibilidad en tiempo real
- ✅ **Gestión de Reservas:** Visualización de reservas próximas, activas y pasadas
- ✅ **Edición de Reservas:** Modificación de reservas pendientes/confirmadas
- ✅ **Cancelación Flexible:** Cancelar reservas con confirmación
- ✅ **Calendario Visual:** Vista de calendario para cada espacio
- ✅ **Responsive Design:** Adaptado a móviles, tablets y desktop

### Para Administradores
- ✅ **Panel de Administración:** Dashboard completo de espacios
- ✅ **CRUD de Espacios:** Crear, editar y eliminar espacios
- ✅ **Gestión de Aprobaciones:** Configurar espacios que requieren aprobación
- ✅ **Vista de Todas las Reservas:** Monitoreo completo del sistema
- ✅ **Estadísticas:** Métricas de uso y ocupación

## 🚀 Instalación

### Prerrequisitos
```bash
- Node.js >= 18.x
- npm >= 9.x
- Angular CLI 19
```

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd spacing-booking-fe
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-backend.azurewebsites.net/api'
};
```

4. **Iniciar servidor de desarrollo**
```bash
npm start
# o
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

5. **Compilar para producción**
```bash
npm run build
# Output en dist/
```

## 📁 Estructura del Proyecto

```
spacing-booking-fe/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes compartidos
│   │   │   └── navbar/          # Barra de navegación
│   │   ├── features/            # Módulos de funcionalidades
│   │   │   ├── auth/            # Autenticación (login/register)
│   │   │   ├── bookings/        # Gestión de reservas
│   │   │   │   ├── booking-form/
│   │   │   │   ├── bookings-list/
│   │   │   │   └── store/       # NgRx state para bookings
│   │   │   └── spaces/          # Gestión de espacios
│   │   │       ├── space-calendar/
│   │   │       ├── space-detail/
│   │   │       ├── spaces-admin/
│   │   │       ├── spaces-list/
│   │   │       └── store/       # NgRx state para spaces
│   │   ├── models/              # Interfaces TypeScript
│   │   ├── services/            # Servicios HTTP
│   │   ├── guards/              # Route Guards
│   │   ├── interceptors/        # HTTP Interceptors
│   │   └── shared/              # Componentes compartidos
│   │       └── components/
│   │           └── mc-table-demo/
│   ├── assets/                  # Imágenes, iconos, etc.
│   ├── environments/            # Configuraciones de entorno
│   └── styles/                  # Estilos globales SCSS
├── local-packages/              # Paquetes personalizados
│   ├── mckit-core/              # Utilidades core
│   └── mckit-table/             # Componente de tabla
├── angular.json                 # Configuración de Angular
├── package.json
└── README.md
```

## 🗺 Rutas de la Aplicación

```typescript
/                           → Home (redirect a /spaces)
/login                      → Página de login
/register                   → Página de registro

# Rutas Públicas
/spaces                     → Lista de espacios disponibles
/spaces/:id                 → Detalle de un espacio
/spaces/:id/calendar        → Calendario del espacio

# Rutas Protegidas (requieren autenticación)
/bookings                   → Mis reservas
/bookings/new               → Crear nueva reserva

# Rutas de Administrador
/admin/spaces               → Gestión de espacios (admin)
/admin/spaces/new           → Crear nuevo espacio
/admin/spaces/:id/edit      → Editar espacio

# Rutas de Demostración
/demo/mc-table              → Demo del componente MC Table
```

## 🗃 Estado de la Aplicación (NgRx)

### Auth Store
```typescript
State:
- user: User | null
- token: string | null
- isAuthenticated: boolean
- loading: boolean

Actions:
- login(credentials)
- loginSuccess(user, token)
- loginFailure(error)
- logout()
- register(userData)
```

### Bookings Store
```typescript
State:
- bookings: Booking[]
- selectedBooking: Booking | null
- loading: boolean
- error: string | null

Actions:
- loadMyBookings()
- loadMyBookingsSuccess(bookings)
- createBooking(booking)
- updateBooking(id, booking)
- cancelBooking(id)
- deleteBooking(id)

Selectors:
- selectAllBookings
- selectUpcomingBookings
- selectActiveBookings
- selectPastBookings
- selectLoading
```

### Spaces Store
```typescript
State:
- spaces: Space[]
- selectedSpace: Space | null
- types: SpaceType[]
- loading: boolean
- error: string | null

Actions:
- loadSpaces()
- loadSpacesSuccess(spaces)
- loadSpaceDetail(id)
- loadSpaceTypes()
- checkAvailability(spaceId, dateTime)

Selectors:
- selectAllSpaces
- selectSpaceById(id)
- selectActiveSpaces
- selectSpaceTypes
```

## 🧩 Componentes Principales

### SpacesList Component
- **Ruta:** `/spaces`
- **Descripción:** Catálogo de espacios con filtros y búsqueda
- **Features:**
  - Grid responsivo de cards de espacios
  - Filtros por tipo de espacio
  - Búsqueda por nombre
  - Paginación
  - Indicadores de capacidad y disponibilidad

### SpaceDetail Component
- **Ruta:** `/spaces/:id`
- **Descripción:** Información detallada del espacio
- **Features:**
  - Galería de imágenes
  - Especificaciones técnicas
  - Botón de reserva rápida
  - Link al calendario

### BookingForm Component
- **Ruta:** `/bookings/new`
- **Descripción:** Formulario de creación de reservas
- **Features:**
  - Selección de espacio
  - Date/time pickers
  - Validación de disponibilidad en tiempo real
  - Cálculo automático de duración
  - Validaciones de negocio

### BookingsList Component
- **Ruta:** `/bookings`
- **Descripción:** Gestión de mis reservas
- **Features:**
  - Tabs: Próximas / Activas / Pasadas
  - Paginación server-side (10, 25, 50, 100 items)
  - Filtros por tipo (upcoming, active, past)
  - Acciones: Editar, Cancelar
  - Modal de edición integrado
  - Estados visuales con tags de color
  - Carga paralela de datos con forkJoin

### SpacesAdmin Component
- **Ruta:** `/admin/spaces`
- **Descripción:** Panel de administración de espacios
- **Features:**
  - CRUD completo de espacios
  - Upload de imágenes
  - Toggle de activación
  - Configuración de aprobación requerida

### Navbar Component
- **Descripción:** Barra de navegación global
- **Features:**
  - Links dinámicos según rol
  - Indicador de usuario autenticado
  - Logout
  - Responsive menu móvil

## 🔌 Integración con Backend

### HTTP Interceptors

**AuthInterceptor**
```typescript
- Agrega token de autenticación a todas las peticiones
- Header: Authorization: Bearer {token}
```

**ErrorInterceptor**
```typescript
- Maneja errores HTTP globalmente
- Redirige a login en 401 Unauthorized
- Muestra mensajes de error
```

### Servicios HTTP

**AuthService**
```typescript
login(credentials)  → Observable<{user, token}>
register(userData)  → Observable<{user, token}>
logout()           → Observable<void>
getCurrentUser()   → Observable<User>
```

**BookingService**
```typescript
getMyBookings(filters?) → Observable<PaginatedResponse<Booking>>
  filters: { type?, page?, per_page? }
  
createBooking(data)     → Observable<Booking>
updateBooking(id, data) → Observable<Booking>
cancelBooking(id)       → Observable<void>
deleteBooking(id)       → Observable<void>
```

**SpaceService**
```typescript
getSpaces()                  → Observable<Space[]>
getSpaceById(id)             → Observable<Space>
getSpaceTypes()              → Observable<SpaceType[]>
checkAvailability(id, data)  → Observable<AvailabilityResponse>
getSpaceBookings(id)         → Observable<Booking[]>
```

### Modelos de Datos

**User**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}
```

**Space**
```typescript
interface Space {
  id: number;
  name: string;
  description: string;
  type: string;
  capacity: number;
  image_url: string;
  is_active: boolean;
  requires_approval: boolean;
}
```

**Booking**
```typescript
interface Booking {
  id: number;
  user_id: number;
  space_id: number;
  space?: Space;
  booking_date: string;
  start_time: string;
  end_time: string;
  event_name: string;
  purpose?: string;
  attendees: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}
```

**PaginatedResponse**
```typescript
interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}
```

## 🎨 Theming

La aplicación utiliza el theme **Aura Blue Light** de PrimeNG con customizaciones:

```scss
// Colores principales
$primary: #74ACDF;    // Azul corporativo
$success: #10b981;    // Verde
$warning: #f59e0b;    // Amarillo
$danger: #ef4444;     // Rojo

// Estados de reserva
.status-pending   → Amarillo
.status-confirmed → Verde
.status-active    → Azul
.status-cancelled → Rojo
.status-completed → Gris
```

## 📦 Paquetes Personalizados

### @mckit/core
- Interfaces y tipos compartidos
- Utilidades comunes
- MCListResponse interface

### @mckit/table
- Componente de tabla reutilizable
- Paginación integrada
- Templates personalizables
- Eventos de página

## 🚀 Deployment en Azure Static Web Apps

### Build Configuration

```json
{
  "app_location": "/",
  "api_location": "",
  "output_location": "dist/frontend/browser",
  "app_build_command": "npm run build",
  "skip_app_build": false
}
```

### Deploy con Azure CLI

```bash
# Login
az login

# Crear Static Web App
az staticwebapp create \
  --name spacebooking-frontend \
  --resource-group spacebooking-rg \
  --location eastus \
  --source https://github.com/yourrepo \
  --branch main \
  --app-location "/" \
  --output-location "dist/frontend/browser"

# Deploy manual
az staticwebapp deploy \
  --name spacebooking-frontend \
  --resource-group spacebooking-rg \
  --source-path ./dist/frontend/browser
```

### Environment Variables en Azure

```bash
BACKEND_API_URL=https://your-backend.azurewebsites.net/api
```

## 🧪 Testing

```bash
# Unit tests
ng test

# E2E tests
ng e2e

# Coverage
ng test --code-coverage
```

## 📝 Scripts disponibles

```bash
npm start          # Desarrollo (ng serve)
npm run build      # Build de producción
npm test           # Ejecutar tests
npm run lint       # Lint del código
npm run format     # Formatear código
```

## 🔒 Seguridad

- ✅ Route Guards para proteger rutas
- ✅ Token almacenado en localStorage
- ✅ Auto-logout en token expirado
- ✅ Sanitización de HTML
- ✅ CORS configurado
- ✅ HTTPS en producción

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Copyright (c) 2026 SpaceBooking. All Rights Reserved.

Este proyecto es **propietario y confidencial**. Todos los derechos reservados.

---

**Backend API:** [https://your-backend.azurewebsites.net/api](https://your-backend.azurewebsites.net/api)
**Documentación:** [https://your-backend.azurewebsites.net/api/documentation](https://your-backend.azurewebsites.net/api/documentation)
