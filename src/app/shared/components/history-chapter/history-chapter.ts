import { Component, Input, OnInit } from '@angular/core';

export type ChapterImage = { src: string; alt: string };

@Component({
  selector: 'app-history-chapter',
  templateUrl: './history-chapter.html',
  styleUrls: ['./history-chapter.css'],
  standalone: false,
})
export class HistoryChapter implements OnInit {
  @Input() id!: string;                 // anchor id
  @Input() kicker: string = '';         // es: "Capitolo 1"
  @Input() title: string = '';          // es: "Ottocento"
  @Input() subtitle?: string;           // frase breve
  @Input() paragraphs: string[] = [];   // corpo (array di paragrafi) - legacy
  @Input() callout?: string;            // box singolo facoltativo
  @Input() images: ChapterImage[] = []; // 0..n immagini (layout semplice)
  @Input() open: boolean = true;        // stato iniziale (aperto/chiuso)

  isOpen = true;

  ngOnInit(): void {
    this.isOpen = this.open;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
