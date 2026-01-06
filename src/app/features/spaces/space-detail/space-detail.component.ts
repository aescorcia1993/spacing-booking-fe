import { Component, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { GalleriaModule } from 'primeng/galleria';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';

// Components
import { SpaceAvailabilityModalComponent } from '../../../shared/components/space-availability-modal/space-availability-modal.component';

// Store
import * as SpacesActions from '../store/spaces.actions';
import * as fromSpaces from '../store/spaces.selectors';
import * as fromAuth from '../../auth/store/auth.selectors';
import { SpaceType } from '../../../models/booking.model';

@Component({
  selector: 'app-space-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule,
    TagModule,
    GalleriaModule,
    SkeletonModule,
    DividerModule,
    SpaceAvailabilityModalComponent,
  ],
  template: `
    <div class="space-detail-container">
      <!-- Back Button -->
      <div class="back-button-container">
        <p-button
          label="Volver a espacios"
          icon="pi pi-arrow-left"
          [text]="true"
          routerLink="/spaces"
        />
      </div>

      <!-- Loading State with Spinner -->
      @if (loading() || !space()) {
      <div class="loading-container">
        <i class="pi pi-spin pi-spinner loading-spinner"></i>
        <p class="loading-text">Cargando espacio...</p>
      </div>
      }

      <!-- Space Detail -->
      @if (!loading() && space()) {
      <div class="space-detail-grid">
        <!-- Main Content -->
        <div class="main-content">
          <p-card>
            <!-- Photos Gallery -->
            @if (space()!.photos && space()!.photos.length > 0) {
            <p-galleria
              [value]="space()!.photos"
              [responsiveOptions]="responsiveOptions"
              [containerStyle]="{ 'max-width': '100%' }"
              [numVisible]="5"
              [circular]="true"
              [showItemNavigators]="true"
              [showThumbnails]="true"
              styleClass="mb-4"
            >
              <ng-template pTemplate="item" let-photo>
                <img [src]="photo" class="gallery-image" [alt]="space()!.name" />
              </ng-template>
              <ng-template pTemplate="thumbnail" let-photo>
                <img [src]="photo" class="gallery-thumbnail" [alt]="space()!.name" />
              </ng-template>
            </p-galleria>
            } @else {
            <div class="no-images">
              <i class="pi pi-image"></i>
              <p>No hay imágenes disponibles</p>
            </div>
            }

            <!-- Space Info -->
            <div class="space-info">
              <div class="space-header">
                <h1>{{ space()!.name }}</h1>
                <p-tag [value]="space()!.type" [severity]="getTypeSeverity(space()!.type)" />
              </div>

              <p class="space-description">{{ space()!.description }}</p>

              <p-divider />

              <div class="space-features">
                <h3>Características</h3>
                <div class="features-grid">
                  <div class="feature-item">
                    <i class="pi pi-users"></i>
                    <div>
                      <span class="feature-label">Capacidad</span>
                      <span class="feature-value">{{ space()!.capacity }} personas</span>
                    </div>
                  </div>

                  @if (space()!.available_hours) {
                  <div class="feature-item">
                    <i class="pi pi-clock"></i>
                    <div>
                      <span class="feature-label">Horario disponible</span>
                      <span class="feature-value">
                        {{ space()!.available_hours['start'] }} -
                        {{ space()!.available_hours['end'] }}
                      </span>
                    </div>
                  </div>
                  }

                  <div class="feature-item">
                    <i class="pi pi-check-circle"></i>
                    <div>
                      <span class="feature-label">Estado</span>
                      <span class="feature-value">
                        {{ space()!.is_active ? 'Disponible' : 'No disponible' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </p-card>
        </div>

        <!-- Sidebar - Booking Action -->
        <div class="sidebar">
          <p-card styleClass="booking-card">
            <h3>Reservar este espacio</h3>
            <p class="booking-info">Selecciona la fecha y hora para hacer tu reserva</p>

            @if (isAuthenticated()) { @if (space()!.is_active) {
            <p-button
              label="Hacer una reserva"
              icon="pi pi-calendar-plus"
              [routerLink]="['/bookings/new', space()!.id]"
              styleClass="w-full booking-button mb-2"
            />
            <p-button
              [style]="{ 'margin-top': '20px' }"
              label="Ver disponibilidad"
              icon="pi pi-eye"
              severity="secondary"
              (onClick)="openAvailabilityModal()"
              styleClass="w-full"
              [outlined]="true"
            />
            } @else {
            <p-button
              label="No disponible"
              icon="pi pi-ban"
              severity="danger"
              [disabled]="true"
              styleClass="w-full"
            />
            } } @else {
            <p class="login-message">
              <i class="pi pi-info-circle"></i>
              Debes iniciar sesión para hacer una reserva
            </p>
            <p-button
              label="Iniciar Sesión"
              icon="pi pi-sign-in"
              routerLink="/login"
              styleClass="w-full"
            />
            }
          </p-card>

          <!-- Additional Info -->
          <p-card styleClass="info-card mt-3" [style]="{ 'margin-top': '20px' }">
            <h4>Información importante</h4>
            <ul class="info-list">
              <li>
                <i class="pi pi-info-circle"></i>
                <span>Las reservas tienen una duración máxima de 8 horas</span>
              </li>
              <li>
                <i class="pi pi-calendar"></i>
                <span>Verifica la disponibilidad antes de reservar</span>
              </li>
              <li>
                <i class="pi pi-ban"></i>
                <span>No se pueden hacer reservas solapadas</span>
              </li>
              <li>
                <i class="pi pi-clock"></i>
                <span>Respeta el horario disponible del espacio</span>
              </li>
            </ul>
          </p-card>
        </div>
      </div>
      }
    </div>

    <!-- Modal de Disponibilidad -->
    <app-space-availability-modal
      [visible]="showAvailabilityModal()"
      [space]="space()"
      (visibleChange)="showAvailabilityModal.set($event)"
    />
  `,
  styles: [
    `
      .space-detail-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
      }

      .back-button-container {
        margin-bottom: 2rem;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        padding: 4rem 2rem;
        background: linear-gradient(
          135deg,
          rgba(116, 172, 223, 0.05) 0%,
          rgba(91, 155, 213, 0.1) 100%
        );
        border-radius: 12px;
        border: 2px dashed rgba(116, 172, 223, 0.3);
      }

      .loading-spinner {
        font-size: 3rem;
        color: #74acdf;
        margin-bottom: 1rem;
      }

      .loading-text {
        font-size: 1.125rem;
        color: #495057;
        font-weight: 500;
        margin: 0;
      }

      .space-detail-grid {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 2rem;
      }

      .gallery-image {
        width: 100%;
        height: 500px;
        object-fit: cover;
        border-radius: 8px;
      }

      .gallery-thumbnail {
        width: 100px;
        height: 60px;
        object-fit: cover;
        cursor: pointer;
        border-radius: 4px;
      }

      .no-images {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        height: 400px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        margin-bottom: 2rem;
      }

      .no-images i {
        font-size: 4rem;
        color: white;
        opacity: 0.5;
        margin-bottom: 1rem;
      }

      .no-images p {
        color: white;
        font-size: 1.2rem;
      }

      .space-info {
        padding: 1rem 0;
      }

      .space-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .space-header h1 {
        margin: 0;
        font-size: 2.5rem;
        color: #2c3e50;
        flex: 1;
      }

      .space-description {
        font-size: 1.1rem;
        line-height: 1.8;
        color: #6c757d;
        margin-bottom: 2rem;
      }

      .space-features h3 {
        margin-bottom: 1.5rem;
        color: #2c3e50;
      }

      .features-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .feature-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
      }

      .feature-item i {
        font-size: 2rem;
        color: #667eea;
      }

      .feature-item > div {
        display: flex;
        flex-direction: column;
      }

      .feature-label {
        font-size: 0.9rem;
        color: #6c757d;
        margin-bottom: 0.25rem;
      }

      .feature-value {
        font-size: 1.1rem;
        font-weight: 600;
        color: #2c3e50;
      }

      .sidebar {
        position: sticky;
        top: 2rem;
        height: fit-content;
      }

      :host ::ng-deep .booking-card,
      :host ::ng-deep .info-card {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        border-radius: 12px !important;
        background: white !important;
      }

      :host ::ng-deep .booking-card .p-card-body,
      :host ::ng-deep .info-card .p-card-body {
        padding: 1.5rem !important;
      }

      .booking-card h3 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
        font-size: 1.25rem;
        font-weight: 700;
      }

      .booking-info {
        color: #6c757d;
        margin-bottom: 1.5rem;
        font-size: 0.875rem;
      }

      :host ::ng-deep .booking-button {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
        border: none !important;
        padding: 0.75rem 1.5rem !important;
        font-size: 1rem !important;
        font-weight: 600 !important;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
        transition: all 0.3s ease !important;
      }

      :host ::ng-deep .booking-button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4) !important;
      }

      /* 🔥 Quitar borde de la galería */
      :host ::ng-deep .p-galleria {
        overflow: hidden !important;
        border-style: solid !important;
        border-width: var(--p-galleria-border-width) !important;
        border-color: var(--p-galleria-border-color) !important;
        border-radius: var(--p-galleria-border-radius) !important;
        border: none !important;
        border-top: none !important;
        border-left: none !important;
        border-right: none !important;
        border-bottom: none !important;
        border-color: transparent !important;
        border-width: 0 !important;
        border-style: none !important;
        outline: none !important;
        box-shadow: none !important;
      }

      .login-message {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: #fef3c7 !important;
        border: 1px solid #fcd34d !important;
        border-left-width: 4px !important;
        border-radius: 8px;
        color: #92400e;
        margin-bottom: 1rem;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .login-message i {
        color: #f59e0b;
        font-size: 1.25rem;
      }

      .info-card h4 {
        margin: 0 0 1rem 0;
        color: #2c3e50;
        font-size: 1rem;
        font-weight: 700;
      }

      .info-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .info-list li {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.875rem;
        margin-bottom: 0.5rem;
        background: #f8f9fa;
        border-radius: 8px;
        transition: all 0.3s ease;
      }

      .info-list li:hover {
        background: rgba(116, 172, 223, 0.1);
        transform: translateX(4px);
      }

      .info-list li:last-child {
        margin-bottom: 0;
      }

      .info-list li span {
        color: #495057;
        line-height: 1.6;
        font-size: 0.875rem;
        flex: 1;
      }

      .info-list i {
        color: #74acdf;
        font-size: 1.125rem;
        flex-shrink: 0;
      }

      .not-found {
        text-align: center;
        padding: 4rem 2rem;
      }

      .not-found i {
        font-size: 5rem;
        color: #e74c3c;
        margin-bottom: 1rem;
      }

      .not-found h2 {
        color: #2c3e50;
        margin-bottom: 0.5rem;
      }

      .not-found p {
        color: #6c757d;
        margin-bottom: 2rem;
      }

      @media (max-width: 1024px) {
        .space-detail-grid {
          grid-template-columns: 1fr;
        }

        .sidebar {
          position: relative;
          top: 0;
        }
      }

      @media (max-width: 768px) {
        .space-detail-container {
          padding: 1rem;
        }

        .space-header h1 {
          font-size: 2rem;
        }

        .gallery-image {
          height: 300px;
        }
      }
    `,
  ],
})
export class SpaceDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);

  // Signal que observa el ID de la ruta
  routeId = toSignal(this.route.paramMap.pipe(map((params) => params.get('id'))));

  space = toSignal(this.store.select(fromSpaces.selectSelectedSpace), { initialValue: null });
  loading = toSignal(this.store.select(fromSpaces.selectSpacesLoading), { initialValue: false });
  isAuthenticated = toSignal(this.store.select(fromAuth.selectIsAuthenticated), {
    initialValue: false,
  });

  // Modal de disponibilidad
  showAvailabilityModal = signal(false);

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  constructor() {
    // 🔥 Effect que detecta cambios en el ID de la ruta y recarga el espacio
    effect(() => {
      const id = this.routeId();
      console.log('🔄 Route ID changed:', id);

      if (id) {
        // Limpiar el espacio anterior primero
        console.log('📤 Clearing previous space');
        this.store.dispatch(SpacesActions.setSelectedSpace({ spaceId: null }));

        // Luego cargar el nuevo espacio
        console.log('📥 Loading new space:', id);
        this.store.dispatch(SpacesActions.loadSpaceById({ id: +id }));

        // Cerrar el modal si estaba abierto
        this.showAvailabilityModal.set(false);
      }
    });
  }

  openAvailabilityModal() {
    this.showAvailabilityModal.set(true);
  }

  getTypeSeverity(type: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const severityMap: Record<
      string,
      'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'
    > = {
      'sala-de-reuniones': 'info',
      auditorio: 'success',
      'sala-de-conferencias': 'warn',
      aula: 'secondary',
      coworking: 'contrast',
    };
    return severityMap[type] || 'secondary';
  }
}
