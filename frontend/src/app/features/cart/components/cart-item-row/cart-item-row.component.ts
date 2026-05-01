import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItemResponse } from '../../../../core';

@Component({
  selector: 'app-cart-item-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cart-item">
      <div class="item-image">
        <img [src]="item.productName" [alt]="item.productName" />
      </div>

      <div class="item-details">
        <h3 class="item-name">{{ item.productName }}</h3>
        @if (item.variantAttributes) {
          <p class="item-variant">
            {{ getVariantString() }}
          </p>
        }
      </div>

      <div class="item-quantity">
        <button
          (click)="decreaseQuantity()"
          [disabled]="item.quantity <= 1 || isUpdating()"
          class="quantity-btn"
        >
          -
        </button>
        <span class="quantity-value">{{ item.quantity }}</span>
        <button
          (click)="increaseQuantity()"
          [disabled]="isUpdating()"
          class="quantity-btn"
        >
          +
        </button>
      </div>

      <div class="item-price">
        <span class="price">{{ (item.promoPrice || item.price) * item.quantity | currency }}</span>
        @if (item.promoPrice) {
          <span class="original-price">{{ item.price * item.quantity | currency }}</span>
        }
      </div>

      <button
        (click)="removeItem()"
        [disabled]="isUpdating()"
        class="remove-btn"
        aria-label="Remove item"
      >
        ×
      </button>
    </div>
  `,
  styles: [`
    .cart-item {
      display: grid;
      grid-template-columns: 80px 1fr 120px 100px 30px;
      gap: 1rem;
      align-items: center;
      padding: 1rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }

    @media (max-width: 768px) {
      .cart-item {
        grid-template-columns: 60px 1fr 100px 80px 30px;
        gap: 0.5rem;
        padding: 0.75rem;
      }
    }

    .item-image {
      width: 80px;
      height: 80px;
      background: #f3f4f6;
      border-radius: 0.375rem;
      overflow: hidden;
    }

    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @media (max-width: 768px) {
      .item-image {
        width: 60px;
        height: 60px;
      }
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .item-name {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
    }

    .item-variant {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .item-quantity {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .quantity-btn {
      width: 30px;
      height: 30px;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      transition: background 0.2s ease;
    }

    .quantity-btn:hover:not(:disabled) {
      background: #e5e7eb;
    }

    .quantity-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .quantity-value {
      min-width: 30px;
      text-align: center;
      font-weight: 600;
    }

    .item-price {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .price {
      font-size: 1rem;
      font-weight: 700;
      color: #1f2937;
    }

    .original-price {
      font-size: 0.875rem;
      color: #9ca3af;
      text-decoration: line-through;
    }

    .remove-btn {
      width: 30px;
      height: 30px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 1.25rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
    }

    .remove-btn:hover:not(:disabled) {
      background: #dc2626;
    }

    .remove-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class CartItemRowComponent {
  @Input() item!: CartItemResponse;
  @Output() quantityChange = new EventEmitter<{ itemId: number; quantity: number }>();
  @Output() remove = new EventEmitter<number>();

  isUpdating = signal(false);

  getVariantString(): string {
    if (!this.item.variantAttributes) return '';
    return Object.values(this.item.variantAttributes).join(', ');
  }

  increaseQuantity(): void {
    this.updateQuantity(this.item.quantity + 1);
  }

  decreaseQuantity(): void {
    if (this.item.quantity > 1) {
      this.updateQuantity(this.item.quantity - 1);
    }
  }

  updateQuantity(quantity: number): void {
    this.isUpdating.set(true);
    this.quantityChange.emit({ itemId: this.item.id, quantity });
    // Note: Parent component handles the API call and will reset isUpdating
  }

  removeItem(): void {
    this.isUpdating.set(true);
    this.remove.emit(this.item.id);
  }
}
