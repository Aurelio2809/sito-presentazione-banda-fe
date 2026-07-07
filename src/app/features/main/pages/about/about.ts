import { Component } from '@angular/core';
import { PageHeaderAction, PageHeaderStat } from '../../components/page-header/page-header';

type AboutSection = {
  tag: string;
  title: string;
  text: string;
  img: string;
  link: string;
  cta: string;
  side: 'left' | 'right';
};

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  standalone: false,
})
export class About {
  // Header (le stringhe sono chiavi i18n, tradotte in template / page-header)
  readonly headerActions: PageHeaderAction[] = [
    { label: 'ABOUT.ACT_CONTACT', routerLink: '/contacts', variant: 'primary' },
    { label: 'ABOUT.ACT_EVENTS', routerLink: '/events', variant: 'ghost' },
  ];

  readonly stats: PageHeaderStat[] = [
    { label: 'ABOUT.STAT_CONCERTS', value: '—' },
    { label: 'ABOUT.STAT_MEMBERS', value: '—' },
    { label: 'ABOUT.STAT_STUDENTS', value: '—' },
    { label: 'ABOUT.STAT_YEARS', value: '—' },
  ];

  readonly sections: AboutSection[] = [
    {
      tag: 'ABOUT.SEC_STORIA_TAG',
      title: 'ABOUT.SEC_STORIA_TITLE',
      text: 'ABOUT.SEC_STORIA_TEXT',
      img: 'assets/about/storia-medaglia-oro.jpg',
      link: '/about/history',
      cta: 'ABOUT.CTA',
      side: 'left',
    },
    {
      tag: 'ABOUT.SEC_OGGI_TAG',
      title: 'ABOUT.SEC_OGGI_TITLE',
      text: 'ABOUT.SEC_OGGI_TEXT',
      img: 'assets/about/oggi-concerto-estivo.jpg',
      link: '/about/today',
      cta: 'ABOUT.CTA',
      side: 'right',
    },
    {
      tag: 'ABOUT.SEC_SCUOLA_TAG',
      title: 'ABOUT.SEC_SCUOLA_TITLE',
      text: 'ABOUT.SEC_SCUOLA_TEXT',
      img: 'assets/about/scuola-lezione-giovanissimi.jpg',
      link: '/about/school',
      cta: 'ABOUT.CTA',
      side: 'left',
    },
  ];
}
