import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="error-container">
      <h1>403</h1>
      <h2>Access Forbidden</h2>
      <p>You don't have permission to access this resource.</p>
      <a routerLink="/" class="back-link">Back to Home</a>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      text-align: center;

      h1 {
        font-size: 4rem;
        margin: 0;
        color: #dc3545;
      }

      h2 {
        margin: 1rem 0;
        color: #333;
      }

      p {
        color: #666;
        margin-bottom: 2rem;
      }

      .back-link {
        color: #667eea;
        text-decoration: none;
        font-weight: 600;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class ForbiddenComponent {}

