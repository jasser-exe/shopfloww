import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-layout">
      <!-- Mobile menu toggle -->
      <button
        class="mobile-menu-toggle"
        (click)="toggleSidebar()"
        [class.active]="sidebarOpen()"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Sidebar -->
      <aside class="dashboard-sidebar" [class.open]="sidebarOpen()">
        <div class="sidebar-header">
          <h2>Dashboard</h2>
        </div>

        <nav class="sidebar-nav">
          <a
            *ngFor="let item of navigationItems()"
            [routerLink]="item.path"
            routerLinkActive="active"
            class="nav-item"
            (click)="closeSidebarOnMobile()"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <button (click)="logout()" class="logout-btn">
            Déconnexion
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="dashboard-main">
        <header class="dashboard-header">
          <h1>{{ getPageTitle() }}</h1>
          <div class="user-info">
            <span>{{ authService.currentUser()?.email }}</span>
          </div>
        </header>

        <div class="dashboard-content">
          <ng-content></ng-content>
        </div>
      </main>

      <!-- Mobile overlay -->
      <div
        class="sidebar-overlay"
        [class.active]="sidebarOpen()"
        (click)="closeSidebar()"
      ></div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .mobile-menu-toggle {
      display: none;
      position: fixed;
      top: 1rem;
      left: 1rem;
      z-index: 1001;
      background: white;
      border: none;
      border-radius: 0.375rem;
      padding: 0.5rem;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .mobile-menu-toggle span {
      display: block;
      width: 20px;
      height: 2px;
      background: #374151;
      margin: 3px 0;
      transition: 0.3s;
    }

    .mobile-menu-toggle.active span:nth-child(1) {
      transform: rotate(-45deg) translate(-5px, 6px);
    }

    .mobile-menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-toggle.active span:nth-child(3) {
      transform: rotate(45deg) translate(-5px, -6px);
    }

    .dashboard-sidebar {
      width: 250px;
      background: white;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 1000;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
    }

    .dashboard-sidebar.open {
      transform: translateX(0);
    }

    .sidebar-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .sidebar-header h2 {
      margin: 0;
      color: #1f2937;
      font-size: 1.25rem;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: #6b7280;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .nav-item:hover {
      background: #f9fafb;
      color: #374151;
    }

    .nav-item.active {
      background: #3b82f6;
      color: white;
    }

    .nav-item.active:hover {
      background: #2563eb;
    }

    .nav-icon {
      font-size: 1.25rem;
      width: 20px;
      text-align: center;
    }

    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .logout-btn {
      width: 100%;
      padding: 0.75rem;
      background: #dc2626;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s ease;
    }

    .logout-btn:hover {
      background: #b91c1c;
    }

    .dashboard-main {
      flex: 1;
      margin-left: 250px;
      display: flex;
      flex-direction: column;
    }

    .dashboard-header {
      background: white;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dashboard-header h1 {
      margin: 0;
      color: #1f2937;
    }

    .user-info {
      color: #6b7280;
      font-size: 0.875rem;
    }

    .dashboard-content {
      flex: 1;
      padding: 2rem;
    }

    .sidebar-overlay {
      display: none;
    }

    @media (max-width: 768px) {
      .mobile-menu-toggle {
        display: block;
      }

      .dashboard-sidebar {
        width: 280px;
      }

      .dashboard-main {
        margin-left: 0;
      }

      .sidebar-overlay {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .sidebar-overlay.active {
        opacity: 1;
        visibility: visible;
      }
    }
  `]
})
export class DashboardLayoutComponent {
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);

  sidebarOpen = signal(false);

  navigationItems = signal([
    { path: '/dashboard', label: 'Tableau de bord', icon: '📊' },
    { path: '/dashboard/products', label: 'Mes produits', icon: '📦' },
    { path: '/dashboard/orders', label: 'Commandes', icon: '📋' },
    { path: '/dashboard/reviews', label: 'Avis', icon: '⭐' },
    { path: '/dashboard/users', label: 'Utilisateurs', icon: '👥' },
    { path: '/dashboard/coupons', label: 'Coupons', icon: '🎫' },
  ]);

  toggleSidebar(): void {
    this.sidebarOpen.update(open => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth <= 768) {
      this.closeSidebar();
    }
  }

  getPageTitle(): string {
    const currentRoute = this.router.url;
    const item = this.navigationItems().find(item => currentRoute.includes(item.path));
    return item ? item.label : 'Dashboard';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
