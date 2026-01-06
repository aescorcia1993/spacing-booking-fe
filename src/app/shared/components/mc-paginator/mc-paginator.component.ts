import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Paginator } from 'primeng/paginator';

export interface PaginationData {
  total: number;
  currentPage: number;
  perPage: number;
  lastPage?: number;
}

export interface PageChangeEvent {
  page: number;
  first: number;
  rows: number;
}

@Component({
  selector: 'mc-paginator',
  imports: [CommonModule, Paginator],
  templateUrl: './mc-paginator.component.html',
  styleUrl: './mc-paginator.component.scss'
})
export class McPaginatorComponent {
  // Inputs
  pagination = input.required<PaginationData | null>();
  rowsPerPageOptions = input<number[]>([10, 20, 30, 50]);
  showInfo = input<boolean>(true);
  
  // Output
  pageChange = output<PageChangeEvent>();

  // Exponer Math para el template
  Math = Math;

  onPageChange(event: any) {
    this.pageChange.emit({
      page: (event.first / event.rows) + 1,
      first: event.first,
      rows: event.rows
    });
  }
}
