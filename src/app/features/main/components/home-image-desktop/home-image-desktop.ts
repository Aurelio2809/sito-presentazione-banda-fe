import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-image-desktop',
  templateUrl: './home-image-desktop.html',
  styleUrls: ['./home-image-desktop.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeImageDesktop {
  @Input() images: string[] = [];
  
  get gridLayoutClass(): string {
    if (this.images.length === 1) return 'grid-single';
    if (this.images.length === 2) return 'grid-double';
    if (this.images.length >= 3) return 'grid-masonry';
    return '';
  }
  
  get displayImages(): string[] {
    return this.images.slice(0, 3);
  }
}
