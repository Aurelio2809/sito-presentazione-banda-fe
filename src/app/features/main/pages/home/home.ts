import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { GalleryService } from '../../../../core/services';
import { environment } from '../../../../../environments/environment';

type Section = {
  key: 'associazione' | 'sede' | 'storia' | 'banda' | 'scuola' | 'direttivo';
  tag: string;
  title: string;
  text: string;
  ctaText: string;
  ctaLink: string;
  images: string[];
  crestImg?: string;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  standalone: false,
})
export class Home implements AfterViewInit, OnDestroy {
  @ViewChildren('sec', { read: ElementRef }) sectionRefs!: QueryList<ElementRef<HTMLElement>>;

  animEnabled = false;

  private rafId: number | null = null;
  private rootEl: HTMLElement | null = null;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef, private galleryService: GalleryService) {}

  readonly sections: Section[] = [
    {
      key: 'associazione',
      tag: 'HOME.ASSOCIAZIONE.TAG',
      title: 'HOME.ASSOCIAZIONE.TITLE',
      text: 'HOME.ASSOCIAZIONE.TEXT',
      ctaText: 'HOME.ASSOCIAZIONE.CTA',
      ctaLink: '/about',
      images: [
        'assets/stemma/stemma_clean.png', // Temporary placeholder until API loads
      ],
      crestImg: 'assets/stemma/stemma_clean.png',
    },
    {
      key: 'sede',
      tag: 'HOME.SEDE.TAG',
      title: 'HOME.SEDE.TITLE',
      text: 'HOME.SEDE.TEXT',
      ctaText: 'HOME.SEDE.CTA',
      ctaLink: '/contacts',
      images: [
        'assets/stemma/stemma_clean.png',
        'assets/stemma/stemma_clean.png',
      ],
    },
    {
      key: 'storia',
      tag: 'HOME.STORIA.TAG',
      title: 'HOME.STORIA.TITLE',
      text: 'HOME.STORIA.TEXT',
      ctaText: 'HOME.STORIA.CTA',
      ctaLink: '/about',
      images: [
        'assets/stemma/stemma_clean.png',
        'assets/stemma/stemma_clean.png',
        'assets/stemma/stemma_clean.png',
      ],
    },
    {
      key: 'banda',
      tag: 'HOME.BANDA.TAG',
      title: 'HOME.BANDA.TITLE',
      text: 'HOME.BANDA.TEXT',
      ctaText: 'HOME.BANDA.CTA',
      ctaLink: '/events',
      images: [
        'assets/stemma/stemma_clean.png',
        'assets/stemma/stemma_clean.png',
        'assets/stemma/stemma_clean.png',
      ],
    },
    {
      key: 'scuola',
      tag: 'HOME.SCUOLA.TAG',
      title: 'HOME.SCUOLA.TITLE',
      text: 'HOME.SCUOLA.TEXT',
      ctaText: 'HOME.SCUOLA.CTA',
      ctaLink: '/contacts',
      images: [
        'assets/stemma/stemma_clean.png',
        'assets/stemma/stemma_clean.png',
      ],
    },
    {
      key: 'direttivo',
      tag: 'HOME.DIRETTIVO.TAG',
      title: 'HOME.DIRETTIVO.TITLE',
      text: 'HOME.DIRETTIVO.TEXT',
      ctaText: 'HOME.DIRETTIVO.CTA',
      ctaLink: '/contacts',
      images: [
        'assets/stemma/stemma_clean.png',
      ],
    },
  ];

  ngAfterViewInit(): void {
    const els = this.sectionRefs.map((r) => r.nativeElement);
    if (els.length === 0) return;

    // Fetch real gallery photos and assign them randomly/sequentially to sections
    this.galleryService.getPublicPhotos(0, 15, 'order').subscribe({
      next: (val) => {
        const photosUrl = val.content.map(p => {
            const baseUrl = environment.apiUrl.replace('/api', '');
            const url = p.src || p.thumbnailSrc;
            return url?.startsWith('http') ? url : `${baseUrl}${url}`; // Simplified, the proxy will handle it
        });

        if (photosUrl.length >= 3) {
           let photoIdx = 0;
           this.sections.forEach(s => {
               for(let i=0; i<s.images.length; i++) {
                   // Cycle through available photos
                   s.images[i] = photosUrl[photoIdx % photosUrl.length];
                   photoIdx++;
               }
           });
           this.cdr.detectChanges();
        }
      }
    });

    this.rootEl = this.findScrollRoot(els[0]);

    Promise.resolve().then(() => {
      this.animEnabled = true;
      this.cdr.detectChanges();
    });

    this.zone.runOutsideAngular(() => {
      const tick = () => {
        this.applyProgressToElements();
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    });
  }

  ngOnDestroy(): void {
    if (this.rafId != null) cancelAnimationFrame(this.rafId);
  }

  private applyProgressToElements(): void {
    const els = this.sectionRefs.map((r) => r.nativeElement);
    if (els.length === 0) return;

    const centerY = this.getVisibleCenterY();
    const viewH = this.getVisibleHeight();
    const range = viewH * 0.60;

    for (let i = 0; i < els.length; i++) {
      const rect = els[i].getBoundingClientRect();
      const secCenterY = rect.top + rect.height / 2;
      const dist = Math.abs(secCenterY - centerY);

      let p = 1 - dist / range;
      if (p < 0) p = 0;
      if (p > 1) p = 1;

      p = this.easeOutCubic(p);
      els[i].style.setProperty('--p', p.toFixed(4));
    }
  }

  private getVisibleCenterY(): number {
    if (!this.rootEl) return window.innerHeight / 2;
    const r = this.rootEl.getBoundingClientRect();
    return r.top + r.height / 2;
  }

  private getVisibleHeight(): number {
    if (!this.rootEl) return window.innerHeight;
    return this.rootEl.getBoundingClientRect().height;
  }

  private findScrollRoot(start: HTMLElement): HTMLElement | null {
    let el: HTMLElement | null = start.parentElement;
    while (el && el !== document.body) {
      const style = getComputedStyle(el);
      const overflowY = style.overflowY;
      if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }

  private easeOutCubic(t: number): number {
    const x = 1 - t;
    return 1 - x * x * x;
  }
}
