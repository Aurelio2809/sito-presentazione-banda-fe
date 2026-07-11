import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { MessageService } from '../../../../core/services';

export type SidebarItem = {
  icon: string;
  label: string;
  route: string;
  badge?: number;
};

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  standalone: false,
})
export class DashboardSidebar implements OnInit, OnDestroy {
  /** Stato puramente interno: nessun altro componente legge o imposta questo valore. */
  collapsed = false;

  menuItems: SidebarItem[] = [
    { icon: 'grid', label: 'Panoramica', route: '/dashboard' },
    { icon: 'image', label: 'Galleria', route: '/dashboard/gallery' },
    { icon: 'calendar', label: 'Eventi', route: '/dashboard/events' },
    { icon: 'mail', label: 'Messaggi', route: '/dashboard/messages', badge: 0 },
    { icon: 'activity', label: 'Attività', route: '/dashboard/activity' },
    { icon: 'user', label: 'Area Personale', route: '/dashboard/profile' },
  ];

  private navSubscription?: Subscription;

  constructor(private messageService: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.refreshUnreadCount();
    // Il sidebar resta montato tra una pagina e l'altra della dashboard: aggiorna il badge
    // ad ogni navigazione, così riflette i messaggi letti nel frattempo (es. dalla pagina Messaggi).
    this.navSubscription = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.refreshUnreadCount());
  }

  ngOnDestroy(): void {
    this.navSubscription?.unsubscribe();
  }

  private refreshUnreadCount(): void {
    this.messageService.getUnreadCount().subscribe({
      next: ({ count }) => {
        const messagesItem = this.menuItems.find(i => i.route === '/dashboard/messages');
        if (messagesItem) {
          messagesItem.badge = count;
        }
      },
      error: () => {
        // Silenzioso: il badge resta al valore precedente, non è un'informazione critica.
      },
    });
  }

  toggle(): void {
    this.collapsed = !this.collapsed;
  }
}
