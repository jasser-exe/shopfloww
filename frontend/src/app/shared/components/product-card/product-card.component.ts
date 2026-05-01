import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductResponse } from '../../../core/models/product.model';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, RatingStarsComponent],
  template: `
    <div class="product-card">
      <div class="product-image-wrapper">
        <img
          *ngIf="product.images && product.images.length"
          [src]="product.images[0].url"
          [alt]="product.images[0].alt || product.name"
          class="product-image"
        />
        <div *ngIf="!product.images || product.images.length === 0" class="product-image-placeholder">
          No Image
        </div>

        <div *ngIf="product.promoPrice" class="promo-badge">
          -{{ discountPercent }}%
        </div>

        <div *ngIf="!product.inStock" class="out-of-stock-overlay">
          Out of Stock
        </div>
      </div>

      <div class="product-content">
        <div class="product-header">
          <h3 class="product-name" [routerLink]="['/products', product.id]">
            {{ product.name }}
          </h3>
          <p class="product-seller">{{ product.sellerName }}</p>
        </div>

        <app-rating-stars
          [rating]="product.rating"
          [showValue]="true"
        ></app-rating-stars>

        <div class="product-footer">
          <div class="price-section">
            <span *ngIf="product.promoPrice" class="promo-price">
              {{ product.promoPrice | currency }}
            </span>
            <span class="price" [class.has-promo]="!!product.promoPrice">
              {{ product.price | currency }}
            </span>
          </div>

          <button
            class="add-to-cart-btn"
            [disabled]="!product.inStock"
            (click)="onAddToCart()"
            [attr.aria-label]="'Add ' + product.name + ' to cart'"
          >
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }

    .product-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .product-image-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      background: #f5f5f5;
      overflow: hidden;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .product-image-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background: #e0e0e0;
      color: #999;
      font-size: 0.875rem;
    }

    .promo-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #ef4444;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 700;
      z-index: 1;
    }

    .out-of-stock-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      font-weight: 600;
      z-index: 2;
    }

    .product-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 1rem;
    }

    .product-header {
      margin-bottom: 0.5rem;
    }

    .product-name {
      margin: 0 0 0.25rem 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: #1f2937;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      cursor: pointer;
      transition: color 0.2s ease;
      text-decoration: none;
    }

    .product-name:hover {
      color: #3b82f6;
    }

    .product-seller {
      margin: 0;
      font-size: 0.8rem;
      color: #6b7280;
    }

    .product-footer {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: auto;
      padding-top: 0.75rem;
      border-top: 1px solid #f0f0f0;
    }

    .price-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .price {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1f2937;
    }

    .price.has-promo {
      text-decoration: line-through;
      color: #9ca3af;
      font-size: 0.95rem;
      font-weight: 500;
    }

    .promo-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ef4444;
    }

    .add-to-cart-btn {
      width: 100%;
      padding: 0.625rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease, opacity 0.2s ease;
    }

    .add-to-cart-btn:hover:not(:disabled) {
      background: #2563eb;
    }

    .add-to-cart-btn:disabled {
      background: #d1d5db;
      cursor: not-allowed;
      opacity: 0.6;
    }
  `]
})
export class ProductCardComponent {
  @Input() product!: ProductResponse;
  @Output() addToCart = new EventEmitter<ProductResponse>();

  get discountPercent(): number {
    if (!this.product.promoPrice) return 0;
    return Math.round(
      ((this.product.price - this.product.promoPrice) / this.product.price) * 100
    );
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}

