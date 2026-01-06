import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import * as AuthActions from './features/auth/store/auth.actions';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  showNavbar = true;

  ngOnInit() {
    // Check for existing token on app initialization
    this.store.dispatch(AuthActions.checkToken());

    // Hide navbar on login and register pages
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbar = !['/login', '/register'].includes(event.urlAfterRedirects);
    });
  }
}
