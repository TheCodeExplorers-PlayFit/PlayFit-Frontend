import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Stadium } from '../../models/stadium';

@Injectable({
  providedIn: 'root'
})
export class StadiumOwnerStadiumsService {
  private apiUrl = 'http://localhost:5000/api/stadiums';

  constructor(private http: HttpClient) {}

  // Fetch all stadiums for the logged-in owner
  getStadiums(token: string): Observable<Stadium[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<Stadium[]>(this.apiUrl, { headers }).pipe(
      map(data => data || []),
      catchError(error => {
        const message = error.error?.message || error.message || 'Error fetching stadiums';
        console.error('Error fetching stadiums:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message
        });
        return throwError(() => new Error(message));
      })
    );
  }

  // Update a stadium
  updateStadium(stadium: Stadium, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      id: stadium.id,
      name: stadium.name,
      address: stadium.address,
      google_maps_link: stadium.google_maps_link,
      facilities: stadium.facilities || null,
      images: stadium.images || [],
      schedule: stadium.schedule.map(schedule => ({
        sport: schedule.sport,
        day: schedule.day,
        fromTime: schedule.fromTime,
        toTime: schedule.toTime,
        maxPlayers: schedule.maxPlayers,
        sportPercentage: schedule.sportPercentage
      }))
    };

    return this.http.put(`${this.apiUrl}/${stadium.id}`, payload, { headers }).pipe(
      catchError(error => {
        const message = error.error?.message || error.message || 'Error updating stadium';
        console.error('Error updating stadium:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message
        });
        return throwError(() => new Error(message));
      })
    );
  }

  // Delete a stadium
  deleteStadium(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => {
        const message = error.error?.message || error.message || 'Error deleting stadium';
        console.error('Error deleting stadium:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message
        });
        return throwError(() => new Error(message));
      })
    );
  }

  // Upload image to Cloudinary
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'imageuploading');
    formData.append('cloud_name', 'dubclskme');
    formData.append('folder', 'stadiums');

    return this.http.post('https://api.cloudinary.com/v1_1/dubclskme/image/upload', formData).pipe(
      map((response: any) => {
        if (response.secure_url) {
          return response.secure_url;
        }
        throw new Error('Upload failed');
      }),
      catchError(error => {
        console.error('Upload error:', error);
        return throwError(() => new Error(`Upload failed: ${error.message}`));
      })
    );
  }
}