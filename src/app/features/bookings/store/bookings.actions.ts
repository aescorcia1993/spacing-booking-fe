import { createAction, props } from '@ngrx/store';
import { Booking, PaginatedResponse } from '../../../models/booking.model';

/**
 * Bookings Actions
 * CRUD operations for user's bookings
 */

// Load My Bookings
export const loadMyBookings = createAction(
  '[Bookings/List Page] Load My Bookings',
  props<{ filters?: { status?: string; from_date?: string; to_date?: string; page?: number } }>()
);

export const loadMyBookingsSuccess = createAction(
  '[Bookings/API] Load My Bookings Success',
  props<{ response: PaginatedResponse<Booking> }>()
);

export const loadMyBookingsFailure = createAction(
  '[Bookings/API] Load My Bookings Failure',
  props<{ error: any }>()
);

// Load Booking Detail
export const loadBookingDetail = createAction(
  '[Bookings/Detail Page] Load Booking Detail',
  props<{ id: number }>()
);

export const loadBookingDetailSuccess = createAction(
  '[Bookings/API] Load Booking Detail Success',
  props<{ booking: Booking }>()
);

export const loadBookingDetailFailure = createAction(
  '[Bookings/API] Load Booking Detail Failure',
  props<{ error: any }>()
);

// Load Space Bookings (for calendar view)
export const loadSpaceBookings = createAction(
  '[Bookings/Calendar] Load Space Bookings',
  props<{ spaceId: number; startDate: string; endDate: string }>()
);

export const loadSpaceBookingsSuccess = createAction(
  '[Bookings/API] Load Space Bookings Success',
  props<{ bookings: Booking[]; spaceId: number }>()
);

export const loadSpaceBookingsFailure = createAction(
  '[Bookings/API] Load Space Bookings Failure',
  props<{ error: any }>()
);

// Create Booking
export const createBooking = createAction(
  '[Bookings/Form] Create Booking',
  props<{
    booking: {
      space_id: number;
      event_name: string;
      booking_date: string;
      start_time: string;
      end_time: string;
      notes?: string;
      description?: string;
    };
  }>()
);

export const createBookingSuccess = createAction(
  '[Bookings/API] Create Booking Success',
  props<{ booking: Booking; message: string }>()
);

export const createBookingFailure = createAction(
  '[Bookings/API] Create Booking Failure',
  props<{ error: any }>()
);

// Update Booking
export const updateBooking = createAction(
  '[Bookings/Edit Form] Update Booking',
  props<{ id: number; booking: Partial<Booking> }>()
);

export const updateBookingSuccess = createAction(
  '[Bookings/API] Update Booking Success',
  props<{ booking: Booking; message: string }>()
);

export const updateBookingFailure = createAction(
  '[Bookings/API] Update Booking Failure',
  props<{ error: any }>()
);

// Cancel Booking
export const cancelBooking = createAction(
  '[Bookings/List] Cancel Booking',
  props<{ id: number }>()
);

export const cancelBookingSuccess = createAction(
  '[Bookings/API] Cancel Booking Success',
  props<{ booking: Booking; message: string }>()
);

export const cancelBookingFailure = createAction(
  '[Bookings/API] Cancel Booking Failure',
  props<{ error: any }>()
);

// Delete Booking
export const deleteBooking = createAction(
  '[Bookings/List] Delete Booking',
  props<{ id: number }>()
);

export const deleteBookingSuccess = createAction(
  '[Bookings/API] Delete Booking Success',
  props<{ id: number; message: string }>()
);

export const deleteBookingFailure = createAction(
  '[Bookings/API] Delete Booking Failure',
  props<{ error: any }>()
);

// UI Actions
export const setSelectedBooking = createAction(
  '[Bookings/UI] Set Selected Booking',
  props<{ bookingId: number | null }>()
);

export const clearBookingsError = createAction('[Bookings/UI] Clear Error');

export const resetBookingsState = createAction('[Bookings/UI] Reset State');

// Filter Actions
export const setBookingsFilter = createAction(
  '[Bookings/UI] Set Filter',
  props<{ filter: { status?: string; from_date?: string; to_date?: string } }>()
);

export const clearBookingsFilter = createAction('[Bookings/UI] Clear Filter');
