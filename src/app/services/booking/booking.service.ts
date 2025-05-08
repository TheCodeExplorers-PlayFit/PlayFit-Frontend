import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service'; // Adjust path as needed

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5000/api/coach-sessions'; // Changed from /api/sessions to /api/coach-sessions

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`
    });
  }

  getWeeklyTimetable(stadiumId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/timetable?stadiumId=${stadiumId}`, { headers: this.getHeaders() });
  }

  bookSession(sessionId: number): Observable<any> {
    const user = this.authService.getUser();
    if (!user || !this.authService.isLoggedIn()) {
      throw new Error('User not logged in');
    }

    const bookingData = {
      sessionId,
      playerId: user.id // Using coach's ID; adjust if needed
    };

    return this.http.post(`${this.apiUrl}/initiate-payment`, bookingData, { headers: this.getHeaders() });
  }

  createBooking(stadiumId: number): Observable<any> {
    const user = this.authService.getUser();
    if (!user || !this.authService.isLoggedIn()) {
      throw new Error('User not logged in');
    }

    const bookingData = {
      stadium_id: stadiumId,
      coach_id: user.id,
      booking_date: new Date().toISOString()
    };

    return this.http.post('http://localhost:5000/api/bookings', bookingData, { headers: this.getHeaders() });
  }
}