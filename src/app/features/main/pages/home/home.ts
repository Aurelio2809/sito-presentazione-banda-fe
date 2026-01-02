import {
  AfterViewInit,
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

  activeSection = 0;
  animEnabled = false;

  private rafId: number | null = null;
  private root: HTMLElement | Window = window;

  constructor(private zone: NgZone) {}

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

    // trova il contenitore scrollabile (se c’è), altrimenti window
    this.root = this.findScrollRoot(els[0]) ?? window;

    // 1) primo calcolo
    this.computeActiveSection();

    // 2) abilita animazioni dopo 1 frame così non rischi “tutto invisibile”
    requestAnimationFrame(() => {
      this.zone.run(() => {
        this.animEnabled = true;
      });
    });

    // 3) loop leggero per aggiornare durante lo scroll (robusto sempre)
    this.zone.runOutsideAngular(() => {
      const tick = () => {
        this.computeActiveSection();
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    });
  }

  ngOnDestroy(): void {
    if (this.rafId != null) cancelAnimationFrame(this.rafId);
  }

  private computeActiveSection(): void {
    const els = this.sectionRefs.map(r => r.nativeElement);
    if (els.length === 0) return;

    const centerY = this.getRootCenterY();

    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    for (let i = 0; i < els.length; i++) {
      const rect = els[i].getBoundingClientRect();
      const sectionCenterY = rect.top + rect.height / 2;
      const dist = Math.abs(sectionCenterY - centerY);

      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }

    if (bestIdx !== this.activeSection) {
      this.zone.run(() => {
        this.activeSection = bestIdx;
      });
    }
  }

  private getRootCenterY(): number {
    if (this.root instanceof Window) {
      return window.innerHeight / 2;
    }
    const r = this.root.getBoundingClientRect();
    return r.top + r.height / 2;
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
}
