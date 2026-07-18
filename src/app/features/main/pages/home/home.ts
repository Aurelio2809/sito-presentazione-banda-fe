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

type Section = {
  key: 'associazione' | 'sede' | 'storia' | 'banda' | 'scuola' | 'direttivo';
  tag: string;
  title: string;
  text: string;
  ctaText: string;
  ctaLink: string;
  images: string[];
  crestImg?: string;
  /** Sezioni senza foto reali: mostrano un emblema curato invece di una griglia di loghi ripetuti. */
  decor?: boolean;
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

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  readonly sections: Section[] = [
    {
      key: 'associazione',
      tag: 'HOME.ASSOCIAZIONE.TAG',
      title: 'HOME.ASSOCIAZIONE.TITLE',
      text: 'HOME.ASSOCIAZIONE.TEXT',
      ctaText: 'HOME.ASSOCIAZIONE.CTA',
      ctaLink: '/about',
      images: ['assets/home/associazione.jpg'],
    },
    {
      key: 'sede',
      tag: 'HOME.SEDE.TAG',
      title: 'HOME.SEDE.TITLE',
      text: 'HOME.SEDE.TEXT',
      ctaText: 'HOME.SEDE.CTA',
      ctaLink: '/contacts',
      images: [
        'assets/home/sede-1.jpg',
        'assets/home/sede-2.jpg',
      ],
    },
    {
      key: 'storia',
      tag: 'HOME.STORIA.TAG',
      title: 'HOME.STORIA.TITLE',
      text: 'HOME.STORIA.TEXT',
      ctaText: 'HOME.STORIA.CTA',
      ctaLink: '/about/history',
      images: ['assets/about/storia-medaglia-oro.jpg'],
    },
    {
      key: 'banda',
      tag: 'HOME.BANDA.TAG',
      title: 'HOME.BANDA.TITLE',
      text: 'HOME.BANDA.TEXT',
      ctaText: 'HOME.BANDA.CTA',
      ctaLink: '/events',
      images: ['assets/home/banda.jpg'],
    },
    {
      key: 'scuola',
      tag: 'HOME.SCUOLA.TAG',
      title: 'HOME.SCUOLA.TITLE',
      text: 'HOME.SCUOLA.TEXT',
      ctaText: 'HOME.SCUOLA.CTA',
      ctaLink: '/about/school',
      images: ['assets/about/scuola-lezione-clarinetti-2026-anon.jpg'],
    },
    {
      key: 'direttivo',
      tag: 'HOME.DIRETTIVO.TAG',
      title: 'HOME.DIRETTIVO.TITLE',
      text: 'HOME.DIRETTIVO.TEXT',
      ctaText: 'HOME.DIRETTIVO.CTA',
      ctaLink: '/contacts',
      images: ['assets/stemma/stemma_clean.png'],
      decor: true,
    },
  ];

  ngAfterViewInit(): void {
    const els = this.sectionRefs.map((r) => r.nativeElement);
    if (els.length === 0) return;

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
    // Il raggio di dissolvenza è ancorato all'altezza reale delle sezioni (non allo schermo):
    // su schermi molto grandi (4K/TV) l'altezza del viewport può superare di molto quella delle
    // sezioni, e usare viewH direttamente rendeva il raggio così ampio che 3-4 sezioni risultavano
    // "rivelate" (opacità piena) insieme, invece che una alla volta. Il cap alla dimensione di
    // riferimento (1000px, tipica di laptop/desktop) riproduce il comportamento già corretto lì.
    const range = Math.min(viewH, 1000) * 0.60;

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
