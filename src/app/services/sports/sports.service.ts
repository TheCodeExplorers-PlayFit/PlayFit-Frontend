import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Sport {
  id: number;
  name: string;
}

interface SportsResponse {
  success: boolean;
  sports: Sport[];
}

@Injectable({
  providedIn: 'root'
})
export class SportsService {
  private apiUrl = 'http://localhost:5000/api/users/sports';

  constructor(private http: HttpClient) {}

  getSports(): Observable<SportsResponse> {
    return this.http.get<SportsResponse>(this.apiUrl);
  }
}