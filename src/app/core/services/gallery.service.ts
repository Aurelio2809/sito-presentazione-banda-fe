import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { GalleryPhotoRequest, GalleryPhotoResponse, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class GalleryService extends ApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  // ==================== PUBBLICI ====================

  getPublicPhotos(page = 0, size = 12): Observable<Page<GalleryPhotoResponse>> {
    const startTime = performance.now();
    console.log('[GalleryService] getPublicPhotos() CHIAMATA HTTP START');
    const params = this.buildParams({ page, size });
    return this.http.get<Page<GalleryPhotoResponse>>(`${this.baseUrl}/gallery/public`, { params }).pipe(
      tap({
        next: (data) => console.log('[GalleryService] getPublicPhotos() HTTP RESPONSE dopo', (performance.now() - startTime).toFixed(2), 'ms -', data.content.length, 'items'),
        error: (err) => console.error('[GalleryService] getPublicPhotos() HTTP ERROR dopo', (performance.now() - startTime).toFixed(2), 'ms')
      })
    );
  }

  getPublicFavorites(): Observable<GalleryPhotoResponse[]> {
    const startTime = performance.now();
    console.log('[GalleryService] getPublicFavorites() CHIAMATA HTTP START');
    return this.http.get<GalleryPhotoResponse[]>(`${this.baseUrl}/gallery/public/favorites`).pipe(
      tap({
        next: (data) => console.log('[GalleryService] getPublicFavorites() HTTP RESPONSE dopo', (performance.now() - startTime).toFixed(2), 'ms -', data.length, 'items'),
        error: (err) => console.error('[GalleryService] getPublicFavorites() HTTP ERROR dopo', (performance.now() - startTime).toFixed(2), 'ms')
      })
    );
  }

  // ==================== ADMIN ====================

  getAll(page = 0, size = 20): Observable<Page<GalleryPhotoResponse>> {
    const startTime = performance.now();
    console.log('[GalleryService] getAll() CHIAMATA HTTP START');
    const params = this.buildParams({ page, size });
    return this.http.get<Page<GalleryPhotoResponse>>(`${this.baseUrl}/gallery`, {
      params,
      withCredentials: true
    }).pipe(
      tap({
        next: (data) => console.log('[GalleryService] getAll() HTTP RESPONSE dopo', (performance.now() - startTime).toFixed(2), 'ms -', data.content.length, 'items'),
        error: (err) => console.error('[GalleryService] getAll() HTTP ERROR dopo', (performance.now() - startTime).toFixed(2), 'ms')
      })
    );
  }

  getById(id: number): Observable<GalleryPhotoResponse> {
    return this.http.get<GalleryPhotoResponse>(`${this.baseUrl}/gallery/${id}`, {
      withCredentials: true
    });
  }

  getFavorites(): Observable<GalleryPhotoResponse[]> {
    return this.http.get<GalleryPhotoResponse[]>(`${this.baseUrl}/gallery/favorites`, {
      withCredentials: true
    });
  }

  upload(file: File, metadata: GalleryPhotoRequest): Observable<GalleryPhotoResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

    return this.http.post<GalleryPhotoResponse>(`${this.baseUrl}/gallery`, formData, {
      withCredentials: true
    });
  }

  update(id: number, request: GalleryPhotoRequest): Observable<GalleryPhotoResponse> {
    const startTime = performance.now();
    console.log('[GalleryService] update() CHIAMATA HTTP PUT START - id:', id);
    return this.http.put<GalleryPhotoResponse>(`${this.baseUrl}/gallery/${id}`, request, {
      withCredentials: true
    }).pipe(
      tap({
        next: (data) => console.log('[GalleryService] update() HTTP PUT RESPONSE dopo', (performance.now() - startTime).toFixed(2), 'ms'),
        error: (err) => console.error('[GalleryService] update() HTTP PUT ERROR dopo', (performance.now() - startTime).toFixed(2), 'ms')
      })
    );
  }

  toggleFavorite(id: number): Observable<GalleryPhotoResponse> {
    return this.http.patch<GalleryPhotoResponse>(`${this.baseUrl}/gallery/${id}/favorite`, {}, {
      withCredentials: true
    });
  }

  updateOrder(id: number, order: number): Observable<GalleryPhotoResponse> {
    const params = this.buildParams({ order });
    return this.http.patch<GalleryPhotoResponse>(`${this.baseUrl}/gallery/${id}/order`, {}, {
      params,
      withCredentials: true
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/gallery/${id}`, {
      withCredentials: true
    });
  }
}
