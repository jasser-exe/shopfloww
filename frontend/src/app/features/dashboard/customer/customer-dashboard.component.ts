import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { CustomerDashboardResponse } from '../../../core/models/dashboard.model';
import { OrderStatus } from '../../../core/models/order.model';
import { DashboardLayoutComponent } from '../../../shared/components/dashboard-layout/dashboard-layout.component';
import { OrderStatusBadgeComponent } from '../../../shared/components/order-status-badge/order-status-badge.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayoutComponent,
    OrderStatusBadgeComponent
  ],
  template: `
    <app-dashboard-layout>
      <div class="customer-dashboard">
        <!-- Welcome Section -->
        <div class="welcome-section">
          <h2>Mon tableau de bord</h2>
          <p>Bienvenue sur votre espace personnel</p>
        </div>

        <!-- Stats Cards -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon">📦</div>
            <div class="stat-content">
              <div class="stat-value">{{ dashboard()?.totalOrders || 0 }}</div>
              <div class="stat-label">Commandes totales</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <div class="stat-value">{{ dashboard()?.totalSpent || 0 | currency }}</div>
              <div class="stat-label">Dépensé total</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <div class="stat-value">{{ dashboard()?.recentReviews?.length || 0 }}</div>
              <div class="stat-label">Avis donnés</div>
            </div>
          </div>
        </div>

        <!-- Active Orders -->
        @if (dashboard()?.activeOrders && dashboard()!.activeOrders.length > 0) {
          <div class="orders-section">
            <h3>Mes commandes actives</h3>
            <div class="orders-list">
              <div *ngFor="let order of dashboard()!.activeOrders" class="order-card">
                <div class="order-header">
                  <span class="order-id">Commande #{{ order.id }}</span>
                  <app-order-status-badge [status]="order.status"></app-order-status-badge>
                </div>
                <div class="order-details">
                  <span class="order-date">{{ order.createdAt | date:'medium' }}</span>
                  <span class="order-total">{{ order.totalPrice | currency }}</span>
                </div>
                <div class="order-items">
                  <span>{{ order.productCount }} article(s)</span>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Recent Reviews -->
        @if (dashboard()?.recentReviews && dashboard()!.recentReviews.length > 0) {
          <div class="reviews-section">
            <h3>Mes derniers avis</h3>
            <div class="reviews-list">
              <div *ngFor="let review of dashboard()!.recentReviews" class="review-card">
                <div class="review-header">
                  <span class="product-name">{{ review.productName }}</span>
                  <div class="review-rating">
                    <span *ngFor="let star of [1,2,3,4,5]" class="star" [class.filled]="star <= review.rating">★</span>
                  </div>
                </div>
                <p class="review-comment">{{ review.comment }}</p>
                <div class="review-footer">
                  <span class="review-date">{{ review.createdAt | date:'short' }}</span>
                  <span class="review-status" [class.approved]="review.approved">
                    {{ review.approved ? 'Approuvé' : 'En attente' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </app-dashboard-layout>
  `,
  styles: [`
    .customer-dashboard {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .welcome-section {
      background: white;
      border-radius: 0.5rem;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .welcome-section h2 {
      margin: 0 0 0.5rem 0;
      color: #1f2937;
    }

    .welcome-section p {
      margin: 0;
      color: #6b7280;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      background: #3b82f6;
      color: white;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .orders-section,
    .reviews-section {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .orders-section h3,
    .reviews-section h3 {
      margin: 0 0 1rem 0;
      color: #1f2937;
      font-size: 1.25rem;
    }

    .orders-list,
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .order-card,
    .review-card {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1rem;
    }

    .order-card:hover,
    .review-card:hover {
      background: #f9fafb;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .order-id {
      font-weight: 600;
      color: #1f2937;
    }

    .order-details {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .order-date,
    .order-total {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .order-items {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.75rem;
    }

    .product-name {
      font-weight: 600;
      color: #1f2937;
    }

    .review-rating {
      display: flex;
      gap: 0.125rem;
    }

    .star {
      color: #e5e7eb;
      font-size: 1rem;
    }

    .star.filled {
      color: #fbbf24;
    }

    .review-comment {
      margin: 0 0 0.75rem 0;
      color: #4b5563;
      line-height: 1.5;
    }

    .review-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .review-date {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .review-status {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      background: #fef3c7;
      color: #d97706;
    }

    .review-status.approved {
      background: #d1fae5;
      color: #065f46;
    }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  dashboard = signal<CustomerDashboardResponse | null>(null);

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.dashboardService.getCustomerDashboard().subscribe({
      next: (data) => {
        this.dashboard.set(data);
      },
      error: (error) => {
        console.error('Error loading customer dashboard:', error);
      }
    });
  }
}
