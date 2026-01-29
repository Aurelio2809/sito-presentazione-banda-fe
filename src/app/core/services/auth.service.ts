import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest, UserResponse } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
  }

  login(request: LoginRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.baseUrl}/auth/login`, request, {
      withCredentials: true
    }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }

  getCurrentUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/auth/me`, {
      withCredentials: true
    }).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get currentUserValue(): UserResponse | null {
    return this.currentUserSubject.value;
  }
}
