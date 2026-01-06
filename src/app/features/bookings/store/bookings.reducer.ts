import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Booking } from '../../../models/booking.model';
import * as BookingsActions from './bookings.actions';

/**
 * Bookings Feature Key
 */
export const bookingsFeatureKey = 'bookings';

/**
 * Bookings State Interface
 */
export interface BookingsState extends EntityState<Booking> {
  selectedBookingId: number | null;
  selectedBooking: Booking | null;
  spaceBookings: {
    [spaceId: number]: Booking[];
  };
  filters: {
    status?: string;
    from_date?: string;
    to_date?: string;
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
 */
export const adapter: EntityAdapter<Booking> = createEntityAdapter<Booking>({
  selectId: (booking: Booking) => booking.id,
  sortComparer: (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
});

/**
 * Initial State
 */
export const initialState: BookingsState = adapter.getInitialState({
  selectedBookingId: null,
  selectedBooking: null,
  spaceBookings: {},
  filters: {},
  pagination: null,
  loading: false,
  loadingDetail: false,
  error: null,
});

/**
 * Bookings Reducer
 */
export const reducer = createReducer(
  initialState,

  // Load My Bookings
  on(BookingsActions.loadMyBookings, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BookingsActions.loadMyBookingsSuccess, (state, { response }) =>
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

  on(BookingsActions.loadMyBookingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Booking Detail
  on(BookingsActions.loadBookingDetail, (state) => ({
    ...state,
    loadingDetail: true,
    error: null,
  })),

  on(BookingsActions.loadBookingDetailSuccess, (state, { booking }) =>
    adapter.upsertOne(booking, {
      ...state,
      selectedBooking: booking,
      selectedBookingId: booking.id,
      loadingDetail: false,
      error: null,
    })
  ),

  on(BookingsActions.loadBookingDetailFailure, (state, { error }) => ({
    ...state,
    loadingDetail: false,
    error,
  })),

  // Load Space Bookings
  on(BookingsActions.loadSpaceBookings, (state) => state),

  on(BookingsActions.loadSpaceBookingsSuccess, (state, { bookings, spaceId }) => ({
    ...state,
    spaceBookings: {
      ...state.spaceBookings,
      [spaceId]: bookings,
    },
  })),

  on(BookingsActions.loadSpaceBookingsFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  // Create Booking
  on(BookingsActions.createBooking, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BookingsActions.createBookingSuccess, (state, { booking }) =>
    adapter.addOne(booking, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(BookingsActions.createBookingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Booking
  on(BookingsActions.updateBooking, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BookingsActions.updateBookingSuccess, (state, { booking }) =>
    adapter.updateOne(
      { id: booking.id, changes: booking },
      {
        ...state,
        selectedBooking: booking,
        loading: false,
        error: null,
      }
    )
  ),

  on(BookingsActions.updateBookingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Cancel Booking
  on(BookingsActions.cancelBooking, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BookingsActions.cancelBookingSuccess, (state, { booking }) =>
    adapter.updateOne(
      { id: booking.id, changes: booking },
      {
        ...state,
        loading: false,
        error: null,
      }
    )
  ),

  on(BookingsActions.cancelBookingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Booking
  on(BookingsActions.deleteBooking, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BookingsActions.deleteBookingSuccess, (state, { id }) =>
    adapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
    })
  ),

  on(BookingsActions.deleteBookingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // UI Actions
  on(BookingsActions.setSelectedBooking, (state, { bookingId }) => ({
    ...state,
    selectedBookingId: bookingId,
  })),

  on(BookingsActions.clearBookingsError, (state) => ({
    ...state,
    error: null,
  })),

  on(BookingsActions.resetBookingsState, () => initialState),

  // Filter Actions
  on(BookingsActions.setBookingsFilter, (state, { filter }) => ({
    ...state,
    filters: { ...state.filters, ...filter },
  })),

  on(BookingsActions.clearBookingsFilter, (state) => ({
    ...state,
    filters: {},
  }))
);

/**
 * Entity Selectors
 */
export const {
  selectIds: selectBookingIds,
  selectEntities: selectBookingEntities,
  selectAll: selectAllBookings,
  selectTotal: selectBookingsTotal,
} = adapter.getSelectors();
