import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartSummary } from '../../../../core/models/dashboard.model';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-summary">
      <h3>Récapitulatif de la commande</h3>

      <div class="summary-row">
        <span>Sous-total</span>
        <span>{{ summary.subtotal | currency }}</span>
      </div>

      @if (summary.discount > 0) {
        <div class="summary-row discount">
          <span>Remise</span>
          <span>-{{ summary.discount | currency }}</span>
        </div>
      }

      <div class="summary-row">
        <span>Frais de livraison</span>
        <span>{{ summary.shippingCost | currency }}</span>
      </div>

      <div class="summary-divider"></div>

      <div class="summary-row total">
        <span>Total TTC</span>
        <span>{{ summary.total | currency }}</span>
      </div>
    </div>
  `,
  styles: [`
    .order-summary {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .order-summary h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: #4b5563;
    }

    .summary-row.discount {
      color: #16a34a;
    }

    .summary-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 0.5rem 0;
    }

    .summary-row.total {
      font-size: 1rem;
      font-weight: 700;
      color: #1f2937;
      padding-top: 0.5rem;
      border-top: 1px solid #e5e7eb;
    }
  `]
})
export class OrderSummaryComponent {
  @Input() summary!: CartSummary;
}
