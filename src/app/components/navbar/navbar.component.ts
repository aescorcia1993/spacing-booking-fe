import { Component, inject, HostListener, ElementRef, effect, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

// PrimeNG
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';

// Store
import * as AuthActions from '../../features/auth/store/auth.actions';
import * as fromAuth from '../../features/auth/store/auth.selectors';

// Services
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MenubarModule,
    ButtonModule,
    AvatarModule,
  ],
  template: `
    <div class="navbar-container">
      <p-menubar [model]="menuItems()" #menubar>
        <ng-template pTemplate="start">
          <div class="brand" routerLink="/">
            <div class="logo-circle">
              <i class="pi pi-building"></i>
            </div>
            <span>SpaceBooking</span>
          </div>
        </ng-template>

        <ng-template pTemplate="end">
          @if (isAuthenticated()) {
            <div class="user-section">
              <div class="user-avatar-circle">
                {{ getUserInitials() }}
              </div>
              <span class="user-name">{{ user()?.name }}</span>
              <p-button
                label="Salir"
                icon="pi pi-sign-out"
                severity="danger"
                [text]="true"
                (onClick)="logout()"
              />
            </div>
          } @else {
            <div class="auth-buttons">
              <p-button
                label="Iniciar Sesión"
                icon="pi pi-sign-in"
                [text]="true"
                routerLink="/login"
              />
              <p-button
                label="Registrarse"
                icon="pi pi-user-plus"
                routerLink="/register"
              />
            </div>
          }
        </ng-template>
      </p-menubar>

      <!-- Overlay para cerrar el menú móvil -->
      @if (showMobileMenu()) {
        <div class="mobile-menu-overlay" (click)="closeMobileMenu()"></div>
      }
    </div>
  `,
  styles: [`
    .navbar-container {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      background: white;
    }

    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.125rem;
      font-weight: 700;
      color: #0033A0;
      cursor: pointer;
      padding: 0 1rem;
      transition: all 0.3s ease;
    }

    .brand:hover {
      transform: translateY(-2px);
      color: #74ACDF;
    }

    .brand:hover .logo-circle {
      background: linear-gradient(135deg, #0033A0 0%, #74ACDF 100%);
      transform: rotate(360deg);
      box-shadow: 0 4px 12px rgba(0, 51, 160, 0.3);
    }

    .logo-circle {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #74ACDF 0%, #0033A0 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(116, 172, 223, 0.3);
      transition: all 0.5s ease;
    }

    .logo-circle i {
      font-size: 1.25rem;
      color: white;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar-circle {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      background: linear-gradient(135deg, #74ACDF 0%, #0033A0 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.8125rem;
      box-shadow: 0 2px 8px rgba(116, 172, 223, 0.3);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .user-avatar-circle:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(116, 172, 223, 0.5);
    }

    .user-name {
      font-weight: 600;
      font-size: 0.8125rem;
      color: #495057;
      transition: color 0.3s ease;
    }

    .user-name:hover {
      color: #0033A0;
    }

    .auth-buttons {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    :host ::ng-deep .p-menubar {
      border: none;
      border-radius: 0;
      background: white !important;
      padding: 0.75rem 1.5rem !important;
    }

    /* Overlay del menú desplegable con fondo opaco */
    :host ::ng-deep .p-menubar .p-menubar-root-list > .p-menuitem.p-menuitem-active > .p-submenu-list {
      opacity: 1 !important;
      visibility: visible !important;
    }

    :host ::ng-deep .p-menubar .p-submenu-list {
      opacity: 1 !important;
      background-color: #ffffff !important;
    }

    :host ::ng-deep .p-menubar .p-menubar-button {
      background: white !important;
      border: 2px solid #e0e0e0 !important;
      color: #495057 !important;
      border-radius: 8px !important;
      width: 2.5rem !important;
      height: 2.5rem !important;
      transition: all 0.3s ease !important;
    }

    :host ::ng-deep .p-menubar .p-menubar-button:hover {
      background: linear-gradient(135deg, rgba(116, 172, 223, 0.15) 0%, rgba(0, 51, 160, 0.1) 100%) !important;
      border-color: #74ACDF !important;
      color: #0033A0 !important;
      transform: scale(1.05) !important;
    }

    :host ::ng-deep .p-menubar .p-menubar-button .p-icon {
      font-size: 1.25rem !important;
    }

    :host ::ng-deep .p-menubar .p-menubar-root-list {
      gap: 1rem !important;
      display: flex !important;
      align-items: center !important;
    }

    :host ::ng-deep .p-menubar .p-menuitem {
      position: relative;
      margin: 0 0.25rem !important;
    }

    :host ::ng-deep .p-menubar .p-menuitem-link {
      padding: 0.75rem 1.25rem !important;
      font-size: 0.875rem !important;
      border-radius: 8px !important;
      transition: all 0.3s ease !important;
      font-weight: 500 !important;
      position: relative !important;
      display: flex !important;
      align-items: center !important;
      gap: 0.5rem !important;
    }

    :host ::ng-deep .p-menubar .p-menuitem-link:hover {
      background: linear-gradient(135deg, rgba(116, 172, 223, 0.15) 0%, rgba(0, 51, 160, 0.15) 100%) !important;
      color: #0033A0 !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 2px 8px rgba(116, 172, 223, 0.2) !important;
    }

    :host ::ng-deep .p-menubar .p-menuitem-link:hover .p-menuitem-icon {
      color: #0033A0 !important;
      transform: scale(1.15) !important;
    }

    :host ::ng-deep .p-menubar .p-menuitem.p-menuitem-active > .p-menuitem-link,
    :host ::ng-deep .p-menubar .p-menuitem-link.router-link-active,
    :host ::ng-deep .p-menubar .p-menuitem-link[aria-current="page"] {
      background: linear-gradient(135deg, rgba(116, 172, 223, 0.25) 0%, rgba(0, 51, 160, 0.25) 100%) !important;
      color: #0033A0 !important;
      font-weight: 600 !important;
      border-bottom: 3px solid #0033A0 !important;
      box-shadow: 0 2px 8px rgba(0, 51, 160, 0.2) !important;
    }

    :host ::ng-deep .p-menubar .p-menuitem.p-menuitem-active > .p-menuitem-link .p-menuitem-icon,
    :host ::ng-deep .p-menubar .p-menuitem-link.router-link-active .p-menuitem-icon,
    :host ::ng-deep .p-menubar .p-menuitem-link[aria-current="page"] .p-menuitem-icon {
      color: #0033A0 !important;
      font-weight: bold !important;
    }

    :host ::ng-deep .p-menubar .p-menuitem-link .p-menuitem-icon {
      color: #74ACDF !important;
      transition: all 0.3s ease !important;
    }

    :host ::ng-deep .p-menubar .p-menuitem-link:hover .p-menuitem-icon {
      color: #0033A0 !important;
      transform: scale(1.1);
    }

    :host ::ng-deep .p-button {
      padding: 0.5rem 1rem !important;
      font-size: 0.8125rem !important;
      height: auto !important;
      border-radius: 8px !important;
      transition: all 0.3s ease !important;
      font-weight: 500 !important;
    }

    :host ::ng-deep .p-button:not(.p-button-text) {
      background: linear-gradient(135deg, #74ACDF 0%, #0033A0 100%) !important;
      border: none !important;
      box-shadow: 0 2px 8px rgba(116, 172, 223, 0.3) !important;
    }

    :host ::ng-deep .p-button:not(.p-button-text):hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 12px rgba(116, 172, 223, 0.5) !important;
    }

    :host ::ng-deep .p-button.p-button-text {
      color: #495057 !important;
    }

    :host ::ng-deep .p-button.p-button-text:hover {
      background: linear-gradient(135deg, rgba(116, 172, 223, 0.1) 0%, rgba(0, 51, 160, 0.1) 100%) !important;
      color: #0033A0 !important;
      transform: translateY(-2px) !important;
    }

    :host ::ng-deep .p-button.p-button-danger.p-button-text:hover {
      background: rgba(239, 68, 68, 0.1) !important;
      color: #dc3545 !important;
    }

    :host ::ng-deep .p-button .p-button-icon {
      font-size: 0.875rem !important;
      transition: all 0.3s ease !important;
    }

    :host ::ng-deep .p-button:hover .p-button-icon {
      transform: scale(1.1);
    }

    :host ::ng-deep .p-button .p-button-label {
      font-weight: 500 !important;
    }

    /* 🎨 Estilos para menú desplegable de Administración */
    :host ::ng-deep .p-menubar .p-submenu-list {
      background: white !important;
      border: 2px solid #e5e7eb !important;
      border-radius: 12px !important;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
      padding: 1rem !important;
      min-width: 250px !important;
      margin-top: 0.75rem !important;
      position: absolute !important;
      z-index: 9999 !important;
    }

    :host ::ng-deep .p-menubar .p-submenu-list::before {
      content: '' !important;
      position: absolute !important;
      top: -8px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      width: 0 !important;
      height: 0 !important;
      border-left: 8px solid transparent !important;
      border-right: 8px solid transparent !important;
      border-bottom: 8px solid white !important;
      filter: drop-shadow(0 -2px 2px rgba(0, 0, 0, 0.05)) !important;
    }

    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem {
      margin-bottom: 0.5rem !important;
    }

    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem:last-child {
      margin-bottom: 0 !important;
    }

    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem-link {
      padding: 1rem 1.25rem !important;
      border-radius: 10px !important;
      display: flex !important;
      align-items: center !important;
      gap: 1rem !important;
      transition: all 0.3s ease !important;
      border-left: 4px solid transparent !important;
      background: white !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
    }

    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem-link:hover {
      background: linear-gradient(135deg, rgba(116, 172, 223, 0.15) 0%, rgba(0, 51, 160, 0.1) 100%) !important;
      border-left-color: #74ACDF !important;
      transform: translateX(4px) !important;
      box-shadow: 0 2px 8px rgba(116, 172, 223, 0.25) !important;
    }

    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem-link .p-menuitem-icon {
      font-size: 1.125rem !important;
      color: #74ACDF !important;
      min-width: 1.25rem !important;
      transition: all 0.3s ease !important;
    }

    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem-link:hover .p-menuitem-icon {
      color: #0033A0 !important;
      transform: scale(1.2) rotate(5deg) !important;
    }

    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem-link .p-menuitem-text {
      font-size: 0.9375rem !important;
      font-weight: 500 !important;
      color: #495057 !important;
      transition: all 0.3s ease !important;
    }

    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem-link:hover .p-menuitem-text {
      color: #0033A0 !important;
      font-weight: 600 !important;
    }

    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem-link.router-link-active,
    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem-link[aria-current="page"] {
      background: linear-gradient(135deg, rgba(0, 51, 160, 0.15) 0%, rgba(116, 172, 223, 0.2) 100%) !important;
      border-left-color: #0033A0 !important;
      border-left-width: 4px !important;
      box-shadow: 0 2px 12px rgba(0, 51, 160, 0.2) !important;
    }

    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem-link.router-link-active .p-menuitem-icon,
    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem-link[aria-current="page"] .p-menuitem-icon {
      color: #0033A0 !important;
      font-weight: bold !important;
    }

    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem-link.router-link-active .p-menuitem-text,
    :host ::ng-deep .p-menubar .p-submenu-list .p-menuitem-link[aria-current="page"] .p-menuitem-text {
      color: #0033A0 !important;
      font-weight: 700 !important;
    }

    /* Icono de flecha del menú padre */
    :host ::ng-deep .p-menubar .p-menuitem.p-menuitem-active > .p-menuitem-link .p-submenu-icon {
      color: #0033A0 !important;
      transform: rotate(180deg) !important;
    }

    :host ::ng-deep .p-menubar .p-menuitem-link .p-submenu-icon {
      color: #74ACDF !important;
      font-size: 0.75rem !important;
      transition: all 0.3s ease !important;
      margin-left: 0.5rem !important;
    }

    :host ::ng-deep .p-avatar {
      width: 2rem !important;
      height: 2rem !important;
      font-size: 0.875rem !important;
    }

    /* Tablet (769px - 1024px) */
    @media (max-width: 1024px) and (min-width: 769px) {
      .navbar-container {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      :host ::ng-deep .p-menubar {
        padding: 0.625rem 1.25rem !important;
      }

      .brand {
        font-size: 1rem;
        gap: 0.625rem;
      }

      .logo-circle {
        width: 2.25rem;
        height: 2.25rem;
      }

      .logo-circle i {
        font-size: 1.125rem;
      }

      .user-section {
        gap: 0.625rem;
      }

      .user-name {
        font-size: 0.75rem;
      }

      .auth-buttons {
        gap: 0.375rem;
      }

      :host ::ng-deep .p-button {
        padding: 0.5rem 0.875rem !important;
        font-size: 0.75rem !important;
      }
    }

    /* Mobile y Tablet (max-width: 1024px) - Menu hamburguesa */
    @media (max-width: 1024px) {
      .navbar-container {
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      }

      :host ::ng-deep .p-menubar {
        padding: 0.5rem 0.75rem !important;
      }

      .brand span {
        display: none;
      }

      .brand {
        padding: 0 0.5rem;
      }

      .logo-circle {
        width: 2rem;
        height: 2rem;
      }

      .logo-circle i {
        font-size: 1rem;
      }

      .user-name {
        display: none;
      }

      .user-section {
        gap: 0.5rem;
      }

      .user-avatar-circle {
        width: 2rem;
        height: 2rem;
        font-size: 0.75rem;
      }

      :host ::ng-deep .p-button {
        padding: 0.5rem 0.75rem !important;
        font-size: 0.75rem !important;
      }

      :host ::ng-deep .p-button .p-button-label {
        display: none !important;
      }

      :host ::ng-deep .p-button .p-button-icon {
        margin: 0 !important;
        font-size: 1rem !important;
      }

      /* Ocultar menú por defecto en mobile/tablet */
      :host ::ng-deep .p-menubar .p-menubar-root-list {
        display: none !important;
      }

      /* Mostrar menú solo cuando está activo */
      :host ::ng-deep .p-menubar-mobile-active .p-menubar-root-list {
        display: flex !important;
        flex-direction: column !important;
        gap: 0 !important;
        position: fixed !important;
        top: 60px !important;
        left: 0 !important;
        right: 0 !important;
        width: 100vw !important;
        max-width: 100vw !important;
        height: auto !important;
        max-height: calc(100vh - 60px) !important;
        overflow-y: auto !important;
        background: white !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        padding: 1rem !important;
        border-radius: 0 !important;
        border: none !important;
        border-top: 1px solid #e5e7eb !important;
        margin: 0 !important;
        z-index: 1001 !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-menuitem {
        margin-bottom: 0.25rem !important;
        width: 100% !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link {
        background: white !important;
        border: none !important;
        border-radius: 10px !important;
        padding: 1rem 1.25rem !important;
        display: flex !important;
        align-items: center !important;
        gap: 1rem !important;
        transition: all 0.2s ease !important;
        border-left: 4px solid transparent !important;
        position: relative !important;
        width: 100% !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link::before {
        content: '' !important;
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        bottom: 0 !important;
        width: 0 !important;
        background: linear-gradient(90deg, #74ACDF 0%, rgba(116, 172, 223, 0.1) 100%) !important;
        transition: width 0.3s ease !important;
        border-radius: 8px 0 0 8px !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link:hover::before {
        width: 100% !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link:hover {
        border-left-color: #74ACDF !important;
        border-left-width: 4px !important;
        transform: translateX(2px) !important;
        box-shadow: 0 2px 8px rgba(116, 172, 223, 0.2) !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link .p-menuitem-icon {
        font-size: 1.375rem !important;
        color: #74ACDF !important;
        min-width: 1.5rem !important;
        transition: all 0.3s ease !important;
        z-index: 1 !important;
        position: relative !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link:hover .p-menuitem-icon {
        color: #0033A0 !important;
        transform: scale(1.2) !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link .p-menuitem-text {
        font-size: 1rem !important;
        font-weight: 600 !important;
        color: #2c3e50 !important;
        transition: all 0.2s ease !important;
        z-index: 1 !important;
        position: relative !important;
        flex: 1 !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link:hover .p-menuitem-text {
        color: #0033A0 !important;
        font-weight: 700 !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link.router-link-active,
      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link[aria-current="page"] {
        background: linear-gradient(90deg, #74ACDF 0%, rgba(116, 172, 223, 0.3) 100%) !important;
        border-left-color: #0033A0 !important;
        border-left-width: 5px !important;
        box-shadow: 0 4px 12px rgba(0, 51, 160, 0.25) !important;
        transform: translateX(3px) !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link.router-link-active::before,
      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link[aria-current="page"]::before {
        width: 100% !important;
        background: linear-gradient(90deg, rgba(0, 51, 160, 0.15) 0%, rgba(116, 172, 223, 0.05) 100%) !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link.router-link-active .p-menuitem-icon,
      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link[aria-current="page"] .p-menuitem-icon {
        color: #0033A0 !important;
        font-weight: bold !important;
        transform: scale(1.15) !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link.router-link-active .p-menuitem-text,
      :host ::ng-deep .p-menubar-mobile-active .p-menuitem-link[aria-current="page"] .p-menuitem-text {
        color: #0033A0 !important;
        font-weight: 700 !important;
        letter-spacing: 0.3px !important;
      }

      :host ::ng-deep .p-menubar-mobile-active .p-submenu-list {
        background: #f8f9fa !important;
        border-radius: 8px !important;
        padding: 0.5rem !important;
        margin-top: 0.5rem !important;
        margin-left: 1rem !important;
        border-left: 3px solid #74ACDF !important;
      }
    }
  `]
})
export class NavbarComponent implements AfterViewInit {
  private store = inject(Store);
  private router = inject(Router);
  private elementRef = inject(ElementRef);
  private navbarService = inject(NavbarService);

