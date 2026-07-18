import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { Overview } from './pages/overview/overview';
import { GalleryManagement } from './pages/gallery-management/gallery-management';
import { EventsManagement } from './pages/events-management/events-management';
import { Profile } from './pages/profile/profile';
import { ActivityLog } from './pages/activity-log/activity-log';
// Login è gestito a livello app.routes come standalone component

const routes: Routes = [
  {
    path: '',
    component: DashboardLayout,
    // AuthGuard è applicato a livello app.routes
    children: [
      { path: '', component: Overview },
      { path: 'gallery', component: GalleryManagement },
      { path: 'events', component: EventsManagement },
      { path: 'profile', component: Profile },
      { path: 'activity', component: ActivityLog },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
