import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductVariant } from '../../../../core/models/product.model';

export interface SelectedVariant {
  variantId: number;
  attributes: { [key: string]: string };
  price: number;
  promoPrice?: number;
  stock: number;
}

@Component({
  selector: 'app-variant-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="variant-selector">
      <h4 class="variant-title">Sélectionner une variante</h4>

      <div *ngFor="let group of attributeGroups()" class="attribute-group">
        <label class="attribute-label">{{ group.name }}:</label>
        <div class="button-group">
          <button
            *ngFor="let value of group.values"
            (click)="selectAttribute(group.name, value)"
            [class.active]="isAttributeSelected(group.name, value)"
            class="option-btn"
            [attr.aria-pressed]="isAttributeSelected(group.name, value)"
          >
            {{ value }}
          </button>
        </div>
      </div>

      <div class="variant-info" *ngIf="selectedVariant()">
        <div class="variant-stock">
          <span *ngIf="selectedVariant()!.stock > 0" class="in-stock"
            >{{ selectedVariant()!.stock }} en stock</span
          >
          <span *ngIf="selectedVariant()!.stock === 0" class="out-of-stock"
            >Rupture de stock</span
          >
        </div>

        <div class="variant-price">
          <span *ngIf="selectedVariant()!.promoPrice" class="promo-price">
            {{ selectedVariant()!.promoPrice | currency }}
          </span>
          <span [class.has-promo]="!!selectedVariant()!.promoPrice" class="price">
            {{ selectedVariant()!.price | currency }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .variant-selector {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.5rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .variant-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
    }

    .attribute-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .attribute-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #4b5563;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .option-btn {
      padding: 0.625rem 1rem;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 0.375rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      transition: all 0.2s ease;
    }

    .option-btn:hover {
      border-color: #d1d5db;
      background: #f3f4f6;
    }

    .option-btn.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .variant-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .variant-stock {
      font-size: 0.875rem;
      font-weight: 600;
    }

    .in-stock {
      color: #16a34a;
    }

    .out-of-stock {
      color: #ef4444;
    }

    .variant-price {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .price {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1f2937;
    }

    .price.has-promo {
      text-decoration: line-through;
      color: #9ca3af;
      font-size: 0.95rem;
    }

    .promo-price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ef4444;
    }
  `]
})
export class VariantSelectorComponent {
  @Input() variants: ProductVariant[] = [];
  @Output() variantSelected = new EventEmitter<SelectedVariant>();

  selectedAttributes = signal<{ [key: string]: string }>({});

  attributeGroups = computed(() => {
    const groups: { [key: string]: Set<string> } = {};

    this.variants.forEach((variant) => {
      variant.attributes.forEach((attr) => {
        if (!groups[attr.name]) {
          groups[attr.name] = new Set();
        }
        groups[attr.name].add(attr.value);
      });
    });

    return Object.entries(groups).map(([name, values]) => ({
      name,
      values: Array.from(values)
    }));
  });

  selectedVariant = computed<SelectedVariant | null>(() => {
    const attrs = this.selectedAttributes();
    const selected = this.variants.find((v) =>
      v.attributes.every(
        (a) => attrs[a.name] === a.value
      )
    );

    if (!selected) return null;

    return {
      variantId: selected.id,
      attributes: attrs,
      price: selected.price ?? 0,
      promoPrice: selected.promoPrice,
      stock: selected.stock
    };
  });

  selectAttribute(name: string, value: string): void {
    const current = this.selectedAttributes();
    const updated = { ...current, [name]: value };
    this.selectedAttributes.set(updated);

    const variant = this.selectedVariant();
    if (variant) {
      this.variantSelected.emit(variant);
    }
  }

  isAttributeSelected(name: string, value: string): boolean {
    return this.selectedAttributes()[name] === value;
  }
}

