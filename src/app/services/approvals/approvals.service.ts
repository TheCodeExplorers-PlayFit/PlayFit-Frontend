import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApprovalsService {
  private apiUrl = 'http://localhost:5000/approvals';

  constructor(private http: HttpClient) {}

  getUnverifiedUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/unverified`);
  }

  approveUser(userId: number, role: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/approve/${userId}`, { role });
  }

  rejectUser(userId: number, role: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reject/${userId}`, { body: { role } });
  }
}