# ShopFlow Frontend - Angular 17+ Setup

## ✅ Configuration Complète Générée

### 1. **Core Architecture (src/app/core/)**

#### Interceptors
- **auth.interceptor.ts**: Intercepteur fonctionnel JWT
  - Ajoute le Bearer token à toutes les requêtes
  - Gère automatiquement le refresh token sur 401
  - Retry de la requête originale après refresh
  - Logout automatique en cas d'échec du refresh

- **error.interceptor.ts**: Intercepteur de gestion des erreurs
  - Convertit HttpErrorResponse en AppError structuré
  - Mappe les erreurs HTTP à des messages utilisateur-friendly

#### Services
- **auth.service.ts**: Service d'authentification complet
  - `login(email, password)`: POST /api/auth/login
  - `register(data)`: POST /api/auth/register
  - `refreshToken()`: POST /api/auth/refresh (automatic on 401)
  - `logout()`: Clear tokens, navigate to /login
  - `isLoggedIn()`: Vérification de l'authentification
  - `getAccessToken()`: Récupère le token depuis localStorage
  - `getRole()`: Récupère le rôle de l'utilisateur
  - `currentUser`: Signal<UserPayload> avec state management réactif
  - Décodage JWT automatique avec extraction du payload

#### Guards
- **auth.guard.ts**: CanActivateFn fonctionnel
  - Protège les routes nécessitant l'authentification
  - Redirect vers /login avec returnUrl query param
  - Utilisable directement dans les définitions de routes

- **role.guard.ts**: CanActivateFn fonctionnel
  - Valide les rôles utilisateur (ADMIN, SELLER, CUSTOMER)
  - Accepte les rôles depuis route.data['roles']
  - Redirect vers /forbidden si non autorisé

#### Models
- **auth.model.ts**: Types TypeScript strictes
  - `UserPayload`: Payload JWT décodé (sub, email, role, iat, exp)
  - `AuthResponse`: Response d'authentification
  - `UserResponse`: Données utilisateur complètes
  - `RegisterRequest`: Body de registration
  - `AppError`: Structure d'erreur unifiée

### 2. **Application Configuration (src/app/)**

#### app.config.ts
```typescript
ApplicationConfig with:
- provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
- provideRouter(routes)
- provideAnimations()
- provideBrowserGlobalErrorListeners()
```

#### app.routes.ts
Routes complètes avec lazy loading:
- `/` → redirect to /products
- `/login` → LoginComponent (public)
- `/register` → RegisterComponent (public)
- `/products` → ProductsComponent (public)
- `/products/:id` → ProductDetailComponent (authGuard)
- `/cart` → CartComponent (authGuard + roleGuard ['CUSTOMER'])
- `/checkout` → CheckoutComponent (authGuard + roleGuard ['CUSTOMER'])
- `/orders` → CustomerOrdersComponent (authGuard + roleGuard ['CUSTOMER'])
- `/orders/:id` → OrderDetailComponent (authGuard)
- `/dashboard` → DashboardComponent (authGuard + roleGuard ['ADMIN', 'SELLER', 'CUSTOMER'])
- `/admin` → AdminComponent (authGuard + roleGuard ['ADMIN'])
- `/seller` → SellerComponent (authGuard + roleGuard ['SELLER'])
- `/forbidden` → ForbiddenComponent (403 error page)
- `**` → NotFoundComponent (404 error page)

### 3. **Pages Components (src/app/pages/)**

Tous les composants sont **standalone** avec:
- Support de TypeScript strict mode
- SCSS pour les styles
- Lazy loading automatique via routes
- Injection de dépendances moderne avec `inject()`

**Components implémentés**:
- LoginComponent: Formulaire d'authentification réactif
- RegisterComponent: Formulaire d'enregistrement
- ProductsComponent: Listing des produits
- ProductDetailComponent: Détails du produit
- CartComponent: Panier d'achat
- CheckoutComponent: Paiement/commande
- CustomerOrdersComponent: Mes commandes
- OrderDetailComponent: Détails de la commande
- DashboardComponent: Dashboard utilisateur
- AdminComponent: Panneau admin
- SellerComponent: Dashboard vendeur
- ForbiddenComponent: Page erreur 403
- NotFoundComponent: Page erreur 404

### 4. **Environment Configuration (src/environments/)**

