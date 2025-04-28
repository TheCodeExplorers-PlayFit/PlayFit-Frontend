// services/announcement/announcement.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = 'http://localhost:5000/api/announcements';

  constructor(private http: HttpClient) {}

  createNotice(notice: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, notice);
  }

  getNotices(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updateNotice(id: number, notice: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, notice);
  }

  deleteNotice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}