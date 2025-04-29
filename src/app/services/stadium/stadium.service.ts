// src/app/services/stadium.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StadiumService {
  // Hardcoded API URL instead of using environment
  private apiUrl = 'http://localhost:5000/api/stadiums';

  constructor(private http: HttpClient) {}

  // Get headers with authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  // Get stadiums based on coach's sports
  getStadiumsByCoachSports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/by-coach-sports`, { 
      headers: this.getHeaders() 
    });
  }
}