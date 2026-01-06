import { Component, input, output, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { Space, Booking } from '../../../models/booking.model';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-space-availability-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    CalendarModule,
    TagModule,
    TableModule,
    SkeletonModule,
  ],
  templateUrl: './space-availability-modal.component.html',
  styleUrl: './space-availability-modal.component.scss'
})
export class SpaceAvailabilityModalComponent {
  private bookingService = inject(BookingService);

  // Inputs & Outputs
  visible = input.required<boolean>();
  space = input.required<Space | null>();
  visibleChange = output<boolean>();

  // Signals
  loading = signal(false);
  bookings = signal<Booking[]>([]);
  selectedDate = signal<Date | null>(null);

  constructor() {
    // 🔥 Effect que recarga las reservas cada vez que el modal se abre
    effect(() => {
      const isVisible = this.visible();
      const currentSpace = this.space();
      
      console.log('📊 Modal visibility changed:', isVisible, 'Space:', currentSpace?.name);
      
      // Solo cargar si el modal está visible Y hay un espacio seleccionado
      if (isVisible && currentSpace) {
        console.log('🔄 Reloading bookings for space:', currentSpace.id);
        this.loadBookings();
      }
    });
  }

  // Computed - Fechas con reservas por estado (solo para marcar en calendario)
  datesWithBookings = computed(() => {
    const dateMap = new Map<string, { confirmed: boolean; pending: boolean }>();
    
    this.bookings().forEach(booking => {
      if (booking.booking_date) {
        // Normalizar la fecha a formato YYYY-MM-DD (eliminar timestamp si existe)
        const normalizedDate = booking.booking_date.split('T')[0];
        const status = (booking.computed_status || booking.status)?.toLowerCase();
        console.log('Processing booking:', normalizedDate, 'status:', status);
        
        // Solo marcamos en el calendario las pendientes y confirmadas
        // Las completadas y canceladas NO se marcan en el calendario
        if (status === 'confirmed' || status === 'pending') {
          const existing = dateMap.get(normalizedDate) || { confirmed: false, pending: false };
          if (status === 'confirmed') existing.confirmed = true;
          if (status === 'pending') existing.pending = true;
          dateMap.set(normalizedDate, existing);
          console.log('Added to map:', normalizedDate, existing);
        }
      }
    });
    
    console.log('Final dateMap:', dateMap);
    return dateMap;
  });

  filteredBookings = computed(() => {
    const selected = this.selectedDate();
    if (!selected) {
      // Si no hay fecha seleccionada, mostrar todas las reservas (incluyendo completadas)
      return this.bookings().sort((a, b) => {
        const dateA = new Date(a.start_datetime || a.booking_date);
        const dateB = new Date(b.start_datetime || b.booking_date);
        return dateA.getTime() - dateB.getTime();
      });
    }
    
    const selectedStr = this.formatDate(selected);
    // Cuando hay fecha seleccionada, mostrar todas las reservas de ese día
    return this.bookings()
      .filter(booking => {
        // Normalizar la fecha de la reserva para comparar
        const bookingDate = booking.booking_date.split('T')[0];
        return bookingDate === selectedStr;
      })
      .sort((a, b) => {
        const timeA = a.start_time || '00:00:00';
        const timeB = b.start_time || '00:00:00';
        return timeA.localeCompare(timeB);
      });
  });

  loadBookings() {
    const currentSpace = this.space();
    if (!currentSpace) return;

    this.loading.set(true);
    
    const now = new Date();
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 días atrás
    const endDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 días adelante

    console.log('Loading bookings for space:', currentSpace.id);
    console.log('Date range:', this.formatDate(startDate), 'to', this.formatDate(endDate));

    this.bookingService.getSpaceBookings(
      currentSpace.id,
      this.formatDate(startDate),
      this.formatDate(endDate)
    ).subscribe({
      next: (bookings) => {
        console.log('Received bookings:', bookings);
        this.bookings.set(bookings);
        this.loading.set(false);
        
        // Log para verificar el mapa de fechas
        const dateMap = this.datesWithBookings();
        console.log('Dates with bookings map:', dateMap);
      },
      error: (error) => {
        console.error('Error loading bookings:', error);
        this.bookings.set([]);
        this.loading.set(false);
      }
    });
  }

  onDateSelect(date: Date) {
    this.selectedDate.set(date);
  }

  closeDialog() {
    console.log('❌ Closing modal - clearing state');
    // Limpiar el estado al cerrar para que la próxima vez empiece fresco
    this.selectedDate.set(null);
    this.bookings.set([]);
    this.visibleChange.emit(false);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      confirmed: 'Confirmada',
      pending: 'Pendiente',
      cancelled: 'Cancelada',
      completed: 'Completada'
    };
    return labels[status?.toLowerCase()] || status;
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    const normalizedStatus = status?.toLowerCase();
    const severities: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
      confirmed: 'success',
      pending: 'warn',
      cancelled: 'danger',
      completed: 'info'
    };
    return severities[normalizedStatus];
  }

  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5); // "HH:MM:SS" -> "HH:MM"
  }

  formatBookingDate(dateString: string): string {
    if (!dateString) return '';
    // Extraer solo la parte de la fecha sin conversión de zona horaria
    const datePart = dateString.split('T')[0];
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  }

  formatDuration(minutes: number): string {
    if (!minutes || isNaN(minutes)) {
      return '0m';
    }
    
    // Redondear los minutos para evitar decimales
    const totalMinutes = Math.round(minutes);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Helper para el template - convierte el objeto date de PrimeNG a fecha formateada
  getDateStr(year: number, month: number, day: number): string {
    // PrimeNG pasa el mes en formato 0-11, así que NO hay que ajustarlo
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr;
  }
  
  // Métodos para verificar si una fecha tiene reservas
  hasConfirmedBooking(year: number, month: number, day: number): boolean {
    const dateStr = this.getDateStr(year, month, day);
    const bookingInfo = this.datesWithBookings().get(dateStr);
    const result = bookingInfo?.confirmed && !bookingInfo?.pending;
    if (result) {
      console.log('Date has confirmed booking:', dateStr);
    }
    return result || false;
  }
  
  hasPendingBooking(year: number, month: number, day: number): boolean {
    const dateStr = this.getDateStr(year, month, day);
    const bookingInfo = this.datesWithBookings().get(dateStr);
    const result = bookingInfo?.pending && !bookingInfo?.confirmed;
    if (result) {
      console.log('Date has pending booking:', dateStr);
    }
    return result || false;
  }
  
  hasMixedBookings(year: number, month: number, day: number): boolean {
    const dateStr = this.getDateStr(year, month, day);
    const bookingInfo = this.datesWithBookings().get(dateStr);
    const result = bookingInfo?.confirmed && bookingInfo?.pending;
    if (result) {
      console.log('Date has mixed bookings:', dateStr);
    }
    return result || false;
  }
}
