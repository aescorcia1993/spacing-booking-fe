import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/spaces', 
    pathMatch: 'full' 
  },
  
  // Auth routes (public)
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  
  // Spaces routes (public - read only, auth required for booking)
  { 
    path: 'spaces', 
    loadComponent: () => import('./features/spaces/spaces-list/spaces-list.component').then(m => m.SpacesListComponent)
  },
  { 
    path: 'spaces/:id', 
    loadComponent: () => import('./features/spaces/space-detail/space-detail.component').then(m => m.SpaceDetailComponent)
  },
  
  // Bookings routes (auth required)
  { 
    path: 'bookings', 
    loadComponent: () => import('./features/bookings/bookings-list/bookings-list.component').then(m => m.BookingsListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'bookings/new/:spaceId', 
    loadComponent: () => import('./features/bookings/booking-form/booking-form.component').then(m => m.BookingFormComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'bookings/:id/edit', 
    loadComponent: () => import('./features/bookings/booking-form/booking-form.component').then(m => m.BookingFormComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'calendar', 
    loadComponent: () => import('./features/bookings/space-calendar/space-calendar.component').then(m => m.SpaceCalendarComponent)
  },
  
  // Admin routes (admin only)
  { 
    path: 'admin/spaces', 
    loadComponent: () => import('./features/admin/spaces-admin/spaces-admin.component').then(m => m.SpacesAdminComponent),
    canActivate: [authGuard, adminGuard]
  },
  
  // Storybook / Documentation (public)
  {
    path: 'storybook',
    loadComponent: () => import('./features/storybook/mc-table-demo/mc-table-demo.component').then(m => m.McTableDemoComponent)
  },
  
  // Fallback
  { 
    path: '**', 
    redirectTo: '/spaces' 
  }
];
