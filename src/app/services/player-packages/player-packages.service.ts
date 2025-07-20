import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PlayerPackage, PlayerPackageAssignment, Stadium, SubscriptionStats } from '@models/player-package';

// Define payload interfaces to avoid index signature issues
interface PlayerPackagePayload {
  name: string;
  description: string | null;
  price: number;
  duration: number;
  sport: string;
  stadiumId: number;
  start_date: string;
  end_date: string;
}

interface UpdatePlayerPackagePayload extends PlayerPackagePayload {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlayerPackagesService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getStadiums(): Observable<Stadium[]> {
    return this.http.get<Stadium[]>(`${this.apiUrl}/stadiums`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching stadiums:', error);
        return throwError(() => new Error(`Error fetching stadiums: ${error.status} - ${error.error?.message || error.statusText}`));
      })
    );
  }

  getPlayerPackages(): Observable<PlayerPackage[]> {
    return this.http.get<PlayerPackage[]>(`${this.apiUrl}/player-packages`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching player packages:', error);
        return throwError(() => new Error(`Error fetching player packages: ${error.status} - ${error.error?.message || error.statusText}`));
      })
    );
  }

  getPlayerPackageAssignments(): Observable<PlayerPackageAssignment[]> {
    return this.http.get<PlayerPackageAssignment[]>(`${this.apiUrl}/player-packages/assignments`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching player package assignments:', error);
        return throwError(() => new Error(`Error fetching player package assignments: ${error.status} - ${error.error?.message || error.statusText}`));
      })
    );
  }

  getSubscriptionStats(): Observable<SubscriptionStats> {
    return this.http.get<SubscriptionStats>(`${this.apiUrl}/player-packages/stats`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error fetching subscription stats:', error);
        return throwError(() => new Error(`Error fetching subscription stats: ${error.status} - ${error.error?.message || error.statusText}`));
      })
    );
  }

  addPlayerPackage(packageData: Omit<PlayerPackage, 'id' | 'stadium_name'>): Observable<any> {
    const payload: PlayerPackagePayload = {
      name: packageData.name,
      description: packageData.description || null,
      price: packageData.price,
      duration: packageData.duration,
      sport: packageData.sport,
      stadiumId: packageData.stadium_id,
      start_date: packageData.start_date,
      end_date: packageData.end_date
    };
    return this.http.post(`${this.apiUrl}/player-packages/add`, payload, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error adding player package:', error);
        return throwError(() => new Error(`Error adding player package: ${error.status} - ${error.error?.message || error.statusText}`));
      })
    );
  }

  updatePlayerPackage(packageData: PlayerPackage): Observable<any> {
    const payload: UpdatePlayerPackagePayload = {
      id: packageData.id,
      name: packageData.name,
      description: packageData.description || null,
      price: packageData.price,
      duration: packageData.duration,
      sport: packageData.sport,
      stadiumId: packageData.stadium_id,
      start_date: packageData.start_date,
      end_date: packageData.end_date
    };
    return this.http.put(`${this.apiUrl}/player-packages/${packageData.id}`, payload, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error updating player package:', error);
        return throwError(() => new Error(`Error updating player package: ${error.status} - ${error.error?.message || error.statusText}`));
      })
    );
  }

  deletePlayerPackage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/player-packages/${id}`, { headers: this.getHeaders() }).pipe(
      catchError(error => {
        console.error('Error deleting player package:', error);
        return throwError(() => new Error(`Error deleting player package: ${error.status} - ${error.error?.message || error.statusText}`));
      })
    );
  }
}