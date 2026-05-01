import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { SellerDashboardResponse } from '../../../core/models/dashboard.model';
import { DashboardLayoutComponent } from '../../../shared/components/dashboard-layout/dashboard-layout.component';
import { MetricCardComponent } from '../../../shared/components/metric-card/metric-card.component';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayoutComponent,
    MetricCardComponent
  ],
  template: `
    <app-dashboard-layout>
      <div class="seller-dashboard">
        <!-- Metrics Row -->
        <div class="metrics-row">
          <app-metric-card
            icon="💰"
            [value]="dashboard()?.totalRevenue || 0"
            label="Revenus totaux"
          ></app-metric-card>

          <app-metric-card
            icon="📦"
            [value]="dashboard()?.pendingOrdersCount || 0"
            label="Commandes en attente"
          ></app-metric-card>

          <app-metric-card
            icon="⚠️"
            [value]="dashboard()?.lowStockProducts?.length || 0"
            label="Produits en rupture"
          ></app-metric-card>
        </div>

        <!-- Low Stock Alerts -->
        @if (dashboard()?.lowStockProducts && dashboard()!.lowStockProducts.length > 0) {
          <div class="alerts-section">
            <h3>Alerte stock faible</h3>
            <div class="alerts-list">
              <div *ngFor="let product of dashboard()!.lowStockProducts" class="alert-item">
                <span class="product-name">{{ product.name }}</span>
                <span class="stock-info">Stock: {{ product.stock }} (seuil: {{ product.threshold }})</span>
              </div>
            </div>
          </div>
        }

        <!-- Recent Orders -->
        @if (dashboard()?.recentOrders && dashboard()!.recentOrders.length > 0) {
          <div class="recent-orders-section">
            <h3>Commandes récentes</h3>
            <div class="orders-list">
              <div *ngFor="let order of dashboard()!.recentOrders" class="order-item">
                <div class="order-info">
                  <span class="order-id">#{{ order.id }}</span>
                  <span class="order-customer">{{ order.customerName }}</span>
                </div>
                <div class="order-details">
                  <span class="order-total">{{ order.totalPrice | currency }}</span>
                  <span class="order-status">{{ order.status }}</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </app-dashboard-layout>
  `,
  styles: [`
    .seller-dashboard {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .metrics-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .alerts-section,
    .recent-orders-section {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .alerts-section h3,
    .recent-orders-section h3 {
      margin: 0 0 1rem 0;
      color: #1f2937;
      font-size: 1.25rem;
    }

    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .alert-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #fef3c7;
      border: 1px solid #fbbf24;
      border-radius: 0.375rem;
    }

    .product-name {
      font-weight: 600;
      color: #92400e;
    }

    .stock-info {
      color: #a16207;
      font-size: 0.875rem;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
    }

    .order-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .order-id {
      font-weight: 600;
      color: #1f2937;
    }

    .order-customer {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .order-details {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .order-total {
      font-weight: 600;
      color: #1f2937;
    }

    .order-status {
      font-size: 0.875rem;
      color: #6b7280;
    }
  `]
})
export class SellerDashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  dashboard = signal<SellerDashboardResponse | null>(null);

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.dashboardService.getSellerDashboard().subscribe({
      next: (data) => {
        this.dashboard.set(data);
      },
      error: (error) => {
        console.error('Error loading seller dashboard:', error);
      }
    });
  }
}
