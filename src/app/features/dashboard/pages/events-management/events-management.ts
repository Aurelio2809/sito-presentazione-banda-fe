import { Component } from '@angular/core';
import { TabItem } from '../../components/tab-switch/tab-switch';

export type ManagedEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'event' | 'announcement';
  status: 'draft' | 'published';
};

@Component({
  selector: 'app-events-management',
  templateUrl: './events-management.html',
  styleUrls: ['./events-management.css'],
  standalone: false,
})
export class EventsManagement {
  activeTab: 'events' | 'announcements' = 'events';

  get tabItems(): TabItem[] {
    return [
      { id: 'events', label: 'Eventi', count: this.events.length },
      { id: 'announcements', label: 'Annunci', count: this.announcements.length },
    ];
  }

  onTabChange(tabId: string): void {
    this.activeTab = tabId as 'events' | 'announcements';
  }

  events: ManagedEvent[] = [
    { id: 1, title: 'Concerto di Natale', date: '2024-12-22', time: '18:00', location: 'Piazza Casali del Manco', description: 'Concerto natalizio con repertorio tradizionale', type: 'event', status: 'published' },
    { id: 2, title: 'Processione San Giovanni', date: '2024-06-24', time: '10:00', location: 'Centro storico Pedace', description: 'Accompagnamento musicale festa patronale', type: 'event', status: 'published' },
    { id: 3, title: 'Concerto di Capodanno', date: '2025-01-01', time: '17:00', location: 'Anfiteatro comunale', description: 'Concerto di inizio anno', type: 'event', status: 'draft' },
  ];

  announcements: ManagedEvent[] = [
    { id: 101, title: 'Iscrizioni scuola di musica', date: '2024-09-01', time: '', location: '', description: 'Aperte le iscrizioni per il nuovo anno accademico', type: 'announcement', status: 'published' },
    { id: 102, title: 'Sospensione prove', date: '2024-08-01', time: '', location: '', description: 'Le prove riprenderanno a settembre', type: 'announcement', status: 'published' },
  ];

  selectedItem: ManagedEvent | null = null;
  showCreateModal = false;
  createType: 'event' | 'announcement' = 'event';

  get currentItems(): ManagedEvent[] {
    return this.activeTab === 'events' ? this.events : this.announcements;
  }

  selectItem(item: ManagedEvent): void {
    this.selectedItem = { ...item };
  }

  closeDetail(): void {
    this.selectedItem = null;
  }

  deleteItem(item: ManagedEvent): void {
    const label = item.type === 'event' ? 'evento' : 'annuncio';
    if (confirm(`Eliminare l'${label} "${item.title}"?`)) {
      if (item.type === 'event') {
        this.events = this.events.filter(e => e.id !== item.id);
      } else {
        this.announcements = this.announcements.filter(a => a.id !== item.id);
      }
      if (this.selectedItem?.id === item.id) {
        this.selectedItem = null;
      }
    }
  }

  toggleStatus(item: ManagedEvent): void {
    item.status = item.status === 'published' ? 'draft' : 'published';
  }

  saveItem(): void {
    if (!this.selectedItem) return;
    const list = this.selectedItem.type === 'event' ? this.events : this.announcements;
    const index = list.findIndex(i => i.id === this.selectedItem!.id);
    if (index >= 0) {
      list[index] = { ...this.selectedItem };
    }
    this.selectedItem = null;
  }

  openCreate(type: 'event' | 'announcement'): void {
    this.createType = type;
    this.showCreateModal = true;
  }

  closeCreate(): void {
    this.showCreateModal = false;
  }
}
