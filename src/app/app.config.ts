import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

// Effects
import { AuthEffects } from './features/auth/store/auth.effects';
import { SpacesEffects } from './features/spaces/store/spaces.effects';
import { BookingsEffects } from './features/bookings/store/bookings.effects';

// Reducers
import { reducer as authReducer } from './features/auth/store/auth.reducer';
import { reducer as spacesReducer } from './features/spaces/store/spaces.reducer';
import { reducer as bookingsReducer } from './features/bookings/store/bookings.reducer';

/**
 * Application Configuration
 * Provides all application-wide services and configurations
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Core Angular providers
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    
    // PrimeNG Services
    MessageService,

    // NgRx Store (root + feature states)
    provideStore(),
    provideState({ name: 'auth', reducer: authReducer }),
    provideState({ name: 'spaces', reducer: spacesReducer }),
    provideState({ name: 'bookings', reducer: bookingsReducer }),
    
    // NgRx Effects
    provideEffects([AuthEffects, SpacesEffects, BookingsEffects]),
    
    // NgRx Router Store
    provideRouterStore(),
    
    // NgRx DevTools (only in development)
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ]
};
