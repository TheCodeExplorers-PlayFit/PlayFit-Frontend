import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service'; // Adjust path

@Injectable({
  providedIn: 'root'
})
export class SessionDetailService {
  private apiUrl = 'http://localhost:5000/api/coach-sessions';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`
    });
  }

  getCoachId(): number | null {
    const user = this.authService.getUser();
    console.log('User from AuthService:', user); // Debug
    if (user && user.role === 'coach') {
      const coachIdRaw = user.id;
      const coachId = Number(coachIdRaw); // Convert to number
      console.log('Raw coachId:', coachIdRaw, 'Parsed coachId:', coachId, 'Type:', typeof coachId); // Debug
      return isNaN(coachId) ? null : coachId;
    }
    console.warn('User is not a coach or no user found:', user);
    return null;
  }
}