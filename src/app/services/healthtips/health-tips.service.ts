// File: src/app/services/health-tips.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthTipsService {
  private cloudName = 'dmmqv54xo'; // replace with your cloud name
  private unsignedPreset = 'medical'; // replace with your unsigned preset
  private apiUrl = 'http://localhost:5000/api/health-tips'; // replace with your API URL

  constructor(private http: HttpClient) {}

  uploadFileToCloudinary(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.unsignedPreset);

    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;

    return this.http.post<any>(url, formData);
  }

  createHealthTip(healthTipData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, healthTipData);
  }

getAllPublicHealthTips() {
  return this.http.get<any>(`${this.apiUrl}/public`);  
}


getHealthTipsByOfficerId(officerId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/by-officer/${officerId}`);
}


  getHealthTips(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getHealthTipById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateHealthTip(id: number, healthTipData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, healthTipData);
  }

  deleteHealthTip(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

   getHealthTipsByCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category/${encodeURIComponent(category)}`);
  }

  searchHealthTips(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?q=${query}`);
  }

 
}