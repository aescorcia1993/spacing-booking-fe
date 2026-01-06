import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, LaravelPaginatedResponse } from '../models/booking.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bookings`;

  /**
   * Get user's bookings with filters
   */
  getMyBookings(filters?: {
    type?: 'upcoming' | 'active' | 'past';
    status?: string;
    from_date?: string;
    to_date?: string;
    page?: number;
    per_page?: number;
  }): Observable<LaravelPaginatedResponse<Booking>> {
    let params = new HttpParams();

    if (filters?.type) {
      params = params.append('type', filters.type);
    }
    if (filters?.status) {
      params = params.append('status', filters.status);
    }
    if (filters?.from_date) {
      params = params.append('from_date', filters.from_date);
    }
    if (filters?.to_date) {
      params = params.append('to_date', filters.to_date);
    }
    if (filters?.page !== undefined) {
      params = params.append('page', filters.page.toString());
    }
    if (filters?.per_page !== undefined) {
      params = params.append('per_page', filters.per_page.toString());
    }

    return this.http.get<LaravelPaginatedResponse<Booking>>(this.apiUrl, { params });
  }

  /**
   * Get booking by ID
   */
  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get bookings for a specific space and date range
   */
  getSpaceBookings(
    spaceId: number,
    startDate: string,
    endDate: string
  ): Observable<Booking[]> {
    const params = new HttpParams()
      .append('start_date', startDate)
      .append('end_date', endDate);

    return this.http.get<Booking[]>(
      `${environment.apiUrl}/spaces/${spaceId}/bookings`,
      { params }
    );
  }

  /**
   * Create new booking
   */
  createBooking(booking: {
    space_id: number;
    event_name: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    notes?: string;
    description?: string;
  }): Observable<{ message: string; booking: Booking }> {
    return this.http.post<any>(this.apiUrl, booking);
  }

  /**
   * Update booking
   */
  updateBooking(
    id: number,
    booking: Partial<Booking>
  ): Observable<{ message: string; booking: Booking }> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, booking);
  }

  /**
   * Cancel booking
   */
  cancelBooking(id: number): Observable<{ message: string; booking: Booking }> {
    return this.http.post<any>(`${this.apiUrl}/${id}/cancel`, {});
  }

  /**
   * Delete booking
   */
  deleteBooking(id: number): Observable<{ message: string }> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get all bookings (for calendar view with optional filters)
   */
  getAllBookings(
    startDate?: string,
    endDate?: string
  ): Observable<Booking[]> {
    let params = new HttpParams();

    if (startDate) {
      params = params.append('start_date', startDate);
    }
    if (endDate) {
      params = params.append('end_date', endDate);
    }

    return this.http.get<Booking[]>(`${this.apiUrl}/all`, { params });
  }
}
