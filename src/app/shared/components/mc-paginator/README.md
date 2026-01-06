# MC-Paginator Component

Componente de paginación reutilizable y personalizable para toda la aplicación.

## 📦 Ubicación
```
src/app/shared/components/mc-paginator/
```

## 🎯 Características

- ✅ **Reutilizable**: Úsalo en cualquier listado que necesite paginación
- ✅ **Información contextual**: Muestra "Mostrando X-Y de Z resultados"
- ✅ **Navegación completa**: Primera, Anterior, Siguiente, Última página
- ✅ **Números de página**: Navegación directa a páginas específicas
- ✅ **Selector de resultados**: El usuario puede elegir cuántos elementos por página
- ✅ **Responsive**: Se adapta perfectamente a móviles
- ✅ **Estilizado**: Diseño moderno con hover effects
- ✅ **Configurable**: Personaliza colores, opciones y comportamiento

## 📝 Uso Básico

### 1. Importar el componente

```typescript
import { McPaginatorComponent, PageChangeEvent } from '../../../shared/components/mc-paginator/mc-paginator.component';

@Component({
  imports: [McPaginatorComponent],
  // ...
})
```

### 2. Usar en el template

```html
<mc-paginator 
  [pagination]="pagination()"
  (pageChange)="onPageChange($event)"
/>
```

### 3. Manejar el evento de cambio de página

```typescript
onPageChange(event: PageChangeEvent) {
  // event.page = número de página (1-indexed)
  // event.first = índice del primer elemento
  // event.rows = elementos por página
  this.loadData(event.page);
}
```

## 🔧 Propiedades (Inputs)

### `pagination` (requerido)
Objeto con la información de paginación.

```typescript
interface PaginationData {
  total: number;        // Total de elementos
  currentPage: number;  // Página actual (1-indexed)
  perPage: number;      // Elementos por página
  lastPage?: number;    // Última página (opcional)
}
```

**Ejemplo:**
```typescript
pagination = {
  total: 50,
  currentPage: 1,
  perPage: 10,
  lastPage: 5
};
```

### `rowsPerPageOptions` (opcional)
Array de opciones para el selector de elementos por página.

**Default:** `[10, 20, 30, 50]`

**Ejemplo:**
```html
<mc-paginator 
  [pagination]="pagination()"
  [rowsPerPageOptions]="[5, 10, 25, 100]"
  (pageChange)="onPageChange($event)"
/>
```

### `showInfo` (opcional)
Mostrar/ocultar el texto informativo "Mostrando X-Y de Z resultados".

**Default:** `true`

**Ejemplo:**
```html
<mc-paginator 
  [pagination]="pagination()"
  [showInfo]="false"
  (pageChange)="onPageChange($event)"
/>
```

## 📤 Eventos (Outputs)

### `pageChange`
Se emite cuando el usuario cambia de página o modifica los elementos por página.

```typescript
interface PageChangeEvent {
  page: number;   // Número de página (1-indexed)
  first: number;  // Índice del primer elemento (0-indexed)
  rows: number;   // Elementos por página
}
```

**Ejemplo:**
```typescript
onPageChange(event: PageChangeEvent) {
  console.log(`Ir a página ${event.page}`);
  console.log(`Mostrar ${event.rows} elementos`);
  console.log(`Desde el índice ${event.first}`);
}
```

## 🎨 Personalización de Estilos

El componente usa variables CSS que puedes sobrescribir:

```scss
mc-paginator {
  // Color primario (botón activo)
  --mc-paginator-primary-color: #74ACDF;
  
  // Color de hover
  --mc-paginator-hover-color: #f8f9fa;
  
  // Color de texto
  --mc-paginator-text-color: #495057;
  
  // Color de bordes
  --mc-paginator-border-color: #dee2e6;
}
```

## 📱 Comportamiento Responsive

- **Desktop (> 768px)**: Botones de 2.5rem, espaciado completo
- **Mobile (≤ 768px)**: Botones de 2rem, espaciado compacto

## 💡 Ejemplos Avanzados

### Ejemplo 1: Sin información de resultados
```html
<mc-paginator 
  [pagination]="{ total: 100, currentPage: 1, perPage: 20 }"
  [showInfo]="false"
  (pageChange)="loadPage($event.page)"
/>
```

### Ejemplo 2: Opciones personalizadas
```html
<mc-paginator 
  [pagination]="paginationData"
  [rowsPerPageOptions]="[5, 15, 25, 50, 100]"
  (pageChange)="handlePageChange($event)"
/>
```

### Ejemplo 3: Con NgRx Store
```typescript
export class MyListComponent {
  pagination = toSignal(
    this.store.select(selectPagination), 
    { initialValue: null }
  );

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      loadItems({ 
        page: event.page, 
        perPage: event.rows 
      })
    );
  }
}
```

## 🧪 Testing

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { McPaginatorComponent } from './mc-paginator.component';

describe('McPaginatorComponent', () => {
  let component: McPaginatorComponent;
  let fixture: ComponentFixture<McPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [McPaginatorComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(McPaginatorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit page change event', () => {
    const spy = jest.spyOn(component.pageChange, 'emit');
    component.onPageChange({ first: 10, rows: 10, page: 2 });
    expect(spy).toHaveBeenCalled();
  });
});
```

## 📦 Dependencias

- `primeng/paginator`
- `@angular/common`

## 🔄 Actualizaciones Futuras

- [ ] Soporte para carga infinita
- [ ] Animaciones de transición
- [ ] Modo "load more" button
- [ ] Temas personalizables (dark mode)
- [ ] Internacionalización (i18n)

## 📚 Ver También

- [MC-Table Component](./mc-table/README.md)
- [PrimeNG Paginator Documentation](https://primeng.org/paginator)

---

**Creado por:** TOTS Team  
**Última actualización:** Diciembre 2025
