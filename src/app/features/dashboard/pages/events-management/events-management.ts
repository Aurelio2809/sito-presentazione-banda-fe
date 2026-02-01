import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { TabItem } from '../../components/tab-switch/tab-switch';
import { EventService } from '../../../../core/services';
import { EventResponse, EventRequest, EventType, EventStatus } from '../../../../core/models';

@Component({
  selector: 'app-events-management',
  templateUrl: './events-management.html',
  styleUrls: ['./events-management.css'],
  standalone: false,
})
export class EventsManagement implements OnInit {
  activeTab: 'events' | 'announcements' = 'events';
  events: EventResponse[] = [];
  announcements: EventResponse[] = [];
  loading = false;
  error: string | null = null;

  selectedItem: EventResponse | null = null;
  showCreateModal = false;
  createType: 'event' | 'announcement' = 'event';
  newItem: Partial<EventRequest> = {};

  constructor(
    private eventService: EventService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      events: this.eventService.getAll(0, 100, 'EVENT'),
      announcements: this.eventService.getAll(0, 100, 'ANNOUNCEMENT')
    }).subscribe({
      next: ({ events, announcements }) => {
        this.events = events.content;
        this.announcements = announcements.content;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Errore nel caricamento';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  get tabItems(): TabItem[] {
    return [
      { id: 'events', label: 'Eventi', count: this.events.length },
      { id: 'announcements', label: 'Annunci', count: this.announcements.length },
    ];
  }

  onTabChange(tabId: string): void {
    this.activeTab = tabId as 'events' | 'announcements';
  }

  get currentItems(): EventResponse[] {
    return this.activeTab === 'events' ? this.events : this.announcements;
  }

  selectItem(item: EventResponse): void {
    this.selectedItem = { ...item };
  }

  closeDetail(): void {
    this.selectedItem = null;
  }

  deleteItem(item: EventResponse): void {
    const label = item.type === 'EVENT' ? 'evento' : 'annuncio';
    if (confirm(`Eliminare l'${label} "${item.title}"?`)) {
      this.eventService.delete(item.id).subscribe({
        next: () => {
          if (item.type === 'EVENT') {
            this.events = this.events.filter(e => e.id !== item.id);
          } else {
            this.announcements = this.announcements.filter(a => a.id !== item.id);
          }
          if (this.selectedItem?.id === item.id) {
            this.selectedItem = null;
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          alert('Errore nell\'eliminazione');
          console.error(err);
        }
      });
    }
  }

  toggleStatus(item: EventResponse): void {
    const action = item.status === 'PUBLISHED' 
      ? this.eventService.unpublish(item.id)
      : this.eventService.publish(item.id);

    action.subscribe({
      next: (updated) => {
        const list = item.type === 'EVENT' ? this.events : this.announcements;
        const index = list.findIndex(i => i.id === item.id);
        if (index >= 0) {
          list[index] = updated;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Errore nel cambio stato');
        console.error(err);
      }
    });
  }

  saveItem(): void {
    if (!this.selectedItem) return;

    const request: EventRequest = {
      title: this.selectedItem.title,
      eventDate: this.selectedItem.eventDate,
      eventTime: this.selectedItem.eventTime,
      location: this.selectedItem.location,
      cityLine: this.selectedItem.cityLine,
      shortDescription: this.selectedItem.shortDescription,
      fullDescription: this.selectedItem.fullDescription,
      bannerSrc: this.selectedItem.bannerSrc,
      type: this.selectedItem.type as EventType,
      status: this.selectedItem.status as EventStatus,
      attachmentLabel: this.selectedItem.attachmentLabel,
      attachmentHref: this.selectedItem.attachmentHref,
      tags: this.selectedItem.tags
    };

    this.eventService.update(this.selectedItem.id, request).subscribe({
      next: (updated) => {
        const list = updated.type === 'EVENT' ? this.events : this.announcements;
        const index = list.findIndex(i => i.id === updated.id);
        if (index >= 0) {
          list[index] = updated;
        }
        this.selectedItem = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Errore nel salvataggio');
        console.error(err);
      }
    });
  }

  openCreate(type: 'event' | 'announcement'): void {
    this.createType = type;
    this.newItem = {
      type: type === 'event' ? 'EVENT' : 'ANNOUNCEMENT',
      status: 'DRAFT'
    };
    this.showCreateModal = true;
  }

  closeCreate(): void {
    this.showCreateModal = false;
    this.newItem = {};
  }

  createItem(): void {
    const request: EventRequest = {
      title: this.newItem.title || '',
      eventDate: this.newItem.eventDate || new Date().toISOString().split('T')[0],
      eventTime: this.newItem.eventTime,
      location: this.newItem.location,
      shortDescription: this.newItem.shortDescription,
      fullDescription: this.newItem.fullDescription,
      type: this.newItem.type as EventType,
      status: this.newItem.status as EventStatus
    };

    this.eventService.create(request).subscribe({
      next: (created) => {
        if (created.type === 'EVENT') {
          this.events = [created, ...this.events];
        } else {
          this.announcements = [created, ...this.announcements];
        }
        this.closeCreate();
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Errore nella creazione');
        console.error(err);
      }
    });
  }
}
