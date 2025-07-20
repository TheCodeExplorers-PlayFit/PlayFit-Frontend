import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/services/auth/auth.service';

@Component({
  selector: 'app-player-private-sessions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-private-sessions.component.html',
  styleUrls: ['./player-private-sessions.component.css']
})
export class PlayerPrivateSessionsComponent implements OnInit {
  sessions: any[] = [];
  private baseUrl = 'http://localhost:5000/api/private-sessions';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>(`${this.baseUrl}/available`, { headers }).subscribe({
      next: (response) => {
        this.sessions = response.sessions;
      },
      error: (error) => console.error('Error loading sessions:', error)
    });
  }

  requestSession(sessionId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post<any>(`${this.baseUrl}/request`, { session_id: sessionId }, { headers }).subscribe({
      next: () => {
        this.loadSessions();
        alert('Session requested successfully contact coach after accepted');
      },
      error: (error) => alert(error.error.message || 'Error requesting session')
    });
  }
}