import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Stadium } from '../../models/stadium';

@Injectable({
  providedIn: 'root'
})
export class AddStadiumService {
  private apiUrl = 'http://localhost:5000/api/stadiums';

  constructor(private http: HttpClient) {}

  addStadium(stadiumData: Stadium, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      name: stadiumData.name,
      address: stadiumData.address,
      google_maps_link: stadiumData.google_maps_link,
      facilities: stadiumData.facilities || null,
      images: stadiumData.images || [],
      schedule: stadiumData.schedule.map(schedule => ({
        sport: schedule.sport,
        day: schedule.day,
        fromTime: schedule.fromTime,
        toTime: schedule.toTime,
        maxPlayers: schedule.maxPlayers,
        sportCost: schedule.sportCost
      }))
    };

    return this.http.post(`${this.apiUrl}/add`, payload, { headers }).pipe(
      catchError(error => {
        const message = error.error?.message || error.message || 'An unexpected error occurred';
        console.error('Error adding stadium:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message
        });
        return throwError(() => new Error(message));
      })
    );
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'imageuploading');
    formData.append('cloud_name', 'dubclskme');
    formData.append('folder', 'Uploads');

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

  getLocationUrl(address: string): Observable<string> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    return this.http.get<any[]>(url).pipe(
      map(data => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          return `https://www.google.com/maps?q=${lat},${lon}`;
        }
        throw new Error('Location not found');
      }),
      catchError(error => {
        console.error('Error fetching location:', error);
        return throwError(() => new Error('Error finding location. Please try again.'));
      })
    );
  }
}