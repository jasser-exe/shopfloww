import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderResponse, PlaceOrderRequest } from '../models/order.model';

export interface CartItem {
  productId: number;
  quantity: number;
  variantId?: number;
}

export interface CartResponse {
  id: number;
  userId: number;
  items: CartItemResponse[];
  totalPrice: number;
  totalItems: number;
  couponCode?: string;
  discount?: number;
  shippingCost?: number;
  finalPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemResponse {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  promoPrice?: number;
  variantId?: number;
  variantAttributes?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/cart`;

  private cartSubject = new BehaviorSubject<CartResponse | null>(null);
  cart$ = this.cartSubject.asObservable();

  cart = signal<CartResponse | null>(null);

  itemCount = computed(() => this.cart()?.items.length ?? 0);

  constructor() {
    this.loadCart().subscribe({
      next: (cart) => {
        // Cart is already set in tap
      },
      error: (error) => {
        console.error('Error loading cart:', error);
      }
    });
  }

  loadCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.apiUrl).pipe(
      tap((cart) => {
        this.cart.set(cart);
        this.cartSubject.next(cart);
      })
    );
  }

  addItem(productId: number, variantId?: number, quantity: number = 1): Observable<CartResponse> {
    const item = { productId, variantId, quantity };
    return this.http.post<CartResponse>(`${this.apiUrl}/items`, item).pipe(
      tap((cart) => {
        this.cart.set(cart);
        this.cartSubject.next(cart);
      })
    );
  }

  updateItem(itemId: number, quantity: number): Observable<CartResponse> {
    return this.http
      .put<CartResponse>(`${this.apiUrl}/items/${itemId}`, { quantity })
      .pipe(
        tap((cart) => {
          this.cart.set(cart);
          this.cartSubject.next(cart);
        })
      );
  }

  removeItem(itemId: number): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.apiUrl}/items/${itemId}`).pipe(
      tap((cart) => {
        this.cart.set(cart);
        this.cartSubject.next(cart);
      })
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => {
        this.cart.set(null);
        this.cartSubject.next(null);
      })
    );
  }

  applyCoupon(code: string): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.apiUrl}/coupon`, { code }).pipe(
      tap((cart) => {
        this.cart.set(cart);
        this.cartSubject.next(cart);
      })
    );
  }

  removeCoupon(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.apiUrl}/coupon`).pipe(
      tap((cart) => {
        this.cart.set(cart);
        this.cartSubject.next(cart);
      })
    );
  }

  placeOrder(request: PlaceOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${environment.apiUrl}/orders`, request).pipe(
      tap((order) => {
        // Clear cart after successful order
        this.cart.set(null);
        this.cartSubject.next(null);
      })
    );
  }

  getTotalItems = computed(() => this.cart()?.totalItems ?? 0);
  getTotalPrice = computed(() => this.cart()?.totalPrice ?? 0);
  getItems = computed(() => this.cart()?.items ?? []);
}
