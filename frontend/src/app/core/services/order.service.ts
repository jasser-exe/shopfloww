import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderResponse, OrderStatus } from '../models/order.model';
import { Page } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  getMyOrders(page: number = 0, size: number = 10): Observable<Page<OrderResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<OrderResponse>>(`${this.apiUrl}/my`, { params });
  }

  getOrderById(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`);
  }

  getAllOrders(page: number = 0, size: number = 10, status?: OrderStatus): Observable<Page<OrderResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<Page<OrderResponse>>(this.apiUrl, { params });
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.apiUrl}/${id}/status`, { status });
  }

  cancelOrder(id: number): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/${id}/cancel`, {});
  }
}
