import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seller',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="container"><h1>Seller Dashboard</h1><p>Seller page</p></div>',
  styles: ['.container { padding: 2rem; }']
})
export class SellerComponent {}

