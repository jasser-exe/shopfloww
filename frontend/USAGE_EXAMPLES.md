// ============================================================
// EXEMPLES D'UTILISATION - CATALOGUE PRODUITS SHOPFLOW
// ============================================================

// ============================================================
// 1. UTILISATION DANS UN COMPOSANT PAGE
// ============================================================

import { Component, inject, signal } from '@angular/core';
import { ProductService, CartService } from './core';

@Component({
  selector: 'app-my-page',
  standalone: true,
  template: `...`
})
export class MyPageComponent {
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  // Les signaux du panier peuvent être utilisés n'importe où
  totalItems = this.cartService.getTotalItems;
  totalPrice = this.cartService.getTotalPrice;
  cartItems = this.cartService.getItems;

  // Ou accéder directement
  onCheckout() {
    const items = this.cartService.cart(); // Prend les données du signal
    console.log('Items in cart:', items);
  }
}

// ============================================================
// 2. NAVIGUER VERS LES PAGES PRODUITS
// ============================================================

import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar'
})
export class NavbarComponent {
  private router = inject(Router);

  // Lister tous les produits
  showCatalogue() {
    this.router.navigate(['/products']);
  }

  // Avec filtres
  showPromo() {
    this.router.navigate(['/products'], {
      queryParams: { onPromo: 'true', page: 0 }
    });
  }

  // Par catégorie
  showCategory(categoryId: number) {
    this.router.navigate(['/products'], {
      queryParams: { categoryId, page: 0 }
    });
  }

  // Détail produit
  showProduct(productId: number) {
    this.router.navigate(['/products', productId]);
  }

  // Recherche
  searchProducts(query: string) {
    this.router.navigate(['/products'], {
      queryParams: { search: query, page: 0 }
    });
  }
}

// ============================================================
// 3. UTILISER LE CART SERVICE
// ============================================================

import { Component, inject, signal } from '@angular/core';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-cart-summary'
})
export class CartSummaryComponent {
  private cartService = inject(CartService);

  // Ajouter au panier
  addToCart() {
    this.cartService
      .addItem({
        productId: 123,
        quantity: 2,
        variantId: 456 // optionnel
      })
      .subscribe({
        next: (cart) => console.log('Added:', cart),
        error: (err) => console.error('Error:', err)
      });
  }

  // Modifier la quantité
  updateQuantity(itemId: number, quantity: number) {
    this.cartService.updateItem(itemId, quantity).subscribe();
  }

  // Supprimer du panier
  removeItem(itemId: number) {
    this.cartService.removeItem(itemId).subscribe();
  }

  // Vider le panier
  clearCart() {
    this.cartService.clearCart().subscribe();
  }

  // Afficher les totaux (avec les signaux)
  get items() {
    return this.cartService.getItems();
  }

  get total() {
    return this.cartService.getTotalPrice();
  }

  get count() {
    return this.cartService.getTotalItems();
  }
}

// ============================================================
// 4. CRÉER UN COMPOSANT NAVBAR AVEC LIEN PANIER
// ============================================================

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from './core/services/cart.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-left">
        <a routerLink="/" class="logo">ShopFlow</a>
        <a routerLink="/products" class="nav-link">Catalogue</a>
      </div>

      <div class="nav-right">
        <div *ngIf="authService.isLoggedIn()" class="user-section">
          <span class="user-name">{{ authService.currentUser()?.email }}</span>
          <button (click)="logout()" class="logout-btn">Déconnexion</button>
        </div>

        <div *ngIf="!authService.isLoggedIn()" class="auth-section">
          <a routerLink="/login" class="nav-link">Connexion</a>
          <a routerLink="/register" class="nav-link">Inscription</a>
        </div>

        <a routerLink="/cart" class="cart-link">
          Panier
          <span class="cart-badge">{{ cartService.getTotalItems() }}</span>
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

    .cart-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  cartService = inject(CartService);

  logout() {
    this.authService.logout();
  }
}

// ============================================================
// 5. UTILISER LES COMPUTES POUR DES VALEURS DÉRIVÉES
// ============================================================

import { Component, inject, computed } from '@angular/core';
import { CartService } from './core/services/cart.service';

@Component({
  selector: 'app-checkout'
})
export class CheckoutComponent {
  private cartService = inject(CartService);

  // Computed automatiquement mis à jour
  subtotal = this.cartService.getTotalPrice;
  itemCount = this.cartService.getTotalItems;

  // Computed personnalisé
  taxAmount = computed(() => this.subtotal() * 0.2);
  totalWithTax = computed(() => this.subtotal() + this.taxAmount());
  hasItems = computed(() => this.itemCount() > 0);

  onCheckout() {
    if (!this.hasItems()) {
      console.error('Cart is empty');
      return;
    }

    console.log(`Total: ${this.totalWithTax()}`);
  }
}

// ============================================================
// 6. CHARGER LES PRODUITS MANUELLEMENT
// ============================================================

import { Component, inject, signal } from '@angular/core';
import { ProductService, ProductResponse } from './core';

@Component({
  selector: 'app-featured-products'
})
export class FeaturedProductsComponent {
  private productService = inject(ProductService);

  products = signal<ProductResponse[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadTopSelling();
  }

  loadTopSelling() {
    this.isLoading.set(true);
    this.productService.getTopSelling().subscribe({
      next: (products) => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isLoading.set(false);
      }
    });
  }

  // Ou avec filtres personnalisés
  loadFiltered() {
    this.productService
      .getProducts(
        {
          categoryId: 1,
          minPrice: 50,
          maxPrice: 200
        },
        0,
        12
      )
      .subscribe({
        next: (page) => {
          this.products.set(page.content);
        }
      });
  }

  // Ou recherche
  search(query: string) {
    this.productService.searchProducts(query, {page: 0, size: 20}).subscribe({
      next: (page) => {
        this.products.set(page.content);
      }
    });
  }
}

// ============================================================
// 7. AFFICHER LES ERREURS AVEC ERROR INTERCEPTOR
// ============================================================

import { Component, inject, signal } from '@angular/core';
import { ProductService } from './core/services/product.service';
import { AppError } from './core/models/auth.model';

@Component({
  selector: 'app-product-list'
})
export class ProductListComponent {
  private productService = inject(ProductService);
  error = signal<AppError | null>(null);

  loadProducts() {
    this.productService.getProducts({}, 0, 12).subscribe({
      next: (products) => {
        console.log('Loaded:', products);
      },
      error: (error: AppError) => {
        // L'error interceptor convertit HttpErrorResponse en AppError
        this.error.set(error);
        console.error('Error:', error.message);
        console.error('Field errors:', error.fieldErrors);
      }
    });
  }
}

// ============================================================
// 8. INTÉGRER DANS app.routes.ts
// ============================================================

import { Routes } from '@angular/router';

export const routes: Routes = [
  // ... autres routes ...

  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then(
        (m) => m.ProductsComponent
      )
  },

  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      )
  },

  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/cart/cart.component').then((m) => m.CartComponent)
  }

  // ... autres routes ...
];

