  # Architecture du Catalogue Produits - ShopFlow

## Structure des fichiers créés

### Core Services
- **ProductService** (`core/services/product.service.ts`)
  - `getProducts(filters, page, size)` - Récupère les produits avec filtrage et pagination
  - `getProductById(id)` - Récupère les détails d'un produit
  - `searchProducts(q, page, size)` - Recherche par texte
  - `getTopSelling(limit)` - Produits les plus vendus
  - `getCategories()` - Récupère les catégories
  - `getReviews(productId, page, size)` - Récupère les avis paginés

- **CartService** (`core/services/cart.service.ts`)
  - `addItem(item)` - Ajoute un article au panier
  - `updateItem(itemId, quantity)` - Met à jour la quantité
  - `removeItem(itemId)` - Supprime un article
  - `clearCart()` - Vide le panier
  - Signaux : `getTotalItems`, `getTotalPrice`, `getItems`

### Models
- **ProductModel** (`core/models/product.model.ts`)
  - `ProductResponse` - Données complètes d'un produit
  - `ProductImage` - Images du produit
  - `ProductVariant` - Variantes (tailles, couleurs, etc.)
  - `ProductFilter` - Filtres applicables
  - `Page<T>` - Réponse paginée
  - `Category` - Catégories (arborescente)
  - `ProductReview` - Avis clients
  - `FilterChangeEvent` - Événement de changement de filtre

### Shared Components
1. **RatingStarsComponent** (`shared/components/rating-stars/`)
   - Affiche les étoiles d'évaluation (1-5)
   - Supporte les demi-étoiles
   - @Input: Rating, showValue

2. **PaginationComponent** (`shared/components/pagination/`)
   - Navigation entre pages
   - Affichage dynamique des numéros de page
   - @Output: pageChange event

3. **ProductCardComponent** (`shared/components/product-card/`)
   - Carte d'affichage d'un produit
   - Affiche prix, promo, stock
   - @Output: addToCart event

### Features - Catalogue (`features/catalogue/`)

#### Sous-composants
1. **CategoryTreeComponent** (`components/category-tree/`)
   - Arborescence des catégories (récursif)
   - Sélection hiérarchique
   - @Output: categorySelected event

2. **FilterComponent** (`components/filter/`)
   - Filtres par catégorie (tree)
   - Filtres par prix (min/max)
   - Checkbox promotion
   - Bouton réinitialiser
   - @Output: filterChange event

3. **ProductGridComponent** (`components/product-grid/`)
   - Grille CSS responsive
   - Reçoit liste de produits
   - @Output: addToCart event

4. **CatalogueComponent** (principal)
   - Gère les query params (route)
   - Synchronise filtres ↔ URL
   - Utilise combineLatest + switchMap
   - Gère loading state
   - Lance chargement initial depuis queryParams

### Features - Product Detail (`features/product-detail/`)

#### Sous-composants
1. **ImageGalleryComponent** (`components/image-gallery/`)
   - Vignettes + image principale
   - Sélection d'image
   - Animation zoom au survol

2. **ReviewCardComponent** (`components/review-card/`)
   - Affiche un avis individuel
   - Rating, date, commentaire
   - Boutons utile/pas utile

3. **ReviewsComponent** (`components/reviews/`)
   - Liste paginée des avis
   - Évaluation moyenne
   - Charge via ProductService

4. **VariantSelectorComponent** (`components/variant-selector/`)
   - Groupes d'attributs (Taille, Couleur, etc.)
   - Boutons de sélection
   - @Output: variantSelected event
   - Mise à jour prix/stock selon variante

5. **ProductDetailComponent** (principal)
   - Route: `/products/:id`
   - Charge produit via ActivatedRoute + switchMap
   - Skeleton loader pendant chargement
   - Intègre tous les sous-composants
   - Ajoute au panier via CartService
   - Gère sélection de variante

## Utilisation

### Dans app.routes.ts
```typescript
{
  path: 'products',
  loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
},
{
  path: 'products/:id',
  loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
}
```

### Injecter les services
```typescript
import { ProductService, CartService } from './core';

constructor() {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
}
```

### Utiliser les signaux du CartService
```typescript
totalItems = this.cartService.getTotalItems; // Signal
totalPrice = this.cartService.getTotalPrice; // Signal
items = this.cartService.getItems; // Signal
```

### Query params du catalogue
```
/products?categoryId=1&minPrice=10&maxPrice=100&onPromo=true&page=0&search=laptop
```

## Patterns Angular 17+

- **Standalone components** partout
- **Signals** pour l'état réactif
- **Computed signals** pour les valeurs dérivées
- **Functional interceptors** (déjà configurés)
- **Lazy loading** des composants (loadComponent)
- **Type safety** complet (TypeScript strict mode)
- **Async pipe** avec combineLatest / switchMap
- **RxJS** pour les flux asynchrones

## Styles

- **SCSS** avec BEM naming conventions
- **CSS Grid** pour les mises en page
- **Tailwind-like** utility patterns
- **Responsive design** mobile-first
- **Animations** smooth transitions

## À implémenter encore

1. Wishlist service
2. Notification system (toast)
3. Search bar component
4. Filter persistence (localStorage)
5. Product comparison
6. Related products
7. Stock management en temps réel

