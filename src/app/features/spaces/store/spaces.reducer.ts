import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Space } from '../../../models/booking.model';
import * as SpacesActions from './spaces.actions';

/**
 * Spaces Feature Key
 */
export const spacesFeatureKey = 'spaces';

/**
 * Spaces State Interface
 * Using NgRx Entity for normalized state management
 */
export interface SpacesState extends EntityState<Space> {
  selectedSpaceId: number | null;
  selectedSpace: Space | null;
  spaceTypes: string[];
  availabilityCheck: {
    [spaceId: number]: boolean;
  };
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  } | null;
  loading: boolean;
  loadingDetail: boolean;
  error: any | null;
}

/**
 * Entity Adapter
 * Provides methods for managing Space entities
 */
export const adapter: EntityAdapter<Space> = createEntityAdapter<Space>({
  selectId: (space: Space) => space.id,
  sortComparer: false, // We'll sort by API order
});

/**
 * Initial State
 */
export const initialState: SpacesState = adapter.getInitialState({
  selectedSpaceId: null,
  selectedSpace: null,
  spaceTypes: [],
  availabilityCheck: {},
  pagination: null,
  loading: false,
  loadingDetail: false,
  error: null,
});

/**
 * Spaces Reducer
 */
export const reducer = createReducer(
  initialState,

  // Load Spaces
  on(SpacesActions.loadSpaces, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SpacesActions.loadSpacesSuccess, (state, { response }) =>
    adapter.setAll(response.data, {
      ...state,
      pagination: {
        currentPage: response.current_page,
        lastPage: response.last_page,
        perPage: response.per_page,
        total: response.total,
      },
      loading: false,
      error: null,
    })
  ),

  on(SpacesActions.loadSpacesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Space Detail
  on(SpacesActions.loadSpaceDetail, (state) => ({
    ...state,
    loadingDetail: true,
    error: null,
  })),

  on(SpacesActions.loadSpaceDetailSuccess, (state, { space }) =>
    adapter.upsertOne(space, {
      ...state,
      selectedSpace: space,
      selectedSpaceId: space.id,
      loadingDetail: false,
      error: null,
    })
  ),

  on(SpacesActions.loadSpaceDetailFailure, (state, { error }) => ({
    ...state,
    loadingDetail: false,
    error,
  })),

  // Load Space Types
  on(SpacesActions.loadSpaceTypes, (state) => state),

  on(SpacesActions.loadSpaceTypesSuccess, (state, { types }) => ({
    ...state,
    spaceTypes: types,
  })),

  on(SpacesActions.loadSpaceTypesFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Check Availability
  on(SpacesActions.checkAvailability, (state) => state),

  on(SpacesActions.checkAvailabilitySuccess, (state, { available, spaceId }) => ({
    ...state,
    availabilityCheck: {
      ...state.availabilityCheck,
      [spaceId]: available,
    },
  })),

  on(SpacesActions.checkAvailabilityFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Admin: Load All Spaces
  on(SpacesActions.loadAllSpaces, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SpacesActions.loadAllSpacesSuccess, (state, { response }) =>
    adapter.setAll(response.data, {
      ...state,
      pagination: {
        currentPage: response.current_page,
        lastPage: response.last_page,
        perPage: response.per_page,
        total: response.total,
      },
      loading: false,
      error: null,
    })
  ),

  on(SpacesActions.loadAllSpacesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Admin: Create Space
  on(SpacesActions.createSpace, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SpacesActions.createSpaceSuccess, (state, { space }) =>
    adapter.addOne(space, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(SpacesActions.createSpaceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Admin: Update Space
  on(SpacesActions.updateSpace, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SpacesActions.updateSpaceSuccess, (state, { space }) =>
    adapter.updateOne(
      { id: space.id, changes: space },
      {
        ...state,
        loading: false,
        error: null,
      }
    )
  ),

  on(SpacesActions.updateSpaceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Admin: Delete Space
  on(SpacesActions.deleteSpace, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(SpacesActions.deleteSpaceSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(SpacesActions.deleteSpaceFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // UI Actions
  on(SpacesActions.setSelectedSpace, (state, { spaceId }) => ({
    ...state,
    selectedSpaceId: spaceId,
    selectedSpace: null, // 🔥 Limpiar el espacio anterior al cambiar de ID
  })),

  on(SpacesActions.clearSpacesError, (state) => ({
    ...state,
    error: null,
  })),

  on(SpacesActions.resetSpacesState, () => initialState)
);

/**
 * Entity Selectors
 * Export adapter selectors for use in feature selectors
 */
export const {
  selectIds: selectSpaceIds,
  selectEntities: selectSpaceEntities,
  selectAll: selectAllSpaces,
  selectTotal: selectSpacesTotal,
} = adapter.getSelectors();
