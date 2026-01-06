import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private _mobileMenuOpen = signal(false);

  // Signal de solo lectura para componentes
  mobileMenuOpen = this._mobileMenuOpen.asReadonly();

  toggleMobileMenu() {
    this._mobileMenuOpen.update(value => !value);
  }

  openMobileMenu() {
    this._mobileMenuOpen.set(true);
  }

  closeMobileMenu() {
    this._mobileMenuOpen.set(false);
  }
}
