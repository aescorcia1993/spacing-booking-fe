import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

// Custom Components
import { McPaginatorComponent, PageChangeEvent } from '../../../shared/components/mc-paginator/mc-paginator.component';

// Store
import * as SpacesActions from '../store/spaces.actions';
import * as fromSpaces from '../store/spaces.selectors';
import { SpaceType } from '../../../models/booking.model';

@Component({
  selector: 'app-spaces-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    Select,
    DatePicker,
    InputNumberModule,
    DataViewModule,
    TagModule,
    SkeletonModule,
    McPaginatorComponent,
  ],
  template: `
    <div class="spaces-list-container">
      <div class="header">
        <h1>Espacios Disponibles</h1>
        <p class="subtitle">Encuentra el espacio perfecto para tu evento</p>
      </div>

      <!-- Filtros -->
      <p-card styleClass="filters-card">
        <div class="filters-grid">
          <div class="filter-field">
            <label for="search">Buscar</label>
            <input
              pInputText
              id="search"
              [(ngModel)]="filters.search"
              (ngModelChange)="onSearchChange()"
              placeholder="Nombre del espacio..."
              class="w-full"
            />
          </div>

          <div class="filter-field">
            <label for="type">Tipo de Espacio</label>
            <p-select
              id="type"
              [(ngModel)]="filters.type"
              [options]="spaceTypes"
              (onChange)="onFilterChange()"
              placeholder="Todos los tipos"
              [showClear]="true"
              styleClass="w-full"
            />
          </div>

          <div class="filter-field">
            <label for="capacity">Capacidad Mínima</label>
            <p-inputNumber
              id="capacity"
              [(ngModel)]="filters.capacity"
              (ngModelChange)="onFilterChange()"
              [showButtons]="true"
              [min]="0"
              placeholder="Personas"
              styleClass="w-full"
            />
          </div>

          <div class="filter-field">
            <label for="date">Fecha</label>
            <p-datepicker
              id="date"
              [(ngModel)]="filters.date"
              (onSelect)="onFilterChange()"
              [showIcon]="true"
              placeholder="Selecciona una fecha"
              dateFormat="yy-mm-dd"
              styleClass="w-full"
            />
          </div>
        </div>
      </p-card>

      <!-- Loading State -->
      @if (loading()) {
        <div class="loading-container">
          <div class="spinner-wrapper">
            <i class="pi pi-spin pi-spinner loading-spinner"></i>
            <p>Cargando espacios disponibles...</p>
          </div>
        </div>
      }

      <!-- Spaces Grid -->
      @if (!loading() && spaces().length > 0) {
        <div class="spaces-grid">
          @for (space of spaces(); track space.id) {
            <p-card styleClass="space-card">
              <div class="space-image">
                @if (space.photos && space.photos.length > 0) {
                  <img [src]="space.photos[0]" [alt]="space.name" />
                } @else {
                  <div class="no-image">
                    <i class="pi pi-image"></i>
                  </div>
                }
              </div>
              
              <div class="space-content">
                <div class="space-header">
                  <h3>{{ space.name }}</h3>
                  <p-tag [value]="space.type" [severity]="getTypeSeverity(space.type)" />
                </div>
                
                <p class="space-description">{{ space.description }}</p>
                
                <div class="space-details">
                  <div class="detail">
                    <i class="pi pi-users"></i>
                    <span>{{ space.capacity }} personas</span>
                  </div>
                  @if (space.available_hours) {
                    <div class="detail">
                      <i class="pi pi-clock"></i>
                      <span>{{ space.available_hours['start'] }} - {{ space.available_hours['end'] }}</span>
                    </div>
                  }
                </div>
                
                <div class="space-actions">
                  <p-button
                    label="Ver Detalles"
                    icon="pi pi-eye"
                    [outlined]="true"
                    (onClick)="viewSpace(space.id)"
                    styleClass="w-full"
                  />
                </div>
              </div>
            </p-card>
          }
        </div>

        <!-- Pagination -->
        <mc-paginator 
          [pagination]="pagination()"
          (pageChange)="onPageChange($event)"
        />
      }

      <!-- Empty State -->
      @if (!loading() && spaces().length === 0) {
        <p-card styleClass="empty-state">
          <div class="empty-content">
            <i class="pi pi-inbox"></i>
            <h3>No se encontraron espacios</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        </p-card>
      }
    </div>
  `,
  styles: [`
    .spaces-list-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      padding-top: 1rem;
      background: #f5f5f5;
      min-height: calc(100vh - 80px);
    }

    .header {
      margin-bottom: 2rem;
      text-align: center;
      padding-top: 1rem;
    }

    .header h1 {
      font-size: 2rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .subtitle {
      font-size: 1rem;
      color: #6c757d;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
      margin: 2rem 0;
    }

    .spinner-wrapper {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }

    .loading-spinner {
      font-size: 3rem;
      color: #74ACDF;
      margin-bottom: 1rem;
      display: block;
    }

    .spinner-wrapper p {
      color: #6c757d;
      font-size: 1rem;
      margin: 0;
    }

    :host ::ng-deep .filters-card {
      margin-bottom: 2rem;
      background: white !important;
      border: 1px solid #e0e0e0 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
    }

    :host ::ng-deep .filters-card .p-card-body {
      padding: 1.25rem !important;
    }

    .filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
      align-items: end;
    }

    .filter-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      position: relative;
    }

    .filter-field label {
      display: block;
      margin-bottom: 0;
      font-weight: 600;
      font-size: 0.875rem;
      color: #495057;
      line-height: 1.2;
    }

    /* Hacer inputs más compactos y uniformes */
    :host ::ng-deep .filter-field .p-inputtext {
      padding: 0.5rem 0.75rem !important;
      font-size: 0.875rem !important;
      height: 2.5rem !important;
      border-radius: 6px !important;
    }

    :host ::ng-deep .filter-field .p-select {
      height: 2.5rem !important;
      border-radius: 6px !important;
    }

    :host ::ng-deep .filter-field .p-select .p-select-label {
      padding: 0.5rem 0.75rem !important;
      font-size: 0.875rem !important;
      display: flex !important;
      align-items: center !important;
    }

    :host ::ng-deep .filter-field .p-select .p-select-dropdown {
      width: 2.5rem !important;
    }

    :host ::ng-deep .filter-field .p-inputnumber {
      height: 2.5rem !important;
    }

    :host ::ng-deep .filter-field .p-inputnumber .p-inputnumber-input {
      padding: 0.5rem 0.75rem !important;
      font-size: 0.875rem !important;
      height: 2.5rem !important;
      border-radius: 6px !important;
    }

    :host ::ng-deep .filter-field .p-inputnumber-button {
      width: 2rem !important;
      border-radius: 0 !important;
    }

    :host ::ng-deep .filter-field .p-inputnumber-button:first-of-type {
      border-top-left-radius: 6px !important;
      border-bottom-left-radius: 6px !important;
    }

    :host ::ng-deep .filter-field .p-inputnumber-button:last-of-type {
      border-top-right-radius: 6px !important;
      border-bottom-right-radius: 6px !important;
    }

    :host ::ng-deep .filter-field .p-datepicker {
      display: flex !important;
      width: 100% !important;
    }

    :host ::ng-deep .filter-field .p-datepicker-input-icon-container {
      height: 2.5rem !important;
      display: flex !important;
      align-items: center !important;
      right: 0.5rem !important;
    }

    :host ::ng-deep .filter-field .p-datepicker .p-inputtext {
      padding: 0.5rem 2.5rem 0.5rem 0.75rem !important;
      font-size: 0.875rem !important;
      height: 2.5rem !important;
      width: 100% !important;
    }

    :host ::ng-deep .filter-field .p-datepicker .p-icon {
      font-size: 1rem !important;
      color: #6c757d !important;
    }

    .spaces-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
    }

    :host ::ng-deep .space-card {
      height: 100%;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      background: white !important;
      border: 1px solid #e0e0e0 !important;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1) !important;
      position: relative;
      z-index: 1;
    }

    :host ::ng-deep .space-card .p-card-body {
      padding: 1.5rem !important;
    }

    :host ::ng-deep .space-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
      border-color: #74ACDF !important;
      z-index: 2;
    }

    .space-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .space-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #74ACDF 0%, #0033A0 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .no-image i {
      font-size: 4rem;
      color: white;
      opacity: 0.5;
    }

    .space-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .space-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      gap: 1rem;
    }

    .space-header h3 {
      margin: 0;
      font-size: 1.25rem;
      color: #2c3e50;
      flex: 1;
      font-weight: 600;
    }

    .space-description {
      color: #6c757d;
      line-height: 1.5;
      margin: 0;
      font-size: 0.875rem;
    }

    .space-details {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .detail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #495057;
      font-size: 0.875rem;
    }

    .detail i {
      color: #74ACDF;
    }

    .space-actions {
      margin-top: auto;
    }

    :host ::ng-deep .space-actions .p-button {
      padding: 0.5rem 1rem !important;
      font-size: 0.875rem !important;
      height: auto !important;
    }

    :host ::ng-deep .space-actions .p-button .p-button-icon {
      font-size: 0.875rem !important;
    }

    :host ::ng-deep .empty-state {
      margin-top: 3rem;
      background: white !important;
      border: 1px solid #e0e0e0 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
    }

    :host ::ng-deep .empty-state .p-card-body {
      padding: 3rem !important;
    }

    .empty-content {
      text-align: center;
      padding: 3rem;
    }

    .empty-content i {
      font-size: 4rem;
      color: #6c757d;
      margin-bottom: 1rem;
    }

    .empty-content h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .empty-content p {
      color: #6c757d;
    }

    @media (max-width: 768px) {
      .spaces-list-container {
        padding: 1rem;
      }

      .header h1 {
        font-size: 2rem;
      }

      .filters-grid {
        grid-template-columns: 1fr;
      }

      .spaces-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SpacesListComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private searchSubject = new Subject<string>();

  spaces = toSignal(this.store.select(fromSpaces.selectActiveSpaces), { initialValue: [] });
  loading = toSignal(this.store.select(fromSpaces.selectSpacesLoading), { initialValue: false });
  pagination = toSignal(this.store.select(fromSpaces.selectSpacesPagination), { initialValue: null });

  spaceTypes = [
    { label: 'Sala de Reuniones', value: 'sala-de-reuniones' },
    { label: 'Auditorio', value: 'auditorio' },
    { label: 'Sala de Conferencias', value: 'sala-de-conferencias' },
    { label: 'Aula', value: 'aula' },
    { label: 'Coworking', value: 'coworking' },
  ];

  filters = {
    search: '',
    type: null as string | null,
    capacity: null as number | null,
    date: null as Date | null,
  };

  ngOnInit() {
    // Configurar debounce para el buscador (500ms de espera)
    this.searchSubject.pipe(
      debounceTime(500), // Espera 500ms después de la última tecla
      distinctUntilChanged() // Solo si el valor cambió
    ).subscribe(() => {
      this.loadSpaces(1);
    });

    // Siempre cargar los espacios al entrar a la vista
    this.loadSpaces();
  }

  ngOnDestroy() {
    this.searchSubject.complete();
  }

  loadSpaces(page: number = 1) {
    const filters: any = { page };

    if (this.filters.search) filters.search = this.filters.search;
    if (this.filters.type) filters.type = this.filters.type;
    if (this.filters.capacity) filters.capacity = this.filters.capacity;
    if (this.filters.date) {
      filters.date = this.formatDate(this.filters.date);
    }

    this.store.dispatch(SpacesActions.loadSpaces({ filters }));
  }

  // Método para el buscador (con debounce)
  onSearchChange() {
    this.searchSubject.next(this.filters.search);
  }

  // Método para otros filtros (sin debounce)
  onFilterChange() {
    this.loadSpaces(1);
  }

  onPageChange(event: PageChangeEvent) {
    this.loadSpaces(event.page);
  }

  viewSpace(id: number) {
    this.router.navigate(['/spaces', id]);
  }

  getTypeSeverity(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const severityMap: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      'sala-de-reuniones': 'info',
      'auditorio': 'success',
      'sala-de-conferencias': 'warn',
      'aula': 'secondary',
      'coworking': 'contrast',
    };
    return severityMap[type] || 'secondary';
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
