import { RouterReducerState } from '@ngrx/router-store';

/**
 * Main application state interface
 * Each feature registers its own state via provideState
 */
export interface AppState {
  router: RouterReducerState;
}

/**
 * Root selectors for accessing router state
 */
export const selectRouter = (state: AppState) => state.router;

