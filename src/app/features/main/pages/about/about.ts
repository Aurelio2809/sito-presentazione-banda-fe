import { Component } from '@angular/core';

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
  readonly stats = [
    { label: 'Concerti / anno', value: '—' },
    { label: 'Componenti', value: '—' },
    { label: 'Allievi scuola', value: '—' },
    { label: 'Anni di attività', value: '—' },
  ];

  readonly sections: AboutSection[] = [
    {
      tag: 'Storia',
      title: 'La nostra storia',
      text:
        'La Banda Musicale “Città di Casali del Manco” nasce dalla volontà di custodire e far crescere una tradizione del territorio. Nel tempo è diventata un punto di riferimento culturale: un luogo dove la musica unisce generazioni, crea amicizie e costruisce comunità.',
      img: 'https://images.unsplash.com/photo-1453738773917-9c3eff1db985?auto=format&fit=crop&w=1800&q=75',
      link: '/about/history',
      cta: 'Scopri di più',
      side: 'left',
    },
    {
      tag: 'Oggi',
      title: 'La banda oggi',
      text:
        'Oggi la banda è un gruppo vivo e in crescita: prove, studio e repertori curati con attenzione. Portiamo in scena musica bandistica, arrangiamenti moderni, colonne sonore e classici, cercando sempre equilibrio tra qualità e partecipazione.',
      img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1800&q=75',
      link: '/about/today',
      cta: 'Scopri di più',
      side: 'right',
    },
    {
      tag: 'Scuola',
      title: 'Scuola di musica',
      text:
        'La scuola di musica è il nostro investimento sul futuro: un percorso per avvicinare bambini, ragazzi e adulti allo studio di uno strumento con gradualità e obiettivi chiari. Qui nasce la passione — e la continuità della banda.',
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=75',
      link: '/about/school',
      cta: 'Scopri di più',
      side: 'left',
    },
  ];
}
