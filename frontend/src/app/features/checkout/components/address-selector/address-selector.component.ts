import { Component, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { Address } from '../../../../core/models/order.model';

@Component({
  selector: 'app-address-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="address-selector">
      @if (isLoading()) {
        <p>Chargement des adresses...</p>
      } @else if (addresses().length === 0) {
        <div class="no-addresses">
          <p>Aucune adresse trouvée.</p>
          <button (click)="showNewAddressForm.set(true)" class="add-address-btn">
            Ajouter une adresse
          </button>
        </div>
      } @else {
        <div class="address-list">
          <div
            *ngFor="let address of addresses()"
            class="address-card"
            [class.selected]="selectedAddress()?.id === address.id"
            (click)="selectAddress(address)"
          >
            <input
              type="radio"
              [value]="address.id"
              [checked]="selectedAddress()?.id === address.id"
              readonly
            />
            <div class="address-details">
              <p class="address-line">{{ address.street }}</p>
              <p class="address-line">{{ address.postalCode }} {{ address.city }}</p>
              <p class="address-line">{{ address.country }}</p>
              @if (address.isDefault) {
                <span class="default-badge">Adresse par défaut</span>
              }
            </div>
          </div>

          <button (click)="showNewAddressForm.set(true)" class="add-address-btn">
            + Nouvelle adresse
          </button>
        </div>
      }

      @if (showNewAddressForm()) {
        <div class="new-address-form">
          <h3>Nouvelle adresse</h3>
          <form (ngSubmit)="addAddress()" #addressForm="ngForm">
            <div class="form-group">
              <label for="street">Rue</label>
              <input
                id="street"
                type="text"
                [(ngModel)]="newAddress.street"
                name="street"
                required
                class="form-input"
              />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="postalCode">Code postal</label>
                <input
                  id="postalCode"
                  type="text"
                  [(ngModel)]="newAddress.postalCode"
                  name="postalCode"
                  required
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="city">Ville</label>
                <input
                  id="city"
                  type="text"
                  [(ngModel)]="newAddress.city"
                  name="city"
                  required
                  class="form-input"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="country">Pays</label>
              <input
                id="country"
                type="text"
                [(ngModel)]="newAddress.country"
                name="country"
                required
                class="form-input"
              />
            </div>
            <div class="form-actions">
              <button type="button" (click)="cancelAddAddress()" class="cancel-btn">
                Annuler
              </button>
              <button type="submit" [disabled]="!addressForm.valid" class="save-btn">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
  styles: [`
    .address-selector {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .address-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .address-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: border-color 0.2s ease;
    }

    .address-card:hover {
      border-color: #3b82f6;
    }

    .address-card.selected {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .address-card input[type="radio"] {
      margin-top: 0.25rem;
      accent-color: #3b82f6;
    }

    .address-details {
      flex: 1;
    }

    .address-line {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
      color: #374151;
    }

    .default-badge {
      display: inline-block;
      padding: 0.125rem 0.5rem;
      background: #16a34a;
      color: white;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .add-address-btn {
      align-self: flex-start;
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background 0.2s ease;
    }

    .add-address-btn:hover {
      background: #e5e7eb;
    }

    .new-address-form {
      padding: 1.5rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .new-address-form h3 {
      margin-bottom: 1rem;
      color: #1f2937;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
    }

    .form-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }

    .cancel-btn {
      padding: 0.5rem 1rem;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .cancel-btn:hover {
      background: #e5e7eb;
    }

    .save-btn {
      padding: 0.5rem 1rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .save-btn:hover:not(:disabled) {
      background: #2563eb;
    }

    .save-btn:disabled {
      background: #d1d5db;
      cursor: not-allowed;
    }

    .no-addresses {
      text-align: center;
      padding: 2rem;
      background: #f9fafb;
      border-radius: 0.5rem;
    }
  `]
})
export class AddressSelectorComponent implements OnInit {
  private readonly http = inject(HttpClient);

  @Output() addressSelected = new EventEmitter<Address>();

  addresses = signal<Address[]>([]);
  selectedAddress = signal<Address | null>(null);
  isLoading = signal(true);
  showNewAddressForm = signal(false);

  newAddress: Partial<Address> = {
    street: '',
    city: '',
    postalCode: '',
    country: ''
  };

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.http.get<Address[]>(`${environment.apiUrl}/users/me/addresses`).subscribe({
      next: (addresses) => {
        this.addresses.set(addresses);
        this.isLoading.set(false);
        // Auto-select default address
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          this.selectAddress(defaultAddress);
        }
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
        this.isLoading.set(false);
      }
    });
  }

  selectAddress(address: Address): void {
    this.selectedAddress.set(address);
    this.addressSelected.emit(address);
  }

  addAddress(): void {
    if (!this.newAddress.street || !this.newAddress.city || !this.newAddress.postalCode || !this.newAddress.country) {
      return;
    }

    this.http.post<Address>(`${environment.apiUrl}/users/me/addresses`, this.newAddress).subscribe({
      next: (address) => {
        this.addresses.update(addresses => [...addresses, address]);
        this.selectAddress(address);
        this.showNewAddressForm.set(false);
        this.newAddress = { street: '', city: '', postalCode: '', country: '' };
      },
      error: (error) => {
        console.error('Error adding address:', error);
      }
    });
  }

  cancelAddAddress(): void {
    this.showNewAddressForm.set(false);
    this.newAddress = { street: '', city: '', postalCode: '', country: '' };
  }
}
