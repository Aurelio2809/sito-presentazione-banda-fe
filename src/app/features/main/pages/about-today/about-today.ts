import { Component } from '@angular/core';
import { PageHeaderAction } from '../../components/page-header/page-header';

@Component({
  selector: 'app-about-today',
  templateUrl: './about-today.html',
  styleUrls: ['./about-today.css'],
  standalone: false,
})
export class AboutToday {
  headerActions: PageHeaderAction[] = [
    { label: 'ABOUT_TODAY.ACT_BACK', routerLink: '/about', variant: 'ghost' },
    { label: 'ABOUT_TODAY.ACT_CONTACT', routerLink: '/contacts', variant: 'primary' },
  ];

  sections = [
    { icon: 'users', title: 'ABOUT_TODAY.SEC_ORGANICO_TITLE', content: 'ABOUT_TODAY.SEC_ORGANICO_TEXT' },
    { icon: 'music', title: 'ABOUT_TODAY.SEC_REPERTORIO_TITLE', content: 'ABOUT_TODAY.SEC_REPERTORIO_TEXT' },
    { icon: 'calendar', title: 'ABOUT_TODAY.SEC_PROVE_TITLE', content: 'ABOUT_TODAY.SEC_PROVE_TEXT' },
    { icon: 'conductor', title: 'ABOUT_TODAY.SEC_DIREZIONE_TITLE', content: 'ABOUT_TODAY.SEC_DIREZIONE_TEXT' },
  ];

  activities = [
    { title: 'ABOUT_TODAY.ACT_CONCERTI_TITLE', desc: 'ABOUT_TODAY.ACT_CONCERTI_DESC' },
    { title: 'ABOUT_TODAY.ACT_PROCESSIONI_TITLE', desc: 'ABOUT_TODAY.ACT_PROCESSIONI_DESC' },
    { title: 'ABOUT_TODAY.ACT_CERIMONIE_TITLE', desc: 'ABOUT_TODAY.ACT_CERIMONIE_DESC' },
    { title: 'ABOUT_TODAY.ACT_COLLAB_TITLE', desc: 'ABOUT_TODAY.ACT_COLLAB_DESC' },
  ];

  requirements = [
    'ABOUT_TODAY.REQ_1',
    'ABOUT_TODAY.REQ_2',
    'ABOUT_TODAY.REQ_3',
    'ABOUT_TODAY.REQ_4',
  ];
}
