import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../core/services';
import { EventResponse } from '../../../../core/models';

type EventsTab = 'upcoming' | 'past';

@Component({
  selector: 'app-events',
  templateUrl: './events.html',
  styleUrls: ['./events.css'],
  standalone: false,
})
export class Events implements OnInit {
  tab: EventsTab = 'upcoming';
  loading = true;
  error: string | null = null;

  // Dati
  upcomingEvents: EventResponse[] = [];
  pastEvents: EventResponse[] = [];
  announcements: EventResponse[] = [];

  // Accordions
  openEventId: number | null = null;
  openAnnouncementId: number | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    
    // Carica eventi futuri
    this.eventService.getUpcoming().subscribe({
      next: (events) => {
        this.upcomingEvents = events;
      },
      error: (err) => console.error('Errore eventi futuri', err)
    });

    // Carica eventi passati
    this.eventService.getPast().subscribe({
      next: (events) => {
        this.pastEvents = events;
      },
      error: (err) => console.error('Errore eventi passati', err)
    });

    // Carica annunci
    this.eventService.getPublicAll('ANNOUNCEMENT').subscribe({
      next: (page) => {
        this.announcements = page.content;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // UI Actions
  setTab(next: EventsTab): void {
    if (this.tab === next) return;
    this.tab = next;
    this.openEventId = null;
    this.openAnnouncementId = null;
  }

  toggleEvent(id: number): void {
    this.openEventId = this.openEventId === id ? null : id;
  }

  toggleAnnouncement(id: number): void {
    this.openAnnouncementId = this.openAnnouncementId === id ? null : id;
  }

  // Helpers
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
