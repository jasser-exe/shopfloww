import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coupon-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="coupon-section">
      <h3>Code promo</h3>

      @if (!appliedCoupon) {
        <div class="coupon-input-group">
          <input
            type="text"
            [(ngModel)]="couponCode"
            placeholder="Entrez votre code promo"
            class="coupon-input"
            [disabled]="isApplying"
          />
          <button
            (click)="onApplyCoupon()"
            [disabled]="!couponCode.trim() || isApplying"
            class="apply-btn"
          >
            {{ isApplying ? 'Application...' : 'Appliquer' }}
          </button>
        </div>
      } @else {
        <div class="applied-coupon">
          <span class="coupon-code">{{ appliedCoupon }}</span>
          <button
            (click)="onRemoveCoupon()"
            [disabled]="isApplying"
            class="remove-btn"
          >
            Retirer
          </button>
        </div>
      }

      @if (errorMessage()) {
        <p class="error-message">{{ errorMessage() }}</p>
      }
    </div>
  `,
  styles: [`
    .coupon-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .coupon-section h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
    }

    .coupon-input-group {
      display: flex;
      gap: 0.5rem;
    }

    .coupon-input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }

    .coupon-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .coupon-input:disabled {
      background: #f9fafb;
      cursor: not-allowed;
    }

    .apply-btn {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .apply-btn:hover:not(:disabled) {
      background: #2563eb;
    }

    .apply-btn:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }

    .applied-coupon {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 0.375rem;
    }

    .coupon-code {
      font-weight: 600;
      color: #166534;
    }

    .remove-btn {
      padding: 0.25rem 0.5rem;
      background: #dc2626;
      color: white;
      border: none;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .remove-btn:hover:not(:disabled) {
      background: #b91c1c;
    }

    .remove-btn:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }

    .error-message {
      margin: 0;
      font-size: 0.875rem;
      color: #dc2626;
    }
  `]
})
export class CouponInputComponent {
  @Input() appliedCoupon?: string;
  @Input() isApplying: boolean = false;
  @Output() applyCoupon = new EventEmitter<string>();
  @Output() removeCoupon = new EventEmitter<void>();

  couponCode = '';
  errorMessage = signal<string>('');

  onApplyCoupon(): void {
    if (!this.couponCode.trim()) return;

    this.errorMessage.set('');
    this.applyCoupon.emit(this.couponCode.trim());
    // Note: Parent component handles the API call and will reset isApplying
  }

  onRemoveCoupon(): void {
    this.removeCoupon.emit();
  }
}
