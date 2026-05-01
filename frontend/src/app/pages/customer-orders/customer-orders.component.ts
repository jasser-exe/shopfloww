import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="container"><h1>My Orders</h1><p>Customer orders page</p></div>',
  styles: ['.container { padding: 2rem; }']
})
export class CustomerOrdersComponent {}

