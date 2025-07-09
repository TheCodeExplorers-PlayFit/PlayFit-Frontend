import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Complaint } from '@models/maintenance-requests';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceRequestsService {
  private apiUrl = 'http://localhost:5000/api/stadium-owner/maintenance-requests';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getMaintenanceRequests(): Observable<Complaint[]> {
    return this.http.get<Complaint[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching maintenance requests:', error);
        return throwError(() => new Error(`Error fetching maintenance requests: ${error.status} - ${error.error?.message || error.statusText}`));
      })
    );
  }

  updateMaintenanceRequest(id: number, status: string): Observable<any> {
    const payload = { id, status };
    return this.http.put(this.apiUrl, payload, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error updating maintenance request:', error);
        return throwError(() => new Error(`Error updating maintenance request: ${error.status} - ${error.error?.message || error.statusText}`));
      })
    );
  }
}