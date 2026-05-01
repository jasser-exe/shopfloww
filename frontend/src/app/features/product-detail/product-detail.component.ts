import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProductService, ProductResponse } from '../../core';
import { CartService } from '../../core/services/cart.service';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { VariantSelectorComponent, SelectedVariant } from './components/variant-selector/variant-selector.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    ImageGalleryComponent,
    VariantSelectorComponent,
    ReviewsComponent,
    RatingStarsComponent
  ],
  template: `
    <!-- Loading Skeleton -->
    @if (isLoading()) {
      <div class="loading-skeleton">
        <div class="skeleton-main">
          <div class="skeleton-block"></div>
          <div class="skeleton-info">
            <div class="skeleton-block"></div>
            <div class="skeleton-block"></div>
            <div class="skeleton-block"></div>
          </div>
        </div>
      </div>
    }

    <!-- Product Detail -->
    @if (!isLoading() && product()) {
      <div class="product-detail-container">
        <div class="product-detail-main">
          <div class="product-gallery">
            <app-image-gallery
              [images]="product()!.images"
            ></app-image-gallery>
          </div>

          <div class="product-info">
            <div class="product-header">
              <h1 class="product-title">{{ product()!.name }}</h1>
              <p class="product-seller">Par {{ product()!.sellerName }}</p>
            </div>

            <div class="product-rating">
              <app-rating-stars
                [rating]="product()!.rating"
                [showValue]="true"
              ></app-rating-stars>
              <span class="rating-count">{{ product()!.ratingCount }} avis</span>
            </div>

            <div class="product-description">
              <h3>Description</h3>
              <p>{{ product()!.description }}</p>
            </div>

            <div class="product-price-section">
              <div class="price-display">
                <span *ngIf="product()!.promoPrice" class="promo-price">
                  {{ product()!.promoPrice | currency }}
                </span>
                <span [class.has-promo]="!!product()!.promoPrice" class="price">
                  {{ product()!.price | currency }}
                </span>
              </div>
              <div
                *ngIf="product()!.promoPrice"
                class="discount-badge"
              >
                -{{ discountPercent() }}%
              </div>
            </div>

            <!-- Variant Selector -->
            <app-variant-selector
              *ngIf="product()!.variants && product()!.variants.length"
              [variants]="product()!.variants"
              (variantSelected)="onVariantSelected($event)"
            ></app-variant-selector>

            <div class="product-actions">
              <button
                class="add-to-cart-btn"
                [disabled]="!product()!.inStock || isAddingToCart()"
                (click)="addToCart()"
                [attr.aria-label]="'Add ' + product()!.name + ' to cart'"
              >
                <span *ngIf="!isAddingToCart()">Ajouter au panier</span>
                <span *ngIf="isAddingToCart()">Ajout en cours...</span>
              </button>
              <button
                class="wishlist-btn"
                [disabled]="isAddingToWishlist()"
                (click)="addToWishlist()"
                [attr.aria-label]="'Add ' + product()!.name + ' to wishlist'"
              >
                ♡
              </button>
            </div>

            <div class="product-details">
              <div class="detail-item">
                <span class="detail-label">Stock:</span>
                <span
                  [class.in-stock]="product()!.inStock"
                  [class.out-of-stock]="!product()!.inStock"
                >
                  {{ product()!.inStock ? 'En stock' : 'Rupture de stock' }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Catégorie:</span>
                <span>{{ product()!.categoryName }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews -->
        <app-reviews [productId]="product()!.id"></app-reviews>
      </div>
    }

    <!-- Error State -->
    @if (!isLoading() && !product()) {
      <div class="error-state">
        <p>Produit non trouvé</p>
      </div>
    }
  `,
  styles: [`
    .loading-skeleton {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .skeleton-main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .skeleton-block {
      background: #e5e7eb;
      border-radius: 0.5rem;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .skeleton-block:first-child {
      aspect-ratio: 1;
    }

    .skeleton-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .skeleton-info .skeleton-block {
      height: 2rem;
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    .product-detail-container {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      padding: 2rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .product-detail-main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .product-detail-main {
        grid-template-columns: 1fr;
      }
    }

    .product-gallery {
      display: flex;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .product-header {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .product-title {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1f2937;
    }

    .product-seller {
      margin: 0;
      font-size: 0.9rem;
      color: #6b7280;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .rating-count {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .product-description {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .product-description h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
    }

    .product-description p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.6;
      color: #4b5563;
    }

    .product-price-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .price-display {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .price {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
    }

    .price.has-promo {
      text-decoration: line-through;
      color: #9ca3af;
      font-size: 1.125rem;
      font-weight: 500;
    }

    .promo-price {
      font-size: 1.75rem;
      font-weight: 700;
      color: #ef4444;
    }

    .discount-badge {
      padding: 0.5rem 0.75rem;
      background: #ef4444;
      color: white;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 700;
    }

    .product-actions {
      display: flex;
      gap: 0.75rem;
    }

    .add-to-cart-btn,
    .wishlist-btn {
      padding: 0.875rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .add-to-cart-btn {
      flex: 1;
      background: #3b82f6;
      color: white;
    }

    .add-to-cart-btn:hover:not(:disabled) {
      background: #2563eb;
    }

    .add-to-cart-btn:disabled {
      background: #d1d5db;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .wishlist-btn {
      width: 50px;
      background: #f3f4f6;
      color: #ef4444;
      border: 2px solid #e5e7eb;
    }

    .wishlist-btn:hover:not(:disabled) {
      background: #fff;
      border-color: #ef4444;
    }

    .wishlist-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .product-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
    }

    .detail-label {
      font-weight: 600;
      color: #4b5563;
    }

    .in-stock {
      color: #16a34a;
      font-weight: 600;
    }

    .out-of-stock {
      color: #ef4444;
      font-weight: 600;
    }

    .error-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      text-align: center;
      color: #6b7280;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  isLoading = signal(true);
  isAddingToCart = signal(false);
  isAddingToWishlist = signal(false);
  product = signal<ProductResponse | null>(null);
  selectedVariant = signal<SelectedVariant | null>(null);

  discountPercent = computed(() => {
    const prod = this.product();
    if (!prod || !prod.promoPrice) return 0;
    return Math.round(
      ((prod.price - prod.promoPrice) / prod.price) * 100
    );
  });

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const id = +params['id'];
          return this.productService.getProductById(id);
        })
      )
      .subscribe({
        next: (product) => {
          this.product.set(product);
          this.isLoading.set(false);
        },
        error: (error: unknown) => {
          console.error('Error loading product:', error);
          this.isLoading.set(false);
        }
      });
  }

  onVariantSelected(variant: SelectedVariant): void {
    this.selectedVariant.set(variant);
  }

  addToCart(): void {
    const prod = this.product();
    if (!prod) return;

    this.isAddingToCart.set(true);

    const item = {
      productId: prod.id,
      quantity: 1,
      variantId: this.selectedVariant()?.variantId
    };

    this.cartService.addItem(prod.id, this.selectedVariant()?.variantId).subscribe({
      next: () => {
        this.isAddingToCart.set(false);
        // TODO: Show success notification
        console.log('Product added to cart');
      },
      error: (error: unknown) => {
        console.error('Error adding to cart:', error);
        this.isAddingToCart.set(false);
      }
    });
  }

  addToWishlist(): void {
    const prod = this.product();
    if (!prod) return;

    this.isAddingToWishlist.set(true);

    // TODO: Implement wishlist service
    console.log('Added to wishlist:', prod.id);
    this.isAddingToWishlist.set(false);
  }
}
