import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MessageRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends ApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  // ==================== PUBBLICO (Form contatti) ====================

  send(request: MessageRequest): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${this.baseUrl}/messages`, request);
  }

}
