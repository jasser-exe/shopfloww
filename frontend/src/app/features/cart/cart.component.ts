import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService, CartItemResponse, CartSummary } from '../../core';
import { CartItemRowComponent } from './components/cart-item-row/cart-item-row.component';
import { CouponInputComponent } from './components/coupon-input/coupon-input.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    CartItemRowComponent,
    CouponInputComponent,
    OrderSummaryComponent
  ],
  template: `
    <div class="cart-container">
      <h1>Mon Panier</h1>

      @if (cartService.itemCount() === 0) {
        <div class="empty-cart">
          <p>Votre panier est vide</p>
          <button (click)="goToCatalogue()" class="continue-shopping-btn">
            Continuer mes achats
          </button>
        </div>
      } @else {
        <div class="cart-content">
          <div class="cart-items">
            <app-cart-item-row
              *ngFor="let item of cartService.getItems()"
              [item]="item"
              (quantityChange)="onQuantityChange($event)"
              (remove)="onRemoveItem($event)"
            ></app-cart-item-row>
          </div>

          <div class="cart-sidebar">
            <app-coupon-input
              [appliedCoupon]="cartService.cart()?.couponCode"
              [isApplying]="isProcessing()"
              (applyCoupon)="onApplyCoupon($event)"
              (removeCoupon)="onRemoveCoupon()"
            ></app-coupon-input>

            <app-order-summary
              [summary]="orderSummary()"
            ></app-order-summary>

            <button
              class="checkout-btn"
              (click)="goToCheckout()"
              [disabled]="isProcessing()"
            >
              {{ isProcessing() ? 'Traitement...' : 'Commander' }}
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    h1 {
      margin-bottom: 2rem;
      color: #1f2937;
    }

    .empty-cart {
      text-align: center;
      padding: 4rem 2rem;
      background: #f9fafb;
      border-radius: 0.5rem;
    }

    .empty-cart p {
      margin-bottom: 1rem;
      color: #6b7280;
      font-size: 1.125rem;
    }

    .continue-shopping-btn {
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .continue-shopping-btn:hover {
      background: #2563eb;
    }

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .cart-content {
        grid-template-columns: 1fr;
      }
    }

    .cart-items {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .cart-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      height: fit-content;
      background: white;
      padding: 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .checkout-btn {
      width: 100%;
      padding: 1rem;
      background: #16a34a;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 1.125rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .checkout-btn:hover:not(:disabled) {
      background: #15803d;
    }

    .checkout-btn:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }
  `]
})
export class CartComponent {
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);

  isProcessing = signal(false);

  orderSummary = computed<CartSummary>(() => {
    const cart = this.cartService.cart();
    if (!cart) return { subtotal: 0, discount: 0, shippingCost: 0, total: 0 };

    const subtotal = cart.totalPrice;
    const discount = cart.discount || 0;
    const shippingCost = cart.shippingCost || 0;
    const total = cart.finalPrice || (subtotal - discount + shippingCost);

    return { subtotal, discount, shippingCost, total };
  });

  onQuantityChange(event: { itemId: number; quantity: number }): void {
    this.isProcessing.set(true);
    this.cartService.updateItem(event.itemId, event.quantity).subscribe({
      next: () => {
        this.isProcessing.set(false);
      },
      error: (error) => {
        console.error('Error updating quantity:', error);
        this.isProcessing.set(false);
      }
    });
  }

  onRemoveItem(itemId: number): void {
    this.isProcessing.set(true);
    this.cartService.removeItem(itemId).subscribe({
      next: () => {
        this.isProcessing.set(false);
      },
      error: (error) => {
        console.error('Error removing item:', error);
        this.isProcessing.set(false);
      }
    });
  }

  onApplyCoupon(code: string): void {
    this.isProcessing.set(true);
    this.cartService.applyCoupon(code).subscribe({
      next: () => {
        this.isProcessing.set(false);
      },
      error: (error) => {
        console.error('Error applying coupon:', error);
        this.isProcessing.set(false);
        // TODO: Show error message
      }
    });
  }

  onRemoveCoupon(): void {
    this.isProcessing.set(true);
    this.cartService.removeCoupon().subscribe({
      next: () => {
        this.isProcessing.set(false);
      },
      error: (error) => {
        console.error('Error removing coupon:', error);
        this.isProcessing.set(false);
        // TODO: Show error message
      }
    });
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  goToCatalogue(): void {
    this.router.navigate(['/products']);
  }
}
