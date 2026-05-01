import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductReview } from '../../../../core/models/product.model';
import { RatingStarsComponent } from '../../../../shared/components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-review-card',
  standalone: true,
  imports: [CommonModule, RatingStarsComponent],
  template: `
    <div class="review-card">
      <div class="review-header">
        <div class="reviewer-info">
          <h4 class="reviewer-name">{{ review.customerName }}</h4>
          <p class="review-date">{{ review.createdAt | date: 'short' }}</p>
        </div>
        <app-rating-stars
          [rating]="review.rating"
          [showValue]="false"
        ></app-rating-stars>
      </div>

      <p class="review-comment">{{ review.comment }}</p>

      <div class="review-footer">
        <div class="review-helpful">
          <button class="helpful-btn" [attr.aria-label]="'Mark as helpful'">
             Utile ({{ review.helpful }})
          </button>
          <button
            class="not-helpful-btn"
            [attr.aria-label]="'Mark as not helpful'"
          >
            Pas utile ({{ review.notHelpful }})
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .review-card {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .reviewer-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .reviewer-name {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: #1f2937;
    }

    .review-date {
      margin: 0;
      font-size: 0.8rem;
      color: #9ca3af;
    }

    .review-comment {
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.6;
      color: #4b5563;
    }

    .review-footer {
      display: flex;
      gap: 1rem;
    }

    .review-helpful {
      display: flex;
      gap: 0.75rem;
    }

    .helpful-btn,
    .not-helpful-btn {
      padding: 0.375rem 0.75rem;
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      font-size: 0.8rem;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s ease;
    }

    .helpful-btn:hover,
    .not-helpful-btn:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }
  `]
})
export class ReviewCardComponent {
  @Input() review!: ProductReview;
}

