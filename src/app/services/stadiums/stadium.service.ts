import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Stadium {
  id: number;
  owner_id: number;
  address: string;
  location_id: number | null;
  name: string;
  description?: string;
  images?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StadiumService {
  private apiUrl = 'http://localhost:5000/api/stadiums';

  constructor(private http: HttpClient) {}

  getStadiums(sports?: number[]): Observable<Stadium[]> {
    let url = this.apiUrl;
    if (sports && sports.length > 0) {
      const validSports = sports.filter(sport => sport != null);
      if (validSports.length > 0) {
        url += `?sports=${validSports.join(',')}`;
      }
    }
    return this.http.get<Stadium[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error fetching stadiums:', error.message);
    return throwError(() => new Error('Failed to fetch stadiums; please try again later.'));
  }
}