  // Usar el signal del servicio
  showMobileMenu = this.navbarService.mobileMenuOpen;

  ngAfterViewInit() {
    // Escuchar clicks en el botón hamburguesa para actualizar el signal
    const menubarElement = this.elementRef.nativeElement.querySelector('.p-menubar');
    const button = menubarElement?.querySelector('.p-menubar-button') as HTMLElement;

    if (button) {
      button.addEventListener('click', () => {
        // Esperar un momento para que PrimeNG actualice el DOM
        setTimeout(() => {
          const isOpen = menubarElement?.classList.contains('p-menubar-mobile-active');
          if (isOpen) {
            this.navbarService.openMobileMenu();
          } else {
            this.navbarService.closeMobileMenu();
          }
        }, 50);
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      // Cerrar el menú móvil si está abierto
      const menubarElement = this.elementRef.nativeElement.querySelector('.p-menubar');
      if (menubarElement && menubarElement.classList.contains('p-menubar-mobile-active')) {
        const button = menubarElement.querySelector('.p-menubar-button') as HTMLElement;
        if (button) {
          button.click();
        }
      }
    }
  }

  isAuthenticated = toSignal(this.store.select(fromAuth.selectIsAuthenticated), { initialValue: false });
  user = toSignal(this.store.select(fromAuth.selectUser), { initialValue: null });
  isAdmin = toSignal(this.store.select(fromAuth.selectIsAdmin), { initialValue: false });

  menuItems = toSignal(
    combineLatest([
      this.store.select(fromAuth.selectIsAuthenticated),
      this.store.select(fromAuth.selectIsAdmin)
    ]).pipe(
      map(([isAuth, isAdmin]) => this.getMenuItems(isAuth, isAdmin))
    ),
    { initialValue: this.getMenuItems(false, false) }
  );

  private getMenuItems(isAuthenticated: boolean, isAdmin: boolean): MenuItem[] {
    const publicItems: MenuItem[] = [
      {
        label: 'Espacios',
        icon: 'pi pi-building',
        routerLink: '/spaces',
        routerLinkActiveOptions: { exact: false },
        command: () => this.closeMobileMenu(),
      },
      {
        label: 'Calendario',
        icon: 'pi pi-calendar',
        routerLink: '/calendar',
        routerLinkActiveOptions: { exact: false },
        command: () => this.closeMobileMenu(),
      },
    ];

    if (!isAuthenticated) {
      return publicItems;
    }

    const authenticatedItems: MenuItem[] = [
      ...publicItems,
      {
        label: 'Mis Reservas',
        icon: 'pi pi-bookmark',
        routerLink: '/bookings',
        routerLinkActiveOptions: { exact: false },
        command: () => this.closeMobileMenu(),
      },
    ];

    // Usar el parámetro isAdmin en lugar del signal this.isAdmin()
    if (isAdmin) {
      authenticatedItems.push({
        label: 'Gestión de Espacios',
        icon: 'pi pi-cog',
        routerLink: '/admin/spaces',
        routerLinkActiveOptions: { exact: false },
        command: () => this.closeMobileMenu(),
      });
    }

    return authenticatedItems;
  }

  closeMobileMenu() {
    const menubarElement = this.elementRef.nativeElement.querySelector('.p-menubar');
    if (menubarElement?.classList.contains('p-menubar-mobile-active')) {
      const button = menubarElement.querySelector('.p-menubar-button') as HTMLElement;
      button?.click();
      // El signal se actualizará automáticamente por el listener en ngAfterViewInit
    }
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/login']);
  }

  getUserInitials(): string {
    const name = this.user()?.name || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
