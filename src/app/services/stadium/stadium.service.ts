// src/app/services/stadium/stadium.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StadiumService {
  private apiUrl = 'http://localhost:5000/api/stadiums';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token); // Debug
    if (!token) {
      console.warn('No token found in localStorage');
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || ''}`
    });
  }

  getStadiumsByCoachSports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-coach-sports`, { 
      headers: this.getHeaders() 
    });
  }
}