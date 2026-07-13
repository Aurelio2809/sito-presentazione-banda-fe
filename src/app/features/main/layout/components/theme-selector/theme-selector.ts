import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { ThemeMode, ThemeService } from '../../../../../core/services';

interface ThemeOption {
  mode: ThemeMode;
  labelKey: string;
}

@Component({
  selector: 'app-theme-selector',
  templateUrl: './theme-selector.html',
  styleUrl: './theme-selector.css',
  standalone: false,
})
export class ThemeSelector {
  @Input() variant: 'desktop' | 'mobile' = 'desktop';

  readonly options: ThemeOption[] = [
    { mode: 'auto', labelKey: 'NAV.THEME_AUTO' },
    { mode: 'light', labelKey: 'NAV.THEME_LIGHT' },
    { mode: 'dark', labelKey: 'NAV.THEME_DARK' },
  ];
  isOpen = false;

  constructor(
    readonly theme: ThemeService,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  select(mode: ThemeMode): void {
    this.theme.setMode(mode);
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeOnOutsideClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  closeOnEscape(): void {
    this.isOpen = false;
  }
}
