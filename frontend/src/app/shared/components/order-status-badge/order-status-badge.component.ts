import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStatus } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="getStatusClass()">
      {{ getStatusLabel() }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-pending {
      background: #fef3c7;
      color: #d97706;
    }

    .status-paid {
      background: #dbeafe;
      color: #2563eb;
    }

    .status-processing {
      background: #ede9fe;
      color: #7c3aed;
    }

    .status-shipped {
      background: #ecfdf5;
      color: #059669;
    }

    .status-delivered {
      background: #f0fdf4;
      color: #16a34a;
    }

    .status-cancelled {
      background: #fef2f2;
      color: #dc2626;
    }

    .status-refunded {
      background: #fef3c7;
      color: #d97706;
    }
  `]
})
export class OrderStatusBadgeComponent {
  @Input() status!: OrderStatus;

  getStatusClass(): string {
    switch (this.status) {
      case 'PENDING':
        return 'status-pending';
      case 'PAID':
        return 'status-paid';
      case 'PROCESSING':
        return 'status-processing';
      case 'SHIPPED':
        return 'status-shipped';
      case 'DELIVERED':
        return 'status-delivered';
      case 'CANCELLED':
        return 'status-cancelled';
      case 'REFUNDED':
        return 'status-refunded';
      default:
        return 'status-pending';
    }
  }

  getStatusLabel(): string {
    switch (this.status) {
      case 'PENDING':
        return 'En attente';
      case 'PAID':
        return 'Payé';
      case 'PROCESSING':
        return 'En traitement';
      case 'SHIPPED':
        return 'Expédié';
      case 'DELIVERED':
        return 'Livré';
      case 'CANCELLED':
        return 'Annulé';
      case 'REFUNDED':
        return 'Remboursé';
      default:
        return 'Inconnu';
    }
  }
}
