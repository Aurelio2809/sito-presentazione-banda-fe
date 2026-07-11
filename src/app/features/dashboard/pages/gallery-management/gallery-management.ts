import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { finalize, timeout } from 'rxjs/operators';
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

  // Date selectors (anno obbligatorio, mese/giorno opzionali)
  years: number[] = [];
  readonly months: { value: number; label: string }[] = [
    { value: 1, label: 'Gennaio' }, { value: 2, label: 'Febbraio' }, { value: 3, label: 'Marzo' },
    { value: 4, label: 'Aprile' }, { value: 5, label: 'Maggio' }, { value: 6, label: 'Giugno' },
    { value: 7, label: 'Luglio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Settembre' },
    { value: 10, label: 'Ottobre' }, { value: 11, label: 'Novembre' }, { value: 12, label: 'Dicembre' }
  ];
  readonly days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

  constructor(
    private galleryService: GalleryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.loading = true;
    this.error = null;

    this.galleryService.getAll(0, 100).subscribe({
      next: (page) => {
        this.photos = page.content;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Errore nel caricamento delle foto';
        this.loading = false;
        this.cdr.detectChanges();
        console.error('[GalleryMgmt] loadPhotos() ERROR:', err);
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
    } else {
      result = [...result].sort((a, b) => {
        const orderA = a.displayOrder ?? 999999;
        const orderB = b.displayOrder ?? 999999;
        if (orderA !== orderB) return orderA - orderB;
        return (a.id ?? 0) - (b.id ?? 0);
      });
    }
    return result;
  }

  /** Posizione 1-based nella lista corrente (preferite o tutte). */
  getPosition(photo: GalleryPhotoResponse): number {
    const i = this.filteredPhotos.findIndex(p => p.id === photo.id);
    return i < 0 ? 1 : i + 1;
  }

  onFilterChange(tabId: string): void {
    this.activeFilter = tabId;
  }

  get favoritePhotos(): GalleryPhotoResponse[] {
    return this.photos.filter(p => p.favorite).sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  }

  selectPhoto(photo: GalleryPhotoResponse): void {
    this.selectedPhoto = {
      ...photo,
      photoYear: photo.photoYear ?? undefined,
      photoMonth: photo.photoMonth ?? undefined,
      photoDay: photo.photoDay ?? undefined
    };
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
        this.cdr.detectChanges();
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
          this.cdr.detectChanges();
        },
        error: (err) => {
          alert('Errore nell\'eliminazione della foto');
          console.error(err);
          this.deleting = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  savePhoto(): void {
    if (!this.selectedPhoto) return;

    this.saving = true;
    const request: GalleryPhotoRequest = {
      title: this.selectedPhoto.title,
      description: this.selectedPhoto.description ?? undefined,
      location: this.selectedPhoto.location ?? undefined,
      photoYear: this.ensureNumberOrNull(this.selectedPhoto.photoYear),
      photoMonth: this.ensureNumberOrNull(this.selectedPhoto.photoMonth),
      photoDay: this.ensureNumberOrNull(this.selectedPhoto.photoDay),
      favorite: this.selectedPhoto.favorite,
      displayOrder: this.selectedPhoto.displayOrder ?? undefined
    };

    this.galleryService.update(this.selectedPhoto.id, request).pipe(
      timeout(30000),
      finalize(() => {
        this.saving = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (updated) => {
        const index = this.photos.findIndex(p => p.id === updated.id);
        if (index >= 0) {
          this.photos[index] = updated;
        }
        this.selectedPhoto = null;
      },
      error: (err) => {
        const isTimeout = err?.name === 'TimeoutError' || err?.message?.includes('Timeout');
        const msg = isTimeout
          ? 'Salvataggio scaduto: il server non ha risposto in tempo. Riprova.'
          : (err?.error?.message ?? err?.message ?? 'Errore nel salvataggio');
        const details = err?.error?.errors;
        const fullMsg = details
          ? `${msg}\n${Object.entries(details).map(([k, v]) => `${k}: ${v}`).join('\n')}`
          : msg;
        alert(fullMsg);
        console.error('[GalleryMgmt] savePhoto() ERROR:', err);
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
      photoYear: this.toNumberOrUndefined(this.uploadMetadata.photoYear),
      photoMonth: this.toNumberOrUndefined(this.uploadMetadata.photoMonth),
      photoDay: this.toNumberOrUndefined(this.uploadMetadata.photoDay),
      favorite: this.uploadMetadata.favorite || false
    };

    this.galleryService.upload(this.uploadFile, metadata).subscribe({
      next: (created) => {
        this.photos = [created, ...this.photos];
        this.uploading = false;
        this.closeUpload();
        this.cdr.detectChanges();
      },
      error: (err) => {
        const errorMsg = err.error?.message ?? err.error?.error ?? err.message ?? 'Errore nell\'upload della foto';
        alert(errorMsg);
        console.error('[GalleryMgmt] uploadPhoto() ERROR:', err);
        this.uploading = false;
        this.cdr.detectChanges();
      }
    });
  }

  movePhoto(photo: GalleryPhotoResponse, direction: 'up' | 'down'): void {
    if (!this.orderChanged) {
      this.savedOrderSnapshot = this.filteredPhotos.map(p => ({ id: p.id, displayOrder: p.displayOrder }));
    }

    const list = this.filteredPhotos;
    const currentIndex = list.findIndex(p => p.id === photo.id);
    if (currentIndex < 0) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= list.length) return;

    const reordered = [...list];
    [reordered[currentIndex], reordered[newIndex]] = [reordered[newIndex], reordered[currentIndex]];
    reordered.forEach((p, k) => p.displayOrder = k + 1);
    this.orderChanged = true;
  }

  moveToPosition(photo: GalleryPhotoResponse, newPosition: number): void {
    if (!this.orderChanged) {
      this.savedOrderSnapshot = this.filteredPhotos.map(p => ({ id: p.id, displayOrder: p.displayOrder }));
    }

    const list = this.filteredPhotos;
    const currentPos = this.getPosition(photo);
    if (newPosition < 1 || newPosition > list.length || newPosition === currentPos) return;

    const reordered = list.filter(p => p.id !== photo.id);
    reordered.splice(newPosition - 1, 0, photo);
    reordered.forEach((p, k) => p.displayOrder = k + 1);
    this.orderChanged = true;
  }

  /** Applica la posizione dall'input al tasto Invio: la foto va alla posizione indicata e le altre scalano. */
  applyOrderFromInput(photo: GalleryPhotoResponse, event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = parseInt(input.value, 10);
    const max = this.filteredPhotos.length;
    if (isNaN(val) || val < 1 || val > max) {
      input.value = String(this.getPosition(photo));
      return;
    }
    this.moveToPosition(photo, val);
    input.value = String(this.getPosition(photo));
    this.cdr.detectChanges();
  }

  async saveOrder(): Promise<void> {
    this.savingOrder = true;
    const list = this.filteredPhotos;
    try {
      const updates = list.map(p =>
        firstValueFrom(this.galleryService.updateOrder(p.id, p.displayOrder ?? 0))
      );
      await Promise.all(updates);
      this.orderChanged = false;
      this.savedOrderSnapshot = [];
    } catch (err) {
      alert('Errore nel salvataggio dell\'ordine');
      console.error(err);
    } finally {
      this.savingOrder = false;
      this.cdr.detectChanges();
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

  private toNumberOrUndefined(value: number | string | null | undefined): number | undefined {
    if (value == null || value === '') return undefined;
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
  }

  /** Per la richiesta API: restituisce il numero o null (mai undefined, così la chiave è sempre inviata in JSON). */
  private ensureNumberOrNull(value: number | string | null | undefined): number | null {
    if (value == null || value === '') return null;
    const n = Number(value);
    return Number.isNaN(n) ? null : n;
  }

  formatPhotoDate(photo: GalleryPhotoResponse): string {
    if (photo.photoYear == null) return '';
    const monthNames = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
      'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
    if (photo.photoDay != null && photo.photoMonth != null) {
      return `${photo.photoDay} ${monthNames[photo.photoMonth - 1]} ${photo.photoYear}`;
    }
    if (photo.photoMonth != null) {
      return `${monthNames[photo.photoMonth - 1]} ${photo.photoYear}`;
    }
    return `${photo.photoYear}`;
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
