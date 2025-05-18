import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  constructor(private http: HttpClient) { }

  getCoachSalaries(): Observable<CoachSalary[]> {
    const token = localStorage.getItem('token');
    console.log('Token in CoachSalaryService:', token);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    return this.http.get<CoachSalary[]>(this.apiUrl, { headers }).pipe(
      map(data => {
        console.log('Raw API response:', data);
        return data.length > 0 ? [data[0]] : [];
      })
    );
  }
}