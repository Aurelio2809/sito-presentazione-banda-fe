import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared-module';
import { DashboardRoutingModule } from './dashboard-routing-module';

// Layout
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';

// Components
import { DashboardSidebar } from './components/sidebar/sidebar';
import { TabSwitch } from './components/tab-switch/tab-switch';

// Pages
import { Overview } from './pages/overview/overview';
import { GalleryManagement } from './pages/gallery-management/gallery-management';
import { EventsManagement } from './pages/events-management/events-management';
import { Messages } from './pages/messages/messages';
import { Profile } from './pages/profile/profile';
import { ActivityLog } from './pages/activity-log/activity-log';
// Login è ora standalone e caricato a livello di app.routes

@NgModule({
  declarations: [
    DashboardLayout,
    DashboardSidebar,
    TabSwitch,
    Overview,
    GalleryManagement,
    EventsManagement,
    Messages,
    Profile,
    ActivityLog,
  ],
  imports: [CommonModule, FormsModule, SharedModule, DashboardRoutingModule],
})
export class DashboardModule { }
