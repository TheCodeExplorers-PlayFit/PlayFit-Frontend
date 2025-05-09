// File: src/app/services/injury.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InjuryService {
  private cloudName = 'dmmqv54xo'; // replace with your cloud name
  private unsignedPreset = 'medical'; // replace with your unsigned preset

  constructor(private http: HttpClient) {}

  uploadFileToCloudinary(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.unsignedPreset);

    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;

    return this.http.post<any>(url, formData);
  }

  createInjury(injuryData: any): Observable<any> {
    return this.http.post<any>('http://localhost:5000/api/injuries', injuryData);
  }

  getInjuries(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5000/api/injuries');
  }

  getInjuryById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:5000/api/injuries/${id}`);
  }
}
