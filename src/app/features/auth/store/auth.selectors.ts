import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState, authFeatureKey } from './auth.reducer';

/**
 * Feature Selector
 * Selects the auth slice of state
 */
export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

/**
 * Memoized Selectors
 * Efficiently select specific parts of auth state
 */

// Basic selectors
export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

// Computed selectors
export const selectIsAdmin = createSelector(
  selectUser,
  (user) => user?.is_admin ?? false
);

export const selectUserName = createSelector(
  selectUser,
  (user) => user?.name ?? ''
);

export const selectUserEmail = createSelector(
  selectUser,
  (user) => user?.email ?? ''
);

// Combined selectors
export const selectAuthStatus = createSelector(
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  (isAuthenticated, loading, error) => ({
    isAuthenticated,
    loading,
    error,
  })
);

export const selectUserProfile = createSelector(
  selectUser,
  selectIsAdmin,
  (user, isAdmin) => ({
    user,
    isAdmin,
  })
);
