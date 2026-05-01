import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../../core/models/product.model';

@Component({
  selector: 'app-category-tree',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="category-tree">
      <div *ngFor="let category of categories" class="category-item">
        <button
          class="category-checkbox"
          [class.active]="isSelected(category.id)"
          (click)="toggleCategory(category.id)"
          [attr.aria-pressed]="isSelected(category.id)"
        >
          <input
            type="checkbox"
            [checked]="isSelected(category.id)"
            [disabled]="true"
          />
          <label>{{ category.name }}</label>
        </button>

        <div *ngIf="category.children && category.children.length" class="subcategories">
          <app-category-tree
            [categories]="category.children"
            [selectedCategoryId]="selectedCategoryId"
            (categorySelected)="onCategorySelected($event)"
          ></app-category-tree>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .category-tree {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .category-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .category-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      padding: 0.5rem;
      cursor: pointer;
      text-align: left;
      transition: background 0.2s ease;
      border-radius: 0.375rem;
      margin: -0.5rem;
    }

    .category-checkbox:hover {
      background: #f0f0f0;
    }

    .category-checkbox.active {
      color: #3b82f6;
      font-weight: 600;
    }

    .category-checkbox input {
      cursor: pointer;
      accent-color: #3b82f6;
    }

    .category-checkbox label {
      cursor: pointer;
      flex: 1;
      margin: 0;
    }

    .subcategories {
      margin-left: 1rem;
      padding-left: 0.75rem;
      border-left: 1px solid #e0e0e0;
    }
  `]
})
export class CategoryTreeComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategoryId: number | null = null;
  @Output() categorySelected = new EventEmitter<number>();

  toggleCategory(categoryId: number): void {
    this.categorySelected.emit(categoryId);
  }

  isSelected(categoryId: number): boolean {
    return this.selectedCategoryId === categoryId;
  }

  onCategorySelected(categoryId: number): void {
    this.categorySelected.emit(categoryId);
  }
}


