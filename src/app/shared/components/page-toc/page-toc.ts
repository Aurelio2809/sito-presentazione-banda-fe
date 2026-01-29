import { Component, EventEmitter, Input, Output } from '@angular/core';

export type TocItem = {
  id: string;     // id dell'anchor (es: "ottocento")
  label: string;  // testo voce (es: "Ottocento")
};

@Component({
  selector: 'app-page-toc',
  templateUrl: './page-toc.html',
  styleUrls: ['./page-toc.css'],
  standalone: false,
})
export class PageToc {
  @Input() title: string = 'Indice';
  @Input() items: TocItem[] = [];
  @Input() hint: string = '';
  @Input() headerOffset: number = 100; // offset per header fisso

  @Output() itemClick = new EventEmitter<string>();

  onItemClick(id: string): void {
    // Emette l'evento per il parent
    this.itemClick.emit(id);

    // Scroll con offset per header
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;

      const top = el.getBoundingClientRect().top + window.scrollY - this.headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 50);
  }
}
