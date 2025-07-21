import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SalaryOverview {
  day: string; // ✅ updated from 'month'
  salary: number;
}

export interface SessionsOverview {
  month: string;
  sessionsCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiBase = 'http://localhost:5000/api/coach-sessions';

  constructor(private http: HttpClient) {}

  getSalaryOverview(): Observable<SalaryOverview[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    // ✅ Updated to use the weekly endpoint
    return this.http.get<SalaryOverview[]>(`${this.apiBase}/weekly-salary-overview`, { headers });
  }

  getSessionsOverview(): Observable<SessionsOverview[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<SessionsOverview[]>(`${this.apiBase}/sessions-overview`, { headers });
  }
}
