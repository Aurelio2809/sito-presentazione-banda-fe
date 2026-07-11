import { Component } from '@angular/core';
import { SOCIAL_URLS } from '../../../../shared/constants/social-links';

@Component({
  selector: 'app-dashboard-layout',
  standalone: false,
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css'],
})
export class DashboardLayout {
  currentYear = new Date().getFullYear();
  SOCIAL_URLS = SOCIAL_URLS;
}
