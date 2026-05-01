import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductFilter, FilterChangeEvent, Category } from '../../../../core/models/product.model';
import { CategoryTreeComponent } from '../category-tree/category-tree.component';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoryTreeComponent],
  template: `
    <div class="filter-sidebar">
      <div class="filter-section">
        <h3 class="filter-title">Filtres</h3>
      </div>

      <!-- Categories -->
      <div class="filter-section">
        <h4 class="filter-heading">Catégories</h4>
        <app-category-tree
          [categories]="categories"
          [selectedCategoryId]="selectedCategoryId()"
          (categorySelected)="onCategorySelect($event)"
        ></app-category-tree>
      </div>

      <!-- Price Range -->
      <div class="filter-section">
        <h4 class="filter-heading">Prix</h4>
        <div class="price-inputs">
          <div class="price-input-group">
            <label for="min-price">Min</label>
            <input
              id="min-price"
              type="number"
              [(ngModel)]="minPrice"
              (change)="onPriceChange()"
              min="0"
              placeholder="0"
              class="price-input"
            />
          </div>
          <span class="price-separator">-</span>
          <div class="price-input-group">
            <label for="max-price">Max</label>
            <input
              id="max-price"
              type="number"
              [(ngModel)]="maxPrice"
              (change)="onPriceChange()"
              min="0"
              placeholder="999999"
              class="price-input"
            />
          </div>
        </div>
      </div>

      <!-- Promo -->
      <div class="filter-section">
        <h4 class="filter-heading">Promotions</h4>
        <label class="checkbox-label">
          <input
            type="checkbox"
            [(ngModel)]="onPromo"
            (change)="onPromoChange()"
          />
          <span>En promotion</span>
        </label>
      </div>

      <!-- Reset Button -->
      <div class="filter-section">
        <button class="reset-button" (click)="resetFilters()">
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  `,
  styles: [`
    .filter-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      height: fit-content;
    }

    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .filter-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
    }

    .filter-heading {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: #4b5563;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .price-inputs {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .price-input-group {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }

    .price-input-group label {
      font-size: 0.8rem;
      color: #6b7280;
      font-weight: 500;
    }

    .price-input {
      padding: 0.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      transition: border-color 0.2s ease;
    }

    .price-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .price-separator {
      color: #d1d5db;
      margin-bottom: 0.25rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: #374151;
      user-select: none;
    }

    .checkbox-label input {
      cursor: pointer;
      accent-color: #3b82f6;
    }

    .reset-button {
      padding: 0.75rem;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #374151;
      cursor: pointer;
      transition: background 0.2s ease, border-color 0.2s ease;
    }

    .reset-button:hover {
      background: #e5e7eb;
      border-color: #9ca3af;
    }
  `]
})
export class FilterComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Input() initialFilter: ProductFilter = {};
  @Output() filterChange = new EventEmitter<FilterChangeEvent>();

  selectedCategoryId = signal<number | null>(null);
  minPrice: number | null = null;
  maxPrice: number | null = null;
  onPromo: boolean = false;

  ngOnInit(): void {
    this.initializeFilters();
  }

  private initializeFilters(): void {
    if (this.initialFilter.categoryId) {
      this.selectedCategoryId.set(this.initialFilter.categoryId);
    }
    if (this.initialFilter.minPrice) {
      this.minPrice = this.initialFilter.minPrice;
    }
    if (this.initialFilter.maxPrice) {
      this.maxPrice = this.initialFilter.maxPrice;
    }
    if (this.initialFilter.onPromo) {
      this.onPromo = this.initialFilter.onPromo;
    }
  }

  onCategorySelect(categoryId: number): void {
    const newCategoryId =
      this.selectedCategoryId() === categoryId ? null : categoryId;
    this.selectedCategoryId.set(newCategoryId);
    this.emitFilterChange();
  }

  onPriceChange(): void {
    this.emitFilterChange();
  }

  onPromoChange(): void {
    this.emitFilterChange();
  }

  resetFilters(): void {
    this.selectedCategoryId.set(null);
    this.minPrice = null;
    this.maxPrice = null;
    this.onPromo = false;
    this.emitFilterChange();
  }

  private emitFilterChange(): void {
    const filter: ProductFilter = {
      categoryId: this.selectedCategoryId() || undefined,
      minPrice: this.minPrice ?? undefined,
      maxPrice: this.maxPrice ?? undefined,
      onPromo: this.onPromo || undefined
    };

    this.filterChange.emit({ filter, page: 0 });
  }
}


