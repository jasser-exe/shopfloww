import { Component } from '@angular/core';
import { ProductDetailComponent as ProductDetailPageComponent } from '../../features/product-detail/product-detail.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ProductDetailPageComponent],
  template: '<app-product-detail></app-product-detail>'
})
export class ProductDetailComponent {}


