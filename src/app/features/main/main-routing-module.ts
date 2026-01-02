import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Events } from './pages/events/events';
import { Contacts } from './pages/contacts/contacts';
import { Gallery } from './pages/gallery/gallery';
import { AboutHistory } from './pages/about-history/about-history';
import { AboutToday } from './pages/about-today/about-today';
import { AboutSchool } from './pages/about-school/about-school';

const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'gallery', component: Gallery },
      { path: 'about', component: About },
      { path: 'about/history', component: AboutHistory },
      { path: 'about/today', component: AboutToday },
      { path: 'about/school', component: AboutSchool },
      { path: 'events', component: Events },
      { path: 'contacts', component: Contacts },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
