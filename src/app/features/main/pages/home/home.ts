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

type Layout =
  | 'assocHero'
  | 'sedeSplit'
  | 'storyTriptych'
  | 'bandStage'
  | 'schoolDouble'
  | 'boardPoster';

type Section = {
  key: 'associazione' | 'sede' | 'storia' | 'banda' | 'scuola' | 'direttivo';
  tag: string;
  title: string;
  text: string;
  ctaText: string;
  ctaLink: string;

  layout: Layout;
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

  constructor(
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  readonly sections: Section[] = [
    {
      key: 'associazione',
      tag: 'Associazione',
      title: 'La nostra associazione',
      text:
        'Siamo un’associazione no-profit che promuove la cultura e la tradizione musicale bandistica territorio, attraverso iniziative e attività concertistiche e sociali. I nostri obbiettivi sono la tutela delle radici storico-culturali, la diffusione della cultura bandistica e la creazione di un senso di comunità.',
      ctaText: 'Scopri di più',
      ctaLink: '/about',
      layout: 'assocHero',
      images: [
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1800&q=75',
      ],
      crestImg: 'assets/stemma.png',
    },
    {
      key: 'sede',
      tag: 'Sede',
      title: 'La sede',
      text:
        'La nostra sede: Via traversa campanile 31, Casali del Manco (CS) loc. Pedace. Uno spazio di incontro, dove svolgiamo le prove, eroghiamo le attività di scuola musica e ci riuniamo per la pianificazione futura. Qui si costruiscono repertori, amicizie e progetti.',
      ctaText: 'Dove siamo',
      ctaLink: '/contacts',
      layout: 'sedeSplit',
      images: [
        'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1800&q=75',
      ],
    },
    {
      key: 'storia',
      tag: 'Storia',
      title: 'La nostra storia',
      text:
        'Una tradizione lunga più di un secolo. Le nostre origini risiedono nell\'ex banda musicale di Pedace, le cui prime testimonianze risalgono al 1925. Nel 2019, con l\'unione del comune di Pedace insieme ad altri cinque a formare il comune di Casali del Manco, anche la banda cambia nominativo. Cresciamo anno dopo anno con eventi, concerti ed abbiamo tanti progetti in mente per il futuro.',
      ctaText: 'Chi siamo',
      ctaLink: '/about',
      layout: 'storyTriptych',
      images: [
        'https://images.unsplash.com/photo-1521337706264-a414f153a5e0?auto=format&fit=crop&w=1800&q=75',
        'https://images.unsplash.com/photo-1453738773917-9c3eff1db985?auto=format&fit=crop&w=1800&q=75',
        'https://images.unsplash.com/photo-1521334726092-b509a19597c1?auto=format&fit=crop&w=1800&q=75',
      ],
    },
    {
      key: 'banda',
      tag: 'Banda',
      title: 'La banda musicale',
      text:
        'Un organico che unisce l\'esperienza dei più grandi alle nuove energie dei giovani. Possiamo contare su solisti esperti di cui professionisti formati e studenti in conservatorio. Lavoriamo su repertori bandistici, colonne sonore, arrangiamenti e classici. Attualmente il maestro della banda è Franco Guglielmelli coadiuvato da Rizzo Pietro.',
      ctaText: 'Eventi',
      ctaLink: '/events',
      layout: 'bandStage',
      images: [
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1800&q=75',
        'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1800&q=75',
        'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1800&q=75',
      ],
    },
    {
      key: 'scuola',
      tag: 'Scuola',
      title: 'La scuola di musica',
      text:
        'Offriamo corsi di formazione, forniamo alle nuove leve metodo e fondamenti di teoria, solfeggio e strumento. Un percorso per avvicinarsi agli strumenti e crescere musicalmente, insieme. I corsi sono tenuti da: Rizzo Pietro, Scrivano Gianmarco, D\'ambrosio Daniela, Zicarelli Mario.',
      ctaText: 'Contatti',
      ctaLink: '/contacts',
      layout: 'schoolDouble',
      images: [
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=75',
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1800&q=75',
      ],
    },
    {
      key: 'direttivo',
      tag: 'Direttivo',
      title: 'Il direttivo',
      text:
        'Il direttivo è l\'organo dell\'associazione predisposto a prendere le decisioni e tracciare la strada verso il futuro. Un gruppo che coordina attività, eventi e progetti, con trasparenza e in rappresentanza dei soci tutti.  Attualmente il presidente dell\'associazione è Aurelio Marotta.',
      ctaText: 'Scrivici',
      ctaLink: '/contacts',
      layout: 'boardPoster',
      images: [
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=75',
      ],
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
