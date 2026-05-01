import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AdminDashboardResponse,
  SellerDashboardResponse,
  CustomerDashboardResponse
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  getAdminDashboard(): Observable<AdminDashboardResponse> {
    return this.http.get<AdminDashboardResponse>(`${this.apiUrl}/admin`);
  }

  getSellerDashboard(): Observable<SellerDashboardResponse> {
    return this.http.get<SellerDashboardResponse>(`${this.apiUrl}/seller`);
  }

  getCustomerDashboard(): Observable<CustomerDashboardResponse> {
    return this.http.get<CustomerDashboardResponse>(`${this.apiUrl}/customer`);
  }
}
