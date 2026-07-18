import { Component, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GalleryService } from '../../../../core/services';
import { GalleryPhotoResponse } from '../../../../core/models';
import { environment } from '../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

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

  // Ordinamento: 'order' = indice (displayOrder), 'date' = cronologico (createdAt)
  sortBy: 'order' | 'date' = 'order';

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
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Le due chiamate sono indipendenti tra loro: un hiccup transitorio su una
   * (es. favorites, puramente decorativa) non deve azzerare tutta la pagina.
   * Solo il fallimento di "photos" (il contenuto principale) è un errore reale.
   */
  loadData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      favorites: this.galleryService.getPublicFavorites().pipe(
        catchError(() => of<GalleryPhotoResponse[]>([]))
      ),
      photos: this.galleryService.getPublicPhotos(this.page, this.pageSize, this.sortBy).pipe(
        catchError(() => of(null))
      ),
    }).subscribe(({ favorites, photos }) => {
      this.favorites = favorites;
      this.heroMain = favorites.length > 0 ? favorites[0] : null;

      if (photos) {
        this.items = photos.content;
        this.totalElements = photos.totalElements;
        this.totalPages = photos.totalPages;
        this.error = null;
      } else {
        this.error = this.translate.instant('GALLERY.ERR');
      }

      this.loading = false;
      this.cdr.detectChanges(); // Forza aggiornamento UI in zoneless mode
    });
  }

  loadPhotos(): void {
    this.loading = true;

    this.galleryService.getPublicPhotos(this.page, this.pageSize, this.sortBy).subscribe({
      next: (pageData) => {
        this.items = pageData.content;
        this.totalElements = pageData.totalElements;
        this.totalPages = pageData.totalPages;
        this.error = null;
        this.loading = false;
        this.cdr.detectChanges(); // Forza aggiornamento UI in zoneless mode
      },
      error: () => {
        this.error = this.translate.instant('GALLERY.ERR');
        this.loading = false;
        this.cdr.detectChanges();
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

  onSortChange(sort: 'order' | 'date'): void {
    this.sortBy = sort;
    this.page = 0;
    this.loadData();
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
    if (y == null && m == null && d == null) return '—';
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
