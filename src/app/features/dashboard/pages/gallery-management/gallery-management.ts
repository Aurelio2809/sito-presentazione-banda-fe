import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TabItem } from '../../components/tab-switch/tab-switch';
import { GalleryService } from '../../../../core/services';
import { GalleryPhotoResponse, GalleryPhotoRequest } from '../../../../core/models';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-gallery-management',
  templateUrl: './gallery-management.html',
  styleUrls: ['./gallery-management.css'],
  standalone: false,
})
export class GalleryManagement implements OnInit {
  photos: GalleryPhotoResponse[] = [];
  loading = false;
  error: string | null = null;

  selectedPhoto: GalleryPhotoResponse | null = null;
  showUploadModal = false;
  activeFilter = 'all';
  orderChanged = false;
  savedOrderSnapshot: { id: number; displayOrder?: number }[] = [];

  // Loading states for operations
  uploading = false;
  saving = false;
  deleting = false;
  savingOrder = false;

  // Upload form
  uploadFile: File | null = null;
  uploadMetadata: Partial<GalleryPhotoRequest> = {};

  // Max favorites limit
  readonly MAX_FAVORITES = 7;

  constructor(private galleryService: GalleryService) {}

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.loading = true;
    this.error = null;

    this.galleryService.getAll(0, 100).subscribe({
      next: (page) => {
        this.photos = page.content;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Errore nel caricamento delle foto';
        this.loading = false;
        console.error(err);
      }
    });
  }

  get filterTabs(): TabItem[] {
    return [
      { id: 'all', label: 'Tutte', count: this.photos.length },
      { id: 'favorites', label: 'Preferite', count: this.favoritePhotos.length },
    ];
  }

  get filterFavorites(): boolean {
    return this.activeFilter === 'favorites';
  }

  get filteredPhotos(): GalleryPhotoResponse[] {
    let result = this.filterFavorites ? this.photos.filter(p => p.favorite) : this.photos;
    if (this.filterFavorites) {
      result = result.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
    }
    return result;
  }

  onFilterChange(tabId: string): void {
    this.activeFilter = tabId;
  }

  get favoritePhotos(): GalleryPhotoResponse[] {
    return this.photos.filter(p => p.favorite).sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  }

  selectPhoto(photo: GalleryPhotoResponse): void {
    this.selectedPhoto = { ...photo };
  }

  closeDetail(): void {
    this.selectedPhoto = null;
  }

  toggleFavorite(photo: GalleryPhotoResponse): void {
    // Verifica limite 7 preferite
    if (!photo.favorite && this.favoritePhotos.length >= this.MAX_FAVORITES) {
      alert(`Massimo ${this.MAX_FAVORITES} foto preferite consentite`);
      return;
    }

    this.galleryService.toggleFavorite(photo.id).subscribe({
      next: (updated) => {
        const index = this.photos.findIndex(p => p.id === photo.id);
        if (index >= 0) {
          this.photos[index] = updated;
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Errore nel toggle preferito';
        alert(errorMsg);
        console.error(err);
      }
    });
  }

  deletePhoto(photo: GalleryPhotoResponse): void {
    if (confirm(`Eliminare la foto "${photo.title}"?`)) {
      this.deleting = true;
      this.galleryService.delete(photo.id).subscribe({
        next: () => {
          this.photos = this.photos.filter(p => p.id !== photo.id);
          if (this.selectedPhoto?.id === photo.id) {
            this.selectedPhoto = null;
          }
          this.deleting = false;
        },
        error: (err) => {
          alert('Errore nell\'eliminazione della foto');
          console.error(err);
          this.deleting = false;
        }
      });
    }
  }

  savePhoto(): void {
    if (!this.selectedPhoto) return;

    this.saving = true;
    const request: GalleryPhotoRequest = {
      title: this.selectedPhoto.title,
      description: this.selectedPhoto.description,
      location: this.selectedPhoto.location,
      photoDate: this.selectedPhoto.photoDate,
      favorite: this.selectedPhoto.favorite,
      displayOrder: this.selectedPhoto.displayOrder
    };

    this.galleryService.update(this.selectedPhoto.id, request).subscribe({
      next: (updated) => {
        const index = this.photos.findIndex(p => p.id === updated.id);
        if (index >= 0) {
          this.photos[index] = updated;
        }
        this.selectedPhoto = null;
        this.saving = false;
      },
      error: (err) => {
        alert('Errore nel salvataggio');
        console.error(err);
        this.saving = false;
      }
    });
  }

  openUpload(): void {
    this.uploadFile = null;
    this.uploadMetadata = { favorite: false };
    this.showUploadModal = true;
  }

  closeUpload(): void {
    this.showUploadModal = false;
    this.uploadFile = null;
    this.uploadMetadata = {};
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFile = input.files[0];
    }
  }

  uploadPhoto(): void {
    if (!this.uploadFile) {
      alert('Seleziona un file');
      return;
    }

    // Verifica limite preferite se si sta caricando come preferita
    if (this.uploadMetadata.favorite && this.favoritePhotos.length >= this.MAX_FAVORITES) {
      alert(`Massimo ${this.MAX_FAVORITES} foto preferite consentite`);
      return;
    }

    this.uploading = true;
    const metadata: GalleryPhotoRequest = {
      title: this.uploadMetadata.title || 'Senza titolo',
      description: this.uploadMetadata.description,
      location: this.uploadMetadata.location,
      photoDate: this.uploadMetadata.photoDate,
      favorite: this.uploadMetadata.favorite || false
    };

    this.galleryService.upload(this.uploadFile, metadata).subscribe({
      next: (created) => {
        this.photos = [created, ...this.photos];
        this.uploading = false;
        this.closeUpload();
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Errore nell\'upload della foto';
        alert(errorMsg);
        console.error(err);
        this.uploading = false;
      }
    });
  }

  moveFavorite(photo: GalleryPhotoResponse, direction: 'up' | 'down'): void {
    if (!this.orderChanged) {
      this.savedOrderSnapshot = this.favoritePhotos.map(p => ({ id: p.id, displayOrder: p.displayOrder }));
    }

    const favorites = this.favoritePhotos;
    const currentIndex = favorites.findIndex(p => p.id === photo.id);
    if (currentIndex < 0) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= favorites.length) return;

    const tempOrder = favorites[currentIndex].displayOrder;
    favorites[currentIndex].displayOrder = favorites[newIndex].displayOrder;
    favorites[newIndex].displayOrder = tempOrder;

    this.orderChanged = true;
  }

  moveToPosition(photo: GalleryPhotoResponse, newPosition: number): void {
    if (!this.orderChanged) {
      this.savedOrderSnapshot = this.favoritePhotos.map(p => ({ id: p.id, displayOrder: p.displayOrder }));
    }

    const favorites = this.favoritePhotos;
    const currentOrder = photo.displayOrder || 0;
    
    if (newPosition < 1 || newPosition > favorites.length || newPosition === currentOrder) return;

    if (newPosition < currentOrder) {
      favorites.forEach(p => {
        if (p.id !== photo.id && p.displayOrder && p.displayOrder >= newPosition && p.displayOrder < currentOrder) {
          p.displayOrder++;
        }
      });
    } else {
      favorites.forEach(p => {
        if (p.id !== photo.id && p.displayOrder && p.displayOrder <= newPosition && p.displayOrder > currentOrder) {
          p.displayOrder--;
        }
      });
    }

    photo.displayOrder = newPosition;
    this.orderChanged = true;
  }

  async saveOrder(): Promise<void> {
    this.savingOrder = true;
    
    try {
      // Salva ogni ordine modificato usando firstValueFrom
      const updates = this.favoritePhotos.map(p => 
        firstValueFrom(this.galleryService.updateOrder(p.id, p.displayOrder || 0))
      );

      await Promise.all(updates);
      this.orderChanged = false;
      this.savedOrderSnapshot = [];
    } catch (err) {
      alert('Errore nel salvataggio dell\'ordine');
      console.error(err);
    } finally {
      this.savingOrder = false;
    }
  }

  resetOrder(): void {
    this.savedOrderSnapshot.forEach(snap => {
      const photo = this.photos.find(p => p.id === snap.id);
      if (photo) {
        photo.displayOrder = snap.displayOrder;
      }
    });
    this.orderChanged = false;
    this.savedOrderSnapshot = [];
  }

  getPhotoUrl(photo: GalleryPhotoResponse): string {
    if (photo.src?.startsWith('http')) {
      return photo.src;
    }
    // photo.src è /api/gallery/photos/filename.jpg
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
}
