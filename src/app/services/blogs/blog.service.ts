import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Blog {
  id: number;
  title: string;
  content: string;
  image: string;
  created_at: string;
  first_name: string;
  last_name: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  private apiUrl = 'http://localhost:5000/api/blogs/approved'; // update if needed

  constructor(private http: HttpClient) {}

  getApprovedBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }
}
