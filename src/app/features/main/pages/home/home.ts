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
  tag: string;
  title: string;
  text: string;
  img: string;
  ctaText: string;
  ctaLink: string;
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

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  readonly sections: Section[] = [
    {
      tag: 'Associazione',
      title: 'La nostra associazione',
      text:
        'Siamo un’associazione no-profit che promuove cultura musicale, partecipazione e senso di comunità attraverso attività concertistiche e sociali.',
      img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1800&q=75',
      ctaText: 'Scopri di più',
      ctaLink: '/about',
    },
    {
      tag: 'Sede',
      title: 'La sede',
      text:
        'Uno spazio di incontro, prove e organizzazione. Qui si costruiscono repertori, amicizie e progetti che poi arrivano sul palco.',
      img: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1800&q=75',
      ctaText: 'Dove siamo',
      ctaLink: '/contacts',
    },
    {
      tag: 'Storia',
      title: 'La nostra storia',
      text:
        'Un percorso fatto di persone, strumenti, impegno e tradizioni. Cresciamo anno dopo anno con eventi, concerti e nuove generazioni.',
      img: 'https://images.unsplash.com/photo-1453738773917-9c3eff1db985?auto=format&fit=crop&w=1800&q=75',
      ctaText: 'Chi siamo',
      ctaLink: '/about',
    },
    {
      tag: 'Banda',
      title: 'La banda musicale',
      text:
        'Un organico che unisce esperienza e nuove energie. Lavoriamo su repertori bandistici, colonne sonore, arrangiamenti e classici.',
      img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1800&q=75',
      ctaText: 'Eventi',
      ctaLink: '/events',
    },
    {
      tag: 'Scuola',
      title: 'La scuola di musica',
      text:
        'Formazione, metodo e passione. Un percorso per avvicinarsi agli strumenti e crescere musicalmente, insieme.',
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=75',
      ctaText: 'Contatti',
      ctaLink: '/contacts',
    },
    {
      tag: 'Direttivo',
      title: 'Il direttivo',
      text:
        'Organizzazione e visione: un gruppo che coordina attività, eventi e progetti, con trasparenza e spirito di servizio.',
      img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=75',
      ctaText: 'Scrivici',
      ctaLink: '/contacts',
    },
  ];

  ngAfterViewInit(): void {
    const els = this.sectionRefs.map(r => r.nativeElement);
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
    const els = this.sectionRefs.map(r => r.nativeElement);
    if (els.length === 0) return;

    const centerY = this.getVisibleCenterY();
    const viewH = this.getVisibleHeight();

    // più stretto => effetto più evidente
    const range = viewH * 0.35;

    for (let i = 0; i < els.length; i++) {
      const rect = els[i].getBoundingClientRect();
      const secCenterY = rect.top + rect.height / 2;
      const dist = Math.abs(secCenterY - centerY);

      let p = 1 - dist / range;
      if (p < 0) p = 0;
      if (p > 1) p = 1;

      p = this.easeOutQuint(p);

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

  private easeOutQuint(t: number): number {
    const x = 1 - t;
    return 1 - x * x * x * x * x;
  }
}
