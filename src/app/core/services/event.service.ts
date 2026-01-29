import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { EventRequest, EventResponse, EventType, EventStatus, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EventService extends ApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  // ==================== PUBBLICI ====================

  getUpcoming(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.baseUrl}/events/public/upcoming`);
  }

  getPast(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(`${this.baseUrl}/events/public/past`);
  }

  getPublicAll(type?: EventType, page = 0, size = 20): Observable<Page<EventResponse>> {
    const params = this.buildParams({ type, page, size });
    return this.http.get<Page<EventResponse>>(`${this.baseUrl}/events/public`, { params });
  }

  getPublicEvent(id: number): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.baseUrl}/events/public/${id}`);
  }

  // ==================== ADMIN ====================

  getAll(page = 0, size = 20, type?: EventType, status?: EventStatus): Observable<Page<EventResponse>> {
    const params = this.buildParams({ page, size, type, status });
    return this.http.get<Page<EventResponse>>(`${this.baseUrl}/events`, {
      params,
      withCredentials: true
    });
  }

  getById(id: number): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.baseUrl}/events/${id}`, {
      withCredentials: true
    });
  }

  create(request: EventRequest): Observable<EventResponse> {
    return this.http.post<EventResponse>(`${this.baseUrl}/events`, request, {
      withCredentials: true
    });
  }

  update(id: number, request: EventRequest): Observable<EventResponse> {
    return this.http.put<EventResponse>(`${this.baseUrl}/events/${id}`, request, {
      withCredentials: true
    });
  }

  publish(id: number): Observable<EventResponse> {
    return this.http.patch<EventResponse>(`${this.baseUrl}/events/${id}/publish`, {}, {
      withCredentials: true
    });
  }

  unpublish(id: number): Observable<EventResponse> {
    return this.http.patch<EventResponse>(`${this.baseUrl}/events/${id}/unpublish`, {}, {
      withCredentials: true
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/events/${id}`, {
      withCredentials: true
    });
  }
}
