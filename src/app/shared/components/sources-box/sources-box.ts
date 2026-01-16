import { Component, Input } from '@angular/core';

export type SourceItem = { label: string; description: string };
export type SourceLink = { label: string; href: string };

@Component({
  selector: 'app-sources-box',
  templateUrl: './sources-box.html',
  styleUrls: ['./sources-box.css'],
  standalone: false,
})
export class SourcesBox {
  @Input() tag: string = 'Fonti';
  @Input() title: string = 'Fonti principali';
  @Input() description: string = '';
  @Input() items: SourceItem[] = [];
  @Input() links: SourceLink[] = [];
}
