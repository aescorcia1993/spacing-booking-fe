import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

// Store
import * as BookingsActions from '../store/bookings.actions';
import * as SpacesActions from '../../spaces/store/spaces.actions';
import * as fromBookings from '../store/bookings.selectors';
import * as fromSpaces from '../../spaces/store/spaces.selectors';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    DatePicker,
    InputTextModule,
    TextareaModule,
    MessageModule,
    ToastModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
  template: `
    <div class="booking-form-container">
      <p-toast />

      <div class="back-button-container">
        <p-button
          label="Volver"
          icon="pi pi-arrow-left"
          [text]="true"
          (onClick)="goBack()"
        />
      </div>

      @if (loadingSpace()) {
        <p-card>
          <div class="loading-container">
            <p-progressSpinner />
            <p>Cargando información del espacio...</p>
          </div>
        </p-card>
      }

      @if (!loadingSpace() && space()) {
        <div class="form-grid">
          <!-- Space Info Card -->
          <p-card header="Información del Espacio" styleClass="space-info-card">
            <div class="space-detail">
              <h2>{{ space()!.name }}</h2>
              <p class="space-description">{{ space()!.description }}</p>
              
              <div class="space-meta">
                <div class="meta-item">
                  <i class="pi pi-tag"></i>
                  <span>{{ space()!.type }}</span>
                </div>
                <div class="meta-item">
                  <i class="pi pi-users"></i>
                  <span>Capacidad: {{ space()!.capacity }} personas</span>
                </div>
                @if (space()!.available_hours) {
                  <div class="meta-item">
                    <i class="pi pi-clock"></i>
                    <span>
                      Horario: {{ space()!.available_hours['start'] }} - {{ space()!.available_hours['end'] }}
                    </span>
                  </div>
                }
              </div>
            </div>
          </p-card>

          <!-- Booking Form Card -->
          <p-card header="Realizar Reserva" styleClass="booking-form-card">
            <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
              <div class="field">
                <label for="event_name">Nombre del Evento *</label>
                <input
                  pInputText
                  id="event_name"
                  formControlName="event_name"
                  placeholder="Ej: Reunión de equipo"
                  class="w-full"
                />
                @if (bookingForm.get('event_name')?.invalid && bookingForm.get('event_name')?.touched) {
                  <small class="p-error">El nombre del evento es requerido</small>
                }
              </div>

              <div class="field">
                <label for="description">Descripción</label>
                <textarea
                  pTextarea
                  id="description"
                  formControlName="description"
                  rows="3"
                  placeholder="Describe brevemente el evento..."
                  class="w-full"
                ></textarea>
              </div>

              <div class="field">
                <label for="start_time">Fecha y Hora de Inicio *</label>
                <p-datepicker
                  formControlName="start_time"
                  [showTime]="true"
                  [showIcon]="true"
                  hourFormat="24"
                  [minDate]="minDate"
                  placeholder="Selecciona fecha y hora"
                  dateFormat="dd/mm/yy"
                  styleClass="w-full"
                />
                @if (bookingForm.get('start_time')?.invalid && bookingForm.get('start_time')?.touched) {
                  <small class="p-error">La fecha de inicio es requerida</small>
                }
              </div>

              <div class="field">
                <label for="end_time">Fecha y Hora de Fin *</label>
                <p-datepicker
                  formControlName="end_time"
                  [showTime]="true"
                  [showIcon]="true"
                  hourFormat="24"
                  [minDate]="minDate"
                  placeholder="Selecciona fecha y hora"
                  dateFormat="dd/mm/yy"
                  styleClass="w-full"
                />
                @if (bookingForm.get('end_time')?.invalid && bookingForm.get('end_time')?.touched) {
                  <small class="p-error">La fecha de fin es requerida</small>
                }
              </div>

              @if (durationError()) {
                <p-message severity="error" [text]="durationError()!" styleClass="w-full mb-3" />
              }

              @if (availabilityError()) {
                <p-message severity="error" [text]="availabilityError()!" styleClass="w-full mb-3" />
              }

              <div class="info-box">
                <i class="pi pi-info-circle"></i>
                <div>
                  <strong>Información importante:</strong>
                  <ul>
                    <li>La duración máxima de una reserva es de 8 horas</li>
                    <li>No se permiten reservas en horarios ya ocupados</li>
                    <li>Respeta el horario disponible del espacio</li>
                  </ul>
                </div>
              </div>

              <div class="form-actions">
                <p-button
                  label="Cancelar"
                  icon="pi pi-times"
                  severity="secondary"
                  [outlined]="true"
                  (onClick)="goBack()"
                  type="button"
                />
                <p-button
                  label="Reservar"
                  icon="pi pi-check"
                  severity="success"
                  [loading]="submitting()"
                  [disabled]="bookingForm.invalid || submitting()"
                  type="submit"
                />
              </div>
            </form>
          </p-card>
        </div>
      }

      @if (!loadingSpace() && !space()) {
        <p-card>
          <div class="error-container">
            <i class="pi pi-exclamation-triangle"></i>
            <h3>Espacio no encontrado</h3>
            <p>El espacio que intentas reservar no existe o no está disponible</p>
            <p-button
              label="Ver espacios disponibles"
              icon="pi pi-arrow-left"
              (onClick)="goToSpaces()"
            />
          </div>
        </p-card>
      }
    </div>
  `,
  styles: [`
    .booking-form-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .back-button-container {
      margin-bottom: 2rem;
    }

    .loading-container,
    .error-container {
      text-align: center;
      padding: 3rem;
    }

    .loading-container p-progressSpinner {
      display: block;
      margin-bottom: 1rem;
    }

    .loading-container p {
      color: #6c757d;
      font-size: 1.1rem;
    }

    .error-container i {
      font-size: 4rem;
      color: #e74c3c;
      margin-bottom: 1rem;
    }

    .error-container h3 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .error-container p {
      color: #6c757d;
      margin-bottom: 1.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 2rem;
    }

    .space-detail h2 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
      font-size: 1.8rem;
    }

    .space-description {
      color: #6c757d;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .space-meta {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .meta-item i {
      color: #667eea;
      font-size: 1.2rem;
    }

    .meta-item span {
      color: #495057;
      font-weight: 500;
    }

    .field {
      margin-bottom: 1.5rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #495057;
      font-size: 0.875rem;
    }

    :host ::ng-deep .p-datepicker {
      width: 100% !important;
    }

    :host ::ng-deep .p-datepicker input {
      width: 100% !important;
    }

    :host ::ng-deep .p-datepicker-panel {
      background: white !important;
      border: 1px solid #e0e0e0 !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
      border-radius: 12px !important;
    }

    :host ::ng-deep .p-datepicker-header {
      background: linear-gradient(135deg, #74ACDF 0%, #5B9BD5 100%) !important;
      color: white !important;
      border-radius: 12px 12px 0 0 !important;
      padding: 1rem !important;
    }

    :host ::ng-deep .p-datepicker-header .p-datepicker-title {
      color: white !important;
      font-weight: 600 !important;
    }

    :host ::ng-deep .p-datepicker-header button {
      color: white !important;
    }

    :host ::ng-deep .p-datepicker-calendar-container {
      background: white !important;
      padding: 0.5rem !important;
    }

    :host ::ng-deep .p-datepicker-calendar thead th {
      color: #495057 !important;
      font-weight: 600 !important;
      padding: 0.5rem !important;
    }

    :host ::ng-deep .p-datepicker-calendar td {
      padding: 0.25rem !important;
    }

    :host ::ng-deep .p-datepicker-calendar td span {
      border-radius: 6px !important;
    }

    :host ::ng-deep .p-datepicker-calendar td:not(.p-datepicker-other-month) span:hover {
      background: rgba(116, 172, 223, 0.1) !important;
      color: #0033A0 !important;
    }

    :host ::ng-deep .p-datepicker-calendar td.p-datepicker-today span {
      background: rgba(116, 172, 223, 0.2) !important;
      color: #0033A0 !important;
      font-weight: 600 !important;
    }

    :host ::ng-deep .p-datepicker-calendar td span.p-datepicker-day-selected {
      background: linear-gradient(135deg, #74ACDF 0%, #0033A0 100%) !important;
      color: white !important;
    }

    :host ::ng-deep .p-timepicker {
      background: white !important;
      border-top: 1px solid #e0e0e0 !important;
      padding: 1rem !important;
    }

    :host ::ng-deep .p-timepicker button {
      color: #74ACDF !important;
    }

    :host ::ng-deep .p-timepicker button:hover {
      background: rgba(116, 172, 223, 0.1) !important;
      color: #0033A0 !important;
    }

    :host ::ng-deep .p-datepicker-buttonbar {
      background: white !important;
      border-top: 1px solid #e0e0e0 !important;
      padding: 0.75rem 1rem !important;
    }

    :host ::ng-deep .p-datepicker .p-datepicker-panel {
      z-index: 9999 !important;
    }

    :host ::ng-deep .p-datepicker-input-icon-container {
      position: relative !important;
    }

    :host ::ng-deep .p-message {
      background: white !important;
      border: 1px solid !important;
      border-left-width: 4px !important;
      border-radius: 8px !important;
      padding: 1rem !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }

    :host ::ng-deep .p-message.p-message-error {
      background: #FEF2F2 !important;
      border-color: #EF4444 !important;
      color: #991B1B !important;
    }

    :host ::ng-deep .p-message .p-message-icon {
      color: #EF4444 !important;
      font-size: 1.25rem !important;
    }

    :host ::ng-deep .p-message .p-message-text {
      color: #991B1B !important;
      font-weight: 500 !important;
      font-size: 0.875rem !important;
    }

    .info-box {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #e3f2fd;
      border: 1px solid #2196f3;
      border-radius: 6px;
      margin-bottom: 1.5rem;
    }

    .info-box i {
      color: #2196f3;
      font-size: 1.5rem;
      margin-top: 0.25rem;
    }

    .info-box ul {
      margin: 0.5rem 0 0 0;
      padding-left: 1.5rem;
    }

    .info-box li {
      color: #495057;
      line-height: 1.6;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    :host ::ng-deep .space-info-card {
      height: fit-content;
      position: sticky;
      top: 2rem;
    }

    @media (max-width: 1024px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      :host ::ng-deep .space-info-card {
        position: relative;
        top: 0;
      }
    }

    @media (max-width: 768px) {
      .booking-form-container {
        padding: 1rem;
      }

      .form-actions {
        flex-direction: column;
      }

      .form-actions p-button {
        width: 100%;
      }
    }
  `]
})
export class BookingFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private messageService = inject(MessageService);

  space = toSignal(this.store.select(fromSpaces.selectSelectedSpace), { initialValue: null });
  loadingSpace = toSignal(this.store.select(fromSpaces.selectSpacesLoading), { initialValue: false });
  submitting = toSignal(this.store.select(fromBookings.selectBookingsLoading), { initialValue: false });

  minDate = new Date();
  durationError = toSignal(this.store.select(fromBookings.selectBookingsError), { initialValue: null });
  availabilityError = toSignal(this.store.select(fromBookings.selectBookingsError), { initialValue: null });

  bookingForm = this.fb.group({
    event_name: ['', Validators.required],
    description: [''],
    start_time: [null as Date | null, Validators.required],
    end_time: [null as Date | null, Validators.required],
  });

  ngOnInit() {
    const spaceId = this.route.snapshot.paramMap.get('spaceId');
    if (spaceId) {
      this.store.dispatch(SpacesActions.loadSpaceById({ id: +spaceId }));
    } else {
      this.router.navigate(['/spaces']);
    }
  }

  onSubmit() {
    if (this.bookingForm.invalid || !this.space()) {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.bookingForm.value;
    const startTime = formValue.start_time as Date;
    const endTime = formValue.end_time as Date;

    // Validar duración (máximo 8 horas = 480 minutos)
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    if (durationMinutes > 480) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La duración máxima de una reserva es de 8 horas',
      });
      return;
    }

    if (durationMinutes <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La hora de fin debe ser posterior a la hora de inicio',
      });
      return;
    }

    const bookingData = {
      space_id: this.space()!.id,
      event_name: formValue.event_name!,
      booking_date: this.formatDate(startTime), // Solo la fecha: YYYY-MM-DD
      description: formValue.description || '',
      start_time: this.formatTime(startTime), // Solo la hora: HH:MM:SS
      end_time: this.formatTime(endTime), // Solo la hora: HH:MM:SS
    };

    console.log('📤 Enviando reserva al backend:', bookingData);
    this.store.dispatch(BookingsActions.createBooking({ booking: bookingData }));
    
    // NO mostrar éxito aquí - el efecto lo manejará
  }

  goBack() {
    window.history.back();
  }

  goToSpaces() {
    this.router.navigate(['/spaces']);
  }

  private formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatTime(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
