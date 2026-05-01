import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import {
  UserPayload,
  AuthResponse,
  UserResponse,
  RegisterRequest
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = 'http://localhost:8080/api';

  readonly currentUser = signal<UserPayload | null>(null);

  constructor() {
    this.loadCurrentUser();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          this.storeTokens(response);
          this.setCurrentUser(response.accessToken);
        })
      );
  }

  register(data: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/auth/register`, data);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.storeTokens(response);
          this.setCurrentUser(response.accessToken);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken() && this.currentUser() !== null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRole(): 'ADMIN' | 'SELLER' | 'CUSTOMER' | null {
    return this.currentUser()?.role || null;
  }

  private storeTokens(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  }

  private setCurrentUser(token: string): void {
    try {
      const payload = this.decodeJwt(token);
      this.currentUser.set(payload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
    }
  }

  private loadCurrentUser(): void {
    const token = this.getAccessToken();
    if (token) {
      this.setCurrentUser(token);
    }
  }

  private decodeJwt(token: string): UserPayload {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT');
    }

    const payload = JSON.parse(atob(parts[1]));
    return payload as UserPayload;
  }
}



