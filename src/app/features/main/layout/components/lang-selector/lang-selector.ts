import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lang-selector',
  templateUrl: './lang-selector.html',
  styleUrls: ['./lang-selector.css'],
  standalone: false
})
export class LangSelector {
  @Input() variant: 'desktop' | 'mobile' = 'desktop';

  isOpen = false;
  languages = [
    { code: 'it', label: 'Italiano' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' }
  ];
  currentLang = 'it';

  constructor(private translate: TranslateService, private eRef: ElementRef) {
    // Ensure a language is active (currentLang is undefined before the first use() call)
    const active = this.translate.currentLang || this.translate.getDefaultLang() || 'it';
    this.currentLang = active;
    if (!this.translate.currentLang) {
      this.translate.use(active);
    }
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  selectLang(lang: string) {
    this.translate.use(lang);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
