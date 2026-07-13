import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="media-wrapper">
      
      <!-- Se c'è solo un'immagine -->
      <div class="frame frame--hero" *ngIf="images.length === 1">
        <img class="img img--hero" [src]="images[0]" [alt]="alt" loading="lazy" />
      </div>

      <!-- Se c'è un carosello -->
      <ng-container *ngIf="images.length > 1">
        <div class="carousel-container" #scrollContainer (scroll)="onScroll()">
          <div class="carousel-slide frame frame--hero" *ngFor="let img of images; let i = index">
             <img class="img img--hero" [src]="img" [alt]="alt + ' ' + (i+1)" loading="lazy" />
          </div>
        </div>
        
        <!-- Indicatore dell'immagine attuale -->
        <div class="carousel-indicators">
          <button 
            *ngFor="let img of images; let i = index" 
            class="indicator-dot" 
            [class.active]="i === currentIndex"
            (click)="scrollTo(i)"
            [attr.aria-label]="'Vai all’immagine ' + (i + 1)"
          ></button>
        </div>
      </ng-container>

    </div>
  `,
  styleUrl: './home-image.css'
})
export class HomeImage {
  @Input() images: string[] = [];
  @Input() alt: string = '';

  @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLDivElement>;

  currentIndex = 0;

  onScroll() {
    if (!this.scrollContainer) return;
    const el = this.scrollContainer.nativeElement;
    const scrollLeft = el.scrollLeft;
    // La larghezza completa del container coincide o è proporsionale a quanto ha scattato ogni frame
    // Con scroll-snap-type: x mandatory, lo scroll si ferma esattamente su multipli del frame.
    const width = el.clientWidth;
    if (width > 0) {
      const index = Math.round(scrollLeft / width);
      if (this.currentIndex !== index) {
        this.currentIndex = index;
      }
    }
  }

  scrollTo(index: number) {
    if (!this.scrollContainer) return;
    const slides = this.scrollContainer.nativeElement.querySelectorAll('.carousel-slide') as NodeListOf<HTMLElement>;
    if (slides[index]) {
      this.scrollContainer.nativeElement.scrollTo({
         left: slides[index].offsetLeft,
         behavior: 'smooth'
      });
    }
  }
}
