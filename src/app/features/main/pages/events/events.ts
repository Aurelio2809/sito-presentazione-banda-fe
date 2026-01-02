import { Component } from '@angular/core';

type EventAttachment = {
  label: string;
  href: string;
};

type BandEvent = {
  id: string;
  title: string;
  bannerSrc: string;
  dateISO: string; // es: "2026-01-18"
  time?: string;   // es: "18:30"
  place: string;   // es: "Teatro Comunale, Casali del Manco"
  cityLine?: string; // es: "Casali del Manco (CS)"
  description: string; // testo breve
  details: string;     // testo lungo (dettagli)
  attachment?: EventAttachment;
  tags?: string[];
};

type Announcement = {
  id: string;
  title: string;
  short: string;
  full: string;
  dateISO: string;
};

type EventsTab = 'upcoming' | 'past';

@Component({
  selector: 'app-events',
  templateUrl: './events.html',
  styleUrls: ['./events.css'],
  standalone: false,
})
export class Events {
  tab: EventsTab = 'upcoming';

  // accordions
  openEventId: string | null = null;
  openAnnouncementId: string | null = null;

  // ====== DEMO DATA (poi li colleghi a backend) ======
  readonly upcomingEvents: BandEvent[] = [
    {
      id: 'e-2026-01-18',
      title: 'Concerto d’Inverno',
      bannerSrc: 'https://picsum.photos/seed/banda-event-1/1600/900',
      dateISO: '2026-01-18',
      time: '19:00',
      place: 'Auditorium – Casali del Manco',
      cityLine: 'Casali del Manco (CS)',
      description:
        'Una serata dedicata al repertorio bandistico classico e colonne sonore.',
      details:
        'Programma indicativo: marce sinfoniche, suite da film e un finale a sorpresa. Ingresso libero fino a esaurimento posti. Arrivare con anticipo consigliato.',
      tags: ['Concerto', 'Ingresso libero'],
      attachment: {
        label: 'Locandina (PDF)',
        href: '#',
      },
    },
    {
      id: 'e-2026-02-02',
      title: 'Sfilata & Festa Patronale',
      bannerSrc: 'https://picsum.photos/seed/banda-event-2/1600/900',
      dateISO: '2026-02-02',
      time: '10:30',
      place: 'Centro storico – Pedace',
      cityLine: 'Casali del Manco (CS)',
      description:
        'Banda in marcia per le vie del paese, con repertorio tradizionale e momenti solenni.',
      details:
        'Ritrovo e partenza in mattinata. Percorso variabile in base all’organizzazione della giornata. Seguiranno esecuzioni in piazza.',
      tags: ['Uscita', 'Tradizione'],
    },
  ];

  readonly pastEvents: BandEvent[] = [
    {
      id: 'e-2025-12-25',
      title: 'Concerto di Natale',
      bannerSrc: 'https://picsum.photos/seed/banda-event-past-1/1600/900',
      dateISO: '2025-12-25',
      time: '20:30',
      place: 'Chiesa Madre – Casali del Manco',
      cityLine: 'Casali del Manco (CS)',
      description:
        'Musiche natalizie, classici e arrangiamenti bandistici.',
      details:
        'Serata speciale con repertorio natalizio e brani sinfonici. Grazie a tutti i partecipanti e alla comunità che ci sostiene.',
      tags: ['Concerto', 'Natale'],
    },
    {
      id: 'e-2025-10-12',
      title: 'Raduno Bandistico',
      bannerSrc: 'https://picsum.photos/seed/banda-event-past-2/1600/900',
      dateISO: '2025-10-12',
      time: '17:30',
      place: 'Piazza principale – Rende',
      cityLine: 'Rende (CS)',
      description:
        'Incontro con altre bande, sfilata e concerto finale.',
      details:
        'Evento con più formazioni bandistiche. Sfilata, esecuzioni in piazza e concerto conclusivo collettivo.',
      tags: ['Raduno', 'Sfilata'],
      attachment: {
        label: 'Programma (PDF)',
        href: '#',
      },
    },
  ];

  readonly announcements: Announcement[] = [
    {
      id: 'a-1',
      title: 'Iscrizioni Scuola di Musica',
      short: 'Aperte le iscrizioni: contattaci per informazioni e strumenti disponibili.',
      full:
        'Sono aperte le iscrizioni per i corsi. Possiamo orientarti sullo strumento più adatto e sul percorso. Scrivici dalla pagina Contatti o via social.',
      dateISO: '2026-01-02',
    },
    {
      id: 'a-2',
      title: 'Nuove foto in galleria',
      short: 'Abbiamo caricato nuovi scatti degli ultimi eventi.',
      full:
        'Trovi nuove foto nella Galleria: prove, concerti e backstage. Se vuoi inviarci scatti, scrivici e li aggiungiamo con crediti.',
      dateISO: '2026-01-01',
    },
  ];

  // ====== UI ACTIONS ======
  setTab(next: EventsTab): void {
    if (this.tab === next) return;
    this.tab = next;
    this.openEventId = null;
    this.openAnnouncementId = null;
  }

  toggleEvent(id: string): void {
    this.openEventId = this.openEventId === id ? null : id;
  }

  toggleAnnouncement(id: string): void {
    this.openAnnouncementId = this.openAnnouncementId === id ? null : id;
  }

  // ====== HELPERS ======
  formatDate(iso: string): string {
    // formato IT: 18 gen 2026
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
