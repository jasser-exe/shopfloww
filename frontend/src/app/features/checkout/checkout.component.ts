import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../core';
import { Address } from '../../core/models/order.model';
import { CartSummary } from '../../core/models/dashboard.model';
import { AddressSelectorComponent } from './components/address-selector/address-selector.component';
import { OrderSummaryComponent } from '../cart/components/order-summary/order-summary.component';

type CheckoutStep = 'address' | 'summary' | 'confirmation';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    AddressSelectorComponent,
    OrderSummaryComponent
  ],
  template: `
    <div class="checkout-container">
      <div class="checkout-header">
        <h1>Finaliser ma commande</h1>
        <div class="step-indicator">
          <div class="step" [class.active]="currentStep() === 'address'" [class.completed]="stepCompleted('address')">
            <span class="step-number">1</span>
            <span class="step-label">Adresse</span>
          </div>
          <div class="step" [class.active]="currentStep() === 'summary'" [class.completed]="stepCompleted('summary')">
            <span class="step-number">2</span>
            <span class="step-label">Récapitulatif</span>
          </div>
          <div class="step" [class.active]="currentStep() === 'confirmation'" [class.completed]="stepCompleted('confirmation')">
            <span class="step-number">3</span>
            <span class="step-label">Confirmation</span>
          </div>
        </div>
      </div>

      <div class="checkout-content">
        @if (currentStep() === 'address') {
          <div class="step-content">
            <h2>Sélectionnez une adresse de livraison</h2>
            <app-address-selector
              (addressSelected)="onAddressSelected($event)"
            ></app-address-selector>
            <div class="step-actions">
              <button
                (click)="nextStep()"
                [disabled]="!selectedAddress()"
                class="next-btn"
              >
                Continuer
              </button>
            </div>
          </div>
        }

        @if (currentStep() === 'summary') {
          <div class="step-content">
            <h2>Récapitulatif de votre commande</h2>
            <app-order-summary
              [summary]="orderSummary()"
            ></app-order-summary>
            <div class="step-actions">
              <button (click)="previousStep()" class="back-btn">
                Retour
              </button>
              <button
                (click)="placeOrder()"
                [disabled]="isPlacingOrder()"
                class="place-order-btn"
              >
                {{ isPlacingOrder() ? 'Commande en cours...' : 'Confirmer la commande' }}
              </button>
            </div>
          </div>
        }

        @if (currentStep() === 'confirmation') {
          <div class="step-content">
            <div class="confirmation-message">
              <h2>Commande confirmée !</h2>
              <p>Votre commande a été passée avec succès.</p>
              <p>Numéro de commande : {{ orderId() }}</p>
              <button (click)="goToOrders()" class="view-order-btn">
                Voir ma commande
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .checkout-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .checkout-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .checkout-header h1 {
      margin-bottom: 2rem;
      color: #1f2937;
    }

    .step-indicator {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      opacity: 0.5;
      transition: opacity 0.3s ease;
    }

    .step.active {
      opacity: 1;
    }

    .step.completed {
      opacity: 1;
    }

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e5e7eb;
      color: #6b7280;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .step.active .step-number {
      background: #3b82f6;
      color: white;
    }

    .step.completed .step-number {
      background: #16a34a;
      color: white;
    }

    .step-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #4b5563;
    }

    .checkout-content {
      background: white;
      border-radius: 0.5rem;
      padding: 2rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .step-content h2 {
      margin-bottom: 2rem;
      color: #1f2937;
    }

    .step-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }

    .next-btn,
    .place-order-btn {
      padding: 0.75rem 2rem;
      background: #16a34a;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .next-btn:hover:not(:disabled),
    .place-order-btn:hover:not(:disabled) {
      background: #15803d;
    }

    .next-btn:disabled,
    .place-order-btn:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }

    .back-btn {
      padding: 0.75rem 2rem;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .back-btn:hover {
      background: #e5e7eb;
    }

    .confirmation-message {
      text-align: center;
      padding: 2rem;
    }

    .confirmation-message h2 {
      margin-bottom: 1rem;
      color: #16a34a;
    }

    .confirmation-message p {
      margin-bottom: 1rem;
      color: #4b5563;
    }

    .view-order-btn {
      padding: 0.75rem 2rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .view-order-btn:hover {
      background: #2563eb;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);

  currentStep = signal<CheckoutStep>('address');
  selectedAddress = signal<Address | null>(null);
  isPlacingOrder = signal(false);
  orderId = signal<string>('');

  orderSummary = computed<CartSummary>(() => {
    const cart = this.cartService.cart();
    if (!cart) return { subtotal: 0, discount: 0, shippingCost: 0, total: 0 };

    const subtotal = cart.totalPrice;
    const discount = cart.discount || 0;
    const shippingCost = cart.shippingCost || 0;
    const total = cart.finalPrice || (subtotal - discount + shippingCost);

    return { subtotal, discount, shippingCost, total };
  });

  ngOnInit(): void {
    // Redirect to cart if empty
    if (this.cartService.itemCount() === 0) {
      this.router.navigate(['/cart']);
    }
  }

  stepCompleted(step: CheckoutStep): boolean {
    switch (step) {
      case 'address':
        return !!this.selectedAddress();
      case 'summary':
        return this.currentStep() === 'confirmation';
      case 'confirmation':
        return !!this.orderId();
      default:
        return false;
    }
  }

  onAddressSelected(address: Address): void {
    this.selectedAddress.set(address);
  }

  nextStep(): void {
    if (this.currentStep() === 'address' && this.selectedAddress()) {
      this.currentStep.set('summary');
    }
  }

  previousStep(): void {
    if (this.currentStep() === 'summary') {
      this.currentStep.set('address');
    }
  }

  placeOrder(): void {
    const address = this.selectedAddress();
    if (!address) return;

    this.isPlacingOrder.set(true);
    this.cartService.placeOrder({ addressId: address.id }).subscribe({
      next: (order) => {
        this.orderId.set(order.id.toString());
        this.currentStep.set('confirmation');
        this.isPlacingOrder.set(false);
        // TODO: Show success toast
      },
      error: (error) => {
        console.error('Error placing order:', error);
        this.isPlacingOrder.set(false);
        // TODO: Show error message
      }
    });
  }

  goToOrders(): void {
    this.router.navigate(['/orders', this.orderId()]);
  }
}
