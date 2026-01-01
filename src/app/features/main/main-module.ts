import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared-module';
import { MainRoutingModule } from './main-routing-module';

import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Events } from './pages/events/events';
import { Contacts } from './pages/contacts/contacts';

@NgModule({
  declarations: [MainLayout, Home, About, Events, Contacts],
  imports: [CommonModule, SharedModule, MainRoutingModule],
})
export class MainModule {}
