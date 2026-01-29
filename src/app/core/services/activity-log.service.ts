import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ActivityLogResponse, TargetType, Page } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService extends ApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  getAll(page = 0, size = 50, targetType?: TargetType): Observable<Page<ActivityLogResponse>> {
    const params = this.buildParams({ page, size, targetType });
    return this.http.get<Page<ActivityLogResponse>>(`${this.baseUrl}/activity-log`, {
      params,
      withCredentials: true
    });
  }

  getRecent(hours = 24): Observable<ActivityLogResponse[]> {
    const params = this.buildParams({ hours });
    return this.http.get<ActivityLogResponse[]>(`${this.baseUrl}/activity-log/recent`, {
      params,
      withCredentials: true
    });
  }

  getForTarget(targetType: TargetType, targetId: number): Observable<ActivityLogResponse[]> {
    return this.http.get<ActivityLogResponse[]>(
      `${this.baseUrl}/activity-log/target/${targetType}/${targetId}`,
      { withCredentials: true }
    );
  }
}
