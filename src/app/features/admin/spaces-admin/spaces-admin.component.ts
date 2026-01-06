import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { ToggleButton } from 'primeng/togglebutton';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

// Store
import * as SpacesActions from '../../spaces/store/spaces.actions';
import * as fromSpaces from '../../spaces/store/spaces.selectors';
import { Space, SpaceType } from '../../../models/booking.model';

@Component({
  selector: 'app-spaces-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    Select,
    ToggleButton,
    TagModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    CardModule,
    Tooltip,
  ],
  providers: [ConfirmationService, MessageService],
  template: `
    <div class="admin-spaces-container">
      <p-toast />
      <p-confirmDialog />

      <div class="header">
        <h1>Administración de Espacios</h1>
        <p class="subtitle">Gestiona los espacios disponibles para reservas</p>
      </div>

      <p-toolbar styleClass="mb-4">
        <ng-template pTemplate="left">
          <p-button
            label="Nuevo Espacio"
            icon="pi pi-plus"
            severity="success"
            (onClick)="openNew()"
          />
        </ng-template>
        <ng-template pTemplate="right">
          <p-button
            label="Refrescar"
            icon="pi pi-refresh"
            [outlined]="true"
            (onClick)="loadSpaces()"
          />
        </ng-template>
      </p-toolbar>

      <p-table
        [value]="spaces()"
        [loading]="loading()"
        [paginator]="true"
        [rows]="10"
        [totalRecords]="pagination()?.total || 0"
        [lazy]="true"
        (onLazyLoad)="loadSpaces($event)"
        [rowsPerPageOptions]="[10, 25, 50]"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} espacios"
        [globalFilterFields]="['name', 'type', 'description']"
        styleClass="p-datatable-striped"
        dataKey="id"
      >
        <ng-template pTemplate="header">
          <tr>
            <th pSortableColumn="id" style="width: 5%">
              ID <p-sortIcon field="id" />
            </th>
            <th pSortableColumn="name" style="width: 20%">
              Nombre <p-sortIcon field="name" />
            </th>
            <th pSortableColumn="type" style="width: 15%">
              Tipo <p-sortIcon field="type" />
            </th>
            <th style="width: 30%">Descripción</th>
            <th pSortableColumn="capacity" style="width: 10%">
              Capacidad <p-sortIcon field="capacity" />
            </th>
            <th style="width: 10%">Estado</th>
            <th style="width: 10%">Acciones</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-space>
          <tr>
            <td>{{ space.id }}</td>
            <td>
              <strong>{{ space.name }}</strong>
            </td>
            <td>
              <p-tag [value]="space.type" [severity]="getTypeSeverity(space.type)" />
            </td>
            <td>
              <div class="text-overflow">{{ space.description }}</div>
            </td>
            <td>
              <i class="pi pi-users mr-2"></i>
              {{ space.capacity }}
            </td>
            <td>
              <p-tag
                [value]="space.is_active ? 'Activo' : 'Inactivo'"
                [severity]="space.is_active ? 'success' : 'danger'"
              />
            </td>
            <td>
              <div class="action-buttons">
                <p-button
                  icon="pi pi-pencil"
                  [rounded]="true"
                  [text]="true"
                  severity="info"
                  (onClick)="editSpace(space)"
                  pTooltip="Editar"
                  tooltipPosition="top"
                />
                <p-button
                  icon="pi pi-trash"
                  [rounded]="true"
                  [text]="true"
                  severity="danger"
                  (onClick)="deleteSpace(space)"
                  pTooltip="Eliminar"
                  tooltipPosition="top"
                />
              </div>
            </td>
          </tr>
        </ng-template>

        <ng-template pTemplate="emptymessage">
          <tr>
            <td colspan="7" class="text-center">
              <div class="empty-message">
                <i class="pi pi-inbox"></i>
                <p>No hay espacios registrados</p>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <!-- Dialog para crear/editar -->
      <p-dialog
        [(visible)]="spaceDialog"
        [header]="editingSpace() ? 'Editar Espacio' : 'Nuevo Espacio'"
        [modal]="true"
        [style]="{ width: '600px', maxHeight: '90vh' }"
        [breakpoints]="{ '960px': '75vw', '640px': '90vw' }"
        [closable]="true"
      >
        <ng-template pTemplate="content">
          <form [formGroup]="spaceForm" class="space-form">
            <!-- Nombre -->
            <div class="form-field">
              <label for="name" class="form-label">Nombre *</label>
              <input
                pInputText
                id="name"
                formControlName="name"
                placeholder="Ej: Sala de Reuniones Principal"
                class="w-full"
              />
              @if (spaceForm.get('name')?.invalid && spaceForm.get('name')?.touched) {
                <small class="text-error">El nombre es requerido</small>
              }
            </div>

            <!-- Descripción -->
            <div class="form-field">
              <label for="description" class="form-label">Descripción *</label>
              <textarea
                pInputTextarea
                id="description"
                formControlName="description"
                rows="3"
                placeholder="Describe las características del espacio..."
                class="w-full"
              ></textarea>
              @if (spaceForm.get('description')?.invalid && spaceForm.get('description')?.touched) {
                <small class="text-error">La descripción es requerida</small>
              }
            </div>

            <!-- Tipo y Capacidad -->
            <div class="form-row">
              <div class="form-field">
                <label for="type" class="form-label">Tipo de Espacio *</label>
                <p-select
                  id="type"
                  formControlName="type"
                  [options]="spaceTypes"
                  placeholder="Selecciona un tipo"
                  styleClass="w-full"
                />
                @if (spaceForm.get('type')?.invalid && spaceForm.get('type')?.touched) {
                  <small class="text-error">El tipo es requerido</small>
                }
              </div>

              <div class="form-field">
                <label for="capacity" class="form-label">Capacidad *</label>
                <p-inputNumber
                  id="capacity"
                  formControlName="capacity"
                  [showButtons]="true"
                  [min]="1"
                  [max]="1000"
                  placeholder="Personas"
                  styleClass="w-full"
                />
                @if (spaceForm.get('capacity')?.invalid && spaceForm.get('capacity')?.touched) {
                  <small class="text-error">La capacidad es requerida</small>
                }
              </div>
            </div>

            <!-- Horario -->
            <div class="form-row">
              <div class="form-field">
                <label for="start_hour" class="form-label">Hora de Inicio</label>
                <input
                  pInputText
                  id="start_hour"
                  formControlName="start_hour"
                  placeholder="08:00"
                  class="w-full"
                />
              </div>

              <div class="form-field">
                <label for="end_hour" class="form-label">Hora de Fin</label>
                <input
                  pInputText
                  id="end_hour"
                  formControlName="end_hour"
                  placeholder="18:00"
                  class="w-full"
                />
              </div>
            </div>

            <!-- URLs de Fotos -->
            <div class="form-field">
              <label for="photos" class="form-label">URLs de Fotos (separadas por coma)</label>
              <textarea
                pInputTextarea
                id="photos"
                formControlName="photos_input"
                rows="2"
                placeholder="https://ejemplo.com/foto1.jpg, https://ejemplo.com/foto2.jpg"
                class="w-full"
              ></textarea>
              <small class="text-help">Ingresa las URLs de las fotos separadas por comas</small>
            </div>

            <!-- Switches Modernos -->
            <div class="form-switches">
              <div class="switch-field">
                <label for="is_active" class="switch-label">
                  <i class="pi pi-check-circle"></i>
                  Espacio activo
                </label>
                <p-toggleButton
                  formControlName="is_active"
                  inputId="is_active"
                  onIcon="pi pi-check"
                  offIcon="pi pi-times"
                  onLabel="Activo"
                  offLabel="Inactivo"
                  styleClass="w-9rem"
                />
              </div>

              <div class="switch-field">
                <label for="requires_approval" class="switch-label">
                  <i class="pi pi-shield"></i>
                  Requiere aprobación de administrador
                </label>
                <p-toggleButton
                  formControlName="requires_approval"
                  inputId="requires_approval"
                  onIcon="pi pi-lock"
                  offIcon="pi pi-lock-open"
                  onLabel="Sí"
                  offLabel="No"
                  styleClass="w-9rem"
                />
              </div>
            </div>
          </form>
        </ng-template>

        <ng-template pTemplate="footer">
          <p-button
            label="Cancelar"
            icon="pi pi-times"
            [text]="true"
            (onClick)="hideDialog()"
          />
          <p-button
            label="Guardar"
            icon="pi pi-check"
            [loading]="saving()"
            (onClick)="saveSpace()"
            [disabled]="spaceForm.invalid"
          />
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .admin-spaces-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .header {
      margin-bottom: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      border-radius: 12px;
      color: white;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    }

    .header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
    }

    .subtitle {
      font-size: 1.1rem;
      opacity: 0.95;
    }

    .text-overflow {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      align-items: center;
    }

    .empty-message {
      padding: 3rem;
      text-align: center;
    }

    .empty-message i {
      font-size: 4rem;
      color: #6c757d;
      margin-bottom: 1rem;
    }

    .empty-message p {
      color: #6c757d;
      font-size: 1.2rem;
    }

    /* 🎨 Estilos del formulario del modal */
    .space-form {
      padding: 1rem 0;
    }

    .form-field {
      margin-bottom: 1.25rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.95rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .text-error {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 0.25rem;
      display: block;
    }

    .text-help {
      color: #6c757d;
      font-size: 0.85rem;
      margin-top: 0.25rem;
      display: block;
    }

    /* 🎛️ Switches Modernos */
    .form-switches {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-top: 1.5rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%);
      border-radius: 12px;
      border: 1px solid #dee2e6;
    }

    .switch-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }

    .switch-field:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    .switch-label {
      font-weight: 600;
      color: #2c3e50;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      user-select: none;
    }

    .switch-label i {
      font-size: 1.25rem;
      color: #74ACDF;
    }

    /* Estilos del ToggleButton de PrimeNG */
    :host ::ng-deep .p-togglebutton {
      border-radius: 8px !important;
      font-weight: 600 !important;
      transition: all 0.3s ease !important;
    }

    :host ::ng-deep .p-togglebutton.p-button-outlined {
      background: white !important;
      border: 2px solid #cbd5e1 !important;
      color: #64748b !important;
    }

    :host ::ng-deep .p-togglebutton.p-button-outlined:hover {
      background: #f8fafc !important;
      border-color: #94a3b8 !important;
    }

    :host ::ng-deep .p-togglebutton.p-togglebutton-checked {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
      border-color: #10b981 !important;
      color: white !important;
    }

    :host ::ng-deep .p-togglebutton.p-togglebutton-checked:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
      border-color: #059669 !important;
    }

    /* 🎨 Estilos mejorados para la tabla */
    :host ::ng-deep .p-datatable {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%) !important;
      color: #2c3e50 !important;
      font-weight: 700 !important;
      font-size: 0.875rem !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
      padding: 1rem !important;
      border-bottom: 2px solid #dee2e6 !important;
      border-top: none !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
      transition: all 0.3s ease !important;
      border-bottom: 1px solid #f1f3f5 !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background: #f8f9fa !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 1rem !important;
      font-size: 0.95rem !important;
      color: #495057 !important;
      vertical-align: middle !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td strong {
      color: #2c3e50 !important;
      font-weight: 600 !important;
    }

    /* Toolbar mejorado */
    :host ::ng-deep .p-toolbar {
      background: white !important;
      border: 1px solid #e9ecef !important;
      border-radius: 12px !important;
      padding: 1rem !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
      margin-bottom: 1.5rem !important;
    }

    :host ::ng-deep .p-toolbar .p-button {
      font-weight: 600 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
      transition: all 0.3s ease !important;
    }

    :host ::ng-deep .p-toolbar .p-button:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }

    /* Botones de acción */
    :host ::ng-deep .p-button.p-button-rounded {
      width: 2.5rem !important;
      height: 2.5rem !important;
      transition: all 0.3s ease !important;
    }

    :host ::ng-deep .p-button.p-button-rounded:hover {
      transform: scale(1.1) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }

    /* Tags mejorados */
    :host ::ng-deep .p-tag {
      padding: 0.375rem 0.75rem !important;
      font-size: 0.875rem !important;
      font-weight: 600 !important;
      border-radius: 6px !important;
    }

    /* Paginación mejorada */
    :host ::ng-deep .p-paginator {
      background: white !important;
      border-top: 1px solid #e9ecef !important;
      border-radius: 0 0 12px 12px !important;
      padding: 1rem !important;
    }

    :host ::ng-deep .p-paginator .p-paginator-page {
      min-width: 2.5rem !important;
      height: 2.5rem !important;
      margin: 0 0.25rem !important;
      border-radius: 8px !important;
      transition: all 0.3s ease !important;
    }

    :host ::ng-deep .p-paginator .p-paginator-page:hover {
      background: #f8f9fa !important;
      transform: translateY(-2px);
    }

    :host ::ng-deep .p-paginator .p-paginator-page.p-paginator-page-active {
      background: linear-gradient(135deg, #74ACDF, #5a9dd8) !important;
      color: white !important;
      box-shadow: 0 2px 8px rgba(116, 172, 223, 0.3) !important;
    }

    /* 🔥 Modal de edición - Fondo sólido sin transparencia */
    :host ::ng-deep .p-dialog {
      background: white !important;
      border-radius: 12px !important;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
    }

    :host ::ng-deep .p-dialog .p-dialog-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      padding: 1.5rem !important;
      border-radius: 12px 12px 0 0 !important;
      border-bottom: none !important;
    }

    :host ::ng-deep .p-dialog .p-dialog-header .p-dialog-title {
      font-size: 1.5rem !important;
      font-weight: 700 !important;
      color: white !important;
    }

    :host ::ng-deep .p-dialog .p-dialog-header .p-dialog-header-icon {
      color: white !important;
    }

    :host ::ng-deep .p-dialog .p-dialog-content {
      background: white !important;
      padding: 2rem !important;
      border-radius: 0 !important;
    }

    :host ::ng-deep .p-dialog .p-dialog-footer {
      background: white !important;
      padding: 1.5rem 2rem !important;
      border-top: 1px solid #e9ecef !important;
      border-radius: 0 0 12px 12px !important;
    }

    :host ::ng-deep .p-dialog-mask {
      background-color: rgba(0, 0, 0, 0.5) !important;
    }

    @media (max-width: 768px) {
      .admin-spaces-container {
        padding: 1rem;
      }

      .header {
        padding: 1.5rem;
      }

      .header h1 {
        font-size: 2rem;
      }

      .space-form .field-group {
        grid-template-columns: 1fr;
      }

      :host ::ng-deep .p-datatable .p-datatable-thead > tr > th,
      :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
        padding: 0.75rem !important;
        font-size: 0.85rem !important;
      }
    }
  `]
})
export class SpacesAdminComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  spaces = toSignal(this.store.select(fromSpaces.selectSpaces), { initialValue: [] });
  loading = toSignal(this.store.select(fromSpaces.selectSpacesLoading), { initialValue: false });
  pagination = toSignal(this.store.select(fromSpaces.selectSpacesPagination), { initialValue: null });

  spaceDialog = false;
  editingSpace = signal<Space | null>(null);
  saving = signal(false);

  spaceTypes = [
    { label: 'Sala de Reuniones', value: 'sala-de-reuniones' },
    { label: 'Auditorio', value: 'auditorio' },
    { label: 'Sala de Conferencias', value: 'sala-de-conferencias' },
    { label: 'Aula', value: 'aula' },
    { label: 'Coworking', value: 'coworking' },
  ];

  spaceForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    type: ['', Validators.required],
    capacity: [null as number | null, [Validators.required, Validators.min(1)]],
    start_hour: ['08:00'],
    end_hour: ['18:00'],
    photos_input: [''],
    is_active: [true],
    requires_approval: [false], // 🔥 NUEVO: Campo para aprobación
  });

  ngOnInit() {
    this.loadSpaces();
  }

  loadSpaces(event?: any) {
    console.log('📊 loadSpaces event:', event);

    // Calcular el número de página correctamente
    // event.first es el índice del primer elemento (0-indexed)
    // event.rows es el número de filas por página
    const page = event?.first !== undefined && event?.rows
      ? Math.floor(event.first / event.rows) + 1
      : 1;

    // Obtener el número de registros por página
    const perPage = event?.rows || 10;

    console.log('📄 Calculando página:', { first: event?.first, rows: event?.rows, page, perPage });

    // Extraer parámetros de ordenamiento del evento de PrimeNG
    let sortField: string | undefined;
    let sortOrder: string | undefined;

    if (event?.sortField) {
      sortField = event.sortField;
      // PrimeNG usa 1 para ASC y -1 para DESC
      sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
      console.log('🔄 Ordenando por:', sortField, sortOrder);
    }

    this.store.dispatch(SpacesActions.loadAllSpaces({
      page,
      perPage,
      sortField,
      sortOrder
    }));
  }

  openNew() {
    this.editingSpace.set(null);
    this.spaceForm.reset({
      start_hour: '08:00',
      end_hour: '18:00',
      is_active: true,
      requires_approval: false, // 🔥 Valor por defecto
    });
    this.spaceDialog = true;
  }

  editSpace(space: Space) {
    this.editingSpace.set(space);

    // Extraer primera entrada de available_hours si existe
    const hoursKeys = space.available_hours ? Object.keys(space.available_hours) : [];
    const firstKey = hoursKeys.length > 0 ? hoursKeys[0] : 'monday';
    const startHour = space.available_hours?.[firstKey]?.start || '08:00';
    const endHour = space.available_hours?.[firstKey]?.end || '18:00';

    // Construir photos string
    const photosStr = space.photos?.join(', ') || '';

    this.spaceForm.patchValue({
      name: space.name,
      description: space.description,
      type: space.type,
      capacity: space.capacity,
      start_hour: startHour,
      end_hour: endHour,
      photos_input: photosStr,
      is_active: space.is_active,
      requires_approval: (space as any).requires_approval || false, // 🔥 Cargar valor existente
    });

    this.spaceDialog = true;
  }

  hideDialog() {
    this.spaceDialog = false;
    this.editingSpace.set(null);
    this.spaceForm.reset();
  }

  saveSpace() {
    if (this.spaceForm.invalid) {
      Object.keys(this.spaceForm.controls).forEach(key => {
        this.spaceForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.saving.set(true);

    const formValue = this.spaceForm.value;

    // Procesar available_hours - backend espera objeto con días
    const available_hours = {
      monday: {
        start: formValue.start_hour || '08:00',
        end: formValue.end_hour || '18:00',
      },
      tuesday: {
        start: formValue.start_hour || '08:00',
        end: formValue.end_hour || '18:00',
      },
      wednesday: {
        start: formValue.start_hour || '08:00',
        end: formValue.end_hour || '18:00',
      },
      thursday: {
        start: formValue.start_hour || '08:00',
        end: formValue.end_hour || '18:00',
      },
      friday: {
        start: formValue.start_hour || '08:00',
        end: formValue.end_hour || '18:00',
      },
    };

    // Procesar photos
    const photosInput = formValue.photos_input?.trim() || '';
    const photos = photosInput
      ? photosInput.split(',').map(url => url.trim()).filter(url => url.length > 0)
      : [];

    const spaceData: any = {
      name: formValue.name!,
      description: formValue.description!,
      type: formValue.type!,
      capacity: formValue.capacity!,
      available_hours,
      photos,
      is_active: formValue.is_active!,
      requires_approval: formValue.requires_approval!, // 🔥 Enviar al backend
    };

    if (this.editingSpace()) {
      // Actualizar
      this.store.dispatch(
        SpacesActions.updateSpace({
          id: this.editingSpace()!.id,
          space: spaceData,
        })
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Espacio actualizado correctamente',
      });
    } else {
      // Crear
      this.store.dispatch(SpacesActions.createSpace({ space: spaceData }));
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Espacio creado correctamente',
      });
    }

    setTimeout(() => {
      this.saving.set(false);
      this.hideDialog();
      this.loadSpaces();
    }, 1000);
  }

  deleteSpace(space: Space) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres eliminar el espacio "${space.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(SpacesActions.deleteSpace({ id: space.id }));
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Espacio eliminado correctamente',
        });
        setTimeout(() => this.loadSpaces(), 500);
      },
    });
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
}
