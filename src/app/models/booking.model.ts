export type SpaceType = 'sala-de-reuniones' | 'auditorio' | 'sala-de-conferencias' | 'aula' | 'coworking';

export interface Space {
  id: number;
  name: string;
  description: string;
  type: SpaceType | string;
  capacity: number;
  photos: string[];
  available_hours: {
    [key: string]: {
      start: string;
      end: string;
    };
  };
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  bookings?: Booking[];
}

export interface Booking {
  id: number;
  user_id: number;
  space_id: number;
  event_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  start_datetime?: string;
  end_datetime?: string;
  duration_minutes?: number;
  attendees?: number;
  purpose?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  computed_status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at?: string;
  updated_at?: string;
  space?: Space;
  user?: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
