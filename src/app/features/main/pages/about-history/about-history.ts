import { Component, QueryList, ViewChildren } from '@angular/core';
import type { TocItem } from '../../../../shared/components/page-toc/page-toc';
import type { SourceItem, SourceLink } from '../../../../shared/components/sources-box/sources-box';
import { HistoryChapter } from '../../../../shared/components/history-chapter/history-chapter';
import { PageHeaderAction } from '../../components/page-header/page-header';

@Component({
  selector: 'app-about-history',
  templateUrl: './about-history.html',
  styleUrls: ['./about-history.css'],
  standalone: false,
})
export class AboutHistory {
  @ViewChildren('chapter') chapterRefs!: QueryList<HistoryChapter>;

  headerActions: PageHeaderAction[] = [
    { label: 'Torna a Chi siamo', routerLink: '/about', variant: 'ghost' },
    { label: 'Eventi', routerLink: '/events', variant: 'primary' },
  ];

  tocItems: TocItem[] = [
    { id: 'ottocento', label: '1. Ottocento' },
    { id: 'primo-novecento', label: '2. Primo Novecento' },
    { id: 'secondo-dopoguerra', label: '3. Secondo Dopoguerra' },
    { id: 'fine-novecento', label: "4. Fine '900 e inizio 2000" },
    { id: 'tempi-recenti', label: '5. Tempi recenti (dal 2019)' },
    { id: 'fonti', label: 'Fonti principali' },
  ];

  sourcesItems: SourceItem[] = [
    {
      label: '[1]',
      description:
        "ISSM \"V. Bellini\", Creux — \"Il mondo della banda musicale nell'Italia di oggi\" (PDF).",
    },
    {
      label: '[2]',
      description:
        'U Campanaro Web — ricostruzione locale "Banda Città di Pedace" (timeline e date principali).',
    },
    {
      label: '[3]',
      description:
        'ICSAIC — biografia di Filippo Martire (contesto storico, episodi e riferimenti).',
    },
    {
      label: '[4]',
      description:
        'ANCI / Legge regionale Calabria n. 11/2017 — istituzione Comune di Casali del Manco.',
    },
    {
      label: '[5]',
      description:
        'Pedace (contesto storico e tradizioni locali: legame festa/musica di comunità).',
    },
  ];

  sourcesLinks: SourceLink[] = [
    {
      label: '[1] PDF Creux',
      href: 'https://www.issmbellini.cl.it/wp-content/uploads/pubblicazioni/i_-_creux.pdf',
    },
    { label: '[2] U Campanaro', href: 'https://www.ucampanaroweb.it/bandapedace.htm' },
    {
      label: '[3] ICSAIC',
      href: 'https://www.icsaicstoria.it/dizionario/biografie/filippo-martire/',
    },
    {
      label: '[4] ANCI',
      href: 'https://portale.ancitel.it/in-calabria-nasce-il-nuovo-comune-di-casali-del-manco/',
    },
    {
      label: '[4] L.R. 11/2017',
      href: 'https://www.consiglioregionale.calabria.it/upload/testicoordinati/2017-11_2017-05-05.pdf',
    },
    { label: '[5] Pedace', href: 'https://it.wikipedia.org/wiki/Pedace' },
  ];

  expandAll(): void {
    this.chapterRefs.forEach(ch => ch.isOpen = true);
  }

  collapseAll(): void {
    this.chapterRefs.forEach(ch => ch.isOpen = false);
  }

  onTocItemClick(id: string): void {
    // Trova il capitolo corrispondente e lo espande
    const chapter = this.chapterRefs.find(ch => ch.id === id);
    if (chapter) {
      chapter.isOpen = true;
    }
  }
}
