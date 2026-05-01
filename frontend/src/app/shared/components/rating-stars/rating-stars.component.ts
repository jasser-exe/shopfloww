import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rating-stars" [attr.aria-label]="'Rating: ' + rating + ' out of 5'">
      <ng-container *ngFor="let star of stars">
        <svg
          *ngIf="star === 'full'"
          class="star full"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <svg
          *ngIf="star === 'half'"
          class="star half"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stop-color="currentColor" />
              <stop offset="50%" stop-color="#e0e0e0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfGradient)"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
        <svg
          *ngIf="star === 'empty'"
          class="star empty"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </ng-container>
      <span class="rating-value" *ngIf="showValue">{{ rating.toFixed(1) }}</span>
    </div>
  `,
  styles: [`
    .rating-stars {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 1.25rem;
      color: #fbbf24;
    }

    .star {
      width: 1.25rem;
      height: 1.25rem;
    }

    .star.full {
      fill: #fbbf24;
    }

    .star.half {
      fill: url(#halfGradient);
    }

    .star.empty {
      color: #e0e0e0;
      fill: none;
    }

    .rating-value {
      margin-left: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #4b5563;
    }
  `]
})
export class RatingStarsComponent {
  @Input() rating: number = 0;
  @Input() showValue: boolean = true;

  get stars(): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(this.rating)) {
        stars.push('full');
      } else if (i - this.rating < 1) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }
}

