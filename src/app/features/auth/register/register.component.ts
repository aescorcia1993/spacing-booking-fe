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
      <p-card header="Crear Cuenta" styleClass="register-card">
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
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
              placeholder="correo@ejemplo.com"
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
            <p-password
              formControlName="password"
              [toggleMask]="true"
              [feedback]="true"
              placeholder="Contraseña (mínimo 8 caracteres)"
              styleClass="w-full"
              inputStyleClass="w-full"
              [class.ng-invalid]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
            />
            @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
              <small class="p-error">Contraseña es requerida</small>
            }
            @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
              <small class="p-error">Contraseña debe tener al menos 8 caracteres</small>
            }
          </div>

          <div class="field">
            <label for="password_confirmation">Confirmar Contraseña</label>
            <p-password
              formControlName="password_confirmation"
              [toggleMask]="true"
              [feedback]="false"
              placeholder="Confirma tu contraseña"
              styleClass="w-full"
              inputStyleClass="w-full"
              [class.ng-invalid]="registerForm.get('password_confirmation')?.invalid && registerForm.get('password_confirmation')?.touched"
            />
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
              styleClass="w-full"
            />
          </div>

          <div class="text-center mt-3">
            <span class="text-600">¿Ya tienes cuenta?</span>
            <a routerLink="/login" class="ml-2 font-medium text-primary cursor-pointer">
              Inicia sesión aquí
            </a>
          </div>
        </form>
      </p-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    :host ::ng-deep .register-card {
      width: 100%;
      max-width: 450px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .field {
      margin-bottom: 1.5rem;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #495057;
    }

    .button-container {
      margin-top: 2rem;
    }

    :host ::ng-deep .p-password {
      width: 100%;
    }

    :host ::ng-deep .p-password input {
      width: 100%;
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
