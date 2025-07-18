import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { inject } from '@angular/core';

export interface Notice {
  id: number;
  admin_id: number;
  created_at: string;
  category: string;
  title: string;
  description: string;
  notice_date: string;
  author: string;
}

@Injectable({ providedIn: 'root' })
export class CoachAnnouncementService {
  private http = inject(HttpClient);
  baseUrl = 'http://localhost:5000/api/coach-sessions';

  getAllNotices() {
    return this.http.get<Notice[]>(`${this.baseUrl}/notices`);
  }

  getCoachNotices() {
    return this.http.get<Notice[]>(`${this.baseUrl}/notices/coaches`);
  }
}
