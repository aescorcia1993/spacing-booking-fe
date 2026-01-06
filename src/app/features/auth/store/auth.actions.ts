import { createAction, props } from '@ngrx/store';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../../../models/user.model';

/**
 * Auth Actions
 * Following the [Source] Event pattern for better action naming
 */

// Login Actions
export const login = createAction(
  '[Auth/Login Page] Login',
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth/API] Login Success',
  props<{ response: AuthResponse }>()
);

export const loginFailure = createAction(
  '[Auth/API] Login Failure',
  props<{ error: any }>()
);

// Register Actions
export const register = createAction(
  '[Auth/Register Page] Register',
  props<{ data: RegisterRequest }>()
);

export const registerSuccess = createAction(
  '[Auth/API] Register Success',
  props<{ response: AuthResponse }>()
);

export const registerFailure = createAction(
  '[Auth/API] Register Failure',
  props<{ error: any }>()
);

// Logout Actions
export const logout = createAction('[Auth/Menu] Logout');

export const logoutSuccess = createAction('[Auth/API] Logout Success');

export const logoutFailure = createAction(
  '[Auth/API] Logout Failure',
  props<{ error: any }>()
);

// Load User Actions
export const loadUser = createAction('[Auth/Guard] Load User');

export const loadUserSuccess = createAction(
  '[Auth/API] Load User Success',
  props<{ user: User }>()
);

export const loadUserFailure = createAction(
  '[Auth/API] Load User Failure',
  props<{ error: any }>()
);

// Token Management
export const checkToken = createAction('[Auth/App Init] Check Token');

export const tokenValid = createAction(
  '[Auth/Token] Token Valid',
  props<{ token: string }>()
);

export const tokenInvalid = createAction('[Auth/Token] Token Invalid');

// Clear Error
export const clearError = createAction('[Auth] Clear Error');
