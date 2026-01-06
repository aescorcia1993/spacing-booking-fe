import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { BookingService } from '../../../services/booking.service';
import * as BookingsActions from './bookings.actions';

/**
 * Bookings Effects
 * Handles side effects for bookings management
 */
@Injectable()
export class BookingsEffects {
  private actions$ = inject(Actions);
  private bookingService = inject(BookingService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private store = inject(Store);

  /**
   * Load My Bookings Effect
   */
  loadMyBookings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.loadMyBookings),
      switchMap(({ filters }) =>
        this.bookingService.getMyBookings(filters).pipe(
          map((response) => BookingsActions.loadMyBookingsSuccess({ response: response.data })),
          catchError((error) =>
            of(
              BookingsActions.loadMyBookingsFailure({
                error: error.error?.message || 'Error al cargar reservas',
              })
            )
          )
        )
      )
    )
  );

  /**
   * Load Booking Detail Effect
   */
  loadBookingDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.loadBookingDetail),
      switchMap(({ id }) =>
        this.bookingService.getBooking(id).pipe(
          map((booking) => BookingsActions.loadBookingDetailSuccess({ booking })),
          catchError((error) =>
            of(
              BookingsActions.loadBookingDetailFailure({
                error: error.error?.message || 'Error al cargar detalle',
              })
            )
          )
        )
      )
    )
  );

  /**
   * Load Space Bookings Effect
   */
  loadSpaceBookings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.loadSpaceBookings),
      switchMap(({ spaceId, startDate, endDate }) =>
        this.bookingService.getSpaceBookings(spaceId, startDate, endDate).pipe(
          map((bookings) =>
            BookingsActions.loadSpaceBookingsSuccess({ bookings, spaceId })
          ),
          catchError((error) =>
            of(
              BookingsActions.loadSpaceBookingsFailure({
                error: error.error?.message || 'Error al cargar reservas del espacio',
              })
            )
          )
        )
      )
    )
  );

  /**
   * Create Booking Effect
   */
  createBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.createBooking),
      tap(({ booking }) => console.log('📤 Llamando al backend para crear reserva:', booking)),
      switchMap(({ booking }) =>
        this.bookingService.createBooking(booking).pipe(
          tap((response) => console.log('✅ Respuesta del backend:', response)),
          map((response) =>
            BookingsActions.createBookingSuccess({
              booking: response.booking,
              message: response.message,
            })
          ),
          catchError((error) => {
            console.error('❌ Error del backend:', error);
            return of(
              BookingsActions.createBookingFailure({
                error: error.error?.message || error.error?.errors || 'Error al crear reserva',
              })
            );
          })
        )
      )
    )
  );

  /**
   * Create Booking Success Effect
   */
  createBookingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BookingsActions.createBookingSuccess),
        tap(({ message }) => {
          console.log('✅ Reserva creada exitosamente:', message);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: message || 'Reserva creada exitosamente',
          });
          // Recargar las reservas del usuario
          this.store.dispatch(BookingsActions.loadMyBookings({}));
          setTimeout(() => this.router.navigate(['/bookings']), 1000);
        })
      ),
    { dispatch: false }
  );

  /**
   * Create Booking Failure Effect
   */
  createBookingFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BookingsActions.createBookingFailure),
        tap(({ error }) => {
          console.error('❌ Error al crear reserva:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error || 'No se pudo crear la reserva',
          });
        })
      ),
    { dispatch: false }
  );

  /**
   * Update Booking Effect
   */
  updateBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.updateBooking),
      switchMap(({ id, booking }) =>
        this.bookingService.updateBooking(id, booking).pipe(
          map((response) =>
            BookingsActions.updateBookingSuccess({
              booking: response.booking,
              message: response.message,
            })
          ),
          catchError((error) =>
            of(
              BookingsActions.updateBookingFailure({
                error: error.error?.message || error.error?.errors || 'Error al actualizar reserva',
              })
            )
          )
        )
      )
    )
  );

  /**
   * Cancel Booking Effect
   */
  cancelBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.cancelBooking),
      switchMap(({ id }) =>
        this.bookingService.cancelBooking(id).pipe(
          map((response) =>
            BookingsActions.cancelBookingSuccess({
              booking: response.booking,
              message: response.message,
            })
          ),
          catchError((error) =>
            of(
              BookingsActions.cancelBookingFailure({
                error: error.error?.message || 'Error al cancelar reserva',
              })
            )
          )
        )
      )
    )
  );

  /**
   * Delete Booking Effect
   */
  deleteBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.deleteBooking),
      switchMap(({ id }) =>
        this.bookingService.deleteBooking(id).pipe(
          map((response) =>
            BookingsActions.deleteBookingSuccess({
              id,
              message: response.message,
            })
          ),
          catchError((error) =>
            of(
              BookingsActions.deleteBookingFailure({
                error: error.error?.message || 'Error al eliminar reserva',
              })
            )
          )
        )
      )
    )
  );

  /**
   * Success Messages Effect
   */
  showSuccessMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          BookingsActions.createBookingSuccess,
          BookingsActions.updateBookingSuccess,
          BookingsActions.cancelBookingSuccess,
          BookingsActions.deleteBookingSuccess
        ),
        tap(({ message }) => {
          // TODO: Integrate with toast/notification service
          console.log('✅', message);
        })
      ),
    { dispatch: false }
  );
}
