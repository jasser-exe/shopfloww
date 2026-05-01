import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductResponse } from '../../../../core/models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-grid',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div *ngIf="!products || products.length === 0" class="empty-state">
      <p>Aucun produit trouvé</p>
    </div>
    <div *ngIf="products && products.length > 0" class="product-grid">
      <app-product-card
        *ngFor="let product of products"
        [product]="product"
        (addToCart)="onAddToCart($event)"
      ></app-product-card>
    </div>
  `,
  styles: [`
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    @media (min-width: 640px) {
      .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }
    }

    @media (min-width: 1024px) {
      .product-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      }
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      text-align: center;
      background: #f9fafb;
      border-radius: 0.5rem;
      color: #6b7280;
    }

    .empty-state p {
      margin: 0;
      font-size: 1rem;
    }
  `]
})
export class ProductGridComponent {
  @Input() products: ProductResponse[] = [];
  @Output() addToCart = new EventEmitter<ProductResponse>();

  onAddToCart(product: ProductResponse): void {
    this.addToCart.emit(product);
  }
}

