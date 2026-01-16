import { Component, Input } from '@angular/core';

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

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
