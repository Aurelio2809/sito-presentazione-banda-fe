import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared-module';
import { DashboardRoutingModule } from './dashboard-routing-module';

import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { Overview } from './pages/overview/overview';
import { Members } from './pages/members/members';

@NgModule({
  declarations: [DashboardLayout, Overview, Members],
  imports: [CommonModule, SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
