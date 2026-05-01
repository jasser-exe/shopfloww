// Example: Usage des services et guards dans une route dans app.routes.ts

import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core';

export const exampleRoutes: Routes = [
  // Public routes (aucune protection)
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  // Protected routes (nécessite d'être authentifié)
  {
    path: 'cart',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['CUSTOMER'] },
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent)
  },

  // Admin-only routes
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  }
];

// Example: Utilisation du service d'authentification dans un composant

import { Component, inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav>
      <span *ngIf="authService.currentUser()">
        Welcome {{ authService.currentUser()?.email }}
      </span>
      <button *ngIf="authService.isLoggedIn()" (click)="logout()">
        Logout
      </button>
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  logout(): void {
    this.authService.logout();
  }
}

// Example: Création d'un service business utilisant le pattern

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api';

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }
}

// Example: Utilisation du error interceptor

import { Component, inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { AppError } from './core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <form (ngSubmit)="onLogin()">
      <input [(ngModel)]="email" name="email" />
      <input [(ngModel)]="password" name="password" type="password" />
      <button type="submit">Login</button>
      <div *ngIf="error" class="error">{{ error }}</div>
    </form>
  `
})
export class LoginExampleComponent {
  authService = inject(AuthService);
  email = '';
  password = '';
  error: string | null = null;

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: () => console.log('Login successful'),
      error: (err: AppError) => {
        // Les erreurs HTTP sont automatiquement converties en AppError
        this.error = err.message;
        console.log('Full error:', err);
        console.log('Field errors:', err.fieldErrors);
      }
    });
  }
}

