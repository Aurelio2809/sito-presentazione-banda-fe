import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GalleryService, EventService, MessageService, ActivityLogService } from '../../../../core/services';
import { ActivityLogResponse } from '../../../../core/models';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.html',
  styleUrls: ['./overview.css'],
  standalone: false,
})
export class Overview implements OnInit {
  stats = [
    { label: 'Foto in galleria', value: 0, icon: 'image', trend: '' },
    { label: 'Eventi pubblicati', value: 0, icon: 'calendar', trend: '' },
    { label: 'Annunci attivi', value: 0, icon: 'megaphone', trend: '' },
    { label: 'Messaggi', value: 0, icon: 'mail', trend: '' },
  ];

  recentActivities: ActivityLogResponse[] = [];
  loading = false;

  constructor(
    private galleryService: GalleryService,
    private eventService: EventService,
    private messageService: MessageService,
    private activityLogService: ActivityLogService
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadRecentActivities();
  }

  /**
   * Ogni chiamata ha il proprio catchError: se una singola statistica non risponde (es. un
   * hiccup di rete), le altre restano comunque visibili invece di azzerarsi tutte insieme.
   */
  loadStats(): void {
    this.loading = true;

    forkJoin({
      photos: this.galleryService.getAll(0, 1).pipe(catchError(() => of(null))),
      events: this.eventService.getAll(0, 1, 'EVENT', 'PUBLISHED').pipe(catchError(() => of(null))),
      announcements: this.eventService.getAll(0, 1, 'ANNOUNCEMENT', 'PUBLISHED').pipe(catchError(() => of(null))),
      unreadCount: this.messageService.getUnreadCount().pipe(catchError(() => of(null))),
      messages: this.messageService.getAll(0, 1).pipe(catchError(() => of(null))),
    }).subscribe((data) => {
      if (data.photos) this.stats[0].value = data.photos.totalElements;
      if (data.events) this.stats[1].value = data.events.totalElements;
      if (data.announcements) this.stats[2].value = data.announcements.totalElements;
      if (data.messages) this.stats[3].value = data.messages.totalElements;
      if (data.unreadCount) this.stats[3].trend = `${data.unreadCount.count} non letti`;
      this.loading = false;
    });
  }

  loadRecentActivities(): void {
    this.activityLogService.getRecent(48).subscribe({
      next: (activities) => {
        this.recentActivities = activities.slice(0, 5);
      },
      error: (err) => console.error('Errore caricamento attività recenti', err)
    });
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'PHOTO': return 'image';
      case 'EVENT': return 'calendar';
      case 'ANNOUNCEMENT': return 'megaphone';
      case 'MESSAGE': return 'mail';
      default: return 'activity';
    }
  }

  formatAction(action: string): string {
    const actionMap: Record<string, string> = {
      'CREATE': 'Creato',
      'UPDATE': 'Modificato',
      'DELETE': 'Eliminato',
      'PUBLISH': 'Pubblicato',
      'UPLOAD': 'Caricato',
      'READ': 'Letto'
    };
    return actionMap[action] || action;
  }

  getTimeAgo(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minuti fa`;
    if (diffHours < 24) return `${diffHours} ore fa`;
    return `${diffDays} giorni fa`;
  }
}
