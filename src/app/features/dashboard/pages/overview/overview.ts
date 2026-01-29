import { Component } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.html',
  styleUrls: ['./overview.css'],
  standalone: false,
})
export class Overview {
  stats = [
    { label: 'Foto in galleria', value: 24, icon: 'image', trend: '+3 questo mese' },
    { label: 'Eventi pubblicati', value: 8, icon: 'calendar', trend: '2 in programma' },
    { label: 'Annunci attivi', value: 3, icon: 'megaphone', trend: '1 nuovo' },
    { label: 'Messaggi', value: 12, icon: 'mail', trend: '5 non letti' },
  ];

  recentActivities = [
    { type: 'photo', text: 'Aggiunta nuova foto alla galleria', time: '2 ore fa' },
    { type: 'event', text: 'Creato evento "Concerto di Natale"', time: '1 giorno fa' },
    { type: 'message', text: 'Nuovo messaggio da Mario Rossi', time: '2 giorni fa' },
    { type: 'photo', text: 'Contrassegnata foto come preferita', time: '3 giorni fa' },
  ];
}
