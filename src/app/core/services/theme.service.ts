import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';

export type ThemeMode = 'auto' | 'light' | 'dark';

const THEME_STORAGE_KEY = 'banda-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly selectedMode = signal<ThemeMode>('auto');
  readonly mode = this.selectedMode.asReadonly();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  initialize(): void {
    const storedMode = this.readStoredMode();
    this.applyMode(storedMode ?? 'auto');
  }

  setMode(mode: ThemeMode): void {
    this.applyMode(mode);
    try {
      this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // La modalità resta attiva anche quando lo storage è disabilitato dal browser.
    }
  }

  private applyMode(mode: ThemeMode): void {
    this.selectedMode.set(mode);
    this.document.documentElement.dataset['theme'] = mode;
  }

  private readStoredMode(): ThemeMode | null {
    try {
      const value = this.document.defaultView?.localStorage.getItem(THEME_STORAGE_KEY);
      return value === 'auto' || value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  }
}
