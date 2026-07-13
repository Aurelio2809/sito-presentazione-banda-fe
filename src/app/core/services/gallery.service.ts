import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getPublicPhotos(page = 0, size = 12, sort: 'order' | 'date' = 'order'): Observable<Page<GalleryPhotoResponse>> {
    const params = this.buildParams({ page, size, orderBy: sort });
    return this.http.get<Page<GalleryPhotoResponse>>(`${this.baseUrl}/gallery/public`, { params });
  }

  getPublicFavorites(): Observable<GalleryPhotoResponse[]> {
    return this.http.get<GalleryPhotoResponse[]>(`${this.baseUrl}/gallery/public/favorites`);
  }

  // ==================== ADMIN ====================

  getAll(page = 0, size = 20): Observable<Page<GalleryPhotoResponse>> {
    const params = this.buildParams({ page, size });
    return this.http.get<Page<GalleryPhotoResponse>>(`${this.baseUrl}/gallery`, {
      params,
      withCredentials: true
    });
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
    return this.http.put<GalleryPhotoResponse>(`${this.baseUrl}/gallery/${id}`, request, {
      withCredentials: true
    });
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
