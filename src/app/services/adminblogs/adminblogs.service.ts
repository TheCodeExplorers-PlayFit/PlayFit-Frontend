import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Blog {
  id: number;
  user_id: number;
  title: string;
  content: string;
  created_at: string;
  first_name: string;
  last_name: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminBlogsService {
  private apiUrl = 'http://localhost:5000/api/adminblogs';

  constructor(private http: HttpClient) {}

  getPendingBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/pending`);
  }

  approveBlog(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/approve/${id}`, {});
  }

  rejectBlog(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reject/${id}`);
  }
}