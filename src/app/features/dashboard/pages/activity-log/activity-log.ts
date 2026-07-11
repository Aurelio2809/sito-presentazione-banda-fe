import { Component, OnInit } from '@angular/core';
import { TabItem } from '../../components/tab-switch/tab-switch';
import { ActivityLogService } from '../../../../core/services';
import { ActivityLogResponse } from '../../../../core/models';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.html',
  styleUrls: ['./activity-log.css'],
  standalone: false,
})
export class ActivityLog implements OnInit {
  activities: ActivityLogResponse[] = [];
  loading = false;
  error: string | null = null;
  activeFilter = 'all';

  constructor(private activityLogService: ActivityLogService) {}

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.loading = true;
    this.error = null;

    // Sempre non filtrato: il filtro per tab è client-side (vedi filteredActivities/onFilterChange).
    this.activityLogService.getAll(0, 100).subscribe({
      next: (page) => {
        this.activities = page.content;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento delle attività';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get filterTabs(): TabItem[] {
    return [
      { id: 'all', label: 'Tutte', count: this.activities.length },
      { id: 'PHOTO', label: 'Galleria', count: this.activities.filter(a => a.targetType === 'PHOTO').length },
      { id: 'EVENT', label: 'Eventi', count: this.activities.filter(a => a.targetType === 'EVENT').length },
      { id: 'ANNOUNCEMENT', label: 'Annunci', count: this.activities.filter(a => a.targetType === 'ANNOUNCEMENT').length },
      { id: 'MESSAGE', label: 'Messaggi', count: this.activities.filter(a => a.targetType === 'MESSAGE').length },
    ];
  }

  get filteredActivities(): ActivityLogResponse[] {
    if (this.activeFilter === 'all') return this.activities;
    return this.activities.filter(a => a.targetType === this.activeFilter);
  }

  onFilterChange(tabId: string): void {
    // Filtro puramente client-side su 'activities' (già caricato per intero): un ricaricamento
    // dal server con targetType sostituiva l'intero array con il solo sottoinsieme filtrato,
    // azzerando i conteggi delle ALTRE tab (che leggono da 'activities' per calcolarsi).
    this.activeFilter = tabId;
  }

  getIcon(type: string): string {
    switch (type) {
      case 'PHOTO': return 'image';
      case 'EVENT': return 'calendar';
      case 'ANNOUNCEMENT': return 'megaphone';
      case 'MESSAGE': return 'mail';
      case 'SETTINGS': return 'settings';
      case 'USER': return 'user';
      default: return 'activity';
    }
  }

  getActionColor(action: string): string {
    if (action === 'DELETE' || action === 'ARCHIVE') return 'danger';
    if (action === 'CREATE' || action === 'UPLOAD' || action === 'PUBLISH') return 'success';
    if (action === 'UPDATE') return 'warning';
    return 'default';
  }

  formatAction(action: string): string {
    const actionMap: Record<string, string> = {
      'CREATE': 'ha creato',
      'UPDATE': 'ha modificato',
      'DELETE': 'ha eliminato',
      'PUBLISH': 'ha pubblicato',
      'UNPUBLISH': 'ha rimosso dalla pubblicazione',
      'ARCHIVE': 'ha archiviato',
      'READ': 'ha letto',
      'UPLOAD': 'ha caricato',
      'LOGIN': 'ha effettuato l\'accesso',
      'LOGOUT': 'ha effettuato il logout'
    };
    return actionMap[action] || action;
  }
}
