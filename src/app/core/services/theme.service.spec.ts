import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset['theme'];
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset['theme'];
  });

  it('uses automatic mode by default', () => {
    service.initialize();

    expect(service.mode()).toBe('auto');
    expect(document.documentElement.dataset['theme']).toBe('auto');
  });

  it('restores a valid saved preference', () => {
    localStorage.setItem('banda-theme', 'dark');

    service.initialize();

    expect(service.mode()).toBe('dark');
    expect(document.documentElement.dataset['theme']).toBe('dark');
  });

  it('applies and persists a new preference', () => {
    service.setMode('light');

    expect(service.mode()).toBe('light');
    expect(document.documentElement.dataset['theme']).toBe('light');
    expect(localStorage.getItem('banda-theme')).toBe('light');
  });

  it('ignores unsupported stored values', () => {
    localStorage.setItem('banda-theme', 'neon');

    service.initialize();

    expect(service.mode()).toBe('auto');
  });
});
