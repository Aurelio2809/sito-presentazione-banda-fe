import { Component } from '@angular/core';
import { TabItem } from '../../components/tab-switch/tab-switch';

export type ManagedPhoto = {
  id: number;
  src: string;
  title: string;
  description: string;
  location: string;
  date: string;
  isFavorite: boolean;
  order?: number;
};

@Component({
  selector: 'app-gallery-management',
  templateUrl: './gallery-management.html',
  styleUrls: ['./gallery-management.css'],
  standalone: false,
})
export class GalleryManagement {
  photos: ManagedPhoto[] = [
    { id: 1, src: '', title: 'Concerto di Natale 2024', description: 'Esibizione in piazza', location: 'Piazza Casali del Manco', date: '2024-12-22', isFavorite: true, order: 1 },
    { id: 2, src: '', title: 'Processione San Giovanni', description: 'Festa patronale', location: 'Centro storico Pedace', date: '2024-06-24', isFavorite: true, order: 2 },
    { id: 3, src: '', title: 'Prove settimanali', description: 'Sezione fiati', location: 'Sede banda', date: '2024-10-15', isFavorite: false },
    { id: 4, src: '', title: 'Concerto estivo', description: 'Festival della musica', location: 'Anfiteatro comunale', date: '2024-08-10', isFavorite: true, order: 3 },
    { id: 5, src: '', title: 'Nuovi allievi', description: 'Lezione di gruppo', location: 'Sede banda', date: '2024-09-20', isFavorite: false },
  ];

  selectedPhoto: ManagedPhoto | null = null;
  showUploadModal = false;
  activeFilter = 'all';
  orderChanged = false;
  savedOrderSnapshot: { id: number; order?: number }[] = [];

  get filterTabs(): TabItem[] {
    return [
      { id: 'all', label: 'Tutte', count: this.photos.length },
      { id: 'favorites', label: 'Preferite', count: this.favoritePhotos.length },
    ];
  }

  get filterFavorites(): boolean {
    return this.activeFilter === 'favorites';
  }

  get filteredPhotos(): ManagedPhoto[] {
    let result = this.filterFavorites ? this.photos.filter(p => p.isFavorite) : this.photos;
    if (this.filterFavorites) {
      result = result.sort((a, b) => (a.order || 999) - (b.order || 999));
    }
    return result;
  }

  onFilterChange(tabId: string): void {
    this.activeFilter = tabId;
  }

  get favoritePhotos(): ManagedPhoto[] {
    return this.photos.filter(p => p.isFavorite).sort((a, b) => (a.order || 999) - (b.order || 999));
  }

  selectPhoto(photo: ManagedPhoto): void {
    this.selectedPhoto = { ...photo };
  }

  closeDetail(): void {
    this.selectedPhoto = null;
  }

  toggleFavorite(photo: ManagedPhoto): void {
    photo.isFavorite = !photo.isFavorite;
    if (!photo.isFavorite) {
      photo.order = undefined;
    } else {
      photo.order = this.favoritePhotos.length + 1;
    }
  }

  deletePhoto(photo: ManagedPhoto): void {
    if (confirm(`Eliminare la foto "${photo.title}"?`)) {
      this.photos = this.photos.filter(p => p.id !== photo.id);
      if (this.selectedPhoto?.id === photo.id) {
        this.selectedPhoto = null;
      }
    }
  }

  savePhoto(): void {
    if (!this.selectedPhoto) return;
    const index = this.photos.findIndex(p => p.id === this.selectedPhoto!.id);
    if (index >= 0) {
      this.photos[index] = { ...this.selectedPhoto };
    }
    this.selectedPhoto = null;
  }

  openUpload(): void {
    this.showUploadModal = true;
  }

  closeUpload(): void {
    this.showUploadModal = false;
  }

  moveFavorite(photo: ManagedPhoto, direction: 'up' | 'down'): void {
    // Save snapshot on first change
    if (!this.orderChanged) {
      this.savedOrderSnapshot = this.favoritePhotos.map(p => ({ id: p.id, order: p.order }));
    }

    const favorites = this.favoritePhotos;
    const currentIndex = favorites.findIndex(p => p.id === photo.id);
    if (currentIndex < 0) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= favorites.length) return;

    // Swap orders
    const tempOrder = favorites[currentIndex].order;
    favorites[currentIndex].order = favorites[newIndex].order;
    favorites[newIndex].order = tempOrder;

    this.orderChanged = true;
  }

  moveToPosition(photo: ManagedPhoto, newPosition: number): void {
    if (!this.orderChanged) {
      this.savedOrderSnapshot = this.favoritePhotos.map(p => ({ id: p.id, order: p.order }));
    }

    const favorites = this.favoritePhotos;
    const currentOrder = photo.order || 0;
    
    if (newPosition < 1 || newPosition > favorites.length || newPosition === currentOrder) return;

    // Shift other photos
    if (newPosition < currentOrder) {
      // Moving up: shift others down
      favorites.forEach(p => {
        if (p.id !== photo.id && p.order && p.order >= newPosition && p.order < currentOrder) {
          p.order++;
        }
      });
    } else {
      // Moving down: shift others up
      favorites.forEach(p => {
        if (p.id !== photo.id && p.order && p.order <= newPosition && p.order > currentOrder) {
          p.order--;
        }
      });
    }

    photo.order = newPosition;
    this.orderChanged = true;
  }

  saveOrder(): void {
    // Here you would save to backend
    this.orderChanged = false;
    this.savedOrderSnapshot = [];
    alert('Ordine salvato con successo!');
  }

  resetOrder(): void {
    // Restore from snapshot
    this.savedOrderSnapshot.forEach(snap => {
      const photo = this.photos.find(p => p.id === snap.id);
      if (photo) {
        photo.order = snap.order;
      }
    });
    this.orderChanged = false;
    this.savedOrderSnapshot = [];
  }
}
