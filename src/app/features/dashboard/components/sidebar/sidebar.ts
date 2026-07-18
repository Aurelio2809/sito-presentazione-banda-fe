import { Component } from '@angular/core';

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
export class DashboardSidebar {
  /** Stato puramente interno: nessun altro componente legge o imposta questo valore. */
  collapsed = false;

  menuItems: SidebarItem[] = [
    { icon: 'grid', label: 'Panoramica', route: '/dashboard' },
    { icon: 'image', label: 'Galleria', route: '/dashboard/gallery' },
    { icon: 'calendar', label: 'Eventi', route: '/dashboard/events' },
    { icon: 'activity', label: 'Attività', route: '/dashboard/activity' },
    { icon: 'user', label: 'Area Personale', route: '/dashboard/profile' },
  ];

  toggle(): void {
    this.collapsed = !this.collapsed;
  }
}
