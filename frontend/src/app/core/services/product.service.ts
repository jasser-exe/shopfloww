import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ProductResponse,
  ProductFilter,
  Page,
  Category,
  ProductReview
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/products`;
  private readonly categoriesUrl = `${environment.apiUrl}/categories`;

  getProducts(
    filters: ProductFilter,
    page: number = 0,
    size: number = 12
  ): Observable<Page<ProductResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters.categoryId) {
      params = params.set('categoryId', filters.categoryId.toString());
    }
    if (filters.minPrice !== undefined) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.sellerId) {
      params = params.set('sellerId', filters.sellerId.toString());
    }
    if (filters.onPromo) {
      params = params.set('onPromo', 'true');
    }
    if (filters.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<Page<ProductResponse>>(this.apiUrl, { params });
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  searchProducts(
    q: string,
    pageable: { page: number; size: number } = { page: 0, size: 12 }
  ): Observable<Page<ProductResponse>> {
    const params = new HttpParams()
      .set('search', q)
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    return this.http.get<Page<ProductResponse>>(this.apiUrl, { params });
  }

  getTopSelling(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.apiUrl}/top-selling`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  getReviews(
    productId: number,
    page: number = 0,
    size: number = 5
  ): Observable<Page<ProductReview>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<ProductReview>>(
      `${this.apiUrl}/${productId}/reviews`,
      { params }
    );
  }
}
