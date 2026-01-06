import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { SpaceService } from '../../../services/space.service';
import * as SpacesActions from './spaces.actions';

/**
 * Spaces Effects
 * Handles side effects for spaces management
 */
@Injectable()
export class SpacesEffects {
  private actions$ = inject(Actions);
  private spaceService = inject(SpaceService);

  /**
   * Load Spaces Effect
   */
  loadSpaces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpacesActions.loadSpaces),
      switchMap(({ filters }) =>
        this.spaceService.getSpaces(filters).pipe(
          map((response) => SpacesActions.loadSpacesSuccess({ response })),
          catchError((error) =>
            of(SpacesActions.loadSpacesFailure({ error: error.error?.message || 'Error al cargar espacios' }))
          )
        )
      )
    )
  );

  /**
   * Load Space Detail Effect
   */
  loadSpaceDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpacesActions.loadSpaceDetail, SpacesActions.loadSpaceById),
      switchMap(({ id }) =>
        this.spaceService.getSpace(id).pipe(
          map((space) => SpacesActions.loadSpaceDetailSuccess({ space })),
          catchError((error) =>
            of(SpacesActions.loadSpaceDetailFailure({ error: error.error?.message || 'Error al cargar detalle' }))
          )
        )
      )
    )
  );

  /**
   * Load Space Types Effect
   */
  loadSpaceTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpacesActions.loadSpaceTypes),
      switchMap(() =>
        this.spaceService.getSpaceTypes().pipe(
          map((types) => SpacesActions.loadSpaceTypesSuccess({ types })),
          catchError((error) =>
            of(SpacesActions.loadSpaceTypesFailure({ error: error.error?.message || 'Error al cargar tipos' }))
          )
        )
      )
    )
  );

  /**
   * Check Availability Effect
   */
  checkAvailability$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpacesActions.checkAvailability),
      switchMap(({ spaceId, startTime, endTime }) =>
        this.spaceService.checkAvailability(spaceId, startTime, endTime).pipe(
          map((response) =>
            SpacesActions.checkAvailabilitySuccess({
              available: response.available,
              spaceId: response.space_id,
            })
          ),
          catchError((error) =>
            of(SpacesActions.checkAvailabilityFailure({ error: error.error?.message || 'Error al verificar disponibilidad' }))
          )
        )
      )
    )
  );

  /**
   * Load All Spaces Effect (Admin)
   */
  loadAllSpaces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpacesActions.loadAllSpaces),
      switchMap(({ page, sortField, sortOrder }) =>
        this.spaceService.getAllSpaces(page, sortField, sortOrder).pipe(
          map((response) => SpacesActions.loadAllSpacesSuccess({ response })),
          catchError((error) =>
            of(SpacesActions.loadAllSpacesFailure({ error: error.error?.message || 'Error al cargar espacios' }))
          )
        )
      )
    )
  );

  /**
   * Create Space Effect (Admin)
   */
  createSpace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpacesActions.createSpace),
      switchMap(({ space }) =>
        this.spaceService.createSpace(space).pipe(
          map((response) =>
            SpacesActions.createSpaceSuccess({
              space: response.space,
              message: response.message,
            })
          ),
          catchError((error) =>
            of(SpacesActions.createSpaceFailure({ error: error.error?.errors || 'Error al crear espacio' }))
          )
        )
      )
    )
  );

  /**
   * Update Space Effect (Admin)
   */
  updateSpace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpacesActions.updateSpace),
      switchMap(({ id, space }) =>
        this.spaceService.updateSpace(id, space).pipe(
          map((response) =>
            SpacesActions.updateSpaceSuccess({
              space: response.space,
              message: response.message,
            })
          ),
          catchError((error) =>
            of(SpacesActions.updateSpaceFailure({ error: error.error?.errors || 'Error al actualizar espacio' }))
          )
        )
      )
    )
  );

  /**
   * Delete Space Effect (Admin)
   */
  deleteSpace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SpacesActions.deleteSpace),
      switchMap(({ id }) =>
        this.spaceService.deleteSpace(id).pipe(
          map((response) =>
            SpacesActions.deleteSpaceSuccess({
              id,
              message: response.message,
            })
          ),
          catchError((error) =>
            of(SpacesActions.deleteSpaceFailure({ error: error.error?.message || 'Error al eliminar espacio' }))
          )
        )
      )
    )
  );

  /**
   * Success Messages Effect
   * Shows toast notifications for successful operations
   */
  showSuccessMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          SpacesActions.createSpaceSuccess,
          SpacesActions.updateSpaceSuccess,
          SpacesActions.deleteSpaceSuccess
        ),
        tap(({ message }) => {
          // TODO: Integrate with toast/notification service
          console.log('✅', message);
        })
      ),
    { dispatch: false }
  );
}
