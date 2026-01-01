import { AfterViewInit, Component, OnDestroy } from '@angular/core';

type Side = 'left' | 'right';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  standalone: false,
  styleUrls: ['./home.css'],
})
export class Home implements AfterViewInit, OnDestroy {
  activeIndex = 0;
  private io?: IntersectionObserver;

  readonly slides = [
    {
      side: 'left' as Side,
      title: 'Una banda, una comunità',
      text:
        'Musica, cultura e territorio. Organizziamo concerti e attività per diffondere la tradizione bandistica e creare comunità.',
      img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1800&q=75',
      tag: 'Chi siamo',
    },
    {
      side: 'right' as Side,
      title: 'Eventi che “si sentono”',
      text:
        'Concerti, celebrazioni e serate speciali. Programmi curati e un repertorio che unisce classico e moderno.',
      img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1800&q=75',
      tag: 'Eventi',
    },
    {
      side: 'left' as Side,
      title: 'Crescita musicale, insieme',
      text:
        'Studio, prove, sezioni. La qualità arriva con costanza, metodo e passione condivisa.',
      img: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1800&q=75',
      tag: 'Formazione',
    },
    {
      side: 'right' as Side,
      title: 'Radici calabresi, suono aperto',
      text:
        'Casali del Manco come punto di partenza. La musica come ponte tra generazioni e luoghi.',
      img: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=1800&q=75',
      tag: 'Territorio',
    },
  ];

  ngAfterViewInit(): void {
    const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-trigger]'));

    this.io = new IntersectionObserver(
      (entries) => {
        // scegliamo l’entry più “centrata” / stabile
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (!visible) return;

        const idx = Number((visible.target as HTMLElement).dataset['index']);
        if (!Number.isNaN(idx)) this.activeIndex = idx;
      },
      {
        // “Apple feel”: cambio slide quando il trigger è ~ al centro viewport
        root: null,
        rootMargin: '-45% 0px -45% 0px',
        threshold: [0.01, 0.25, 0.5, 0.75, 0.99],
      }
    );

    triggers.forEach(t => this.io!.observe(t));
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
