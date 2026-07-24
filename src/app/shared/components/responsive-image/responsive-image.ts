import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[appResponsiveImage]',
  standalone: true,
})
export class ResponsiveImage implements OnChanges {
  @Input('appResponsiveImage') src = '';
  @Input() responsiveWidths: number[] = [640, 960];
  @Input() responsiveSizes = '(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 960px';

  constructor(private element: ElementRef<HTMLImageElement>, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (!this.src) return;
    const srcset = this.responsiveWidths.map(width => `${this.imageUrl(width)} ${width}w`).join(', ');
    this.renderer.setAttribute(this.element.nativeElement, 'srcset', srcset);
    this.renderer.setAttribute(this.element.nativeElement, 'sizes', this.responsiveSizes);
    this.renderer.setAttribute(this.element.nativeElement, 'src', this.imageUrl(this.responsiveWidths[this.responsiveWidths.length - 1]));
  }

  private imageUrl(width: number): string {
    const normalized = this.src.replace(/^\//, '').replace(/^assets\//, '');
    const extensionIndex = normalized.lastIndexOf('.');
    const imagePath = extensionIndex === -1 ? normalized : normalized.slice(0, extensionIndex);
    return `/assets/responsive/${imagePath}-${width}.webp`;
  }
}
