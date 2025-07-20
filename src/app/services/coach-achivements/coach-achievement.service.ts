import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoachAchievementService {
  private baseUrl = 'http://localhost:5000/api/coach-sessions/achievements';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Replace with AuthService if needed
    if (!token) {
      console.error('No authentication token found');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getMyAchievements(coachId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers.has('Authorization')) {
      return throwError(() => new Error('Authentication token is missing'));
    }
    return this.http.get(`${this.baseUrl}?coachId=${coachId}`, { headers });
  }

  getAllAchievements(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers.has('Authorization')) {
      return throwError(() => new Error('Authentication token is missing'));
    }
    return this.http.get(`${this.baseUrl}/all`, { headers });
  }

  getTopAchievements(): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers.has('Authorization')) {
      return throwError(() => new Error('Authentication token is missing'));
    }
    return this.http.get(`${this.baseUrl}/top`, { headers });
  }
}