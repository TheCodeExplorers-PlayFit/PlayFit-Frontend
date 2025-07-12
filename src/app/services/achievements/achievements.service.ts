import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achievement } from '../../models/achievement';

@Injectable({
  providedIn: 'root'
})
export class AchievementsService {
  private apiUrl = 'http://localhost:5000/api/achievements';

  constructor(private http: HttpClient) {}

  getAchievements(): Observable<Achievement> {
    return this.http.get<Achievement>(this.apiUrl);
  }
}