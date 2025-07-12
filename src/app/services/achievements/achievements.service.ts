import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement } from '../../models/achievement';

@Injectable({
  providedIn: 'root'
})
export class AchievementsService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getAchievements(): Observable<Achievement> {
    console.log('Fetching achievements from:', `${this.apiUrl}/achievements`);
    return this.http.get<Achievement>(`${this.apiUrl}/achievements`);
  }

  getAchievementDetails(): Observable<any[]> {
    console.log('Fetching achievement details from:', `${this.apiUrl}/achievement-details`);
    return this.http.get<any[]>(`${this.apiUrl}/achievement-details`);
  }

  getTop3Achievers(): Observable<any[]> {
    console.log('Fetching top 3 achievers from:', `${this.apiUrl}/top-achievers`);
    return this.http.get<any[]>(`${this.apiUrl}/top-achievers`);
  }

  updateAchievement(id: number, data: any): Observable<any> {
    console.log('Updating achievement from:', `${this.apiUrl}/achievement/${id}`);
    return this.http.put(`${this.apiUrl}/achievement/${id}`, data);
  }

  deleteAchievement(id: number): Observable<any> {
    console.log('Deleting achievement from:', `${this.apiUrl}/achievement/${id}`);
    return this.http.delete(`${this.apiUrl}/achievement/${id}`);
  }
}