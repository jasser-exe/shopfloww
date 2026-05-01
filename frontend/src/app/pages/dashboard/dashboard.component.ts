import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: '<div class="container"><h1>Dashboard</h1><p>Dashboard page</p></div>',
  styles: ['.container { padding: 2rem; }']
})
export class DashboardComponent {}

