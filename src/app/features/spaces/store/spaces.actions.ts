import { createAction, props } from '@ngrx/store';
import { Space, PaginatedResponse } from '../../../models/booking.model';

/**
 * Spaces Actions
 * CRUD operations for spaces management
 */

// Load Spaces (Public)
export const loadSpaces = createAction(
  '[Spaces/List Page] Load Spaces',
  props<{ filters?: { type?: string; capacity?: number; date?: string; page?: number } }>()
);

export const loadSpacesSuccess = createAction(
  '[Spaces/API] Load Spaces Success',
  props<{ response: PaginatedResponse<Space> }>()
);

export const loadSpacesFailure = createAction(
  '[Spaces/API] Load Spaces Failure',
  props<{ error: any }>()
);

// Load Space Detail
export const loadSpaceDetail = createAction(
  '[Spaces/Detail Page] Load Space Detail',
  props<{ id: number }>()
);

export const loadSpaceById = createAction(
  '[Spaces/Component] Load Space By ID',
  props<{ id: number }>()
);

export const loadSpaceDetailSuccess = createAction(
  '[Spaces/API] Load Space Detail Success',
  props<{ space: Space }>()
);

export const loadSpaceDetailFailure = createAction(
  '[Spaces/API] Load Space Detail Failure',
  props<{ error: any }>()
);

// Load Space Types
export const loadSpaceTypes = createAction('[Spaces/App Init] Load Space Types');

export const loadSpaceTypesSuccess = createAction(
  '[Spaces/API] Load Space Types Success',
  props<{ types: string[] }>()
);

export const loadSpaceTypesFailure = createAction(
  '[Spaces/API] Load Space Types Failure',
  props<{ error: any }>()
);

// Check Availability
export const checkAvailability = createAction(
  '[Spaces/Booking Form] Check Availability',
  props<{ spaceId: number; startTime: string; endTime: string }>()
);

export const checkAvailabilitySuccess = createAction(
  '[Spaces/API] Check Availability Success',
  props<{ available: boolean; spaceId: number }>()
);

export const checkAvailabilityFailure = createAction(
  '[Spaces/API] Check Availability Failure',
  props<{ error: any }>()
);

// Admin: Load All Spaces
export const loadAllSpaces = createAction(
  '[Admin/Spaces Page] Load All Spaces',
  props<{ page?: number; sortField?: string; sortOrder?: string }>()
);

export const loadAllSpacesSuccess = createAction(
  '[Admin/API] Load All Spaces Success',
  props<{ response: PaginatedResponse<Space> }>()
);

export const loadAllSpacesFailure = createAction(
  '[Admin/API] Load All Spaces Failure',
  props<{ error: any }>()
);

// Admin: Create Space
export const createSpace = createAction(
  '[Admin/Space Form] Create Space',
  props<{ space: Partial<Space> }>()
);

export const createSpaceSuccess = createAction(
  '[Admin/API] Create Space Success',
  props<{ space: Space; message: string }>()
);

export const createSpaceFailure = createAction(
  '[Admin/API] Create Space Failure',
  props<{ error: any }>()
);

// Admin: Update Space
export const updateSpace = createAction(
  '[Admin/Space Form] Update Space',
  props<{ id: number; space: Partial<Space> }>()
);

export const updateSpaceSuccess = createAction(
  '[Admin/API] Update Space Success',
  props<{ space: Space; message: string }>()
);

export const updateSpaceFailure = createAction(
  '[Admin/API] Update Space Failure',
  props<{ error: any }>()
);

// Admin: Delete Space
export const deleteSpace = createAction(
  '[Admin/Space List] Delete Space',
  props<{ id: number }>()
);

export const deleteSpaceSuccess = createAction(
  '[Admin/API] Delete Space Success',
  props<{ id: number; message: string }>()
);

export const deleteSpaceFailure = createAction(
  '[Admin/API] Delete Space Failure',
  props<{ error: any }>()
);

// UI Actions
export const setSelectedSpace = createAction(
  '[Spaces/UI] Set Selected Space',
  props<{ spaceId: number | null }>()
);

export const clearSpacesError = createAction('[Spaces/UI] Clear Error');

export const resetSpacesState = createAction('[Spaces/UI] Reset State');
