import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { EventService } from '../../../../core/services';
import { EventResponse } from '../../../../core/models';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      upcoming: this.eventService.getUpcoming(),
      past: this.eventService.getPast(),
      announcements: this.eventService.getPublicAll('ANNOUNCEMENT')
    }).subscribe({
      next: ({ upcoming, past, announcements }) => {
        this.upcomingEvents = upcoming;
        this.pastEvents = past;
        this.announcements = announcements.content;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = this.translate.instant('EVENTS.ERR');
        this.loading = false;
        this.cdr.detectChanges();
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
