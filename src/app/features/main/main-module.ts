import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared-module';
import { MainRoutingModule } from './main-routing-module';

import { MainLayout } from './layout/main-layout/main-layout';
import { Home } from './pages/home/home';
import { About } from './pages/about/about';
import { Events } from './pages/events/events';
import { Contacts } from './pages/contacts/contacts';
import { Gallery } from './pages/gallery/gallery';
import { AboutHistory } from './pages/about-history/about-history';
import { AboutToday } from './pages/about-today/about-today';
import { AboutSchool } from './pages/about-school/about-school';

// Components
import { PageHeader } from './components/page-header/page-header';
import { HomeSection } from './components/home-section/home-section';
import { HomeTitle } from './components/home-title/home-title';
import { HomeSubtitleText } from './components/home-subtitle-text/home-subtitle-text';
import { HomeImage } from './components/home-image/home-image';
import { HomeImageDesktop } from './components/home-image-desktop/home-image-desktop';
import { HomeSectionCta } from './components/home-section-cta/home-section-cta';
import { LangSelector } from './layout/components/lang-selector/lang-selector';

@NgModule({
  declarations: [
    MainLayout,
    LangSelector,
    Home,
    About,
    Events,
    Contacts,
    Gallery,
    AboutHistory,
    AboutToday,
    AboutSchool,
    PageHeader,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MainRoutingModule,
    HomeSection,
    HomeTitle,
    HomeSubtitleText,
    HomeImage,
    HomeImageDesktop,
    HomeSectionCta
  ],
})
export class MainModule {}
