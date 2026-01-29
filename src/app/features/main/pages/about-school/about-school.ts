import { Component } from '@angular/core';
import { PageHeaderAction } from '../../components/page-header/page-header';

@Component({
  selector: 'app-about-school',
  templateUrl: './about-school.html',
  styleUrls: ['./about-school.css'],
  standalone: false,
})
export class AboutSchool {
  headerActions: PageHeaderAction[] = [
    { label: 'Torna a Chi siamo', routerLink: '/about', variant: 'ghost' },
    { label: 'Iscriviti / Contatti', routerLink: '/contacts', variant: 'primary' },
  ];

  levels = [
    {
      title: 'Livello Base',
      subtitle: 'Per chi inizia da zero',
      items: [
        'Introduzione alla lettura musicale (note, ritmi, tempi)',
        'Primi esercizi di respirazione e impostazione',
        'Conoscenza dello strumento scelto',
        'Ascolto guidato e senso del ritmo',
      ],
    },
    {
      title: 'Livello Intermedio',
      subtitle: 'Per chi ha già le basi',
      items: [
        'Tecnica strumentale approfondita',
        'Studio di brani progressivamente più complessi',
        'Prime esperienze di musica d\'insieme',
        'Introduzione all\'armonia e alla teoria musicale',
      ],
    },
    {
      title: 'Livello Avanzato',
      subtitle: 'Per musicisti con esperienza',
      items: [
        'Perfezionamento tecnico e interpretativo',
        'Repertorio solistico e d\'insieme',
        'Partecipazione attiva alle esibizioni della banda',
        'Supporto per preparazione a conservatorio o esami',
      ],
    },
  ];

  instruments = [
    { category: 'Legni', items: ['Flauto traverso', 'Ottavino', 'Clarinetto', 'Sassofono (soprano, contralto, tenore, baritono)'] },
    { category: 'Ottoni', items: ['Tromba / Cornetta', 'Corno', 'Trombone', 'Flicorno (soprano, contralto, tenore, baritono)', 'Eufonio', 'Tuba / Basso tuba'] },
    { category: 'Percussioni', items: ['Rullante', 'Grancassa', 'Piatti', 'Accessori (triangolo, tamburo basco, ecc.)'] },
  ];

  infoItems = [
    { icon: 'calendar', label: 'Quando', value: 'Da settembre a giugno, con pause per festività' },
    { icon: 'clock', label: 'Orari', value: 'Lezioni individuali e collettive da concordare' },
    { icon: 'location', label: 'Dove', value: 'Sede della banda a Casali del Manco' },
    { icon: 'users', label: 'A chi', value: 'Bambini (dai 7 anni), ragazzi e adulti' },
    { icon: 'gift', label: 'Costi', value: 'Quota associativa annuale (strumenti in comodato disponibili)' },
  ];
}
