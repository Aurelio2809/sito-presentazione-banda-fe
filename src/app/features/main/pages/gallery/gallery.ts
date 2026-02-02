import { Component, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { GalleryService } from '../../../../core/services';
import { GalleryPhotoResponse } from '../../../../core/models';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.css'],
  standalone: false,
})
export class Gallery implements OnInit {
  favorites: GalleryPhotoResponse[] = [];
  items: GalleryPhotoResponse[] = [];
  heroMain: GalleryPhotoResponse | null = null;
  loading = true;
  error: string | null = null;

  // Paginazione
  page = 0;
  pageSize = 9;
  totalElements = 0;
  totalPages = 0;

  // Viewer
  viewerOpen = false;
  selected: GalleryPhotoResponse | null = null;

  constructor(
    private galleryService: GalleryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const startTime = performance.now();
    console.log('[Gallery] loadData() START - loading =', this.loading);
    this.loading = true;
    this.error = null;

    forkJoin({
      favorites: this.galleryService.getPublicFavorites(),
      photos: this.galleryService.getPublicPhotos(this.page, this.pageSize)
    }).subscribe({
      next: ({ favorites, photos }) => {
        const responseTime = performance.now();
        console.log('[Gallery] forkJoin RESPONSE ricevuta dopo', (responseTime - startTime).toFixed(2), 'ms');
        console.log('[Gallery] favorites:', favorites.length, 'items');
        console.log('[Gallery] photos:', photos.content.length, 'items');
        
        this.favorites = favorites;
        if (favorites.length > 0) {
          this.heroMain = favorites[0];
        }
        this.items = photos.content;
        this.totalElements = photos.totalElements;
        this.totalPages = photos.totalPages;
        
        console.log('[Gallery] Dati assegnati, imposto loading = false');
        this.loading = false;
        this.cdr.detectChanges(); // Forza aggiornamento UI in zoneless mode
        
        const endTime = performance.now();
        console.log('[Gallery] loadData() COMPLETE - tempo totale:', (endTime - startTime).toFixed(2), 'ms');
      },
      error: (err) => {
        this.error = 'Errore nel caricamento della galleria';
        this.loading = false;
        this.cdr.detectChanges();
        console.error('[Gallery] ERRORE:', err);
      }
    });
  }

  loadPhotos(): void {
    const startTime = performance.now();
    console.log('[Gallery] loadPhotos() START - page:', this.page);
    this.loading = true;
    
    this.galleryService.getPublicPhotos(this.page, this.pageSize).subscribe({
      next: (pageData) => {
        const responseTime = performance.now();
        console.log('[Gallery] loadPhotos RESPONSE dopo', (responseTime - startTime).toFixed(2), 'ms');
        
        this.items = pageData.content;
        this.totalElements = pageData.totalElements;
        this.totalPages = pageData.totalPages;
        this.loading = false;
        this.cdr.detectChanges(); // Forza aggiornamento UI in zoneless mode
        
        console.log('[Gallery] loadPhotos() COMPLETE - tempo totale:', (performance.now() - startTime).toFixed(2), 'ms');
      },
      error: (err) => {
        this.error = 'Errore nel caricamento della galleria';
        this.loading = false;
        this.cdr.detectChanges();
        console.error('[Gallery] loadPhotos ERRORE:', err);
      }
    });
  }

  getPhotoUrl(photo: GalleryPhotoResponse): string {
    if (photo.src?.startsWith('http')) {
      return photo.src;
    }
    // photo.src è /api/gallery/photos/filename.jpg - rimuovo /api dall'apiUrl
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${photo.src}`;
  }

  getThumbnailUrl(photo: GalleryPhotoResponse): string {
    // Usa la thumbnail se disponibile, altrimenti usa l'immagine originale
    const src = photo.thumbnailSrc || photo.src;
    if (src?.startsWith('http')) {
      return src;
    }
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${src}`;
  }

  get pagedItems(): GalleryPhotoResponse[] {
    return this.items;
  }

  onPageChange(p: number): void {
    this.page = p - 1; // API usa 0-based
    this.loadPhotos();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.page = 0;
    this.loadPhotos();
  }

  open(item: GalleryPhotoResponse): void {
    this.selected = item;
    this.viewerOpen = true;
    document.documentElement.style.overflow = 'hidden';
  }

  close(): void {
    this.viewerOpen = false;
    this.selected = null;
    document.documentElement.style.overflow = '';
  }

  formatPhotoDate(photo: GalleryPhotoResponse): string {
    const y = photo?.photoYear;
    const m = photo?.photoMonth;
    const d = photo?.photoDay;
    if (y == null && m == null && d == null) return '';
    const monthNames = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
      'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
    if (d != null && m != null && y != null) {
      return `${d} ${monthNames[m - 1]} ${y}`;
    }
    if (m != null && y != null) {
      return `${monthNames[m - 1]} ${y}`;
    }
    if (y != null) return `${y}`;
    if (m != null) return monthNames[m - 1];
    return String(d);
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent): void {
    if (!this.viewerOpen) return;
    if (ev.key === 'Escape') this.close();
  }
}
