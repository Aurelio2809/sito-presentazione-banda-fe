import { Component, HostListener } from '@angular/core';
import { SOCIAL_URLS } from '../../../../shared/constants/social-links';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.html',
  standalone: false,
  styleUrls: ['./main-layout.css'],
})
export class MainLayout {
  currentYear = new Date().getFullYear();
  mobileMenuOpen = false;

  readonly SOCIAL_URLS = SOCIAL_URLS;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Blocca lo scroll del body quando il menu è aperto
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    document.body.style.overflow = '';
  }

  // Chiudi il menu quando si ridimensiona la finestra (da mobile a desktop)
  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth >= 900 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }
}
