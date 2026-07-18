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
    { label: 'ABOUT_HISTORY.ACT_BACK', routerLink: '/about', variant: 'ghost' },
    { label: 'ABOUT_HISTORY.ACT_EVENTS', routerLink: '/events', variant: 'primary' },
  ];

  tocItems: TocItem[] = [
    { id: 'ottocento', label: 'ABOUT_HISTORY.TOC_1' },
    { id: 'primo-novecento', label: 'ABOUT_HISTORY.TOC_2' },
    { id: 'secondo-dopoguerra', label: 'ABOUT_HISTORY.TOC_3' },
    { id: 'fine-novecento', label: 'ABOUT_HISTORY.TOC_4' },
    { id: 'tempi-recenti', label: 'ABOUT_HISTORY.TOC_5' },
    { id: 'fonti', label: 'ABOUT_HISTORY.TOC_SOURCES' },
  ];

  sourcesItems: SourceItem[] = [
    {
      label: '[1]',
      description: 'ABOUT_HISTORY.SOURCE_1',
    },
    {
      label: '[2]',
      description: 'ABOUT_HISTORY.SOURCE_2',
    },
    {
      label: '[3]',
      description: 'ABOUT_HISTORY.SOURCE_3',
    },
    {
      label: '[4]',
      description: 'ABOUT_HISTORY.SOURCE_4',
    },
    {
      label: '[5]',
      description: 'ABOUT_HISTORY.SOURCE_5',
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
