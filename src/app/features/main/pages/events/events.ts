import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EventService } from '../../../../core/services';
import { EventResponse, Page } from '../../../../core/models';
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

  /**
   * Le tre chiamate sono indipendenti: un hiccup transitorio su una sola
   * (es. gli annunci) non deve azzerare l'intera pagina eventi.
   */
  loadData(): void {
    this.loading = true;
    this.error = null;
    let anyFailed = false;

    forkJoin({
      upcoming: this.eventService.getUpcoming().pipe(
        catchError(() => { anyFailed = true; return of<EventResponse[]>([]); })
      ),
      past: this.eventService.getPast().pipe(
        catchError(() => { anyFailed = true; return of<EventResponse[]>([]); })
      ),
      announcements: this.eventService.getPublicAll('ANNOUNCEMENT').pipe(
        catchError(() => { anyFailed = true; return of<Page<EventResponse> | null>(null); })
      ),
    }).subscribe(({ upcoming, past, announcements }) => {
      this.upcomingEvents = upcoming;
      this.pastEvents = past;
      this.announcements = announcements?.content ?? [];
      // Errore visibile solo se non abbiamo alcun dato utile da mostrare
      this.error = anyFailed && upcoming.length === 0 && past.length === 0 && !announcements
        ? this.translate.instant('EVENTS.ERR')
        : null;
      this.loading = false;
      this.cdr.detectChanges();
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
