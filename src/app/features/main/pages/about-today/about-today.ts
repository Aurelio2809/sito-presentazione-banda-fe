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
    { label: 'Torna a Chi siamo', routerLink: '/about', variant: 'ghost' },
    { label: 'Contattaci', routerLink: '/contacts', variant: 'primary' },
  ];

  sections = [
    {
      icon: 'users',
      title: 'Organico',
      content: 'La banda conta oggi circa 30-40 elementi attivi tra fiati (legni e ottoni) e percussioni. L\'organico varia in base alle esibizioni: dalle formazioni ridotte per processioni e cerimonie, fino al complesso al completo per concerti in piazza o eventi speciali.',
    },
    {
      icon: 'music',
      title: 'Repertorio',
      content: 'Il repertorio spazia dalla tradizione bandistica italiana (marce, sinfonie d\'opera, brani da concerto) a colonne sonore, musica pop arrangiata per banda e composizioni moderne. Ogni anno vengono aggiunti nuovi brani per mantenere vivo l\'interesse e la crescita musicale.',
    },
    {
      icon: 'calendar',
      title: 'Prove',
      content: 'Le prove si tengono settimanalmente presso la sede della banda. Durante i periodi di preparazione a concerti o eventi, le prove possono intensificarsi. Oltre alle prove d\'insieme, sono previsti momenti di studio per sezioni (legni, ottoni, percussioni).',
    },
    {
      icon: 'conductor',
      title: 'Direzione',
      content: 'La direzione artistica guida il percorso musicale della banda: scelta del repertorio, preparazione dei concerti, coordinamento con la scuola di musica. Il direttore lavora a stretto contatto con i capisezione per garantire qualità e coesione.',
    },
  ];

  activities = [
    { title: 'Concerti', desc: 'Esibizioni in piazza, teatri e luoghi pubblici del territorio' },
    { title: 'Processioni', desc: 'Accompagnamento musicale per feste patronali e ricorrenze religiose' },
    { title: 'Cerimonie', desc: 'Partecipazione a eventi civili, commemorazioni e celebrazioni' },
    { title: 'Collaborazioni', desc: 'Progetti con altre realtà musicali, scuole e associazioni' },
  ];

  requirements = [
    'Saper leggere la musica (anche a livello base)',
    'Possedere uno strumento a fiato o percussione',
    'Impegno a partecipare alle prove settimanali',
    'Disponibilità per le esibizioni principali',
  ];
}
