import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SpacesState, spacesFeatureKey, selectAllSpaces, selectSpaceEntities } from './spaces.reducer';

/**
 * Feature Selector
 */
export const selectSpacesState = createFeatureSelector<SpacesState>(spacesFeatureKey);

/**
 * Entity Selectors
 */
export const selectSpaces = createSelector(selectSpacesState, selectAllSpaces);

export const selectSpaceEntitiesMap = createSelector(selectSpacesState, selectSpaceEntities);

/**
 * Basic Selectors
 */
export const selectSpacesLoading = createSelector(
  selectSpacesState,
  (state) => state.loading
);

export const selectSpacesLoadingDetail = createSelector(
  selectSpacesState,
  (state) => state.loadingDetail
);

export const selectSpacesError = createSelector(
  selectSpacesState,
  (state) => state.error
);

export const selectSpacesPagination = createSelector(
  selectSpacesState,
  (state) => state.pagination
);

export const selectSpaceTypes = createSelector(
  selectSpacesState,
  (state) => state.spaceTypes
);

export const selectSelectedSpaceId = createSelector(
  selectSpacesState,
  (state) => state.selectedSpaceId
);

export const selectSelectedSpace = createSelector(
  selectSpacesState,
  (state) => state.selectedSpace
);

export const selectAvailabilityCheck = createSelector(
  selectSpacesState,
  (state) => state.availabilityCheck
);

/**
 * Computed Selectors
 */

// Get space by ID
export const selectSpaceById = (id: number) =>
  createSelector(selectSpaceEntitiesMap, (entities) => entities[id] || null);

// Get spaces by type
export const selectSpacesByType = (type: string) =>
  createSelector(selectSpaces, (spaces) =>
    spaces.filter((space) => space.type === type)
  );

// Get active spaces only
export const selectActiveSpaces = createSelector(selectSpaces, (spaces) =>
  spaces.filter((space) => space.is_active)
);

// Get spaces with minimum capacity
export const selectSpacesByMinCapacity = (minCapacity: number) =>
  createSelector(selectSpaces, (spaces) =>
    spaces.filter((space) => space.capacity >= minCapacity)
  );

// Check if a specific space is available
export const selectSpaceAvailability = (spaceId: number) =>
  createSelector(
    selectAvailabilityCheck,
    (availabilityCheck) => availabilityCheck[spaceId] ?? null
  );

/**
 * Combined Selectors
 */
export const selectSpacesLoadingState = createSelector(
  selectSpacesLoading,
  selectSpacesLoadingDetail,
  selectSpacesError,
  (loading, loadingDetail, error) => ({
    loading,
    loadingDetail,
    error,
  })
);

export const selectSpacesViewModel = createSelector(
  selectSpaces,
  selectSpacesLoading,
  selectSpacesPagination,
  selectSpaceTypes,
  (spaces, loading, pagination, types) => ({
    spaces,
    loading,
    pagination,
    types,
  })
);

export const selectSpaceDetailViewModel = createSelector(
  selectSelectedSpace,
  selectSpacesLoadingDetail,
  selectSpacesError,
  (space, loading, error) => ({
    space,
    loading,
    error,
  })
);
