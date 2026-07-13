import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('sets the public site title on initialization', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(TestBed.inject(Title).getTitle()).toBe(
      'Banda Musicale Casali del Manco | Sito Ufficiale',
    );
  });
});
