import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="error-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
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
export class NotFoundComponent {}

