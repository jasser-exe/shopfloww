import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AdminDashboardResponse } from '../../../core/models/dashboard.model';
import { DashboardLayoutComponent } from '../../../shared/components/dashboard-layout/dashboard-layout.component';
import { MetricCardComponent } from '../../../shared/components/metric-card/metric-card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardLayoutComponent,
    MetricCardComponent
  ],
  template: `
    <app-dashboard-layout>
      <div class="admin-dashboard">
        <!-- Metrics Row -->
        <div class="metrics-row">
          <app-metric-card
            icon="💰"
            [value]="dashboard()?.totalRevenue || 0"
            label="Revenus totaux"
          ></app-metric-card>

          <app-metric-card
            icon="📦"
            [value]="dashboard()?.totalOrders || 0"
            label="Total commandes"
          ></app-metric-card>

          <app-metric-card
            icon="👥"
            [value]="dashboard()?.totalUsers || 0"
            label="Utilisateurs actifs"
          ></app-metric-card>

          <app-metric-card
            icon="🏆"
            [value]="0"
            label="Produit le plus populaire"
          ></app-metric-card>
        </div>

        <!-- Recent Orders -->
        @if (dashboard()?.recentOrders && dashboard()!.recentOrders.length > 0) {
          <div class="recent-orders-section">
            <h3>Commandes récentes</h3>
            <div class="orders-table">
              <div class="table-header">
                <span>ID</span>
                <span>Client</span>
                <span>Total</span>
                <span>Statut</span>
                <span>Date</span>
              </div>
              <div *ngFor="let order of dashboard()!.recentOrders" class="table-row">
                <span>#{{ order.id }}</span>
                <span>{{ order.customerName }}</span>
                <span>{{ order.totalPrice | currency }}</span>
                <span>{{ order.status }}</span>
                <span>{{ order.createdAt | date:'short' }}</span>
              </div>
            </div>
          </div>
        }

        <!-- User Stats -->
        @if (dashboard()?.userStats) {
          <div class="user-stats-section">
            <h3>Statistiques utilisateurs</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-value">{{ dashboard()!.userStats.active }}</span>
                <span class="stat-label">Actifs</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ dashboard()!.userStats.inactive }}</span>
                <span class="stat-label">Inactifs</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ dashboard()!.userStats.newThisMonth }}</span>
                <span class="stat-label">Nouveaux ce mois</span>
              </div>
            </div>
          </div>
        }
      </div>
    </app-dashboard-layout>
  `,
  styles: [`
    .admin-dashboard {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .metrics-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .recent-orders-section,
    .user-stats-section {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .recent-orders-section h3,
    .user-stats-section h3 {
      margin: 0 0 1rem 0;
      color: #1f2937;
      font-size: 1.25rem;
    }

    .orders-table {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .table-header,
    .table-row {
      display: grid;
      grid-template-columns: 80px 1fr 100px 100px 120px;
      gap: 1rem;
      padding: 0.75rem;
      align-items: center;
    }

    .table-header {
      background: #f9fafb;
      border-radius: 0.375rem;
      font-weight: 600;
      color: #374151;
      font-size: 0.875rem;
    }

    .table-row {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
    }

    .table-row:hover {
      background: #f9fafb;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .stat-item {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1.5rem;
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #6b7280;
      font-size: 0.875rem;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  dashboard = signal<AdminDashboardResponse | null>(null);

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.dashboardService.getAdminDashboard().subscribe({
      next: (data) => {
        this.dashboard.set(data);
      },
      error: (error) => {
        console.error('Error loading admin dashboard:', error);
      }
    });
  }
}
