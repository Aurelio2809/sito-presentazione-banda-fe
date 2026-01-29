import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MessageRequest, MessageResponse, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends ApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  // ==================== PUBBLICO (Form contatti) ====================

  send(request: MessageRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.baseUrl}/messages`, request);
  }

  // ==================== ADMIN ====================

  getAll(page = 0, size = 20, filter?: 'read' | 'unread'): Observable<Page<MessageResponse>> {
    const params = this.buildParams({ page, size, filter });
    return this.http.get<Page<MessageResponse>>(`${this.baseUrl}/messages`, {
      params,
      withCredentials: true
    });
  }

  getById(id: number): Observable<MessageResponse> {
    return this.http.get<MessageResponse>(`${this.baseUrl}/messages/${id}`, {
      withCredentials: true
    });
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/messages/unread/count`, {
      withCredentials: true
    });
  }

  markAsRead(id: number): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(`${this.baseUrl}/messages/${id}/read`, {}, {
      withCredentials: true
    });
  }

  markAllAsRead(): Observable<{ markedAsRead: number }> {
    return this.http.patch<{ markedAsRead: number }>(`${this.baseUrl}/messages/read-all`, {}, {
      withCredentials: true
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/messages/${id}`, {
      withCredentials: true
    });
  }
}
