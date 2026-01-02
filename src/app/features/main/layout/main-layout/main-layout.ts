import { Component } from '@angular/core';
import { SOCIAL_URLS } from '../../../../shared/constants/social-links';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  standalone: false,
  styleUrl: './main-layout.css',
})
export class MainLayout {
  currentYear = new Date().getFullYear();

  readonly SOCIAL_URLS = SOCIAL_URLS;
}
