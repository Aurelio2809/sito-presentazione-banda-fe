import { Component } from '@angular/core';
import { TabItem } from '../../components/tab-switch/tab-switch';

export type ActivityEntry = {
  id: number;
  user: string;
  action: string;
  target: string;
  targetType: 'photo' | 'event' | 'announcement' | 'message' | 'settings' | 'user';
  timestamp: string;
  details?: string;
};

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.html',
  styleUrls: ['./activity-log.css'],
  standalone: false,
})
export class ActivityLog {
  activities: ActivityEntry[] = [
    { id: 1, user: 'Admin Banda', action: 'ha caricato', target: 'Concerto di Natale 2024', targetType: 'photo', timestamp: '2024-12-20 15:30', details: 'Aggiunta alla galleria' },
    { id: 2, user: 'Admin Banda', action: 'ha modificato', target: 'Processione San Giovanni', targetType: 'event', timestamp: '2024-12-19 10:15', details: 'Aggiornato orario e luogo' },
    { id: 3, user: 'Admin Banda', action: 'ha pubblicato', target: 'Iscrizioni scuola di musica', targetType: 'announcement', timestamp: '2024-12-18 09:00' },
    { id: 4, user: 'Admin Banda', action: 'ha letto', target: 'Richiesta informazioni corso', targetType: 'message', timestamp: '2024-12-17 16:45', details: 'Messaggio da Mario Rossi' },
    { id: 5, user: 'Admin Banda', action: 'ha eliminato', target: 'Foto prova 2023', targetType: 'photo', timestamp: '2024-12-16 14:20' },
    { id: 6, user: 'Admin Banda', action: 'ha creato', target: 'Concerto di Capodanno', targetType: 'event', timestamp: '2024-12-15 11:30', details: 'Evento in bozza' },
    { id: 7, user: 'Admin Banda', action: 'ha modificato', target: 'Impostazioni notifiche', targetType: 'settings', timestamp: '2024-12-14 08:00' },
    { id: 8, user: 'Admin Banda', action: 'ha risposto a', target: 'Richiesta prenotazione', targetType: 'message', timestamp: '2024-12-13 17:30', details: 'Messaggio da Comune di Casali' },
    { id: 9, user: 'Admin Banda', action: 'ha riordinato', target: 'Foto preferite', targetType: 'photo', timestamp: '2024-12-12 12:00', details: 'Nuovo ordine galleria' },
    { id: 10, user: 'Admin Banda', action: 'ha archiviato', target: 'Annuncio scaduto', targetType: 'announcement', timestamp: '2024-12-11 10:00' },
  ];

  activeFilter = 'all';

  get filterTabs(): TabItem[] {
    return [
      { id: 'all', label: 'Tutte', count: this.activities.length },
      { id: 'photo', label: 'Galleria', count: this.activities.filter(a => a.targetType === 'photo').length },
      { id: 'event', label: 'Eventi', count: this.activities.filter(a => a.targetType === 'event').length },
      { id: 'announcement', label: 'Annunci', count: this.activities.filter(a => a.targetType === 'announcement').length },
      { id: 'message', label: 'Messaggi', count: this.activities.filter(a => a.targetType === 'message').length },
    ];
  }

  get filteredActivities(): ActivityEntry[] {
    if (this.activeFilter === 'all') return this.activities;
    return this.activities.filter(a => a.targetType === this.activeFilter);
  }

  onFilterChange(tabId: string): void {
    this.activeFilter = tabId;
  }

  getIcon(type: string): string {
    switch (type) {
      case 'photo': return 'image';
      case 'event': return 'calendar';
      case 'announcement': return 'megaphone';
      case 'message': return 'mail';
      case 'settings': return 'settings';
      case 'user': return 'user';
      default: return 'activity';
    }
  }

  getActionColor(action: string): string {
    if (action.includes('eliminato') || action.includes('archiviato')) return 'danger';
    if (action.includes('creato') || action.includes('caricato') || action.includes('pubblicato')) return 'success';
    if (action.includes('modificato') || action.includes('riordinato')) return 'warning';
    return 'default';
  }
}
