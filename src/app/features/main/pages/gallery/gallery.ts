import { Component, HostListener } from '@angular/core';

type GalleryItem = {
  id: string;
  src: string;
  title: string;
  description: string;
  place?: string;
  date?: string; // formato libero (es. "25/12/2025" oppure "Dicembre 2025")
};

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.css'],
  standalone: false,
})
export class Gallery {
  readonly heroMain: GalleryItem = {
    id: 'hero-main',
    src: 'https://picsum.photos/seed/banda-hero/1800/1100',
    title: 'Gran concerto bandistico',
    description: 'Scatto “hero” per raccontare l’impatto della banda: palco, pubblico e atmosfera.',
    place: 'Casali del Manco (CS)',
    date: 'Dicembre 2025',
  };

  readonly favorites: GalleryItem[] = [
    {
      id: 'fav-r1',
      src: 'https://picsum.photos/seed/banda-fav-r1/1200/900',
      title: 'Prove in sala',
      description: 'La costruzione del suono: prove, sezioni e lavoro di insieme.',
      place: 'Sede – Località Pedace',
      date: 'Novembre 2025',
    },
    {
      id: 'fav-r2',
      src: 'https://picsum.photos/seed/banda-fav-r2/1200/900',
      title: 'Dettagli e strumenti',
      description: 'Il lato artigianale: strumenti, luci e dettagli ravvicinati.',
      place: 'Casali del Manco (CS)',
      date: 'Ottobre 2025',
    },
    {
      id: 'fav-b1',
      src: 'https://picsum.photos/seed/banda-fav-b1/1200/900',
      title: 'Scuola di musica',
      description: 'Formazione e nuove generazioni: il futuro passa da qui.',
      place: 'Sede – Località Pedace',
      date: 'Settembre 2025',
    },
    {
      id: 'fav-b2',
      src: 'https://picsum.photos/seed/banda-fav-b2/1200/900',
      title: 'Comunità',
      description: 'Musica come collante sociale: persone, sorrisi, territorio.',
      place: 'Casali del Manco (CS)',
      date: 'Agosto 2025',
    },
    {
      id: 'fav-br',
      src: 'https://picsum.photos/seed/banda-fav-br/1200/900',
      title: 'Dietro le quinte',
      description: 'Preparazione e organizzazione: ciò che non si vede sul palco.',
      place: 'Backstage',
      date: 'Dicembre 2025',
    },
  ];

  readonly items: GalleryItem[] = Array.from({ length: 18 }).map((_, i) => ({
    id: `grid-${i + 1}`,
    src: `https://picsum.photos/seed/banda-grid-${i + 1}/1400/900`,
    title: `Foto ${i + 1}`,
    description:
      'Placeholder: qui inserirai titolo e descrizione reali (concerto, prova, evento, ecc.).',
    place: 'Casali del Manco (CS)',
    date: '2025',
  }));

  viewerOpen = false;
  selected: GalleryItem | null = null;

  open(item: GalleryItem): void {
    this.selected = item;
    this.viewerOpen = true;
    document.documentElement.style.overflow = 'hidden';
  }

  close(): void {
    this.viewerOpen = false;
    this.selected = null;
    document.documentElement.style.overflow = '';
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent): void {
    if (!this.viewerOpen) return;
    if (ev.key === 'Escape') this.close();
  }
}
