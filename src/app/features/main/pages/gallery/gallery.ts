import { Component, HostListener, OnInit } from '@angular/core';
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

  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.loadFavorites();
    this.loadPhotos();
  }

  loadFavorites(): void {
    this.galleryService.getPublicFavorites().subscribe({
      next: (photos) => {
        this.favorites = photos;
        // La prima foto preferita diventa hero
        if (photos.length > 0) {
          this.heroMain = photos[0];
        }
      },
      error: (err) => console.error('Errore caricamento preferite', err)
    });
  }

  loadPhotos(): void {
    this.loading = true;
    this.galleryService.getPublicPhotos(this.page, this.pageSize).subscribe({
      next: (pageData) => {
        this.items = pageData.content;
        this.totalElements = pageData.totalElements;
        this.totalPages = pageData.totalPages;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento della galleria';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getPhotoUrl(photo: GalleryPhotoResponse): string {
    if (photo.src?.startsWith('http')) {
      return photo.src;
    }
    return `${environment.apiUrl}/gallery/photos/${photo.id}`;
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

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent): void {
    if (!this.viewerOpen) return;
    if (ev.key === 'Escape') this.close();
  }
}
