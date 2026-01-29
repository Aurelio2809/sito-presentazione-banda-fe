import { Component, Input } from '@angular/core';

export type PageHeaderAction = {
  label: string;
  routerLink: string;
  variant: 'primary' | 'ghost';
};

export type PageHeaderStat = {
  value: string;
  label: string;
};

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.html',
  styleUrls: ['./page-header.css'],
  standalone: false,
})
export class PageHeader {
  @Input() tag = '';
  @Input() title = '';
  @Input() description = '';
  @Input() actions: PageHeaderAction[] = [];
  @Input() stats: PageHeaderStat[] = [];
}
