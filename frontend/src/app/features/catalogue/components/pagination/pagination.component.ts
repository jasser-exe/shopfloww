import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination" *ngIf="totalPages > 1">
      <button
        (click)="previousPage()"
        [disabled]="currentPage === 0"
        class="pagination-btn"
        aria-label="Previous page"
      >
        ← Précédent
      </button>

      <div class="pagination-info">
        <span class="page-number"
          >Page {{ currentPage + 1 }} / {{ totalPages }}</span
        >
      </div>

      <div class="page-buttons">
        <button
          *ngFor="let page of pageNumbers"
          (click)="goToPage(page)"
          [class.active]="page === currentPage"
          class="pagination-btn page-btn"
          [attr.aria-current]="page === currentPage ? 'page' : null"
          [attr.aria-label]="'Go to page ' + (page + 1)"
        >
          {{ page + 1 }}
        </button>
      </div>

      <button
        (click)="nextPage()"
        [disabled]="currentPage === totalPages - 1"
        class="pagination-btn"
        aria-label="Next page"
      >
        Suivant →
      </button>
    </div>
  `,
  styles: [`
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      padding: 1.5rem;
    }

    .pagination-btn {
      padding: 0.5rem 0.75rem;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      transition: all 0.2s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      background: #f3f4f6;
      border-color: #9ca3af;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: #f9fafb;
    }

    .pagination-btn.page-btn {
      width: 2.25rem;
      padding: 0.5rem;
    }

    .pagination-btn.page-btn.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .pagination-info {
      padding: 0 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .page-number {
      display: block;
      white-space: nowrap;
    }

    .page-buttons {
      display: flex;
      gap: 0.25rem;
    }

    @media (max-width: 640px) {
      .page-buttons {
        display: none;
      }

      .pagination {
        gap: 1rem;
      }
    }
  `]
})
export class PaginationComponent {
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(
      this.totalPages,
      startPage + maxVisiblePages
    );

    if (endPage - startPage < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages);
    }

    for (let i = startPage; i < endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  goToPage(page: number): void {
    this.pageChange.emit(page);
  }
}

