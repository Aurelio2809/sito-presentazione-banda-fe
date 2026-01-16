import { Component, Input } from '@angular/core';

export type ChapterImage = { src: string; alt: string };

@Component({
  selector: 'app-history-chapter',
  templateUrl: './history-chapter.html',
  styleUrls: ['./history-chapter.css'],
  standalone: false,
})
export class HistoryChapter {
  @Input() id!: string;                 // anchor id
  @Input() kicker: string = '';         // es: "Capitolo 1"
  @Input() title: string = '';          // es: "Ottocento"
  @Input() subtitle?: string;           // frase breve
  @Input() paragraphs: string[] = [];   // corpo (array di paragrafi)
  @Input() callout?: string;            // box singolo facoltativo
  @Input() images: ChapterImage[] = []; // 0..n immagini (layout semplice)
}
