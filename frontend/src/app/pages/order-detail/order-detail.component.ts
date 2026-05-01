import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="container"><h1>Order Detail</h1><p>Order detail page</p></div>',
  styles: ['.container { padding: 2rem; }']
})
export class OrderDetailComponent {}

