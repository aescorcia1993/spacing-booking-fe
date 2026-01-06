import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';

// Store
import * as SpacesActions from '../../spaces/store/spaces.actions';
import * as fromSpaces from '../../spaces/store/spaces.selectors';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/booking.model';

@Component({
  selector: 'app-space-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    Select,
    SkeletonModule,
    TagModule,
    TableModule,
  ],
  template: `
    <div class="calendar-container">
      <div class="header">
        <div>
          <h1>Calendario de Reservas</h1>
          <p class="subtitle">Visualiza los horarios reservados de los espacios</p>
        </div>
        <p-button
          label="Volver"
          icon="pi pi-arrow-left"
          [text]="true"
          (onClick)="goBack()"
        />
      </div>

      <div class="filters-section">
        <p-card>
          <div class="filter-content">
            <div class="filter-field">
              <label for="space">Selecciona un espacio</label>
              <p-select
                id="space"
                [(ngModel)]="selectedSpaceId"
                [options]="spaceOptions()"
                (onChange)="onSpaceChange()"
                placeholder="Todos los espacios"
                [showClear]="true"
                styleClass="w-full"
              />
            </div>
            
            @if (selectedSpace()) {
              <div class="space-info">
                <div class="info-item">
                  <i class="pi pi-building"></i>
                  <span>{{ selectedSpace()!.name }}</span>
                </div>
                <div class="info-item">
                  <i class="pi pi-users"></i>
                  <span>Capacidad: {{ selectedSpace()!.capacity }} personas</span>
                </div>
                <div class="info-item">
                  <i class="pi pi-tag"></i>
                  <p-tag [value]="selectedSpace()!.type" />
                </div>
              </div>
            }
          </div>
        </p-card>
      </div>

      @if (loading()) {
        <p-card>
          <div class="loading-container">
            <p-skeleton width="100%" height="400px" />
          </div>
        </p-card>
      }

      @if (!loading() && bookings().length > 0) {
        <p-card styleClass="bookings-card">
          <p-table
            [value]="bookings()"
            [paginator]="true"
            [rows]="10"
            [tableStyle]="{ 'min-width': '50rem' }"
            [rowsPerPageOptions]="[10, 25, 50]"
            [globalFilterFields]="['event_name', 'status']"
            responsiveLayout="scroll"
          >
            <ng-template pTemplate="header">
              <tr>
                @if (!selectedSpaceId) {
                  <th pSortableColumn="space.name">
                    Espacio
                    <p-sortIcon field="space.name" />
                  </th>
                }
                <th pSortableColumn="event_name">
                  Evento
                  <p-sortIcon field="event_name" />
                </th>
                <th pSortableColumn="start_time">
                  Inicio
                  <p-sortIcon field="start_time" />
                </th>
                <th pSortableColumn="end_time">
                  Fin
                  <p-sortIcon field="end_time" />
                </th>
                <th pSortableColumn="status">
                  Estado
                  <p-sortIcon field="status" />
                </th>
                <th>Duración</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-booking>
              <tr>
                @if (!selectedSpaceId) {
                  <td>
                    <strong>{{ booking.space?.name || 'N/A' }}</strong>
                    <br>
                    <small class="text-muted">
                      <i class="pi pi-users" style="font-size: 0.75rem;"></i>
                      {{ booking.space?.capacity || 0 }} personas
                    </small>
                  </td>
                }
                <td>
                  <strong>{{ booking.event_name }}</strong>
                  @if (booking.notes) {
                    <br>
                    <small class="text-muted">{{ booking.notes }}</small>
                  }
                </td>
                <td>{{ formatDateTime(booking.start_datetime) }}</td>
                <td>{{ formatDateTime(booking.end_datetime) }}</td>
                <td>
                  <p-tag
                    [value]="getStatusLabel(booking.computed_status || booking.status)"
                    [severity]="getStatusSeverity(booking.computed_status || booking.status)"
                  />
                </td>
                <td>{{ formatDuration(booking.duration_minutes) }}</td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="5" class="text-center">
                  No hay reservas para mostrar
                </td>
              </tr>
            </ng-template>
          </p-table>
        </p-card>
      }

      @if (!loading() && bookings().length === 0 && selectedSpaceId) {
        <p-card>
          <div class="empty-state">
            <i class="pi pi-calendar" style="font-size: 3rem; color: #ccc;"></i>
            <h3>No hay reservas</h3>
            <p>No se encontraron reservas para este espacio en el período seleccionado</p>
          </div>
        </p-card>
      }

      @if (!loading() && bookings().length === 0 && !selectedSpaceId) {
        <p-card>
          <div class="empty-state">
            <i class="pi pi-calendar" style="font-size: 3rem; color: #ccc;"></i>
            <h3>No hay reservas</h3>
            <p>No se encontraron reservas en el sistema</p>
          </div>
        </p-card>
      }

      <div class="legend-section">
        <p-card>
          <h3>Estados de Reserva</h3>
          <div class="legend-items">
            <div class="legend-item">
              <p-tag value="Confirmada" severity="success" />
              <span>La reserva está confirmada y activa</span>
            </div>
            <div class="legend-item">
              <p-tag value="Pendiente" severity="warn" />
              <span>Esperando confirmación</span>
            </div>
            <div class="legend-item">
              <p-tag value="Cancelada" severity="danger" />
              <span>Reserva cancelada</span>
            </div>
            <div class="legend-item">
              <p-tag value="Completada" severity="info" />
              <span>Evento finalizado</span>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .calendar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 2rem;
    }

    .header h1 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: 1.1rem;
      color: #6c757d;
    }

    .filters-section {
      margin-bottom: 2rem;
    }

    .filter-content {
      display: flex;
      gap: 2rem;
      align-items: start;
    }

    .filter-field {
      flex: 1;
      max-width: 400px;
    }

    .filter-field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #495057;
    }

    .space-info {
      display: flex;
      gap: 2rem;
      align-items: center;
      flex: 1;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .info-item i {
      color: #667eea;
    }

    .info-item span {
      font-weight: 500;
      color: #495057;
    }

    .loading-container {
      padding: 2rem;
    }

    .text-muted {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .text-center {
      text-align: center;
      padding: 2rem;
      color: #6c757d;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
    }

    .empty-state h3 {
      margin-top: 1rem;
      color: #2c3e50;
    }

    .empty-state p {
      color: #6c757d;
      margin-top: 0.5rem;
    }

    :host ::ng-deep .bookings-card {
      .p-datatable {
        .p-datatable-thead > tr > th {
          background: #f8f9fa;
          color: #495057;
          font-weight: 600;
        }

        .p-datatable-tbody > tr > td {
          padding: 1rem;
        }

        .p-datatable-tbody > tr:hover {
          background: #f8f9fa;
        }
      }
      
      // Estilos para los tags de estado
      .p-tag {
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.875rem;
        
        &.p-tag-success {
          background-color: #22c55e;
          color: white;
        }
        
        &.p-tag-warn {
          background-color: #f59e0b;
          color: white;
        }
        
        &.p-tag-danger {
          background-color: #ef4444;
          color: white;
        }
        
        &.p-tag-info {
          background-color: #3b82f6;
          color: white;
        }
        
        &.p-tag-secondary {
          background-color: #6b7280;
          color: white;
        }
      }
    }

    :host ::ng-deep .legend-section {
      .p-tag {
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-weight: 600;
        font-size: 0.875rem;
        
        &.p-tag-success {
          background-color: #22c55e !important;
          color: white !important;
        }
        
        &.p-tag-warn {
          background-color: #f59e0b !important;
          color: white !important;
        }
        
        &.p-tag-danger {
          background-color: #ef4444 !important;
          color: white !important;
        }
        
        &.p-tag-info {
          background-color: #3b82f6 !important;
          color: white !important;
        }
        
        &.p-tag-secondary {
          background-color: #6b7280 !important;
          color: white !important;
        }
      }
    }

    .legend-section {
      margin-top: 2rem;
    }

    .legend-section h3 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
      font-size: 1.2rem;
    }

    .legend-items {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .legend-item span {
      color: #495057;
    }

    @media (max-width: 1024px) {
      .filter-content {
        flex-direction: column;
      }

      .space-info {
        flex-wrap: wrap;
      }
    }

    @media (max-width: 768px) {
      .calendar-container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
      }

      .header h1 {
        font-size: 2rem;
      }

      .legend-items {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SpaceCalendarComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private bookingService = inject(BookingService);

  spaces = toSignal(this.store.select(fromSpaces.selectActiveSpaces), { initialValue: [] });
  loading = signal(false);
  
  selectedSpaceId: number | null = null;
  selectedSpace = signal<any>(null);
  bookings = signal<Booking[]>([]);

  spaceOptions = toSignal(
    this.store.select(fromSpaces.selectActiveSpaces).pipe(
      map(spaces => spaces.map(s => ({ label: s.name, value: s.id })))
    ),
    { initialValue: [] }
  );

  ngOnInit() {
    // Cargar espacios
    this.store.dispatch(SpacesActions.loadSpaces({}));

    // Si hay ID en la ruta, cargar ese espacio
    const spaceId = this.route.snapshot.queryParamMap.get('spaceId');
    if (spaceId) {
      this.selectedSpaceId = +spaceId;
      this.onSpaceChange();
    } else {
      // Si no hay espacio seleccionado, cargar TODAS las reservas
      this.loadAllBookings();
    }
  }

  onSpaceChange() {
    if (!this.selectedSpaceId) {
      // Si deselecciona el espacio, mostrar todas las reservas
      this.selectedSpace.set(null);
      this.loadAllBookings();
      return;
    }

    // Encontrar espacio seleccionado
    const space = this.spaces().find(s => s.id === this.selectedSpaceId);
    this.selectedSpace.set(space || null);

    // Cargar reservas del espacio
    this.loadSpaceBookings(this.selectedSpaceId);
  }

  loadAllBookings() {
    this.loading.set(true);
    
    // Obtener rango de 30 días hacia adelante y 30 atrás
    const now = new Date();
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const endDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    this.bookingService.getAllBookings(
      this.formatDate(startDate),
      this.formatDate(endDate)
    ).subscribe({
      next: (bookings) => {
        this.bookings.set(bookings.sort((a, b) => 
          new Date(b.start_datetime || b.start_time).getTime() - new Date(a.start_datetime || a.start_time).getTime()
        ));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading all bookings:', error);
        this.bookings.set([]);
        this.loading.set(false);
      }
    });
  }

  loadSpaceBookings(spaceId: number) {
    this.loading.set(true);
    
    // Obtener rango de 30 días hacia adelante y 30 atrás
    const now = new Date();
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const endDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

    this.bookingService.getSpaceBookings(
      spaceId,
      this.formatDate(startDate),
      this.formatDate(endDate)
    ).subscribe({
      next: (bookings) => {
        this.bookings.set(bookings.sort((a, b) => 
          new Date(b.start_datetime || b.start_time).getTime() - new Date(a.start_datetime || a.start_time).getTime()
        ));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.bookings.set([]);
        this.loading.set(false);
      }
    });
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateDuration(start: string, end: string): string {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }

  formatDuration(minutes: number): string {
    if (!minutes || isNaN(minutes)) {
      return '0m';
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      confirmed: 'Confirmada',
      pending: 'Pendiente',
      cancelled: 'Cancelada',
      completed: 'Completada'
    };
    return labels[status?.toLowerCase()] || status;
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    const normalizedStatus = status?.toLowerCase();
    const severities: Record<string, 'success' | 'warn' | 'danger' | 'secondary' | 'info'> = {
      confirmed: 'success',
      pending: 'warn',
      cancelled: 'danger',
      completed: 'info'
    };
    return severities[normalizedStatus];
  }

  goBack() {
    this.router.navigate(['/spaces']);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
