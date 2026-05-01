# 🔌 Intégration dans Autres Pages

## Comment réutiliser les composants

### 1. Afficher Un Produit Seul (ProductCardComponent)

```typescript
import { Component } from '@angular/core';
import { ProductResponse } from './core/models/product.model';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';

@Component({
  selector: 'app-featured',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <section>
      <h2>Produit en vedette</h2>
      <app-product-card
        [product]="featuredProduct"
        (addToCart)="onAddToCart($event)"
      ></app-product-card>
    </section>
  `
})
export class FeaturedProductComponent {
  featuredProduct: ProductResponse = {
    // ...données produit
  };

  onAddToCart(product: ProductResponse) {
    console.log('Add to cart:', product);
  }
}
```

---

### 2. Afficher Des Étoiles D'Évaluation (RatingStarsComponent)

```typescript
import { Component } from '@angular/core';
import { RatingStarsComponent } from './shared/components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [RatingStarsComponent],
  template: `
    <div class="seller">
      <h2>Vendeur Excellence</h2>
      <div>
        <p>Note vendeur:</p>
        <app-rating-stars
          [rating]="4.8"
          [showValue]="true"
        ></app-rating-stars>
      </div>
    </div>
  `
})
export class SellerProfileComponent {}
```

---

### 3. Afficher Une Pagination Personnalisée (PaginationComponent)

```typescript
import { Component, signal } from '@angular/core';
import { PaginationComponent } from './shared/components/pagination/pagination.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [PaginationComponent],
  template: `
    <div class="orders">
      <h2>Mes commandes</h2>
      <ul>
        <li *ngFor="let order of getCurrentPageOrders()">
          {{ order.id }} - {{ order.total }}
        </li>
      </ul>
      <app-pagination
        [totalPages]="totalPages()"
        [currentPage]="currentPage()"
        (pageChange)="onPageChange($event)"
      ></app-pagination>
    </div>
  `
})
export class OrdersComponent {
  currentPage = signal(0);
  totalPages = signal(5);
  allOrders: any[] = [];

  getCurrentPageOrders() {
    // Return orders for current page
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }
}
```

---

### 4. Utiliser ProductService Dans un Component Perso

```typescript
import { Component, inject, signal } from '@angular/core';
import { ProductService, ProductResponse } from './core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-related-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <h3>Produits connexes</h3>
      <div *ngIf="isLoading()" class="loading">
        Chargement...
      </div>
      <div *ngIf="!isLoading()" class="products">
        <div *ngFor="let product of relatedProducts()">
          {{ product.name }} - {{ product.price | currency }}
        </div>
      </div>
    </section>
  `
})
export class RelatedProductsComponent {
  private productService = inject(ProductService);

  isLoading = signal(true);
  relatedProducts = signal<ProductResponse[]>([]);

  loadRelated(categoryId: number) {
    this.productService
      .getProducts({ categoryId }, 0, 4)
      .subscribe({
        next: (page) => {
          this.relatedProducts.set(page.content);
          this.isLoading.set(false);
        }
      });
  }
}
```

---

### 5. Utiliser CartService Dans la Navbar

```typescript
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from './core/services/cart.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">ShopFlow</div>

      <div class="nav-links">
        <a routerLink="/products">Catalogue</a>
      </div>

      <div class="nav-right">
        <div *ngIf="authService.isLoggedIn()">
          <span>{{ authService.currentUser()?.email }}</span>
          <button (click)="logout()">Déconnexion</button>
        </div>

        <a routerLink="/cart" class="cart-link">
          🛒 Panier ({{ cartService.getTotalItems() }})
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
    }

    .cart-link {
      position: relative;
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);

  logout() {
    this.authService.logout();
  }
}
```

---

### 6. Créer Une Dashboard Avec Statistiques Panier

```typescript
import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-checkout-review',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="checkout-summary">
      <h2>Résumé commande</h2>

      <div class="summary-item">
        <span>Nombre d'articles:</span>
        <strong>{{ cartService.getTotalItems() }}</strong>
      </div>

      <div class="summary-item">
        <span>Sous-total:</span>
        <strong>{{ subtotal() | currency }}</strong>
      </div>

      <div class="summary-item">
        <span>Taxes (20%):</span>
        <strong>{{ taxAmount() | currency }}</strong>
      </div>

      <div class="summary-item total">
        <span>TOTAL:</span>
        <strong>{{ totalWithTax() | currency }}</strong>
      </div>

      <button
        (click)="placeOrder()"
        [disabled]="!canCheckout()"
        class="btn-checkout"
      >
        Confirmer la commande
      </button>
    </div>
  `,
  styles: [`
    .checkout-summary {
      padding: 2rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .summary-item.total {
      font-size: 1.25rem;
      font-weight: 700;
      border-top: 2px solid #d1d5db;
      border-bottom: none;
      margin-top: 1rem;
      padding-top: 1rem;
    }
  `]
})
export class CheckoutReviewComponent {
  private cartService = inject(CartService);

  subtotal = this.cartService.getTotalPrice;
  itemCount = this.cartService.getTotalItems;

  taxAmount = computed(() => this.subtotal() * 0.2);
  totalWithTax = computed(() => this.subtotal() + this.taxAmount());
  canCheckout = computed(() => this.itemCount() > 0);

  placeOrder() {
    if (this.canCheckout()) {
      console.log('Order total:', this.totalWithTax());
      // Call checkout API
    }
  }
}
```

---

### 7. Page de Wishlist (Future)

```typescript
import { Component, inject, signal } from '@angular/core';
import { ProductService, ProductResponse } from './core';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [ProductCardComponent],
  template: `
    <div class="wishlist-page">
      <h1>Ma Liste de Souhaits</h1>

      <div *ngIf="wishlistItems().length === 0" class="empty">
        <p>Votre liste de souhaits est vide</p>
        <a routerLink="/products">Continuer vos achats</a>
      </div>

      <div class="products-grid">
        <app-product-card
          *ngFor="let product of wishlistItems()"
          [product]="product"
          (addToCart)="moveToCart($event)"
        ></app-product-card>
      </div>
    </div>
  `
})
export class WishlistComponent {
  wishlistItems = signal<ProductResponse[]>([]);

  moveToCart(product: ProductResponse) {
    // Add to cart and remove from wishlist
    console.log('Moving to cart:', product);
  }
}
```

---

## 📚 Imports Courants

```typescript
// Services
import { ProductService } from './core/services/product.service';
import { CartService } from './core/services/cart.service';

// Models
import { 
  ProductResponse,
  ProductFilter,
  Page,
  Category,
  ProductReview 
} from './core/models/product.model';

// Components
import { CatalogueComponent } from './features/catalogue/catalogue.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { RatingStarsComponent } from './shared/components/rating-stars/rating-stars.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
```

---

## 🎯 Quick Reference

| Besoin | Solution |
|--------|----------|
| Afficher 1 produit | `ProductCardComponent` |
| Lister produits | `CatalogueComponent` ou `ProductGridComponent` |
| Détail produit | `ProductDetailComponent` |
| Pagination | `PaginationComponent` |
| Étoiles rating | `RatingStarsComponent` |
| Charger produits | `ProductService.getProducts()` |
| Panier | `CartService` (signaux) |
| Images produit | `ImageGalleryComponent` |
| Variantes | `VariantSelectorComponent` |
| Avis clients | `ReviewsComponent` |

---

**Tous les composants sont standalone et peuvent être utilisés/réutilisés n'importe où!**