- **environment.ts**: Development
  - apiUrl: http://localhost:8080/api

- **environment.prod.ts**: Production
  - apiUrl: http://localhost:8080/api (à adapter)

### 5. **Features Clés**

#### TypeScript Strict Mode ✓
```json
{
  "strict": true,
  "noImplicitOverride": true,
  "noPropertyAccessFromIndexSignature": true,
  "strictInjectionParameters": true,
  "strictInputAccessModifiers": true,
  "strictTemplates": true
}
```

#### Standalone Components ✓
- Tous les composants utilisent `standalone: true`
- Imports déclarés directement dans le décorateur
- Pas de NgModule requis

#### Signals (Angular 17+) ✓
```typescript
readonly currentUser = signal<UserPayload | null>(null);
// Utilisation: authService.currentUser() dans les templates
```

#### Functional Interceptors (Angular 15+) ✓
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => { ... }
```

#### Functional Guards (Angular 16+) ✓
```typescript
export const authGuard: CanActivateFn = (route, state) => { ... }
```

#### Lazy Loading Routes ✓
```typescript
loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
```

## 🚀 Scripts disponibles

```bash
# Démarrage du serveur de développement
npm start

# Build de production
npm build

# Tests
npm test
```

## 📦 Dépendances Installées

```json
{
  "@angular/animations": "^21.2.0",
  "@angular/common": "^21.2.0",
  "@angular/compiler": "^21.2.0",
  "@angular/core": "^21.2.0",
  "@angular/forms": "^21.2.0",
  "@angular/platform-browser": "^21.2.0",
  "@angular/router": "^21.2.0",
  "rxjs": "~7.8.0",
  "tslib": "^2.3.0"
}
```

## 🔐 Flow d'authentification

1. **Login**: User → LoginComponent → authService.login() → Backend /api/auth/login
2. **Token Storage**: accessToken + refreshToken stockés dans localStorage
3. **Auto-attach**: authInterceptor ajoute Authorization header
4. **Token Refresh**: Sur 401, refreshToken automatiquement via authService.refreshToken()
5. **Retry**: Requête originale est retriée avec nouveau token
6. **Logout**: Clear localStorage, navigate to /login, currentUser signal reset

## 🛡️ Flow de sécurité

1. **authGuard**: Vérifie isLoggedIn() avant d'accéder aux routes protégées
2. **roleGuard**: Vérifie le rôle utilisateur (data.roles)
3. **Error Interceptor**: Capture et mappe les erreurs HTTP
4. **JWT Validation**: Payload vérifié au login et chaque refresh

## 📁 Structure du projet

```
src/
├── app/
│   ├── core/
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   ├── error.interceptor.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── index.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   ├── role.guard.ts
│   │   │   └── index.ts
│   │   ├── models/
│   │   │   ├── auth.model.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── pages/
│   │   ├── login/
│   │   ├── register/
│   │   ├── products/
│   │   ├── product-detail/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── customer-orders/
│   │   ├── order-detail/
│   │   ├── dashboard/
│   │   ├── admin/
│   │   ├── seller/
│   │   ├── forbidden/
│   │   └── not-found/
│   ├── app.config.ts
│   ├── app.routes.ts
│   ├── app.ts
│   ├── app.html
│   └── app.scss
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
├── index.html
├── main.ts
└── styles.scss
```

## ✨ Prochaines étapes

1. **Implémenter les services business**: CartService, ProductService, OrderService, etc.
2. **Créer les composants détaillés**: Remplir les templates des pages
3. **State management**: Considérer NgRx/Akita pour la gestion d'état complexe
4. **Intercepteurs avancés**: Ajouter request/response logging
5. **Tests**: Unit tests avec Jest/Vitest, E2E tests avec Cypress/Playwright
6. **Performance**: Lazy loading des routes, ChangeDetectionStrategy.OnPush
7. **PWA**: Service Worker, offline support
8. **i18n**: Internationalisation Angular

## 📝 Notes

- ✅ Tous les composants compilent sans erreurs
- ✅ TypeScript strict mode activé
- ✅ SCSS support inclus
- ✅ Angular 21.2.0 utilisé (dernière version stable)
- ✅ Intercepteurs et guards fonctionnels
- ✅ Signals pour reactive state management
- ✅ Lazy loading pour toutes les routes
- ✅ Auth flow complet avec JWT + refresh token

