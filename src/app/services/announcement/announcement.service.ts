// services/announcement/announcement.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Announcement {
  id?: number;
  admin_id: number;
  category: string;
  title: string;
  description: string;
  notice_date: string;
  author: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = 'http://localhost:5000/api/announcements';

  constructor(private http: HttpClient) {}

  /**
   * Create a new notice
   */
  createNotice(notice: Omit<Announcement, 'id' | 'created_at'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, notice)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get all notices
   */
  getNotices(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update a notice
   */
  updateNotice(id: number, notice: Partial<Announcement>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, notice)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Delete a notice
   */
  deleteNotice(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}