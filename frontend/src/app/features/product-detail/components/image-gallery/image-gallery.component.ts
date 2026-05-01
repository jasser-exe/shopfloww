import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductImage } from '../../../../core/models/product.model';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-gallery">
      <div class="main-image-container">
        <img
          [src]="selectedImage().url"
          [alt]="selectedImage().alt || 'Product image'"
          class="main-image"
        />
      </div>

      <div class="thumbnails-container">
        <button
          *ngFor="let image of images; let i = index"
          (click)="selectImage(i)"
          [class.active]="selectedImageIndex() === i"
          class="thumbnail"
          [attr.aria-label]="'View image ' + (i + 1)"
          [attr.aria-pressed]="selectedImageIndex() === i"
        >
          <img [src]="image.url" [alt]="image.alt || 'Product thumbnail'" />
        </button>
      </div>
    </div>
  `,
  styles: [`
    .image-gallery {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .main-image-container {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      background: #f5f5f5;
      border-radius: 0.5rem;
      overflow: hidden;
    }

    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .thumbnails-container {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .thumbnail {
      position: relative;
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      padding: 4px;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: border-color 0.2s ease;
      overflow: hidden;
    }

    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .thumbnail:hover {
      border-color: #d1d5db;
    }

    .thumbnail.active {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }
  `]
})
export class ImageGalleryComponent {
  @Input() images: ProductImage[] = [];

  selectedImageIndex = signal(0);

  selectedImage(): ProductImage {
    return this.images[this.selectedImageIndex()] || this.images[0];
  }

  selectImage(index: number): void {
    if (index >= 0 && index < this.images.length) {
      this.selectedImageIndex.set(index);
    }
  }
}


