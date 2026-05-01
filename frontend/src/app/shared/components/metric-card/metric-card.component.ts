import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metric-card">
      <div class="metric-icon">
        {{ icon }}
      </div>
      <div class="metric-content">
        <div class="metric-value">{{ value | number }}</div>
        <div class="metric-label">{{ label }}</div>
        @if (change !== undefined) {
          <div class="metric-change" [class.positive]="change > 0" [class.negative]="change < 0">
            <span class="change-icon">{{ change > 0 ? '↗' : change < 0 ? '↘' : '→' }}</span>
            <span class="change-value">{{ change | number:'1.1-1' }}%</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .metric-card {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      background: #3b82f6;
      color: white;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .metric-content {
      flex: 1;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 0.25rem;
    }

    .metric-label {
      font-size: 0.875rem;
      color: #6b7280;
      font-weight: 500;
    }

    .metric-change {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      margin-top: 0.5rem;
    }

    .metric-change.positive {
      color: #16a34a;
    }

    .metric-change.negative {
      color: #dc2626;
    }

    .change-icon {
      font-size: 0.875rem;
    }
  `]
})
export class MetricCardComponent {
  @Input() icon: string = '';
  @Input() value: number = 0;
  @Input() label: string = '';
  @Input() change?: number;
}
