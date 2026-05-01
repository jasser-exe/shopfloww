import { Component } from '@angular/core';
import { CatalogueComponent } from '../../features/catalogue/catalogue.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CatalogueComponent],
  template: '<app-catalogue></app-catalogue>'
})
export class ProductsComponent {}


