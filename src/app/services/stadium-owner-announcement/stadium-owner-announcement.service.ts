
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notice } from '../../models/notice.model';

@Injectable({
  providedIn: 'root'
})
export class StadiumOwnerAnnouncementService {
  private apiUrl = 'http://localhost:5000/api/stadium-owner/announcements';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Adjust if using cookies
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  getNotices(): Observable<Notice[]> {
    return this.http.get<Notice[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}
