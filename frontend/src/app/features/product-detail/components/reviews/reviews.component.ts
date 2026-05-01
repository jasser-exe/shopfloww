import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { ProductReview } from '../../../../core/models/product.model';
import { ReviewCardComponent } from '../review-card/review-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';


@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, ReviewCardComponent, PaginationComponent],
  template: `
    <div class="reviews-section">
      <div class="reviews-header">
        <h3>Avis Clients</h3>
        <div class="average-rating">
          <span class="rating-value">{{ averageRating | number: '1.1-1' }}</span>
          <span class="rating-count">({{ totalReviews }} avis)</span>
        </div>
      </div>

      <div *ngIf="isLoading()" class="loading-state">
        <p>Chargement des avis...</p>
      </div>

      <div *ngIf="!isLoading() && reviews().length === 0" class="empty-state">
        <p>Aucun avis pour ce produit pour le moment.</p>
      </div>

      <div *ngIf="!isLoading() && reviews().length > 0" class="reviews-list">
        <app-review-card
          *ngFor="let review of reviews()"
          [review]="review"
        ></app-review-card>
      </div>

      <app-pagination
        *ngIf="!isLoading() && totalPages() > 1"
        [totalPages]="totalPages()"
        [currentPage]="currentPage()"
        (pageChange)="onPageChange($event)"
      ></app-pagination>
    </div>
  `,
  styles: [`
    .reviews-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 2rem;
      background: white;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .reviews-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .reviews-header h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
    }

    .average-rating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .rating-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .rating-count {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .loading-state,
    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      color: #6b7280;
    }

    .loading-state p,
    .empty-state p {
      margin: 0;
    }
  `]
})
export class ReviewsComponent implements OnInit {
  @Input() productId!: number;

  private readonly productService = inject(ProductService);

  isLoading = signal(true);
  reviews = signal<ProductReview[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  totalReviews = 0;
  averageRating = 0;

  ngOnInit(): void {
    this.loadReviews();
  }

  private loadReviews(): void {
    this.isLoading.set(true);
    this.productService
      .getReviews(this.productId, this.currentPage(), 5)
      .subscribe({
      next: (response) => {
        this.reviews.set(response.content);
        this.currentPage.set(response.currentPage);
        this.totalPages.set(response.totalPages);
        this.totalReviews = response.totalElements;
        this.calculateAverageRating();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.isLoading.set(false);
      }
    });
  }

  private calculateAverageRating(): void {
    if (this.reviews().length === 0) {
      this.averageRating = 0;
      return;
    }
    const sum = this.reviews().reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews().length;
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadReviews();
  }
}
