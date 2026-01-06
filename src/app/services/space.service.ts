import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Space, PaginatedResponse } from '../models/booking.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpaceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/spaces`;
  private adminApiUrl = `${environment.apiUrl}/admin/spaces`;

  /**
   * Get list of available spaces with filters
   */
  getSpaces(filters?: {
    search?: string;
    type?: string;
    capacity?: number;
    date?: string;
    page?: number;
  }): Observable<PaginatedResponse<Space>> {
    let params = new HttpParams();
    
    if (filters?.search) {
      params = params.append('search', filters.search);
    }
    if (filters?.type) {
      params = params.append('type', filters.type);
    }
    if (filters?.capacity) {
      params = params.append('capacity', filters.capacity.toString());
    }
    if (filters?.date) {
      params = params.append('date', filters.date);
    }
    if (filters?.page) {
      params = params.append('page', filters.page.toString());
    }

    return this.http.get<PaginatedResponse<Space>>(this.apiUrl, { params });
  }

  /**
   * Get all spaces (admin only)
   */
  getAllSpaces(page?: number, sortField?: string, sortOrder?: string): Observable<PaginatedResponse<Space>> {
    let params = new HttpParams();
    if (page) {
      params = params.append('page', page.toString());
    }
    if (sortField) {
      params = params.append('sort_field', sortField);
    }
    if (sortOrder) {
      params = params.append('sort_order', sortOrder);
    }
    return this.http.get<PaginatedResponse<Space>>(this.adminApiUrl, { params });
  }

  /**
   * Get space by ID
   */
  getSpace(id: number): Observable<Space> {
    return this.http.get<Space>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get available space types
   */
  getSpaceTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/spaces-types`);
  }

  /**
   * Check availability of a space
   */
  checkAvailability(
    spaceId: number,
    startTime: string,
    endTime: string
  ): Observable<{
    available: boolean;
    space_id: number;
    start_time: string;
    end_time: string;
  }> {
    return this.http.post<any>(`${this.apiUrl}/${spaceId}/check-availability`, {
      start_time: startTime,
      end_time: endTime
    });
  }

  /**
   * Create new space (admin only)
   */
  createSpace(space: Partial<Space>): Observable<{ message: string; space: Space }> {
    return this.http.post<any>(this.adminApiUrl, space);
  }

  /**
   * Update space (admin only)
   */
  updateSpace(id: number, space: Partial<Space>): Observable<{ message: string; space: Space }> {
    return this.http.put<any>(`${this.adminApiUrl}/${id}`, space);
  }

  /**
   * Delete space (admin only)
   */
  deleteSpace(id: number): Observable<{ message: string }> {
    return this.http.delete<any>(`${this.adminApiUrl}/${id}`);
  }
}
