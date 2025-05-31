import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  gender: string;
  age: number;
  nic: string;
  created_at: string;
  name?: string; // Added for computed name in component
}

export interface UserResponse {
  success: boolean;
  data: User[];
  totalCount: number;
  roleCounts: {
    player: number;
    coach: number;
    stadiumOwner: number;
    medicalOfficer: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(this.apiUrl, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  deleteUser(userId: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }
}