import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

// Store
import * as AuthActions from '../store/auth.actions';
import * as fromAuth from '../store/auth.selectors';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    ProgressSpinnerModule,
  ],
  template: `
    <div class="register-container">
      <div class="register-wrapper">
        <div class="register-header">
          <i class="pi pi-building" style="font-size: 3rem; color: #0033A0;"></i>
          <h1>SpaceBooking</h1>
          <p>Sistema de Reservas de Espacios</p>
        </div>

        <p-card styleClass="register-card">
          <ng-template pTemplate="content">
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <h2 class="register-title">Crear Cuenta</h2>
              
              <div class="field">
                <label for="name">Nombre</label>
                <input
                  pInputText
                  id="name"
                  formControlName="name"
                  placeholder="Tu nombre completo"
                  class="w-full"
                  [class.ng-invalid]="registerForm.get('name')?.invalid && registerForm.get('name')?.touched"
                />
                @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
                  <small class="p-error">El nombre es requerido</small>
                }
              </div>

              <div class="field">
                <label for="email">Email</label>
                <input
                  pInputText
                  id="email"
                  formControlName="email"
                  type="email"
                  placeholder="admin@spacebooking.com"
                  class="w-full"
                  [class.ng-invalid]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                />
                @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
                  <small class="p-error">Email es requerido</small>
                }
                @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
                  <small class="p-error">Email no es válido</small>
                }
              </div>

              <div class="field">
                <label for="password">Contraseña</label>
                <span class="p-input-icon-right w-full">
                  <p-password
                    formControlName="password"
                    [toggleMask]="true"
                    [feedback]="false"
                    placeholder="••••••••"
                    styleClass="w-full"
                    inputStyleClass="w-full"
                    [class.ng-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                  />
                </span>
                @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
                  <small class="p-error">Contraseña es requerida</small>
                }
                @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
                  <small class="p-error">Contraseña debe tener al menos 8 caracteres</small>
                }
              </div>

              <div class="field">
                <label for="password_confirmation">Confirmar Contraseña</label>
                <span class="p-input-icon-right w-full">
                  <p-password
                    formControlName="password_confirmation"
                    [toggleMask]="true"
                    [feedback]="false"
                    placeholder="Confirma tu contraseña"
                    styleClass="w-full"
                    inputStyleClass="w-full"
                    [class.ng-invalid]="registerForm.get('password_confirmation')?.invalid && registerForm.get('password_confirmation')?.touched"
                  />
                </span>
                @if (registerForm.get('password_confirmation')?.hasError('required') && registerForm.get('password_confirmation')?.touched) {
                  <small class="p-error">Debes confirmar la contraseña</small>
                }
                @if (registerForm.hasError('passwordMismatch') && registerForm.get('password_confirmation')?.touched) {
                  <small class="p-error">Las contraseñas no coinciden</small>
                }
              </div>

              @if (error()) {
                <p-message severity="error" [text]="error()!" styleClass="w-full mb-3" />
              }

              <div class="button-container">
                <p-button
                  label="Registrarse"
                  icon="pi pi-user-plus"
                  [loading]="loading()"
                  [disabled]="registerForm.invalid || loading()"
                  type="submit"
                  styleClass="w-full btn-primary"
                />
              </div>

              <div class="register-link">
                <span>¿Ya tienes cuenta?</span>
                <a routerLink="/login">Inicia sesión aquí</a>
              </div>
            </form>
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #74ACDF 0%, #5A9FD4 50%, #74ACDF 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .register-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(180deg, #74ACDF 0%, rgba(116, 172, 223, 0.8) 100%);
      z-index: 0;
    }

    .register-container::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(0deg, #FFFFFF 0%, rgba(255, 255, 255, 0.8) 100%);
      z-index: 0;
    }

    .register-wrapper {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 450px;
    }

    .register-header {
      text-align: center;
      margin-bottom: 2rem;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .register-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin: 1rem 0 0.5rem;
      color: white;
    }

    .register-header p {
      font-size: 1.1rem;
      opacity: 0.95;
      margin: 0;
    }

    :host ::ng-deep .register-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      border: none;
      overflow: hidden;
    }

    :host ::ng-deep .register-card .p-card-content {
      padding: 2.5rem;
    }

    .register-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #2C3E50;
      margin: 0 0 2rem;
      text-align: center;
    }

    .field {
      margin-bottom: 1.75rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.75rem;
      font-weight: 600;
      color: #2C3E50;
      font-size: 0.95rem;
    }

    :host ::ng-deep .field input {
      border: 2px solid #E8F4F8;
      border-radius: 10px;
      padding: 0.875rem 1rem;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    :host ::ng-deep .field input:focus {
      border-color: #74ACDF;
      box-shadow: 0 0 0 3px rgba(116, 172, 223, 0.1);
    }

    :host ::ng-deep .p-password {
      width: 100%;
      display: block;
    }

    :host ::ng-deep .p-password .p-inputwrapper {
      width: 100%;
    }

    :host ::ng-deep .p-password input {
      width: 100%;
      border: 2px solid #E8F4F8;
      border-radius: 10px;
      padding: 0.875rem 1rem;
      font-size: 1rem;
    }

    :host ::ng-deep .p-password input:focus {
      border-color: #74ACDF;
      box-shadow: 0 0 0 3px rgba(116, 172, 223, 0.1);
    }

    :host ::ng-deep .p-password .p-icon {
      color: #74ACDF;
    }

    .button-container {
      margin-top: 2rem;
    }

    :host ::ng-deep .btn-primary {
      background: linear-gradient(135deg, #74ACDF 0%, #5A9FD4 100%);
      border: none;
      border-radius: 10px;
      padding: 0.875rem;
      font-size: 1rem;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(116, 172, 223, 0.3);
      transition: all 0.3s ease;
    }

    :host ::ng-deep .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #5A9FD4 0%, #4A8FC4 100%);
      box-shadow: 0 6px 20px rgba(116, 172, 223, 0.4);
      transform: translateY(-2px);
    }

    :host ::ng-deep .btn-primary:disabled {
      background: #B8D4E6;
      box-shadow: none;
    }

    .register-link {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #E8F4F8;
      color: #6C757D;
    }

    .register-link a {
      color: #74ACDF;
      font-weight: 600;
      text-decoration: none;
      margin-left: 0.5rem;
      transition: color 0.3s ease;
    }

    .register-link a:hover {
      color: #5A9FD4;
      text-decoration: underline;
    }

    :host ::ng-deep .p-message {
      background: white !important;
      border: 1px solid !important;
      border-left-width: 4px !important;
      border-radius: 10px !important;
      padding: 1rem !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    }

    :host ::ng-deep .p-message.p-message-error {
      background: #FEF2F2 !important;
      border-color: #EF4444 !important;
    }

    :host ::ng-deep .p-message .p-message-icon {
      color: #EF4444 !important;
      font-size: 1.25rem !important;
    }

    :host ::ng-deep .p-message .p-message-text {
      color: #991B1B !important;
      font-weight: 500 !important;
    }

    .p-error {
      color: #E74C3C;
      font-size: 0.85rem;
      margin-top: 0.5rem;
      display: block;
    }

    @media (max-width: 576px) {
      .register-container {
        padding: 1rem;
      }

      .register-header h1 {
        font-size: 2rem;
      }

      :host ::ng-deep .register-card .p-card-content {
        padding: 1.5rem;
      }

      .register-title {
        font-size: 1.5rem;
      }
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);

  loading = toSignal(this.store.select(fromAuth.selectAuthLoading), { initialValue: false });
  error = toSignal(this.store.select(fromAuth.selectAuthError), { initialValue: null });

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', Validators.required],
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('password_confirmation')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value as {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
      };
      this.store.dispatch(AuthActions.register({ data: userData }));
    }
  }
}
