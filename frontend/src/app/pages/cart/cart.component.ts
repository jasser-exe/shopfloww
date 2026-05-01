import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="container"><h1>Shopping Cart</h1><p>Cart page</p></div>',
  styles: ['.container { padding: 2rem; }']
})
export class CartComponent {}

