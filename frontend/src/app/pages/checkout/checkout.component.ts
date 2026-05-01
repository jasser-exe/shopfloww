import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="container"><h1>Checkout</h1><p>Checkout page</p></div>',
  styles: ['.container { padding: 2rem; }']
})
export class CheckoutComponent {}

