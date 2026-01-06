import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  BookingsState,
  bookingsFeatureKey,
  selectAllBookings,
  selectBookingEntities,
} from './bookings.reducer';

/**
 * Feature Selector
 */
export const selectBookingsState = createFeatureSelector<BookingsState>(bookingsFeatureKey);

/**
 * Entity Selectors
 */
export const selectBookings = createSelector(selectBookingsState, selectAllBookings);

export const selectBookingEntitiesMap = createSelector(selectBookingsState, selectBookingEntities);

/**
 * Basic Selectors
 */
export const selectBookingsLoading = createSelector(
  selectBookingsState,
  (state) => state.loading
);

export const selectBookingsLoadingDetail = createSelector(
  selectBookingsState,
  (state) => state.loadingDetail
);

export const selectBookingsError = createSelector(
  selectBookingsState,
  (state) => state.error
);

export const selectBookingsPagination = createSelector(
  selectBookingsState,
  (state) => state.pagination
);

export const selectSelectedBookingId = createSelector(
  selectBookingsState,
  (state) => state.selectedBookingId
);

export const selectSelectedBooking = createSelector(
  selectBookingsState,
  (state) => state.selectedBooking
);

export const selectBookingsFilters = createSelector(
  selectBookingsState,
  (state) => state.filters
);

export const selectSpaceBookings = createSelector(
  selectBookingsState,
  (state) => state.spaceBookings
);

/**
 * Computed Selectors
 */

// Get booking by ID
export const selectBookingById = (id: number) =>
  createSelector(selectBookingEntitiesMap, (entities) => entities[id] || null);

// Get bookings by status
export const selectBookingsByStatus = (status: string) =>
  createSelector(selectBookings, (bookings) =>
    bookings.filter((booking) => booking.status === status)
  );

// Get active bookings (confirmed/pending and happening right now)
export const selectActiveBookings = createSelector(selectBookings, (bookings) => {
  const now = new Date();

  return bookings.filter(
    (booking) =>
      (booking.status === 'confirmed' || booking.status === 'pending') &&
      booking.start_datetime &&
      booking.end_datetime &&
      new Date(booking.start_datetime) <= now &&
      new Date(booking.end_datetime) >= now
  ).sort((a, b) =>
    new Date(a.start_datetime || a.start_time).getTime() -
    new Date(b.start_datetime || b.start_time).getTime()
  );
});

// Get past bookings (completed, cancelled, or already finished)
export const selectPastBookings = createSelector(selectBookings, (bookings) => {
  const now = new Date();
  return bookings.filter((booking) => {
    // Incluir si está cancelada o completada
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return true;
    }
    // Incluir si ya terminó (independientemente del estado)
    if (booking.end_datetime && new Date(booking.end_datetime) < now) {
      return true;
    }
    return false;
  }).sort((a, b) =>
    new Date(b.end_datetime || b.end_time).getTime() -
    new Date(a.end_datetime || a.end_time).getTime()
  );
});

// Get upcoming bookings (future confirmed or pending bookings that haven't started yet)
export const selectUpcomingBookings = createSelector(selectBookings, (bookings) => {
  const now = new Date();

  return bookings
    .filter(
      (booking) =>
        (booking.status === 'confirmed' || booking.status === 'pending') &&
        booking.start_datetime &&
        new Date(booking.start_datetime) > now
    )
    .sort(
      (a, b) =>
        new Date(a.start_datetime || a.start_time).getTime() -
        new Date(b.start_datetime || b.start_time).getTime()
    );
});

// Get bookings for a specific space
export const selectBookingsForSpace = (spaceId: number) =>
  createSelector(selectSpaceBookings, (spaceBookings) => spaceBookings[spaceId] || []);

// Get cancelled bookings
export const selectCancelledBookings = createSelector(selectBookings, (bookings) =>
  bookings.filter((booking) => booking.status === 'cancelled')
);

/**
 * Statistics Selectors
 */
export const selectBookingsStats = createSelector(selectBookings, (bookings) => {
  const now = new Date();
  return {
    total: bookings.length,
    active: bookings.filter(
      (b) => b.status === 'confirmed' && new Date(b.end_time) >= now
    ).length,
    upcoming: bookings.filter(
      (b) => b.status === 'confirmed' && new Date(b.start_time) > now
    ).length,
    past: bookings.filter((b) => new Date(b.end_time) < now).length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  };
});

/**
 * Combined Selectors
 */
export const selectBookingsLoadingState = createSelector(
  selectBookingsLoading,
  selectBookingsLoadingDetail,
  selectBookingsError,
  (loading, loadingDetail, error) => ({
    loading,
    loadingDetail,
    error,
  })
);

export const selectBookingsViewModel = createSelector(
  selectBookings,
  selectBookingsLoading,
  selectBookingsPagination,
  selectBookingsFilters,
  selectBookingsStats,
  (bookings, loading, pagination, filters, stats) => ({
    bookings,
    loading,
    pagination,
    filters,
    stats,
  })
);

export const selectBookingDetailViewModel = createSelector(
  selectSelectedBooking,
  selectBookingsLoadingDetail,
  selectBookingsError,
  (booking, loading, error) => ({
    booking,
    loading,
    error,
  })
);
