import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, switchMap, tap } from 'rxjs';
import {
  ProductService,
  ProductResponse,
  ProductFilter,
  Page,
  Category
} from '../../core';
import { FilterComponent } from './components/filter/filter.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [
    CommonModule,
    FilterComponent,
    ProductGridComponent,
    PaginationComponent
  ],
  template: `
    <div class="catalogue-container">
      <div class="catalogue-header">
        <h1>Catalogue Produits</h1>
      </div>

      <div class="catalogue-content">
        <!-- Sidebar Filters -->
        <aside class="catalogue-sidebar">
          <app-filter
            [categories]="categories()"
            [initialFilter]="currentFilter()"
            (filterChange)="onFilterChange($event)"
          ></app-filter>
        </aside>

        <!-- Main Content -->
        <main class="catalogue-main">
          <!-- Loading State -->
          <div *ngIf="isLoading()" class="loading-state">
            <p>Chargement des produits...</p>
          </div>

          <!-- Products Grid -->
          <app-product-grid
            *ngIf="!isLoading()"
            [products]="products()"
            (addToCart)="onAddToCart($event)"
          ></app-product-grid>

          <!-- Pagination -->
          <app-pagination
            *ngIf="!isLoading() && totalPages() > 1"
            [totalPages]="totalPages()"
            [currentPage]="currentPage()"
            (pageChange)="onPageChange($event)"
          ></app-pagination>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .catalogue-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem 1rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .catalogue-header {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .catalogue-header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
    }

    .catalogue-content {
      display: grid;
      grid-template-columns: 250px 1fr;
      gap: 2rem;
    }

    @media (max-width: 768px) {
      .catalogue-content {
        grid-template-columns: 1fr;
      }

      .catalogue-sidebar {
        order: 2;
      }

      .catalogue-main {
        order: 1;
      }
    }

    .catalogue-sidebar {
      display: flex;
      flex-direction: column;
    }

    .catalogue-main {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      background: #f9fafb;
      border-radius: 0.5rem;
      color: #6b7280;
    }

    .loading-state p {
      margin: 0;
      font-size: 1rem;
    }
  `]
})
export class CatalogueComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Signals
  isLoading = signal(true);
  products = signal<ProductResponse[]>([]);
  categories = signal<Category[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);

  // State signals for filters
  currentFilter = signal<ProductFilter>({});

  constructor() {
    this.loadCategories();
  }

  ngOnInit(): void {
    this.initializeFromQueryParams();
  }

  private initializeFromQueryParams(): void {
    combineLatest([this.route.queryParams])
      .pipe(
        tap((params) => {
          this.currentFilter.set({
            categoryId: params[0]['categoryId']
              ? +params[0]['categoryId']
              : undefined,
            minPrice: params[0]['minPrice']
              ? +params[0]['minPrice']
              : undefined,
            maxPrice: params[0]['maxPrice']
              ? +params[0]['maxPrice']
              : undefined,
            onPromo: params[0]['onPromo'] === 'true' || undefined,
            search: params[0]['search'] || undefined
          });
          this.currentPage.set(params[0]['page'] ? +params[0]['page'] : 0);
        }),
        switchMap(() =>
          this.productService.getProducts(
            this.currentFilter(),
            this.currentPage(),
            12
          )
        )
      )
      .subscribe({
        next: (response: Page<ProductResponse>) => {
          this.products.set(response.content);
          this.totalPages.set(response.totalPages);
          this.currentPage.set(response.currentPage);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading products:', error);
          this.isLoading.set(false);
        }
      });
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onFilterChange(event: { filter: ProductFilter; page: number }): void {
    this.updateQueryParams(event.filter, event.page);
  }

  onPageChange(page: number): void {
    this.updateQueryParams(this.currentFilter(), page);
  }

  onAddToCart(product: ProductResponse): void {
    // TODO: Implement add to cart logic using CartService
    console.log('Add to cart:', product);
  }

  private updateQueryParams(filter: ProductFilter, page: number): void {
    const queryParams: any = { page };

    if (filter.categoryId) {
      queryParams['categoryId'] = filter.categoryId;
    }
    if (filter.minPrice) {
      queryParams['minPrice'] = filter.minPrice;
    }
    if (filter.maxPrice) {
      queryParams['maxPrice'] = filter.maxPrice;
    }
    if (filter.onPromo) {
      queryParams['onPromo'] = 'true';
    }
    if (filter.search) {
      queryParams['search'] = filter.search;
    }

    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.route
    });
  }
}


