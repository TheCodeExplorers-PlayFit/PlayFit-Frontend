import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'app/services/auth/auth.service';
@Component({
  selector: 'app-coach-private-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coach-private-sessions.component.html',
  styleUrls: ['./coach-private-sessions.component.css']
})
export class CoachPrivateSessionsComponent implements OnInit {
  sessions: any[] = [];
  sports: any[] = [];
  stadiums: any[] = [];
  showPopup: boolean = false;
  newSession = {
    stadium_id: null,
    sport_id: null,
    start_time: '',
    end_time: '',
    date: '',
    cost: null
  };
  searchQuery: string = '';
  private baseUrl = 'http://localhost:5000/api/private-sessions';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadSessions();
    this.loadSports();
  }

  loadSessions(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>(`${this.baseUrl}/coach`, { headers }).subscribe({
      next: (response) => {
        this.sessions = response.sessions;
      },
      error: (error) => console.error('Error loading sessions:', error)
    });
  }

  loadSports(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>(`${this.baseUrl}/sports`, { headers }).subscribe({
      next: (response) => {
        this.sports = response.sports;
      },
      error: (error) => console.error('Error loading sports:', error)
    });
  }

  searchStadiums(): void {
    if (this.searchQuery.trim()) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.get<any>(`${this.baseUrl}/stadiums/search?query=${this.searchQuery}`, { headers }).subscribe({
        next: (response) => {
          this.stadiums = response.stadiums;
        },
        error: (error) => console.error('Error searching stadiums:', error)
      });
    } else {
      this.stadiums = [];
    }
  }

  selectStadium(stadium: any): void {
    this.newSession.stadium_id = stadium.id;
    this.searchQuery = stadium.name;
    this.stadiums = [];
  }

  openPopup(): void {
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.resetForm();
  }

  createSession(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post<any>(`${this.baseUrl}/create`, this.newSession, { headers }).subscribe({
      next: () => {
        this.loadSessions();
        this.closePopup();
        alert('Private session created successfully');
      },
      error: (error) => console.error('Error creating session:', error)
    });
  }

  acceptRequest(sessionId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post<any>(`${this.baseUrl}/accept`, { session_id: sessionId }, { headers }).subscribe({
      next: () => {
        this.loadSessions();
        alert('Session request accepted');
      },
      error: (error) => alert(error.error.message || 'Error accepting request')
    });
  }

  rejectRequest(sessionId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post<any>(`${this.baseUrl}/reject`, { session_id: sessionId }, { headers }).subscribe({
      next: () => {
        this.loadSessions();
        alert('Session request rejected');
      },
      error: (error) => console.error('Error rejecting request:', error)
    });
  }

  resetForm(): void {
    this.newSession = {
      stadium_id: null,
      sport_id: null,
      start_time: '',
      end_time: '',
      date: '',
      cost: null
    };
    this.searchQuery = '';
    this.stadiums = [];
  }
}