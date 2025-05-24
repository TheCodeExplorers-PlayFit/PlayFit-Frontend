import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CoachSalary {
  coach_id: number;
  total_salary: number;
  coach_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CoachSalaryService {
  private apiUrl = 'http://localhost:5000/api/coach-sessions/salaries';

  constructor(private http: HttpClient) {}

  getCoachSalaries(): Observable<CoachSalary[]> {
    const token = localStorage.getItem('token');
    console.log('Token in CoachSalaryService:', token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
    return this.http.get<CoachSalary[]>(this.apiUrl, { headers });
  }
}