import { Component, inject, OnInit, Signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

// MC-Kit
import { MCTable, MCTdTemplateDirective } from '@mckit/table';
import { MCColumn, MCListResponse } from '@mckit/core';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabsModule } from 'primeng/tabs';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmationService, MessageService } from 'primeng/api';

// Store
import * as BookingsActions from '../store/bookings.actions';
import * as fromBookings from '../store/bookings.selectors';
import { Booking } from '../../../models/booking.model';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [
    CommonModule,
    MCTable,
    MCTdTemplateDirective,
    CardModule,
    ButtonModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    TabsModule,
    SkeletonModule,
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <p-toast position="top-right" />
    <p-confirmDialog [appendTo]="'body'" [baseZIndex]="10000" />
    
    <div class="bookings-list-container">

      <div class="header">
        <h1>Mis Reservas</h1>
        <p class="subtitle">Gestiona tus reservas de espacios</p>
      </div>

      <p-card>
        <p-tabs [value]="0">
          <p-tablist>
            <p-tab [value]="0">
              <i class="pi pi-calendar-plus tab-icon"></i>
              Próximas
              @if (upcomingBookings().length > 0) {
                <span class="tab-badge">{{ upcomingBookings().length }}</span>
              }
            </p-tab>
            <p-tab [value]="1">
              <i class="pi pi-check-circle tab-icon"></i>
              Activas
              @if (activeBookings().length > 0) {
                <span class="tab-badge">{{ activeBookings().length }}</span>
              }
            </p-tab>
            <p-tab [value]="2">
              <i class="pi pi-history tab-icon"></i>
              Pasadas
              @if (pastBookings().length > 0) {
                <span class="tab-badge">{{ pastBookings().length }}</span>
              }
            </p-tab>
          </p-tablist>
          
          <p-tabpanels>
            <p-tabpanel [value]="0">
              @if (loading()) {
                <div class="skeleton-container">
                  @for (item of [1,2,3]; track item) {
                    <p-skeleton width="100%" height="80px" styleClass="mb-3" />
                  }
                </div>
              } @else if (upcomingBookings().length > 0) {
                <mc-table [columns]="upcomingColumns" [response]="upcomingResponse()">
                  <!-- Template personalizado para evento -->
                  <ng-template mcTdTemplate="event_name" let-booking>
                    <strong>{{ booking.event_name }}</strong>
                    @if (booking.description) {
                      <div class="text-secondary">{{ booking.description }}</div>
                    }
                  </ng-template>

                  <!-- Template personalizado para espacio -->
                  <ng-template mcTdTemplate="space.name" let-booking>
                    <i class="pi pi-building mr-2"></i>
                    {{ booking.space?.name || 'N/A' }}
                  </ng-template>

                  <!-- Template personalizado para fecha inicio -->
                  <ng-template mcTdTemplate="start_time" let-booking>
                    <div class="datetime-cell">
                      <i class="pi pi-calendar"></i>
                      <span>{{ formatDateTime(booking.start_datetime || booking.start_time) }}</span>
                    </div>
                  </ng-template>

                  <!-- Template personalizado para fecha fin -->
                  <ng-template mcTdTemplate="end_time" let-booking>
                    <div class="datetime-cell">
                      <i class="pi pi-clock"></i>
                      <span>{{ formatDateTime(booking.end_datetime || booking.end_time) }}</span>
                    </div>
                  </ng-template>

                  <!-- Template personalizado para estado -->
                  <ng-template mcTdTemplate="status" let-booking>
                    <p-tag
                      [value]="getStatusLabel(booking.status)"
                      [severity]="getStatusSeverity(booking.status)"
                    />
                  </ng-template>

                  <!-- Template personalizado para acciones -->
                  <ng-template mcTdTemplate="actions" let-booking>
                    <div class="actions-cell">
                      <p-button
                        icon="pi pi-ban"
                        [rounded]="true"
                        [outlined]="true"
                        severity="danger"
                        size="small"
                        (onClick)="cancelBooking(booking)"
                      />
                    </div>
                  </ng-template>
                </mc-table>
            } @else {
              <div class="empty-state">
                <i class="pi pi-calendar-plus"></i>
                <h3>No tienes reservas próximas</h3>
                <p>Explora los espacios disponibles y haz tu primera reserva</p>
                <p-button
                  label="Ver espacios disponibles"
                  icon="pi pi-arrow-right"
                  (onClick)="goToSpaces()"
                />
              </div>
            }
            </p-tabpanel>

            <p-tabpanel [value]="1">
              @if (loading()) {
              <div class="skeleton-container">
                @for (item of [1,2,3]; track item) {
                  <p-skeleton width="100%" height="80px" styleClass="mb-3" />
                }
              </div>
            } @else if (activeBookings().length > 0) {
              <mc-table [columns]="activeColumns" [response]="activeResponse()">
                <!-- Template personalizado para evento -->
                <ng-template mcTdTemplate="event_name" let-booking>
                  <strong>{{ booking.event_name }}</strong>
                  @if (booking.description) {
                    <div class="text-secondary">{{ booking.description }}</div>
                  }
                </ng-template>

                <!-- Template personalizado para espacio -->
                <ng-template mcTdTemplate="space.name" let-booking>
                  <i class="pi pi-building mr-2"></i>
                  {{ booking.space?.name || 'N/A' }}
                </ng-template>

                <!-- Template personalizado para fecha inicio -->
                <ng-template mcTdTemplate="start_time" let-booking>
                  <div class="datetime-cell">
                    <i class="pi pi-calendar"></i>
                    <span>{{ formatDateTime(booking.start_datetime || booking.start_time) }}</span>
                  </div>
                </ng-template>

                <!-- Template personalizado para fecha fin -->
                <ng-template mcTdTemplate="end_time" let-booking>
                  <div class="datetime-cell">
                    <i class="pi pi-clock"></i>
                    <span>{{ formatDateTime(booking.end_datetime || booking.end_time) }}</span>
                  </div>
                </ng-template>

                <!-- Template personalizado para estado -->
                <ng-template mcTdTemplate="status" let-booking>
                  <p-tag
                    [value]="getStatusLabel(booking.status)"
                    [severity]="getStatusSeverity(booking.status)"
                  />
                </ng-template>

                <!-- Template personalizado para acciones -->
                <ng-template mcTdTemplate="actions" let-booking>
                  <div class="actions-cell">
                    <p-button
                      icon="pi pi-ban"
                      [rounded]="true"
                      [outlined]="true"
                      severity="danger"
                      size="small"
                      (onClick)="cancelBooking(booking)"
                    />
                  </div>
                </ng-template>
              </mc-table>
            } @else {
              <div class="empty-state">
                <i class="pi pi-calendar"></i>
                <h3>No tienes reservas activas</h3>
                <p>Las reservas activas aparecerán aquí</p>
              </div>
            }
            </p-tabpanel>

            <p-tabpanel [value]="2">
              @if (loading()) {
              <div class="skeleton-container">
                @for (item of [1,2,3]; track item) {
                  <p-skeleton width="100%" height="80px" styleClass="mb-3" />
                }
              </div>
            } @else if (pastBookings().length > 0) {
              <mc-table [columns]="pastColumns" [response]="pastResponse()">
                <!-- Template personalizado para evento -->
                <ng-template mcTdTemplate="event_name" let-booking>
                  <strong>{{ booking.event_name }}</strong>
                  @if (booking.description) {
                    <div class="text-secondary">{{ booking.description }}</div>
                  }
                </ng-template>

                <!-- Template personalizado para espacio -->
                <ng-template mcTdTemplate="space.name" let-booking>
                  <i class="pi pi-building mr-2"></i>
                  {{ booking.space?.name || 'N/A' }}
                </ng-template>

                <!-- Template personalizado para fecha inicio -->
                <ng-template mcTdTemplate="start_time" let-booking>
                  <div class="datetime-cell">
                    <i class="pi pi-calendar"></i>
                    <span>{{ formatDateTime(booking.start_datetime || booking.start_time) }}</span>
                  </div>
                </ng-template>

                <!-- Template personalizado para fecha fin -->
                <ng-template mcTdTemplate="end_time" let-booking>
                  <div class="datetime-cell">
                    <i class="pi pi-clock"></i>
                    <span>{{ formatDateTime(booking.end_datetime || booking.end_time) }}</span>
                  </div>
                </ng-template>

                <!-- Template personalizado para estado -->
                <ng-template mcTdTemplate="status" let-booking>
                  <p-tag
                    [value]="getStatusLabel(booking.status)"
                    [severity]="getStatusSeverity(booking.status)"
                  />
                </ng-template>
              </mc-table>
            } @else {
              <div class="empty-state">
                <i class="pi pi-history"></i>
                <h3>No tienes reservas pasadas</h3>
                <p>El historial de tus reservas aparecerá aquí</p>
              </div>
            }
            </p-tabpanel>
          </p-tabpanels>
        </p-tabs>
      </p-card>

      <!-- Stats Card -->
      <div class="stats-grid">
        <p-card styleClass="stat-card">
          <div class="stat-content">
            <i class="pi pi-calendar-plus stat-icon upcoming"></i>
            <div>
              <div class="stat-value">{{ upcomingBookings().length }}</div>
              <div class="stat-label">Próximas</div>
            </div>
          </div>
        </p-card>

        <p-card styleClass="stat-card">
          <div class="stat-content">
            <i class="pi pi-check-circle stat-icon active"></i>
            <div>
              <div class="stat-value">{{ activeBookings().length }}</div>
              <div class="stat-label">Activas</div>
            </div>
          </div>
        </p-card>

        <p-card styleClass="stat-card">
          <div class="stat-content">
            <i class="pi pi-history stat-icon past"></i>
            <div>
              <div class="stat-value">{{ pastBookings().length }}</div>
              <div class="stat-label">Completadas</div>
            </div>
          </div>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .bookings-list-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      padding-top: 1rem;
      background: #f5f5f5;
      min-height: calc(100vh - 80px);
    }

    .header {
      margin-bottom: 2rem;
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

    :host ::ng-deep .p-card {
      border-radius: 12px !important;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e0e0e0 !important;
      background: white !important;
    }

    :host ::ng-deep .p-card .p-card-body {
      padding: 0 !important;
    }

    :host ::ng-deep .p-datatable {
      border: none !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-wrapper {
      border-radius: 0 0 12px 12px !important;
    }

    :host ::ng-deep .p-tabs {
      background: transparent !important;
    }

    :host ::ng-deep .p-tabpanel {
      padding: 1.5rem 0 !important;
      background: transparent !important;
    }

    .skeleton-container {
      padding: 1rem 0;
    }

    .empty-state {
      text-align: center;
      padding: 3rem 2rem;
      background: #f8f9fa;
      border-radius: 12px;
      margin: 1rem 0;
    }

    .empty-state i {
      font-size: 4rem;
      color: #74ACDF;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .empty-state p {
      color: #6c757d;
      margin-bottom: 2rem;
      font-size: 0.875rem;
    }

    .text-secondary {
      font-size: 0.8125rem;
      color: #6c757d;
      margin-top: 0.25rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }

    :host ::ng-deep .stat-card {
      border-radius: 12px !important;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
      border: 1px solid #e0e0e0 !important;
      transition: all 0.3s ease !important;
      background: white !important;
    }

    :host ::ng-deep .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
      border-color: #74ACDF !important;
    }

    :host ::ng-deep .stat-card .p-card-body {
      padding: 1.5rem !important;
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat-icon {
      font-size: 3rem;
      padding: 1rem;
      border-radius: 12px;
      background: rgba(116, 172, 223, 0.1);
    }

    .stat-icon.upcoming {
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
    }

    .stat-icon.active {
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
    }

    .stat-icon.past {
      color: #6c757d;
      background: rgba(108, 117, 125, 0.1);
    }

    .stat-value {
      font-size: 2.25rem;
      font-weight: 700;
      color: #2c3e50;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6c757d;
      font-weight: 500;
      margin-top: 0.25rem;
    }

    :host ::ng-deep .p-datatable {
      border-radius: 12px !important;
      overflow: hidden !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
      transition: background-color 0.2s ease !important;
      border-bottom: 1px solid #f0f0f0 !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background: #f8f9fa !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 0.875rem 0.75rem !important;
      font-size: 0.875rem !important;
      border-bottom: none !important;
      border-left: none !important;
      border-right: none !important;
      vertical-align: middle !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td:first-child {
      padding-left: 1.25rem !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td:last-child {
      padding-right: 1.25rem !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td strong {
      color: #2c3e50;
      font-weight: 600;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td i {
      color: #74ACDF;
    }

    :host ::ng-deep .p-button {
      padding: 0.5rem 1rem !important;
      font-size: 0.8125rem !important;
      border-radius: 8px !important;
      transition: all 0.2s ease !important;
    }

    :host ::ng-deep .p-tag {
      padding: 0.375rem 0.75rem !important;
      font-size: 0.75rem !important;
      font-weight: 600 !important;
      border-radius: 6px !important;
    }

    /* Estilos mejorados para los tabs */
    :host ::ng-deep .p-tablist,
    :host ::ng-deep .p-tablist-tab-list {
      border: none !important;
      border-top: none !important;
      border-left: none !important;
      border-right: none !important;
      border-bottom: none !important;
      border-color: transparent !important;
      border-width: 0 !important;
      border-style: none !important;
      padding: 0 0.5rem !important;
      background: linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%) !important;
      border-radius: 8px 8px 0 0 !important;
    }

    :host ::ng-deep .p-tab {
      padding: 0.875rem 1.5rem !important;
      margin: 0 0.25rem !important;
      border-radius: 8px 8px 0 0 !important;
      transition: all 0.3s ease !important;
      font-weight: 500 !important;
      color: #6c757d !important;
      border: none !important;
      border-top: none !important;
      border-left: none !important;
      border-right: none !important;
      border-bottom: none !important;
      position: relative !important;
      outline: none !important;
      box-shadow: none !important;
    }

    :host ::ng-deep .p-tab:focus,
    :host ::ng-deep .p-tab:focus-visible {
      outline: none !important;
      box-shadow: none !important;
      border: none !important;
    }

    :host ::ng-deep .p-tab:focus,
    :host ::ng-deep .p-tab:focus-visible {
      outline: none !important;
      box-shadow: none !important;
      border: none !important;
    }

    :host ::ng-deep .p-tab:hover {
      background: rgba(116, 172, 223, 0.08) !important;
      color: #74ACDF !important;
    }

    :host ::ng-deep .p-tab.p-tab-active {
      background: white !important;
      color: #74ACDF !important;
      font-weight: 600 !important;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05) !important;
      outline: none !important;
      border: none !important;
    }

    :host ::ng-deep .p-tab.p-tab-active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(to right, #74ACDF, #5a9dd8);
      border-radius: 3px 3px 0 0;
    }

    .tab-icon {
      margin-right: 0.5rem;
      font-size: 1rem;
    }

    .tab-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-left: 0.5rem;
      padding: 0.125rem 0.5rem;
      background: #74ACDF;
      color: white;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      min-width: 20px;
    }

    :host ::ng-deep .p-tab.p-tab-active .tab-badge {
      background: linear-gradient(135deg, #74ACDF, #5a9dd8);
      box-shadow: 0 2px 6px rgba(116, 172, 223, 0.4);
    }

    /* Headers de tabla más elegantes y suaves */
    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: #f8f9fa !important;
      color: #495057 !important;
      font-weight: 600 !important;
      font-size: 0.813rem !important;
      text-transform: none !important;
      letter-spacing: 0.3px !important;
      padding: 0.875rem 0.75rem !important;
      border-bottom: 1px solid #dee2e6 !important;
      border-top: none !important;
      border-left: none !important;
      border-right: none !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th:first-child {
      border-radius: 0 !important;
      padding-left: 1.25rem !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th:last-child {
      border-radius: 0 !important;
      padding-right: 1.25rem !important;
      text-align: center !important;
    }

    /* Celdas de fecha/hora */
    .datetime-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .datetime-cell i {
      color: #74ACDF;
      font-size: 0.875rem;
    }

    .datetime-cell span {
      color: #2c3e50;
      font-weight: 500;
    }

    /* Celda de acciones */
    .actions-cell {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      min-height: 40px;
    }

    :host ::ng-deep .p-button.p-button-outlined {
      background: transparent !important;
      border: 1.5px solid #ef4444 !important;
      color: #ef4444 !important;
      transition: all 0.2s ease !important;
    }

    :host ::ng-deep .p-button.p-button-outlined:hover {
      background: #ef4444 !important;
      color: white !important;
      border-color: #ef4444 !important;
      transform: scale(1.05) !important;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25) !important;
    }

    :host ::ng-deep .p-button.p-button-outlined:active {
      transform: scale(0.98) !important;
    }

    /* Estilos mejorados para la paginación */
    :host ::ng-deep .p-paginator {
      background: #f8f9fa !important;
      border: none !important;
      border-top: 1px solid #e0e0e0 !important;
      padding: 1rem !important;
      border-radius: 0 0 12px 12px !important;
    }

    :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page {
      min-width: 2.5rem !important;
      height: 2.5rem !important;
      margin: 0 0.25rem !important;
      border-radius: 8px !important;
      border: 1px solid #dee2e6 !important;
      background: white !important;
      color: #495057 !important;
      font-weight: 500 !important;
      transition: all 0.2s ease !important;
    }

    :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page:hover {
      background: #e9ecef !important;
      border-color: #74ACDF !important;
      color: #74ACDF !important;
    }

    :host ::ng-deep .p-paginator .p-paginator-pages .p-paginator-page.p-paginator-page-active {
      background: linear-gradient(135deg, #74ACDF, #5a9dd8) !important;
      border-color: #74ACDF !important;
      color: white !important;
      font-weight: 600 !important;
      box-shadow: 0 2px 8px rgba(116, 172, 223, 0.3) !important;
    }

    :host ::ng-deep .p-paginator .p-paginator-first,
    :host ::ng-deep .p-paginator .p-paginator-prev,
    :host ::ng-deep .p-paginator .p-paginator-next,
    :host ::ng-deep .p-paginator .p-paginator-last {
      min-width: 2.5rem !important;
      height: 2.5rem !important;
      margin: 0 0.25rem !important;
      border-radius: 8px !important;
      border: 1px solid #dee2e6 !important;
      background: white !important;
      color: #495057 !important;
      transition: all 0.2s ease !important;
    }

    :host ::ng-deep .p-paginator .p-paginator-first:hover,
    :host ::ng-deep .p-paginator .p-paginator-prev:hover,
    :host ::ng-deep .p-paginator .p-paginator-next:hover,
    :host ::ng-deep .p-paginator .p-paginator-last:hover {
      background: #74ACDF !important;
      border-color: #74ACDF !important;
      color: white !important;
    }

    :host ::ng-deep .p-paginator .p-paginator-first:disabled,
    :host ::ng-deep .p-paginator .p-paginator-prev:disabled,
    :host ::ng-deep .p-paginator .p-paginator-next:disabled,
    :host ::ng-deep .p-paginator .p-paginator-last:disabled {
      opacity: 0.4 !important;
      cursor: not-allowed !important;
    }

    :host ::ng-deep .p-dropdown {
      border: 1px solid #dee2e6 !important;
      border-radius: 8px !important;
      background: white !important;
      height: 2.5rem !important;
      transition: all 0.2s ease !important;
    }

    :host ::ng-deep .p-dropdown:hover {
      border-color: #74ACDF !important;
    }

    /* Forzar que el dropdown de la paginación se abra hacia arriba */
    :host ::ng-deep .p-paginator .p-dropdown-panel {
      transform-origin: bottom !important;
      bottom: 100% !important;
      top: auto !important;
      margin-bottom: 0.5rem !important;
    }

    :host ::ng-deep .p-dropdown-panel {
      border-radius: 8px !important;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15) !important;
    }

    :host ::ng-deep .p-dropdown:focus {
      border-color: #74ACDF !important;
      box-shadow: 0 0 0 3px rgba(116, 172, 223, 0.1) !important;
    }

    @media (max-width: 768px) {
      .bookings-list-container {
        padding: 1rem;
      }

      .header h1 {
        font-size: 2rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      :host ::ng-deep .p-datatable {
        font-size: 0.9rem;
      }
    }
  `]
})
export class BookingsListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  activeBookings: Signal<Booking[]> = toSignal(this.store.select(fromBookings.selectActiveBookings), { initialValue: [] });
  upcomingBookings: Signal<Booking[]> = toSignal(this.store.select(fromBookings.selectUpcomingBookings), { initialValue: [] });
  pastBookings: Signal<Booking[]> = toSignal(this.store.select(fromBookings.selectPastBookings), { initialValue: [] });
  loading: Signal<boolean> = toSignal(this.store.select(fromBookings.selectBookingsLoading), { initialValue: false });

  // MC-Table columns configuration
  upcomingColumns: MCColumn[] = [
    { field: 'event_name', title: 'Evento' },
    { field: 'space.name', title: 'Espacio' },
    { field: 'start_time', title: 'Inicio' },
    { field: 'end_time', title: 'Fin' },
    { field: 'status', title: 'Estado' },
    { field: 'actions', title: 'Acciones' },
  ];

  activeColumns: MCColumn[] = [
    { field: 'event_name', title: 'Evento' },
    { field: 'space.name', title: 'Espacio' },
    { field: 'start_time', title: 'Inicio' },
    { field: 'end_time', title: 'Fin' },
    { field: 'status', title: 'Estado' },
    { field: 'actions', title: 'Acciones' },
  ];

  pastColumns: MCColumn[] = [
    { field: 'event_name', title: 'Evento' },
    { field: 'space.name', title: 'Espacio' },
    { field: 'start_time', title: 'Inicio' },
    { field: 'end_time', title: 'Fin' },
    { field: 'status', title: 'Estado' },
  ];

  // Convert arrays to MCListResponse format
  upcomingResponse = computed<MCListResponse<Booking>>(() => ({
    data: this.upcomingBookings(),
    total: this.upcomingBookings().length,
  }));

  activeResponse = computed<MCListResponse<Booking>>(() => ({
    data: this.activeBookings(),
    total: this.activeBookings().length,
  }));

  pastResponse = computed<MCListResponse<Booking>>(() => ({
    data: this.pastBookings(),
    total: this.pastBookings().length,
  }));

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.store.dispatch(BookingsActions.loadMyBookings({}));
  }

  cancelBooking(booking: Booking) {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea cancelar la reserva "${booking.event_name}" en ${booking.space?.name || 'este espacio'}? Esta acción no se puede deshacer.`,
      header: 'Cancelar Reserva',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      defaultFocus: 'reject',
      accept: () => {
        this.store.dispatch(BookingsActions.cancelBooking({ id: booking.id }));
        this.messageService.add({
          severity: 'success',
          summary: 'Reserva Cancelada',
          detail: 'La reserva ha sido cancelada exitosamente',
          life: 3000,
        });
        setTimeout(() => this.loadBookings(), 500);
      },
    });
  }

  goToSpaces() {
    this.router.navigate(['/spaces']);
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      completed: 'Completada',
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const severities: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      pending: 'warn',
      confirmed: 'success',
      cancelled: 'danger',
      completed: 'secondary',
    };
    return severities[status] || 'info';
  }
}
