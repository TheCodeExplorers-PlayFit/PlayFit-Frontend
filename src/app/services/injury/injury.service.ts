// File: src/app/services/injury.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InjuryService {
  private apiUrl = 'http://localhost:5000/api/injuries'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  createInjury(injuryData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, injuryData);
  }
}
