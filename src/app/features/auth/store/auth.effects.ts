import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import * as AuthActions from './auth.actions';

/**
 * Auth Effects
 * Handles side effects for authentication actions
 */
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Login Effect
   * Handles user login and stores token
   */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) => {
            // Store token in localStorage
            localStorage.setItem('auth_token', response.token);
            return AuthActions.loginSuccess({ response });
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.error?.message || 'Error al iniciar sesión' }))
          )
        )
      )
    )
  );

  /**
   * Login Success Effect
   * Redirects to dashboard after successful login
   */
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.router.navigate(['/spaces']);
        })
      ),
    { dispatch: false }
  );

  /**
   * Register Effect
   * Handles user registration
   */
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ data }) =>
        this.authService.register(data).pipe(
          map((response) => {
            // Store token in localStorage
            localStorage.setItem('auth_token', response.token);
            return AuthActions.registerSuccess({ response });
          }),
          catchError((error) =>
            of(AuthActions.registerFailure({ error: error.error?.errors || 'Error al registrar' }))
          )
        )
      )
    )
  );

  /**
   * Register Success Effect
   * Redirects to dashboard after successful registration
   */
  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => {
          this.router.navigate(['/spaces']);
        })
      ),
    { dispatch: false }
  );

  /**
   * Logout Effect
   * Handles user logout and cleans up token
   */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() => {
            localStorage.removeItem('auth_token');
            return AuthActions.logoutSuccess();
          }),
          catchError((error) => {
            // Even if API fails, remove token locally
            localStorage.removeItem('auth_token');
            return of(AuthActions.logoutSuccess());
          })
        )
      )
    )
  );

  /**
   * Logout Success Effect
   * Redirects to login after logout
   */
  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  /**
   * Load User Effect
   * Fetches current user data
   */
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUser),
      switchMap(() =>
        this.authService.loadUser().pipe(
          map((user) => AuthActions.loadUserSuccess({ user })),
          catchError((error) => {
            // If user load fails, token is probably invalid
            localStorage.removeItem('auth_token');
            return of(AuthActions.loadUserFailure({ error }));
          })
        )
      )
    )
  );

  /**
   * Check Token Effect
   * Validates stored token on app initialization
   */
  checkToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkToken),
      map(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          return AuthActions.tokenValid({ token });
        }
        return AuthActions.tokenInvalid();
      })
    )
  );

  /**
   * Token Valid Effect
   * Loads user data when token is valid
   */
  tokenValid$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.tokenValid),
      map(() => AuthActions.loadUser())
    )
  );
}
